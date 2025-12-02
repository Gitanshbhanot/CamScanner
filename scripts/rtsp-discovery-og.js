const fs = require("fs");
const onvif = require("node-onvif");
const net = require("net");
const os = require("os");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

// Configuration
const CONCURRENT_WORKERS = 10; // Number of parallel workers for scanning
const COMMON_PORTS = {
  ONVIF: [80, 8080, 8000, 8899],
  RTSP: [554, 8554],
};
const COMMON_PATHS = {
  ONVIF: ["/onvif/device_service", "/onvif/services", "/onvif/Media"],
  RTSP: [
    "/Streaming/Channels/101",
    "/Streaming/Channels/102",
    "/cam/realmonitor?channel=1&subtype=0",
    "/live/main",
    "/ISAPI/Streaming/channels/101",
  ],
};
const SCAN_TIMEOUT = 2000; // 2 seconds per attempt
const userName = process.env.USERNAME || "";
const password = process.env.PASSWORD || "";
const scanStart = process.env.SCAN_IP_START
  ? parseInt(process.env.SCAN_IP_START)
  : null;
const scanEnd = process.env.SCAN_IP_END
  ? parseInt(process.env.SCAN_IP_END)
  : null;

// const logStream = fs.createWriteStream("rtsp-discovery.log", { flags: "a" });

// Override console.log to write to both console and file
const originalLog = console.log;
console.log = (...args) => {
  const message = args
    .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
    .join(" ");
  const timestamp = new Date().toISOString();

  originalLog(`logTime: ${timestamp},`, ...args);
  // logStream.write(`logTime: ${timestamp}, message: ${message}\n`);
};

// Enhanced RTSP details extraction
function extractRtspDetails(rtspLink) {
  try {
    if (!rtspLink?.startsWith("rtsp://"))
      throw new Error("Invalid RTSP URL: missing protocol");

    const restOfLink = rtspLink.substring(7);
    let userName = "",
      password = "",
      addressWithPort = "",
      path = "";
    const lastAtSymbolIndex = restOfLink.lastIndexOf("@");

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
}

// Function to build RTSP link with credentials
function createRtspLinkWithPas(rawRtsp, userName, password) {
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
}

// Function to get RTSP URLs from a device
async function getRTSP(deviceUrl, username = "", password = "") {
  try {
    const device = new onvif.OnvifDevice({
      xaddr: deviceUrl,
      user: username,
      pass: password,
      timeout: 10000,
    });

    await device.init();

    let profiles = [];
    try {
      profiles = await device.getProfileList();
    } catch (error) {
      const mediaService = await device.getMediaService();
      profiles = await mediaService.getProfiles();
    }

    if (!Array.isArray(profiles)) {
      profiles = [profiles];
    }

    const rtspUrls = [];
    for (const profile of profiles) {
      try {
        console.log(profile);
        const streamUri = profile?.stream?.rtsp;
        if (streamUri) {
          rtspUrls.push(createRtspLinkWithPas(streamUri, username, password));
        }
      } catch (error) {
        console.error(`Error getting stream URI: ${error.message}`);
      }
    }

    return rtspUrls.length > 0 ? rtspUrls : null;
  } catch (error) {
    console.error(`Error connecting to ${deviceUrl}: ${error.message}`);
    return null;
  }
}

// Function to check if a device is reachable
async function checkDeviceReachable(ip, port, timeout = SCAN_TIMEOUT) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, ip);
  });
}

// Worker function for parallel scanning
async function scanWorker() {
  const { baseIp, start, end, username, password, workerId } = workerData;
  const results = [];

  for (let i = start; i <= end; i++) {
    const ip = `${baseIp}${i}`;

    // add condition to not check if ip already exists in onvif
    for (const port of COMMON_PORTS.ONVIF) {
      try {
        const isReachable = await checkDeviceReachable(ip, port);
        if (!isReachable) continue;

        for (const path of COMMON_PATHS.ONVIF) {
          const deviceUrl = `http://${ip}:${port}${path}`;
          try {
            const rtspUrls = await getRTSP(deviceUrl, username, password);
            if (rtspUrls?.length) {
              results.push({
                ip,
                port,
                url: deviceUrl,
                rtsp: rtspUrls,
              });
              break; // Move to next port if found
            }
          } catch (error) {
            // Silently continue to next path
          }
        }
      } catch (error) {
        console.error(
          `Worker ${workerId} error scanning ${ip}:${port}`,
          error.message
        );
      }
    }
  }

  parentPort.postMessage(results);
}

async function rtspFallbackWorker() {
  const { baseIp, start, end, username, password, workerId, foundOnvifIPs } =
    workerData;
  const results = [];

  for (let i = start; i <= end; i++) {
    const ip = `${baseIp}${i}`;
    // Skip IPs already found via ONVIF
    if (foundOnvifIPs.includes(ip)) continue;
    for (const port of COMMON_PORTS.RTSP) {
      try {
        if (!(await checkDeviceReachable(ip, port))) continue;

        for (const path of COMMON_PATHS.RTSP) {
          const rtspUrl = `rtsp://${username}:${password}@${ip}:${port}${path}`;
          results.push({
            ip,
            port,
            type: "RTSP",
            url: rtspUrl,
            rtsp: rtspUrl,
            verified: false,
          });
          break; // Try next port after first potential match
        }
      } catch (error) {
        console.error(
          `Worker ${workerId} error scanning ${ip}:${port}`,
          error.message
        );
      }
    }
  }

  parentPort.postMessage(results);
}

