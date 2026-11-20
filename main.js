const Renderer = require('./renderer.js');
const ConnectingStage = require('./stages/connecting.js');

let stage = new ConnectingStage();

async function run() {
    try {
        while (true) {
            old_stage = stage;
            stage = await stage.loop();
            await new Promise(r => setTimeout(r, 33));
            if (stage !== old_stage) Renderer.clear()
        }
    } catch (err) {
        exitHandler({ error: err.message }, 1);
    }
}

run();

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdout.write(Renderer.Colours.Cursor.START_CURSOR_TRACKING + Renderer.Colours.Cursor.HIDE_CURSOR);
process.stdin.on('data', (key) => {
    function handleMouseInput(mouseDataMatch) {
        const [_, button, x, y, mode] = mouseDataMatch;
        const parsed = {
            action: (() => {
                if (button === '35') return "move";
                if (mode === 'M') return "click";
                if (mode === 'm') return "release";
            })(),
            x, y,
            mouseButton: button !== '35' ? button : null
        };
        stage.processMouseInput(parsed);
    }

    const input = key.toString();
    if (input == '\u0003') return exitHandler({ exit: true }, 2);
    
    const mouseDataMatch = input.match(/\u001b\[<(\d+);(\d+);(\d+)([Mm])/);
    if (mouseDataMatch) return handleMouseInput(mouseDataMatch);
    stage.processKey(input);
});

function exitHandler(options, exitCode) {
    console.log(
        '\r',
        Renderer.Colours.Cursor.STOP_CURSOR_TRACKING,
        Renderer.Colours.Cursor.SHOW_CURSOR
    );
    if (options.error) console.log(`Err${exitCode}: ${options.error}`);
    process.stdin.setRawMode(false);
    process.exit();
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

process.on('uncaughtException', exitHandler.bind(null, { exit: true }));