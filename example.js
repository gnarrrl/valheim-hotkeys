// valheim-hotkeys with optional config
const valheim = require('valheim-hotkeys');

// completely optional, if you're tired of misspelling your server pwd
valheim.config.hotkeys.F3.ip = '<your server ip>';
valheim.config.hotkeys.F1.password = '<your server password>';

valheim.listen();