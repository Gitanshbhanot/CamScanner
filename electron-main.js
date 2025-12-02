// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");

require("dotenv").config();

// Configure logging
log.transports.file.level = "info";
autoUpdater.logger = log;

// Determine the environment
const isDev = require("electron-is-dev");

// Allow remote debugging
//app.commandLine.appendSwitch('remote-debugging-port', '9222');

function createWindow() {
  // Dynamically set the window width
  const window_width = isDev ? 1500 : 1000;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: window_width,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    frame: true,
    title: "CamSearch",
    contextIsolation: false,
    enableRemoteModule: true,
    icon: path.join(__dirname, "build/app-icon.ico"),
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true, // Dynamically enables/disables the dev tools based on environment
      webSecurity: false,
    },
  });

  // Open dev tools based on environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const unhandled = require("electron-unhandled");
  unhandled();

  //removes the menu bar from the main window
  mainWindow.setMenuBarVisibility(isDev);

  // Load app based on environment
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    const url = require("url");

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "build/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
}

const getScriptPath = () => {
  if (isDev) {
    // In development, use the direct path
    const projectRoot = path.join(__dirname);
    return path.join(projectRoot, "scripts", "rtsp-discovery.js");
  } else {
    // In production, use the packaged path
    return path.join(process.resourcesPath, "scripts/rtsp-discovery.js");
  }
};

ipcMain.handle(
  "run-discovery",
  async (event, { username, password, scanRange, onvif }) => {
    const logsDir = path.join(app.getPath("documents"), "RTSPDiscoveryLogs");
    const logPath = path.join(logsDir, `discovery_${Date.now()}.log`);
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const scriptPath = getScriptPath();
      const child = spawn(process.execPath, [scriptPath], {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
          USERNAME: username,
          PASSWORD: password,
          SCAN_IP_START: scanRange?.start,
          SCAN_IP_END: scanRange?.end,
          SCAN_ONVIF: onvif,
        },
      });

      // Capture output
      const logStream = fs.createWriteStream(logPath);
      let cameraData = "";

      child.stdout.on("data", (data) => {
        const message = data.toString();
        // Assume the last JSON-like output is the cameras array
        if (message.trim().startsWith("[")) {
          cameraData += message; // Accumulate in case it's split across chunks
        } else {
          logStream.write(`[STDOUT] ${message}`);
        }
      });

      child.stderr.on("data", (data) => {
        const message = data.toString();
        console.error(message); // Main process console
        logStream.write(`[STDERR] ${message}`);
      });

      child.on("close", (code) => {
        logStream.end();
        if (code === 0) {
          try {
            console.log(cameraData, "hello");

            const cameras = JSON.parse(cameraData?.trim());
            resolve(cameras); // Return only the cameras array
          } catch (e) {
            reject(
              new Error(
                `Failed to parse camera data: ${e.message}. See logs at ${logPath}`
              )
            );
          }
        } else {
          reject(
            new Error(
              `Process exited with code ${code}. See logs at ${logPath}`
            )
          );
        }
      });
    });
  }
);

ipcMain.handle("open-rtsp-link", async (event, rtspUrl) => {
  console.log("Received request to open RTSP link:", rtspUrl);
  shell.openExternal(rtspUrl);
});

ipcMain.handle("get-base-ip", async (event) => {
  console.log("Received request to get base ip");
  return new Promise((resolve, reject) => {
    try {
      const interfaces = os.networkInterfaces();
      const networks = [];
      for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
          if (config.family === "IPv4" && !config.internal) {
            networks.push({
              ip: config.address, // e.g., "192.168.1.100"
              netmask: config.netmask, // e.g., "255.255.255.0"
              interface: iface[0].interface || "Unknown", // Optional: interface name (e.g., "en0", "eth0")
            });
          }
        }
      }
      if (networks.length === 0) {
        throw new Error("No valid network interfaces found");
      }
      resolve(networks);
    } catch (error) {
      reject(new Error(error.message));
    }
  });
});

// built to diplay log file not of use
ipcMain.handle("read-log", async (event, logPath) => {
  try {
    return await fs.promises.readFile(logPath, "utf-8");
  } catch (err) {
    console.error("Error reading log:", err);
    return `Error reading log file: ${err.message}`;
  }
});

app.whenReady().then(async () => {
  // autoUpdater.checkForUpdatesAndNotify();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
