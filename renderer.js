class Renderer {
    Colours = class {
        static FG = class {
            static BLACK = '\x1b[30m';
            static RED = '\x1b[31m';
            static GREEN = '\x1b[32m';
            static YELLOW = '\x1b[33m';
            static BLUE = '\x1b[34m';
            static MAGENTA = '\x1b[35m';
            static CYAN = '\x1b[36m';
            static WHITE = '\x1b[37m';

            static rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
        }

        static BG = class {
            static BLACK = '\x1b[40m';
            static RED = '\x1b[41m';
            static GREEN = '\x1b[42m';
            static YELLOW = '\x1b[43m';
            static BLUE = '\x1b[44m';
            static MAGENTA = '\x1b[45m';
            static CYAN = '\x1b[46m';
            static WHITE = '\x1b[47m';

            static rgb = (r, g, b) => `\x1b[48;2;${r};${g};${b}m`;
        }

        static RESET = '\x1b[0m';

        static BOLD = '\x1b[1m';
        static ITALIC = '\x1b[3m';
        static UNDERLINE = '\x1b[4m';

        static BLINK = '\x1b[5m';
        static REVERSE = '\x1b[7m';

        static HIDDEN = '\x1b[8m';

        static CLEAR_SCREEN = '\x1b[H\x1b[2J\x1b[3J';
        static CLEAR_LINE = '\x1b[2K\x1b[200D';

        static Cursor = class {
            static SET_CURSOR = (x, y) => `\x1b[${y};${x}H`;
        
            static MOVE_CURSOR_UP = (n=1) => `\x1b[${n}A`;
            static MOVE_CURSOR_DOWN = (n=1) => `\x1b[${n}B`;
            static MOVE_CURSOR_RIGHT = (n=1) => `\x1b[${n}C`;
            static MOVE_CURSOR_LEFT = (n=1) => `\x1b[${n}D`;

            static MOVE_CURSOR(x, y) {
                let returnString = '';
                if (x > 0) returnString += this.MOVE_CURSOR_RIGHT(x);
                else if (x < 0) returnString += this.MOVE_CURSOR_LEFT(-x);
                if (y < 0) returnString += this.MOVE_CURSOR_DOWN(y);
                else if (y > 0) returnString += this.MOVE_CURSOR_UP(-y);
                return returnString;
            }


            static SAVE_CURSOR_POSITION = '\x1b[s';
            static RESTORE_CURSOR_POSITION = '\x1b[u';

            static HIDE_CURSOR = '\x1b[?25l';
            static SHOW_CURSOR = '\x1b[?25h';

            static GET_CURSOR_POSITION = '\x1b[6n';
            static START_CURSOR_TRACKING = '\x1b[?1003h\x1b[?1006h';
            static STOP_CURSOR_TRACKING = '\x1b[?1003l\x1b[?1006l';
        }
    }

    get width() { return process.stdout.columns; }
    centre(width) { return Math.floor((this.width - width) / 2); }

    clear() { process.stdout.write(this.Colours.CLEAR_SCREEN) }
    logo() { 
        const W = this.Colours.FG.WHITE;
        const B = this.Colours.FG.BLACK;
        const LG = this.Colours.FG.rgb(153, 229, 80);
        const DG = this.Colours.FG.rgb(75, 105, 47);

        const LOGO = `
00000WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW0
0000WWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWW
0000WBGggggggGBBBGggggggGBBGgggggggggggggggGBBGggggggGBBBGggggggGBBBBggggggggggggggggBBW
0000WBggggggggBBBggggggggBBgggggggggggggggggBBggggggggBBBggggggggBBBggggggggggggggggggBW
0000WBggggggggBBBggggggggBGgggggggggggggggggBBggggggggBBBggggggggBBBggggggggggggggggggBW
0000WBggggggggBBBggggggggBggggggggBBBgggggggBBggggggggBBBggggggggBBBggggggggBBBgggggggBW
0000WBggggggggBBBggggggggBggggggggBBBgggggggBBggggggggBBBggggggggBBBggggggggBBBgggggggBW
0000WBggggggggBBBggggggggBggggggggBBBgggggggBBggggggggBBBggggggggBBBggggggggBBBBBBBBBBBW
0000WBggggggggBBBggggggggBggggggggBBBgggggggBBggggggggBBBggggggggBBBggggggggBBBBBBBBBBBW
0000WBgggggggggggggggggggBggggggggggggggggggBBggggggggBBBggggggggBBBgggggggggggggggggGBW
0000WBgggggggggggggggggggBggggggggggggggggggBBggggggggBBBggggggggBBBggggggggggggggggggBW
0000WBgggggggggggggggggggBggggggggggggggggggBBggggggggBBBggggggggBBBGgggggggggggggggggBW
0000WBggggggggGGGggggggggBggggggggGGGgggggggBBggggggggBBBggggggggBBBBGGGGGGGGGGgggggggBW
000WWBggggggggBBBggggggggBggggggggBBBgggggggBBggggggggBBBggggggggBBBBBBBBBBBBBBgggggggBW
00WWBgggggggggBBBggggggggBggggggggBBBgggggggBBggggggggggBggggggggggBggggggggBBBgggggggBW
WWWBBgggggggggBBBggggggggBggggggggBBBgggggggBBggggggggggBggggggggggBgggggggggggggggggGBW
WBBBgggggggggGBBBGggggggGBGggggggGBBBGgggggGBBGggggggggGBGggggggggGBGgggggggggggggggGGBW
WBGGGGGGGGGGGGBBBGGGGGGGGBGGGGGGGGBBBGGGGGGGBBGGGGGGGGGGBGGGGGGGGGGBBGGGGGGGGGGGGGGGGBBW
WBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW0
        `.trim();

        const terminalWidth = this.width;
        const logoWidth = LOGO.split('\n')[0].length * 2; // each char is 2 pixels
        const x = Math.floor((terminalWidth - logoWidth) / 2);
        
        let centered;
        if (x >= 0) centered = LOGO.split('\n').map(line => ' '.repeat(x) + line).join('\n');
        else centered = LOGO.split('\n').map(line => line.slice(0, terminalWidth / 2)).join('\n');

        if (!this.terminalWidth || terminalWidth !== this.terminalWidth)
            this.clear();

        this.terminalWidth = terminalWidth;

        const text = centered.replaceAll('0', '  ').replaceAll('W', W + '██').replaceAll('B', B + '██').replaceAll('g', LG + '██').replaceAll('G', DG + '██');
        process.stdout.write(this.Colours.Cursor.SET_CURSOR(0, 0) + '\r' + text)
    }
}

module.exports = new Renderer()