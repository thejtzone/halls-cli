const { Stage, ConfigReader, ServerQuery, AnimatedActionText, Logger } = require('../common.js');
const Renderer = require('../renderer.js');

class LoginTypeStage extends Stage {
    constructor(login_msg='') {
        super();
        this.msg = login_msg
        this._sel = 0;
    }

    async loop() {
        this.displayMsg(`${this.msg ? ` - ${this.msg}! - ` : ''}You aren't logged in! Please select login or register.\n\n`)

        Array.from(["LOGIN", "REGISTER"]).map((text, idx, arr) => {
            // process.stdout.write(arr.reduce((a,b) => a.length+b.length))
            if (idx == 0)
                process.stdout.write(' '.repeat(Renderer.centre(arr.reduce((a, b) => a.length + b.length + 4))))

            process.stdout.write('[ ')
            if (idx == this._sel) process.stdout.write(Renderer.Colours.REVERSE);
            process.stdout.write(`${text}`);
            process.stdout.write(Renderer.Colours.RESET + ' ]');
        })
        if (this._return) return this._return;
        return this;
    }

    processKey(input) {
        if (input === '\u001b[D') this._sel = 0
        else if (input === '\u001b[C') this._sel = 1

        if (input === '\r')
            this._return = this._sel == 0 ? new (require('./login.js'))() : new (require('./register.js'))();
    }
}

module.exports = LoginTypeStage