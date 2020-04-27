const {
    app,
    ipcMain
} = require('electron');
const path = require('path');
const windowManager = require('./core');

app.whenReady().then(() => {
    let splash = windowManager.createWindow({
        titleBarStyle: "hidden",
        frame: false,
        width: 500,
        height: 350,
        show: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    }, function (window) {
        window.loadFile(path.join(__dirname, 'renderer/splash.html')).catch((e) => console.log(e));
        window.once('ready-to-show', () => {
            setTimeout(() => {
                window.show();
            }, 500);
        });
    })

    let options = {
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    };
    windowManager.createWindow(options, function (win) {
        win.loadFile(path.join(__dirname, 'renderer/index.html')).catch((e) => console.log(e))
        win.once('ready-to-show', function () {
            setTimeout(() => {
                windowManager.destroyWindow(splash);
                win.show();
            }, 3000);
        });
    });
});

ipcMain.on('getPrinterList', ((event, args) => {
    const {sender} = event;
    const printers = sender.getPrinters();
    sender.send("getPrinterList", printers);
    debugger;
}));

app.allowRendererProcessReuse = true;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    console.log('activate')
});