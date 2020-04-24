const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile("./src/renderer/index.html");
    win.webContents.openDevTools()

    ipcMain.on("getPrinterList", event => {
        const list = win.webContents.getPrinters();
        win.webContents.send("getPrinterList", list);
    });

    ipcMain.on('exec-printing', (event, args) => {
        win.webContents.print(args, (success, errorType) => {
            if (!success) console.log(errorType)
        });
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})