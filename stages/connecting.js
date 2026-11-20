const { Stage, ConfigReader, ServerQuery, AnimatedActionText } = require('../common.js');

class ConnectingStage extends Stage {
    async loop() {
        this.displayMsg('')
        const connectingAction = new AnimatedActionText('Connecting to server...');
        connectingAction.start();

        let response = await ServerQuery.GET('');
        connectingAction.stop();
        if (!response.ok) return new (require('./error.js'))(`Error whilst connecting to server: ${response.status} - ${response.statusText}`);

        console.log('\nServer is operational!')

        const token = ConfigReader.getKey('token');
        const username = ConfigReader.getKey('username');

        if (!token || !username) return new (require('./loginType.js'))();

        const credentialsAction = new AnimatedActionText('Checking credentials with server...');
        credentialsAction.start();

        response = await ServerQuery.GET('check-token', token, { username });
        credentialsAction.stop();
        if (!response.ok) return new (require('./loginType.js'))(`Invalid credentials.`);

        let json = await response.json();
        if (!json.username || json.username != username) return new (require('./loginType.js'))('Invalid credentials.');

        console.log('\nConnected!');
        return new (require('./home.js'))();
        // return new Stage();
    }
}

module.exports = ConnectingStage