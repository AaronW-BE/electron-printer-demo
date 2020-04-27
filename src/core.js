const {
    BrowserWindow,
} = require('electron');

/**
 * Global window manager for application
 */
class WindowManager {
    #windowStack = []

    /**
     * Create a window ant append to window stack
     * @param options
     * @param fn
     * @returns {Electron.BrowserWindow}
     */
    createWindow(options, fn) {
        let win = new BrowserWindow(options);
        typeof fn === "function" && fn(win);
        this.#windowStack.push(win);
        return win;
    }

    /**
     * Get last appended window
     * @returns {*}
     */
    getTopWindow() {
        return this.#windowStack[this.#windowStack.length - 1];
    }

    /**
     * get Activated windows array
     * @returns {[]}
     */
    getActivateWindows() {
        let wins = [];
        for (let win of this.#windowStack) {
            if (win.isVisible()) {
                wins.push(win)
            }
        }
        return wins;
    }

    /**
     * Close specific window and destroy it
     * @param window
     */
    destroyWindow(window) {
        for (let i = 0; i < this.#windowStack.length; i++) {
            if (this.#windowStack[i] === window) {
                window.close();
                window.destroy();
                window = null;
                this.#windowStack.splice(i, 1);
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