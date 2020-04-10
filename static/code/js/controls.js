var lrc_file =
`[length:  3:45]
[ar:Four Year Strong]
[ti:Learn to Love the Lie]
[al:Brain Pain]
[00:21.40]I wish it was just another day
[00:24.10]Another ordinary, not extraordinary
[00:26.50]Just a boring Sunday morning
[00:28.50]When doing nothing’s the only something we’ve got planned
[00:31.60]But not today
[00:33.50]We're falling apart and it's showing that we're
[00:37.00]Basically just trapped in captivity
[00:39.40]Wishing our way out
[00:41.00]Just let me cross my fingers behind my back
[00:45.50]And I’ll swear on anything you want me to after that
[00:49.50]I’ve heard that if I cross my heart then I’d have to die
[00:54.80]If you don’t want to say goodbye
[00:57.80]Then I guess you’ll have to learn to love the lie
[01:01.62]You and me, we’re really nothing but enemies
[01:06.26]Pretending we're not meant to be
[01:09.63]I don’t want to be the one to stay
[01:11.98]I don’t want to be the one that got away
[01:15.30]And if I’m being honest
[01:16.93]You couldn’t get rid of me anyway
[01:19.00]I don’t want to be the one to stay
[01:20.94]What the hell, for heaven's sake
[01:23.74]I don’t want to be the one that got away
[01:27.73]If Massachusetts had a loyalty
[01:32.26]I hope it wouldn’t choose you over me
[01:36.43]And if you’re wondering what keeps me up at night
[01:40.67]It's thinking that you might be right
[01:43.39]Just let me cross my fingers behind my back
[01:47.89]And I’ll swear on anything you want me to after that
[01:51.82]I’ve heard that if I cross my heart then I’d have to die
[01:57.18]If you don’t want to say goodbye
[02:00.06]Then I guess you’ll have to learn to love the lie
[02:03.56]You and me, we’re really nothing but enemies
[02:08.31]Pretending that’s exactly how it's supposed to be
[02:12.08]I don’t want to be the one to stay
[02:14.69]I don’t want to be the one that got away
[02:17.42]And if I’m being honest
[02:19.01]You couldn’t get rid of me anyway
[02:21.31]I don’t want to be the one to stay
[02:23.19]What the hell, for heaven's sake
[02:25.82]I don’t want to be the one that got away
[02:31.27]You can say what you want about me
[02:34.50]The old me would not apologize
[02:40.44]You can do what you want without me
[02:43.75]If only I could keep us from colliding
[02:47.32]Overanalyzing
[02:50.31]Every move we make we think we're just surviving
[02:54.30]But slowly we were dying
[02:57.36]Until the rattle somehow brings us back to life
[03:01.70]So let's learn to love the lie
[03:05.26]I don’t want to be the one to stay
[03:07.47]I don’t want to be the one that got away
[03:10.52]And if I’m being honest
[03:12.11]You couldn’t get rid of me anyway
[03:14.42]I don’t want to be the one to stay
[03:16.28]What the hell, for heaven's sake
[03:19.00]I don’t want to be the one that got away
[03:23.90]I don’t want to be the one that got away
[03:28.40]I don’t want to be the one that got away
[03:36.98]But we have to laugh to learn to love the lie
[03:41.50]`

/* <span id="karokePos" style="color: rgb(221, 190, 11)"></span> */

function resetControls() {
    document.getElementById("nowPlaying").innerHTML = "No song loaded!"
    document.getElementById("audioUpload").disabled = true;
    document.getElementById("control").disabled = true;
    updateControlButton("play");
    document.getElementById("restart").disabled = true;
    document.getElementById("currentTime").innerText = "..";
    document.getElementById("totalTime").innerText = "..";
    if (window.currentSong) {
        window.currentSong = undefined;
    }
}

function initializePage() {
    resetControls();
    initializeLrcButton();
    initializeAudioButton();
    initializeControlButton();
    initializeRestartButton();
}

function initializeLrcButton() {
    document.getElementById("lrcUpload").addEventListener("click", function() {
        this.blur();
        window.currentSong = new Song(readLrcFile());
        if (window.currentSong.valid) {
            updateNowPlaying();
            document.getElementById("audioUpload").disabled = false;
        }
        else {
            displayError(window.currentSong.error)
        }
        // document.getElementById("lrcFile").click();
    });
}

