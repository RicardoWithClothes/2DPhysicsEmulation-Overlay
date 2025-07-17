const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let overlayWindow;
let controlWindow;

function createWindows() {
    const { width, height } = screen.getPrimaryDisplay().bounds;

    // Overlay (click-through)
    overlayWindow = new BrowserWindow({
        width,
        height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });

    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    overlayWindow.setAlwaysOnTop(true, "screen-saver");
    overlayWindow.loadFile("overlay.html");

    // Control Panel (interactive)
    controlWindow = new BrowserWindow({
        width: 300,
        height: 200,
        frame: true,
        resizable: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });

    controlWindow.loadFile("controls.html");
}

const { ipcMain } = require("electron");

ipcMain.on("update-dot", (event, pos) => {
    overlayWindow.webContents.send("update-dot", pos);
});


app.whenReady().then(() => {
    createWindows();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

app.on("window-all-closed", () => {
    app.quit();
});