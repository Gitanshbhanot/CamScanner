const onvif = require("node-onvif");
const net = require("net");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-ffprobe-static");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

// Set FFmpeg and ffprobe paths
const ffmpegPath = ffmpegStatic.ffmpegPath;
const ffprobePath = ffmpegStatic.ffprobePath;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Configuration Constants
const CONFIG = {
  CONCURRENT_WORKERS: 20,
  CONCURRENT_DEVICES: 5,
  COMMON_PORTS: {
    ONVIF: [80, 8080, 8000, 8899],
    RTSP: [554, 8554],
  },
  COMMON_PATHS: {
    ONVIF: ["/onvif/device_service", "/onvif/services", "/onvif/Media"],
    RTSP: [
      "/Streaming/Channels/101", // Hikvision main stream
      "/Streaming/Channels/102", // Hikvision sub stream
      "/ISAPI/Streaming/channels/101", // Hikvision ISAPI main stream
      "/ISAPI/Streaming/channels/102", // Hikvision ISAPI sub stream
      "/ISAPI/streaming/channels/1/httpPreview",
      "/ISAPI/Streaming/channels/101/httpPreview",
      "/cam/realmonitor?channel=1&subtype=0", // Dahua main stream
      "/cam/realmonitor?channel=1&subtype=1", // Dahua sub stream
      "/live/main", // Some generic cams, often Reolink
      "/live/sub", // Reolink sub stream
      "/h264", // Some generic ONVIF cams
      "/mpeg4", // MPEG stream
      "/video", // Used by some IP cams (e.g., TP-Link)
      "/axis-media/media.amp", // Axis cameras
      "/axis-cgi/mjpg/video.cgi", // Axis MJPEG stream
      "/ch0_0.h264", // XM-based cameras
      "/ch1/main/av_stream", // Uniview main stream
      "/ch1/sub/av_stream", // Uniview sub stream
      "/bcs/channel0_main.bcs?channel=0&stream=0", // Lorex / Dahua OEM
      "/live", // Generic fallback
      "/stream1", // Generic stream
      "/videoMain", // Some Amcrest & clones
      "/videoSub", // Amcrest sub stream
      "/onvif1", // ONVIF-compliant
      "/onvif2", // ONVIF secondary
      "/rtp/av0_0", // Some IP cameras (YI, V380)
      "/rtsp/live.sdp", // Generic RTSP
      "/user=admin&password=&channel=1&stream=0.sdp", // Some cheap generic cams
      "/ucast/11", // Used in some Zmodo/ZOSI
      "/flv", // Some support RTMP/FLV
      "/live/0/h264.sdp", // Some newer firmwares
      "/av0_0", // Some Chinese generic cams
      "/media/video1", // Vivotek and others
      "/live/ch00_0", // VStarcam and others
      "/EZVIZ/Streaming/Channels/101",
    ],
  },
  SCAN_TIMEOUT: 1000,
  RETRY_ATTEMPTS: 1,
  RETRY_DELAY: 1000,
};

// Environment Variables
const credentials = {
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || "",
};
const scanRange = {
  start: process.env.SCAN_IP_START || null,
  end: process.env.SCAN_IP_END || null,
};
const scanOnvif = process.env.SCAN_ONVIF === "true" || false;

// Custom Logging (Console Only)
const setupLogging = () => {
  const originalLog = console.log;

  console.log = (...args) => {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join(" ");
    const timestamp = new Date().toISOString();
    originalLog(`logTime: ${timestamp}, ${message}`);
  };

  return () => {}; // No-op cleanup
};

// Utility Functions
const withRetry = async (
  fn,
  retries = CONFIG.RETRY_ATTEMPTS,
  delay = CONFIG.RETRY_DELAY
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} after error: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const pLimit = (concurrency) => {
  const queue = [];
  let active = 0;

  const next = async () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    try {
      resolve(await fn());
    } catch (error) {
      reject(error);
    }
    active--;
    await next();
  };

  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
};