function readLrcFile() {
    //TODO
    return lrc_file;
}

function updateNowPlaying() {
    var status = ''
    var nowPlaying = document.getElementById("nowPlaying");
    if (window.currentSong.title != '') {
        nowPlaying.innerHTML =
            '<strong>' + window.currentSong.title + '</strong>';
        if (window.currentSong.artist != '') {
            nowPlaying.innerHTML +=
                '<br>by <strong>' + window.currentSong.artist + '</strong>';
        }
    }
    else {
        nowPlaying.innerHTML = '<strong>Unnamed Song</strong>';
    }
}

function displayError(message) {
    document.getElementById("error").innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show" role="alert">`
            + message +
            `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
}

function initializeAudioButton() {
    document.getElementById("audioUpload").addEventListener("click", function() {
        this.blur();
        initializeSong();
        document.getElementById("song").src = getAudioFile();
        // document.getElementById("audioFile").click();
    });
}

function initializeSong() {
    var song = document.getElementById("song");
    song.addEventListener("loadedmetadata", function(){
        if (window.currentSong.length > song.duration) {
            displayError("Audio file is shorter than LRC indicates.");
            document.getElementsByTagName("audio")[0].src = "";
        }
        else {
            updateCurrentSongTime();
            document.getElementById("totalTime").innerText = secondsToString(song.duration);
            document.getElementById("control").disabled = false;
            document.getElementById("restart").disabled = false;
        }
    });
    song.addEventListener("ended", function() {
        document.getElementById("restart").click();
    });
    document.getElementById("progressDiv").addEventListener("click", function (e) {
        var colOffset =  document.getElementsByClassName("col-md-8")[0].offsetLeft;
        var cardOffset = document.getElementsByClassName("card")[0].offsetLeft;
        var x = e.pageX - this.offsetLeft - cardOffset - colOffset;
        var clickedPosition = x / this.offsetWidth;
        var song = document.getElementById("song");
        var songPosition = clickedPosition * song.duration;
        song.currentTime = songPosition;
        updateCurrentSongTime();
    });
}

function getAudioFile() {
    //TODO
    return document.getElementById("song").src;
}

function initializeControlButton() {
    document.getElementById("control").addEventListener("click", function() {
        this.blur();
        var song = document.getElementById("song");
        if (song.paused) {
            song.play();
            updateControlButton("pause");
            window.updateTime = setInterval(updateCurrentSongTime, 50);
        }
        else {
            updateControlButton("play");
            song.pause();
            clearInterval(window.updateTime)
        }
    });
}

function initializeRestartButton() {
    document.getElementById("restart").addEventListener("click", function() {
        this.blur();
        document.getElementById("song").currentTime = 0;
        updateControlButton("play");
        document.getElementById("song").pause();
        updateCurrentSongTime();
    });
}

function updateControlButton(state) {
    clearInterval(window.updateTime);
    if (state == "play") {
        document.getElementById("controlIcon").className = "fa fa-play";
        document.getElementById("control").style.background = "rgb(0, 255, 136)";
        document.getElementById("control").title = "Play Song";
    }
    else if (state == "pause") {
        document.getElementById("controlIcon").className = "fa fa-pause";
        document.getElementById("control").style.background = "rgb(253, 224, 59)";
        document.getElementById("control").title = "Pause Song";
    }
}

function updateCurrentSongTime() {
    var song = document.getElementById('song');
    var currentTime = secondsToString(song.currentTime);
    document.getElementById("currentTime").innerText = currentTime;
    var progressBar = document.getElementById("progressBar");
    var progress = (song.currentTime / song.duration) * 100
    progressBar.setAttribute("aria-valuenow", progress);
    progressBar.style.width = `${progress}%`;
}

/* <h5 class="karokeTextLine">I wish it was just another day.</h5>
<h5 class="karokeTextLine">Another ordinary, not extraordinary</h5>
<h5 class="karokeTextLine">Just a boring Sunday morning</h5>
<h5 class="karokeTextLine">When doing nothing’s the only something we’ve got planned</h5> */