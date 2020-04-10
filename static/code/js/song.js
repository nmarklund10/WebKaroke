class Song {
    constructor(lrc_file) {
        this.intervalId = 0;
        this.error = '';
        this.valid = true;
        this.title = '';
        this.artist = '';
        this.lyrics = []
        this.parse_lrc(lrc_file);
    }

    parse_lrc(file) {
        file = file.replace('\r', '');
        file = file.split('\n');
        for (var i = 0; i < file.length; ++i) {
            this.parseLrcLine(file[i])
            if (!this.valid) {
                return [];
            }
        }
        this.title = 'Learn to Love the Lie';
        this.artist = 'Four Year Strong';
        this.length = 0; //TODO
        this.valid = true; //TODO
        return [];
    }

    parseLrcLine(line) {
        var line = line.trim();
        if (line != "") {
            if (line[0] != "[") {
                this.setError("Invalid first character found in LRC file!");
                return;
            }
            var closingBracket = line.indexOf("]");
            if (line.length == closingBracket + 1) {
                line = [line.slice(1, closingBracket)];
            }
            else {
                line = [line.slice(1, closingBracket), line.slice(closingBracket + 1)];
            }
            this.parseBracketText(line[0]);
        }
    }

    parseBracketText(text) {
        var timestampRegex = /\d\d:\d\d.\d\d/;
        var match = text.match(timestampRegex);
        if (match) {
            if (match[0] == text) {
                var time = stringToSeconds(match[0]);
            }
        }
        else {
            // console.log(text);
        }
    }

    startKaroke(event) {
        // var len = document.getElementById("upcoming").textContent.length - 1;
        // this.intervalId = setInterval(this.karoke, 3000/len, this);
        // updateCurrentSongTime(event.srcElement.currentTime)
    }

    karoke(song_inst) {
        var karokePos = document.getElementById("karokePos");
        var upcoming = document.getElementById("upcoming");
        if (upcoming.textContent.length == 0) {
            clearInterval(song_inst.intervalId);
            return;
        }
        karokePos.textContent += upcoming.textContent[0];
        upcoming.textContent = upcoming.textContent.substr(1);
    }

    setError(msg) {
        this.error = msg;
        this.valid = false;
    }

    static songLengthToTimeString(songLength) {
        if (!songLength.contains('.')) {
            songLength += '.00'
        }
        if (songLength[0] != '0') {
            songLength = '0' + songLength
        }
        return songLength;
    }
}