// RTSP Utilities
const extractRtspDetails = (rtspLink) => {
  try {
    if (!rtspLink?.startsWith("rtsp://")) {
      throw new Error("Invalid RTSP URL: missing protocol");
    }

    const restOfLink = rtspLink.substring(7);
    const lastAtSymbolIndex = restOfLink.lastIndexOf("@");
    let userName = "",
      password = "",
      addressWithPort = "",
      path = "";

    if (lastAtSymbolIndex !== -1) {
      const credentialsPart = restOfLink.substring(0, lastAtSymbolIndex);
      const [user, ...passwordParts] = credentialsPart.split(":");
      userName = user || "";
      password = passwordParts.join(":") || "";
      addressWithPort = restOfLink.substring(lastAtSymbolIndex + 1);
    } else {
      addressWithPort = restOfLink;
    }

    const [addressPort, ...pathParts] = addressWithPort.split("/");
    path = pathParts.join("/") || "";
    const [address, port] = addressPort.split(":");

    return {
      userName,
      password,
      address: address || "",
      port: port || "",
      path,
    };
  } catch (error) {
    console.error("Error parsing RTSP URL:", error.message);
    return { userName: "", password: "", address: "", port: "", path: "" };
  }
};

const createRtspLinkWithPas = (rawRtsp, userName, password) => {
  const {
    userName: name,
    password: pass,
    address,
    port,
    path,
  } = extractRtspDetails(rawRtsp);
  const encodedUser = encodeURIComponent(name || userName);
  const encodedPass = encodeURIComponent(pass || password);

  let rtspLink = `rtsp://${encodedUser}:${encodedPass}@${address}`;
  if (port) rtspLink += `:${port}`;
  if (path) rtspLink += `/${path}`;
  return rtspLink;
};

// ONVIF Functions
const getRTSP = async (deviceUrl, username = "", password = "") => {
  return withRetry(async () => {
    const device = new onvif.OnvifDevice({
      xaddr: deviceUrl,
      user: username,
      pass: password,
      timeout: 10000,
    });

    await device.init();
    let profiles = await getProfiles(device);

    if (!Array.isArray(profiles)) profiles = [profiles];

    const rtspUrls = [];
    for (const profile of profiles) {
      try {
        const streamUri = profile?.stream?.rtsp;
        if (streamUri) {
          rtspUrls.push(createRtspLinkWithPas(streamUri, username, password));
        }
      } catch (error) {
        console.error(`Error getting stream URI: ${error.message}`);
      }
    }

    return rtspUrls.length > 0 ? rtspUrls : null;
  });
};

const getProfiles = async (device) => {
  try {
    return await device.getProfileList();
  } catch (error) {
    const mediaService = await device.getMediaService();
    return await mediaService.getProfiles();
  }
};

// Network Utilities
function checkRtspStream(rtspUrl, timeoutMs = 5000) {
  return new Promise((resolve) => {
    // Basic input validation
    if (!rtspUrl || typeof rtspUrl !== "string" || !rtspUrl.trim()) {
      return resolve({ isValid: false, error: "Invalid or empty URL" });
    }

    // Set timeout
    const timeout = setTimeout(() => {
      console.log(`Timeout after ${timeoutMs}ms for ${rtspUrl}`);
      resolve({ isValid: false, error: "Stream timed out" });
    }, timeoutMs);

    // Probe the RTSP stream
    const ff = ffmpeg(rtspUrl)
      .inputOptions([
        "-rtsp_transport", "tcp", // Try TCP first
        "-rtsp_flags", "prefer_tcp", // Prefer TCP but allow fallback
        "-timeout", "5000000", // FFmpeg connection timeout (5 seconds in microseconds)
      ])
      .on("start", (commandLine) => {
        console.log(`FFmpeg started for ${rtspUrl}: ${commandLine}`);
      })
      .on("codecData", (data) => {
        console.log(`Codec data received for ${rtspUrl}: ${JSON.stringify(data)}`);
        clearTimeout(timeout);
        ff.kill(); // Stop FFmpeg to avoid resource leaks
        resolve({ isValid: true });
      })
      .on("error", (err) => {
        console.error(`FFmpeg error for ${rtspUrl}: ${err.message}`);
        clearTimeout(timeout);
        resolve({ isValid: false, error: `Stream error: ${err.message}` });
      })
      .ffprobe((err, data) => {
        if (err) {
          console.error(`ffprobe error for ${rtspUrl}: ${err.message}`);
          clearTimeout(timeout);
          resolve({ isValid: false, error: `Probe error: ${err.message}` });
        } else {
          console.log(`ffprobe success for ${rtspUrl}: ${JSON.stringify(data.streams)}`);
          clearTimeout(timeout);
          resolve({ isValid: true });
        }
      });
  });
}

