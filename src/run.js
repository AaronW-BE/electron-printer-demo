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

let mainWindow;

function setTray() {
    tray = new Tray(path.join(__dirname, "assets", "icon", "app.ico"));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', type: 'normal', click: () => {
                if (mainWindow && !mainWindow.isVisible()) {
                    mainWindow.show();
                }
            }},
        { label: 'Quit', type: 'normal', click: (event, focusedWindow, focusedWebContents) => {
                app.exit();
            }},
    ])
    tray.on('double-click', () => {
        mainWindow.show();
    });
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
}

function hideTray() {
    if (tray) {
        tray.destroy();
    }
}

app.whenReady().then(() => {

    let splash = windowManager.createWindow({
        titleBarStyle: "hidden",
        frame: false,
        width: 500,
        height: 350,
        center: true,
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
                window.setProgressBar(2);
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
    mainWindow = windowManager.createWindow(options, function (win) {
        win.loadFile(path.join(__dirname, 'renderer/index.html')).catch((e) => console.log(e))

        win.on('show', () => {
            hideTray();
        });
        win.once('ready-to-show', function () {
            setTimeout(() => {
                windowManager.destroyWindow(splash);
                // win.maximize();
                // win.setResizable(false);
                win.show();
            }, 3000);
        });

        win.on('close', (e) => {
            setTray();
            e.preventDefault();
            win.hide();
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