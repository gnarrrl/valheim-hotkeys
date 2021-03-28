const robot = require('robotjs');
const gkm = require('gkm');
const monitor = require('active-window');

let is_valheim = false;
let config = {
    valheimAppName: 'valheim',
    windowDetectionIntervalSec: 2,
    hotkeys: {
        Q: {
            cmd: 'auto_run',
            gameRunHotkey: 'shift'
        },
        F: {
            cmd: 'multi_insert',
            count: 10,
            gameUseHotkey: 'e'
        },
        T: {
            cmd: 'auto_plant',
            intervalMs: 750
        },
        F1: {
            cmd: 'type_password',
            password: ''
        },
        F3: {
            cmd: 'type_server',
            ip: ''
        },
        F4: {
            cmd: 'suspend'
        }
    }
};

const autoplant = {
    toggle: function(handler) {
        if (suspend.running) return;
     
        if (this.running) {
            clearInterval(this.timer);
        } else {
            this.timer = setInterval(this.callback, handler.intervalMs);
        }
        this.running = !this.running;
        console.log('autoplant =', this.running);
    },
    running: false,
    timer: undefined,
    callback: function() {
        robot.mouseClick();
    }
};

const autorun = {
    toggle: function(handler) {
        if (suspend.running) return;
        
        if (this.running) {
            robot.keyToggle(handler.gameRunHotkey, 'up');
        } else {
            robot.keyToggle(handler.gameRunHotkey, 'down');
        }
        this.running = !this.running;
        console.log('autorun =', this.running);
    },
    running: false
};

const suspend = {
    toggle: function () {
        this.running = !this.running;
        console.log('suspended =', this.running);
    },
    running: false
};

monitor.getActiveWindow((window) => {
    const current = (window.app === config.valheimAppName);
    if (current !== is_valheim) {
        is_valheim = current;

        if (is_valheim) {
            console.log("You're in Valheim... waking up");
        } else {           
            console.log("You've left Valheim... going to sleep");
        }
    }
}, -1, config.windowDetectionIntervalSec);

async function listen() {
    console.log('Listening for Valheim activity...');

    gkm.events.on('key.pressed', async function (data) {
        if (!is_valheim) return;

        const key = data[0];
        const handler = config.hotkeys[key];
        if (!handler) return;

        switch (handler.cmd) {
            case 'type_server':
                if (suspend.running) break;
                robot.typeString(handler.ip);
                robot.keyTap('enter');
                break;
            case 'type_password':
                if (suspend.running) break;
                robot.typeString(handler.password);
                robot.keyTap('enter');
                break;
            case 'suspend':
                suspend.toggle();
                break;
            case 'auto_run':
                autorun.toggle(handler);
                break;
            case 'multi_insert':
                if (suspend.running) break;
                robot.typeString(Array(handler.count).fill(handler.gameUseHotkey).join(''));
                break;
            case 'auto_plant':
                autoplant.toggle(handler);
                break;
        }
    });
}

exports.config = config;
exports.listen = listen;