const checkDeviceReachable = (ip, ports, timeout = CONFIG.SCAN_TIMEOUT) => {
  return Promise.all(
    ports.map(
      (port) =>
        new Promise((resolve) => {
          const socket = new net.Socket();
          socket.setTimeout(timeout);
          const cleanup = () => {
            socket.destroy();
            resolve({ port, reachable: false });
          };
          socket.on("connect", () => {
            socket.destroy();
            resolve({ port, reachable: true });
          });
          socket.on("timeout", cleanup);
          socket.on("error", cleanup);
          socket.connect(port, ip);
        })
    )
  );
};

// Worker Functions
const ipToNumber = (ip) => {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
};

const numberToIp = (num) => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
};

const onvifFallbackWorker = async () => {
  // not using
  const { start, end, username, password, workerId } = workerData;
  const results = [];
  const startNum = ipToNumber(start);
  const endNum = ipToNumber(end);

  for (let i = startNum; i <= endNum; i++) {
    const ip = numberToIp(i);
    const portResults = await checkDeviceReachable(
      ip,
      CONFIG.COMMON_PORTS.ONVIF
    );
    for (const { port, reachable } of portResults) {
      if (!reachable) continue;
      for (const path of CONFIG.COMMON_PATHS.ONVIF) {
        const deviceUrl = `http://${ip}:${port}${path}`;
        try {
          const rtspUrls = await getRTSP(deviceUrl, username, password);
          if (rtspUrls?.length) {
            results.push({ ip, port, url: deviceUrl, rtsp: rtspUrls });
            break;
          }
        } catch (error) {
          console.error(
            `Worker ${workerId} error on ${ip}:${port}${path}: ${error.message}`
          );
        }
      }
    }
  }

  parentPort.postMessage(results);
};

const rtspFallbackWorker = async () => {
  const { start, end, username, password, workerId, foundOnvifIPs } =
    workerData;
  const foundOnvifIPSet = new Set(foundOnvifIPs);
  const results = [];
  const startNum = ipToNumber(start);
  const endNum = ipToNumber(end);

  for (let i = startNum; i <= endNum; i++) {
    const ip = numberToIp(i);
    if (foundOnvifIPSet.has(ip)) continue;
    const portResults = await checkDeviceReachable(
      ip,
      CONFIG.COMMON_PORTS.RTSP
    );
    for (const { port, reachable } of portResults) {
      if (!reachable) continue;
      for (const path of CONFIG.COMMON_PATHS.RTSP) {
        const rtspUrl =
          username && password
            ? `rtsp://${username}:${password}@${ip}:${port}${path}`
            : `rtsp://${ip}:${port}${path}`;
        const { isValid, error = "" } = await checkRtspStream(rtspUrl);
        if (isValid) {
          results.push({
            ip,
            port,
            type: "RTSP",
            url: rtspUrl,
            rtsp: rtspUrl,
            verified: false,
          });
          break;
        } else console.log(`Path not valid Error: ${error}`);
      }
    }
  }

  parentPort.postMessage(results);
};

// Scanning Coordination
const runWorkers = async (
  type,
  start,
  end,
  username,
  password,
  foundOnvifIPs = []
) => {
  const startNum = ipToNumber(start);
  const endNum = ipToNumber(end);
  const totalIps = endNum - startNum + 1;
  const ipsPerWorker = Math.ceil(totalIps / CONFIG.CONCURRENT_WORKERS);
  const workers = [];
  const results = [];

  for (let i = 0; i < CONFIG.CONCURRENT_WORKERS; i++) {
    const workerStartNum = startNum + i * ipsPerWorker;
    const workerEndNum = Math.min(workerStartNum + ipsPerWorker - 1, endNum);
    if (workerStartNum > endNum) break;

    const workerStart = numberToIp(workerStartNum);
    const workerEnd = numberToIp(workerEndNum);

    const worker = new Worker(__filename, {
      workerData: {
        start: workerStart,
        end: workerEnd,
        username,
        password,
        workerId: i,
        foundOnvifIPs,
        scanType: type,
      },
    });

    workers.push(
      new Promise((resolve) => {
        worker.on("message", (workerResults) => results.push(...workerResults));
        worker.on("exit", resolve);
      })
    );
  }

  await Promise.all(workers);
  return results;
};