// Function to get the local network base IP
function getLocalBaseIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === "IPv4") {
        const parts = iface.address.split(".");
        parts.pop(); // Remove the last part
        return parts.join(".") + ".";
      }
    }
  }
  return "192.168.1."; // Default fallback
}

// Main function to coordinate workers
async function parallelIpScan(baseIp, start, end, username, password) {
  // First run ONVIF scan
  console.log("Starting ONVIF scan...");
  const onvifResults = await runWorkers(
    "onvif",
    baseIp,
    start,
    end,
    username,
    password
  );
  const foundOnvifIPs = onvifResults.map((r) => r.ip);

  // Then run RTSP fallback for IPs not found via ONVIF
  console.log("Starting RTSP fallback scan...");
  const rtspResults = await runWorkers(
    "rtsp",
    baseIp,
    start,
    end,
    username,
    password,
    foundOnvifIPs
  );

  return [...onvifResults, ...rtspResults];
}

// Unified worker runner
async function runWorkers(
  type,
  baseIp,
  start,
  end,
  username,
  password,
  foundOnvifIPs = []
) {
  const totalIps = end - start + 1;
  const ipsPerWorker = Math.ceil(totalIps / CONCURRENT_WORKERS);
  const workers = [];
  const results = [];

  for (let i = 0; i < CONCURRENT_WORKERS; i++) {
    const workerStart = start + i * ipsPerWorker;
    const workerEnd = Math.min(workerStart + ipsPerWorker - 1, end);
    if (workerStart > end) break;

    const worker = new Worker(__filename, {
      workerData: {
        baseIp,
        start: workerStart,
        end: workerEnd,
        username,
        password,
        workerId: i,
        foundOnvifIPs,
        scanType: type, // Add this to distinguish between scan types
      },
    });

    workers.push(
      new Promise((resolve) => {
        worker.on("message", (workerResults) => {
          results.push(...workerResults);
        });
        worker.on("exit", resolve);
      })
    );
  }

  await Promise.all(workers);
  return results;
}

// Main discovery function
async function discoverCameras(userName, password) {
  console.log("Starting camera discovery...");

  // Auto-detect base IP
  const baseIp = getLocalBaseIP();
  console.log(`Detected local network base IP: ${baseIp}`);

  // Automatic discovery first
  console.log("Performing automatic ONVIF discovery...");
  let devices = await onvif.startProbe({ timeout: 5000 });

  if (devices.length === 0) {
    console.log("No cameras found via automatic discovery");
  } else {
    console.log(`Found ${devices.length} cameras via automatic discovery`);
  }

  // Manual IP range scanning if requested
  const scanSpecific = scanStart && scanEnd;
  if (scanSpecific) {
    const start = scanStart;
    const end = scanEnd;

    console.log(
      `Starting parallel scan from ${baseIp}${start} to ${baseIp}${end}`
    );
    const manualResults = await parallelIpScan(
      baseIp,
      start,
      end,
      userName,
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

  // Process all found devices
  let cameras = [];
  for (const device of devices) {
    try {
      const cameraData = {
        ip: device.hostname,
        url: device.xaddrs[0],
        hardware: device.hardware || "Unknown",
        manufacturer: device.manufacturer || "Unknown",
        rtsp: device.rtsp || [],
      };

      cameraData.rtsp =
        (await getRTSP(device.xaddrs[0], userName, password)) || [];
      cameras.push(cameraData);
    } catch (error) {
      console.error(
        `Error processing camera at ${device.hostname}:`,
        error.message
      );
    }
  }

  // Save results
  // const rtspLinks = cameras
  //   .flatMap((camera) => camera.rtsp)
  //   .filter((url) => url);
  // if (rtspLinks.length > 0) {
  //   fs.writeFileSync("rtsp_cameras.txt", rtspLinks.join("\n"), "utf8");
  //   console.log(
  //     `Found ${rtspLinks.length} RTSP URLs saved to rtsp_cameras.txt`
  //   );

  //   // Save detailed results to JSON
  //   fs.writeFileSync(
  //     "camera_details.json",
  //     JSON.stringify(cameras, null, 2),
  //     "utf8"
  //   );
  //   console.log("Detailed camera information saved to camera_details.json");
  // } else {
  //   console.log("No valid RTSP URLs found.");
  // }
  cameras = cameras?.map((item) => {
    if (item?.rtsp?.length === 0) {
      if (new URL(item?.url).protocol === "rtsp:") {
        item.rtsp = [item?.url];
      }
    }
    return item;
  });
  process.stdout.write(JSON.stringify(cameras));
  return cameras;
}

// Entry point
if (isMainThread) {
  // Main execution

  discoverCameras(userName, password)
    .then((cameras) => {})
    .catch((err) => {
      console.error("Discovery failed:", err);
    });
} else {
  if (workerData.scanType === "onvif") {
    scanWorker().catch(console.error);
  } else {
    rtspFallbackWorker().catch(console.error);
  }
}
