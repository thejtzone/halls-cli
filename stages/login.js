const { Stage, ConfigReader, ServerQuery, AnimatedActionText, Logger } = require('../common.js');
const Renderer = require('../renderer.js');

class LoginStage extends Stage {
    constructor(login_msg='') { 
        super(); 
        this.msg = login_msg;

        this._usernameInput = '';
        this._usernameDone = false;

        this._passwordInput = '';
        this._passwordDone = false;

        this._attemptingLogin = false;
        this._loginActionText = null;

        this._returnClass = null;
    }

    async loop() {
        this.displayMsg(`${this.msg ? ` - ${this.msg}! - ` : ''}Login to your account.\n\n`);

        process.stdout.write(`${Renderer.Colours.CLEAR_LINE + Renderer.Colours.Cursor.SHOW_CURSOR}Username: ${this._usernameInput}`);
        if (!this._usernameDone) return this._returnClass ? this._returnClass : this;

        process.stdout.write(`\n${Renderer.Colours.CLEAR_LINE}Password: ${'*'.repeat(this._passwordInput.length)}`);
        if (!this._passwordDone) return this._returnClass ? this._returnClass : this;

        process.stdout.write(Renderer.Colours.Cursor.HIDE_CURSOR);
        if (!this._attemptingLogin) this._attemptLogin();

        process.stdout.write(`\n\n${this._loginActionText.ctext}`);
        return this._returnClass ? this._returnClass : this;
    }

    _handleLoginResponseError(status, statusText) {
        switch (status) {
            case 400: return new LoginStage('Invalid username or password.');
            case 401: return new LoginStage('Invalid username or password.');
            default: return new (require('./error.js'))(`${status} - ${statusText}`);
        }
    }

    async _attemptLogin() {
        this._attemptingLogin = true;
        this._loginActionText = new AnimatedActionText('Validating with server...', false);
        this._loginActionText.start();

        const response = await ServerQuery.POST('login', null, { username: this._usernameInput, password: this._passwordInput });
        this._loginActionText.stop();

        if (!response.ok) { 
            this._returnClass = this._handleLoginResponseError(response.status, response.statusText);
            return;
        }

        const json = await response.json();
        ConfigReader.setKey('token', json.token);
        ConfigReader.setKey('username', this._usernameInput);
        this._returnClass = new (require('./connecting.js'))();
    }

    processKey(input) {
        if (this._usernameDone && this._passwordDone) return;
        if (input == '\r') {
            if (!this._usernameDone) this._usernameDone = true;
            else if (!this._passwordDone) this._passwordDone = true;
            return;
        }
        if (['\b', '\x7f', '\x08'].includes(input)) {
            if (!this._usernameDone) this._usernameInput = this._usernameInput.slice(0, -1);
            else this._passwordInput = this._passwordInput.slice(0, -1);
            return;
        }
        if (this._usernameDone) this._passwordInput += input;
        else this._usernameInput += input;
    }
}

module.exports = LoginStage;