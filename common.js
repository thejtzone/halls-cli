const Renderer = require('./renderer.js');

class Stage {
    async loop() { 
        // this.displayMsg('');
        return this; 
    }

    displayMsg(message) {
        // Renderer.clear();
        Renderer.logo();
        console.log(`\n\n${message}`);
    }

    processKey(input) {}
    processMouseInput(input) {}
}

class ConfigReader {
    static getLocation() {
        const os = require('os');
        const path = require('path')

        switch (os.type()) {
            case 'Linux': return path.join(os.homedir(), '.local', 'share', 'halls');
            case 'Windows_NT': return path.join(os.homedir(), 'AppData', 'Local', 'halls')
            default: throw new Error('Unrecognised operating system.')
        }
    }

    static read() { 
        if (!ConfigReader.getLocation()) return {};

        const fs = require('fs');
        if (!fs.existsSync(ConfigReader.getLocation()))
            fs.mkdirSync(ConfigReader.getLocation());

        const path = require('path');
        try {
            let config = fs.readFileSync(path.join(ConfigReader.getLocation(), 'config.json')) || '{}';
            return JSON.parse(config)
        } catch { return {}; }
    }
    static write(contents) {
        const fs = require('fs');
        if (!fs.existsSync(ConfigReader.getLocation()))
            fs.mkdirSync(ConfigReader.getLocation());

        const path = require('path');
        fs.writeFileSync(path.join(ConfigReader.getLocation(), 'config.json'), JSON.stringify(contents));
    }

    static getKey(key) {
        const config = ConfigReader.read();
        return config[key];
    }

    static setKey(key, name) {
        const config = ConfigReader.read();
        config[key] = name;
        ConfigReader.write(config);
    }
}

class Logger {
    constructor() {
        this._LOG_SESSION = new Date().getTime();
        this._DIRECTORY = ConfigReader.getLocation();
        this._fs = require('fs');
        this._path = require('path');

        const logFiles = this._getLogFiles().sort((a, b) => {
            const aDate = parseInt(a.split('.')[0]);
            const bDate = parseInt(b.split('.')[0]);
            return bDate - aDate;
        });

        if (logFiles.length > 5) {
            for (let i = 5; i < logFiles.length; i++) {
                this._fs.unlinkSync(this._path.join(this._DIRECTORY, logFiles[i]));
            }
        }
    }

    _getLogFiles() {
        if (!this._fs.existsSync(this._DIRECTORY)) return [];
        return this._fs.readdirSync(this._DIRECTORY).filter(file => file.endsWith('.log'));
    }

    log(message) {
        if (!this._fs.existsSync(this._DIRECTORY)) this._fs.mkdirSync(this._DIRECTORY);
        this._fs.appendFileSync(this._path.join(this._DIRECTORY, `${this._LOG_SESSION}.log`), `[${new Date().toLocaleString()}] ${message}\n`);
    }
}

const L = new Logger();

class ServerQuery {
    static SERVER_URL = "https://halls.theadelaidegame.org";

    static async GET(path, token=null, params={}) {
        L.log(`GET ${path}: Params: ${JSON.stringify(params)}`);
        const paramsFormatted = new URLSearchParams(params).toString();
        const url = `${ServerQuery.SERVER_URL}/${path}${paramsFormatted ? `?${paramsFormatted}` : ''}`;
        const response = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
        L.log(`GET ${path}: Response: ${response.status} - ${response.statusText}`);
        return response;
    }

    static async POST(path, token=null, body={}) {
        L.log(`POST ${path}: Body: ${JSON.stringify(body)}`);
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`${ServerQuery.SERVER_URL}/${path}`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(body)
        });
        L.log(`POST ${path}: Response: ${response.status} - ${response.statusText}`);
        return response;
    }
}

class AnimatedActionText {
    constructor(text, print=true, interval=300) {
        this.text = text;
        this.print = print;
        this._doInterval = null;
        this._intervalCount = interval;
        this._dotCount = 3;
        this._currentText = text;
    }

    get ctext() { return this._currentText; }

    _do() {
        this._currentText = this.text.replaceAll('...', '.'.repeat(this._dotCount));
        if (this.print) process.stdout.write(`${Renderer.Colours.CLEAR_LINE}${this._currentText}`);
        this._dotCount = (this._dotCount + 1) % 4;
    }

    start() {
        this._do();
        this._doInterval = setInterval(this._do.bind(this), this._intervalCount);
    }

    stop() { clearInterval(this._doInterval); }
}

module.exports = { Stage, ConfigReader, ServerQuery, AnimatedActionText, Logger: L };