const parallelIpScan = async (start, end, username, password) => {
  console.time("Scan");
  let onvifResults = [];
  // if (username && password) {
  //   console.log("Starting ONVIF scan...");
  //   onvifResults = await runWorkers(
  //     "onvif",
  //     start,
  //     end,
  //     username,
  //     password
  //   );
  // }
  const foundOnvifIPs = onvifResults.map((r) => r.ip);

  console.log("Starting RTSP fallback scan...");
  const rtspResults = await runWorkers(
    "rtsp",
    start,
    end,
    username,
    password,
    foundOnvifIPs
  );

  console.timeEnd("Scan");
  return [...onvifResults, ...rtspResults];
};

// Input Validation
const validateIPv4 = (ip) => {
  const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(regex);
  if (!match) return false;
  return match
    .slice(1)
    .every((num) => parseInt(num) >= 0 && parseInt(num) <= 255);
};

const validateInputs = () => {
  if (scanRange.start !== null && scanRange.end !== null) {
    if (!validateIPv4(scanRange.start) || !validateIPv4(scanRange.end)) {
      throw new Error(
        "Invalid IP format: must be valid IPv4 addresses (x.y.z.w)"
      );
    }
    const startNum = ipToNumber(scanRange.start);
    const endNum = ipToNumber(scanRange.end);
    if (startNum > endNum) {
      throw new Error(
        "Invalid IP range: start IP must be less than or equal to end IP"
      );
    }
  }
};

// Main Discovery Function
const discoverCameras = async (username, password) => {
  validateInputs();
  console.log("Starting camera discovery...");
  let devices = [];
  if (scanOnvif && username && password) {
    console.log("Performing automatic ONVIF discovery...");
    devices = await withRetry(() => onvif.startProbe({ timeout: 5000 }));
    console.log(
      devices.length === 0
        ? "No cameras found via automatic discovery"
        : `Found ${devices.length} cameras via automatic discovery`
    );
  }

  if (scanRange.start !== null && scanRange.end !== null) {
    console.log(
      `Starting parallel scan from ${scanRange.start} to ${scanRange.end}`
    );
    const manualResults = await parallelIpScan(
      scanRange.start,
      scanRange.end,
      username,
      password
    );
    devices = devices.concat(
      manualResults.map((result) => ({
        hostname: result.ip,
        xaddrs: [result.url],
        hardware: "Manually discovered",
      }))
    );
  }

  const limit = pLimit(CONFIG.CONCURRENT_DEVICES);
  const cameras = await Promise.all(
    devices.map((device) =>
      limit(async () => {
        try {
          const cameraData = {
            ip: device.hostname,
            url: device.xaddrs[0],
            hardware: device.hardware || "Unknown",
            manufacturer: device.manufacturer || "Unknown",
            rtsp: device.rtsp || [],
          };
          cameraData.rtsp =
            new URL(device.xaddrs[0]).protocol === "rtsp:"
              ? [device.xaddrs[0]]
              : (await getRTSP(device.xaddrs[0], username, password)) || [];
          return cameraData;
        } catch (error) {
          console.error(
            `Error processing camera at ${device.hostname || "unknown"}: ${
              error.message
            }`
          );
          return null;
        }
      })
    )
  );

  const processedCameras = cameras.filter(Boolean).map((item) => {
    if (item?.rtsp?.length === 0 && new URL(item?.url).protocol === "rtsp:") {
      item.rtsp = [item?.url];
    }
    return item;
  });

  // Output log and JSON separately with a delay to ensure separate chunks
  const timestamp = new Date().toISOString();
  process.stdout.write(
    `logTime: ${timestamp}, Camera discovery completed, outputting results...\n`
  );
  await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay to flush buffer
  const jsonOutput = JSON.stringify(processedCameras) + "\n";
  process.stdout.write(jsonOutput);

  return processedCameras;
};

// Entry Point
if (isMainThread) {
  const cleanupLogging = setupLogging();
  process.on("exit", cleanupLogging);

  discoverCameras(credentials.username, credentials.password)
    .then(() => {})
    .catch((err) => console.error(`Discovery failed: ${err.message}`));
} else {
  workerData.scanType === "onvif"
    ? onvifFallbackWorker().catch((err) =>
        console.error(`ONVIF worker failed: ${err.message}`)
      )
    : rtspFallbackWorker().catch((err) =>
        console.error(`RTSP worker failed: ${err.message}`)
      );
}
