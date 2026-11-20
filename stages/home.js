const { Stage, ServerQuery, ConfigReader } = require("../common.js");
const Renderer = require("../renderer.js");

class HomeStage extends Stage {
    constructor() {
        super();
        this._init();        
    }

    async _getJsonFromServer(path, params={}, key) {
        const response = await ServerQuery.GET(path, this.token, params);
        const json = await response.json();
        if (key) return json[key];
        return json;
    }

    async _init() {
        this.token = ConfigReader.getKey('token');
        this.username = ConfigReader.getKey('username');
        this.display_name = await this._getJsonFromServer('get-user-display-name', { username: this.username, target: this.username }, 'display_name');
        this.friends = await this._getJsonFromServer('get-friends-of', { username: this.username });
    }

    async loop() {
        this.displayMsg(`${Renderer.Colours.Cursor.HIDE_CURSOR}Welcome back, ${this.display_name ? this.display_name : this.username}!`);
        console.log(`You have [?] unread messages.`);
        return this;
    }
}

module.exports = HomeStage;