const robot = require('robotjs');
const gkm = require('gkm');
const monitor = require('active-window');

let is_valheim = false;
let config = {
    valheimAppName: 'valheim',
    windowDetectionIntervalSec: 1,
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
        if (this.running) {
            clearInterval(this.timer);
        } else {
            if (handler) {
                this.intervalMs = handler.intervalMs;
            }
            this.timer = setInterval(this.callback, this.intervalMs);
        }
        this.running = !this.running;
        console.log('autoplant =', this.running);
    },
    running: false,
    timer: undefined,
    callback: function() {
        robot.mouseClick();
    },
    intervalMs: 0
};

const autorun = {
    toggle: function(handler) {
        if (handler) {
            this.gameRunHotkey = handler.gameRunHotkey;
        }

        if (this.running) {
            robot.keyToggle(this.gameRunHotkey, 'up');
        } else {
            robot.keyToggle(this.gameRunHotkey, 'down');
        }
        this.running = !this.running;
        console.log('autorun =', this.running);
    },
    running: false,
    gameRunHotkey: 'shift'
};

const suspend = {
    toggle: function () {
        if (autorun.running) {
            autorun.toggle();
        }
        if (autoplant.running) {
            autoplant.toggle();
        }
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
            if (suspend.running) {
                suspend.toggle();
            }
        } else {           
            console.log("You've left Valheim... going to sleep");
            if (!suspend.running) {
                suspend.toggle();
            }
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

        if (suspend.running && 
            handler.cmd === 'suspend')
        {
            suspend.toggle();
        } else if (!suspend.running) {
            switch (handler.cmd) {
                case 'type_server':
                    robot.typeString(handler.ip);
                    robot.keyTap('enter');
                    break;
                case 'type_password':
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
                    robot.typeString(Array(handler.count).fill(handler.gameUseHotkey).join(''));
                    break;
                case 'auto_plant':
                    autoplant.toggle(handler);
                    break;
            }
        }
    });
}

exports.config = config;
exports.listen = listen;
