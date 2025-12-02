const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runDiscovery: (credentials) =>
    ipcRenderer.invoke("run-discovery", credentials),
  readLog: (path) => ipcRenderer.invoke("read-log", path),
  openRtspLink: (link) => ipcRenderer.invoke("open-rtsp-link", link),
  getBaseIp: () => ipcRenderer.invoke("get-base-ip"),
});
