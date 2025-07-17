const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onUpdateDot: (callback) => ipcRenderer.on("update-dot", callback),
});