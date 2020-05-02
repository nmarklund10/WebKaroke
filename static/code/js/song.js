class Song {
    constructor(lrc_file) {
        this.intervalId = 0;
        this.error = '';
        this.valid = true;
        this.title = '';
        this.artist = '';
        this.length = 0;
        this.lyrics = [];
        this.karoke = [];
        this.played = false;
        this.parse_lrc(lrc_file);
    }

    parse_lrc(file) {
        file = file.replace('\r', '');
        file = file.split('\n');
        if (!this.decompressLyrics(file)) {
            return;
        }
        this.buildKaroke()
    }

    buildKaroke() {
        for (let i = 0; i < this.lyrics.length; i++) {
            let lyric = this.lyrics[i];
            let previousLyric =
                (i == 0) ?
                {end: 0}
                : this.karoke[this.karoke.length - 1]
            if (lyric.lyric == "") {
                this.karoke[this.karoke.length - 1].end = lyric.time;
            }
            else {
                if (lyric.time - previousLyric.end >= 4) {
                    this.karoke.push({
                        start: previousLyric.end + 1,
                        lyric: "[break]",
                        end: lyric.time - 1
                    })
                }
                this.karoke.push({
                    start: lyric.time,
                    lyric: lyric.lyric,
                    end: this.length
                });
            }
        }
        this.lyrics = null;
        this.currentPosition = 0;
    }

    decompressLyrics (file) {
        for (var i = 0; i < file.length; ++i) {
            this.parseLrcLine(file[i])
            if (!this.valid) {
                return false;
            }
        }
        this.lyrics.sort(function(a, b) {
            return a.time - b.time
        });
        this.length = this.lyrics[this.lyrics.length - 1].time
        return true;
    }

    parseLrcLine(line) {
        var line = line.trim();
        if (line != "") {
            var regex = /\[[^\]]*\]/g
            var bracketMatches = line.match(regex)
            if (bracketMatches.length > 0) {
                var lyric = this.getNonBracketText(line, bracketMatches);
                for (var i = 0; i < bracketMatches.length; i++) {
                    var match = bracketMatches[i];
                    match = match.substr(1, match.length - 2);
                    var colonIndex = -1;
                    if (this.isTimeStamp(match)) {
                        this.handleLyricLine(match, lyric);
                    }
                    else if ((colonIndex = match.indexOf(':')) != -1) {
                        var splitBracket = [
                            match.slice(0, colonIndex),
                            match.slice(colonIndex + 1)
                        ]
                        this.handleMetaLine(splitBracket);
                    }
                    else {
                        this.setError(`Invalid line found in LRC file: ${line}`)
                        break;
                    }
                }
            }
            else {
                this.setError(`Invalid line found in LRC file: ${line}`)
            }
        }
    }

    handleLyricLine(bracketText, lyric) {
        var timestamp = stringToSeconds(bracketText);
        this.lyrics.push({
            time: timestamp,
            lyric: lyric
        })
    }

    handleMetaLine(splitBracket) {
        var text = splitBracket[1].trim();
        switch(splitBracket[0]) {
            case 'ar':
                this.artist = text;
                break;
            case 'ti':
                this.title = text;
                break;
        }
    }

    getNonBracketText(line, bracketMatches) {
        var lastMatch = bracketMatches[bracketMatches.length - 1];
        var splitIndex = line.indexOf(lastMatch) + lastMatch.length;
        return line.substr(splitIndex);
    }

    isTimeStamp(text) {
        var timestampRegex = /\d\d:\d\d\.\d\d/;
        var match = text.match(timestampRegex);
        if (match) {
            if (match[0] == text) {
                return true;
            }
        }
        return false;
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
        this.lyrics = [];
        this.karoke = [];
    }
}