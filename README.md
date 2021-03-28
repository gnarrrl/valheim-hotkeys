Enables useful global hotkeys while in Valheim.

```
// minimal node.js script
require('valheim-hotkeys').listen();
```

```
// valheim-hotkeys with optional config
const valheim = require('valheim-hotkeys');

// completely optional, if you're tired of misspelling your server pwd
valheim.config.hotkeys.F3.ip = '<your server ip>';
valheim.config.hotkeys.F1.password = '<your server password>';

valheim.listen();
```

## Default Hotkeys

- Q  ... toggle auto-run
- F  ... hit use key 10 times
- T  ... toggle click every 750 ms (**walk** sideways for easy auto-planting)
- F1 ... types your specified server password
- F3 ... types your specified server ip
- F4 ... suspends hotkeys (required for chatting ingame or naming signs)

## Config

```
config = {
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
```