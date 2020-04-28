const {
    app,
    Tray,
    Menu,
    ipcMain,
    shell
} = require('electron');
const path = require('path');
const windowManager = require('./core');


let tray;

app.whenReady().then(() => {

    tray = new Tray(path.join(__dirname, "assets", "icon", "app.ico"));
    const contextMenu = Menu.buildFromTemplate([
        { label: '打开', type: 'normal' },
        { label: '退出', type: 'normal', click: (event, focusedWindow, focusedWebContents) => {
                app.quit();
        }},
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

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