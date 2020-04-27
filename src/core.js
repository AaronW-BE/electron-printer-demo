const {
    BrowserWindow,
} = require('electron');

class WindowManager {
    constructor() {
        this.windowStack = [];
    }

    createWindow(options, fn) {
        let win = new BrowserWindow(options);
        typeof fn === "function" && fn(win);
        this.windowStack.push(win);
        return win;
    }

    getTopWindow() {
        return this.windowStack[this.windowStack.length - 1];
    }

    getActivateWindows() {
        let wins = [];
        for (let win of this.windowStack) {
            if (win.isVisible()) {
                wins.push(win)
            }
        }
        return wins;
    }

    destroyWindow(window) {
        for (let i = 0; i < this.windowStack.length; i++) {
            if (this.windowStack[i] === window) {
                window.close();
                window.destroy();
                window = null;
                this.windowStack.splice(i, 1);
            }
        }
    }
}

let windowManager;
module.exports = (() => {
    if (windowManager !== null) {
        windowManager = new WindowManager();
    }
    return windowManager;
})();