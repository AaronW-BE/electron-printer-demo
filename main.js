const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain
} = require('electron');

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.once('ready-to-show', () => {
        console.log('ready to show')
        setTimeout(() => {
            splashWindow.destroy()
            splashWindow = null;

            win.show();
        }, 3000);
    });

    // let printPreviewWindow = new BrowserWindow({
    //     webPreferences: {
    //         nodeIntegration: true
    //     }
    // });
    // printPreviewWindow.hide();
    // printPreviewWindow.loadFile("./src/renderer/print_preview.html");
    // printPreviewWindow.webContents.openDevTools();

    // printPreviewWindow.hide();
    win.loadFile("./src/renderer/index.html");
    win.webContents.openDevTools()

    ipcMain.on("getPrinterList", event => {
        const list = win.webContents.getPrinters();
        win.webContents.send("getPrinterList", list);
    });

    ipcMain.on('exec-printing', (event, args) => {
        // printPreviewWindow.webContents.print(args, (success, errorType) => {
        //     if (!success) console.log(errorType)
        // });
    });

    ipcMain.on('print-preview', ((event, args) => {
        // printPreviewWindow.show();
        // win.close();
        // printPreviewWindow.webContents.send('print-preview', args);
    }));
}

app.whenReady().then(() => {
    createWindow();
    splashWindow = new BrowserWindow({
        titleBarStyle: "hidden",
        frame: false,
        width: 500,
        height: 350,
        alwaysOnTop: true,
        // transparent: true
    });
    splashWindow.loadFile('./src/renderer/splash.html')
    splashWindow.show();
});

// let onlineStatusWindow;
// app.whenReady().then(() => {
//     onlineStatusWindow = new BrowserWindow({ width: 500, height: 500, show: true, webPreferences: { nodeIntegration: true } })
//     onlineStatusWindow.loadURL(`file://${__dirname}/src/renderer/online-status.html`)
// });

let splashWindow;

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