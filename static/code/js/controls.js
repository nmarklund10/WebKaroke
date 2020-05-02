var lrc_file =
`[length: 3:51]
[ar:Four Year Strong]
[ti:Learn to Love the Lie]
[00:21.36]I wish it was just another day
[00:23.60][00:26.09][00:28.28][00:31.34][00:33.04][00:36.86][00:39.21][00:40.53][00:44.72][00:48.80][00:53.91][00:56.57][01:00.60][01:05.64][01:09.32][01:11.53][01:14.36][01:16.44][01:18.46][01:20.70][01:22.91][01:25.89][01:30.79][01:35.09][01:39.67][01:42.86][01:47.28][01:51.35][01:56.37][01:58.72][02:03.00][02:07.73][02:11.42][02:13.89][02:16.90][02:19.03][02:20.91][02:22.86][02:25.39][02:28.26][02:33.31][02:37.71][02:42.69][02:47.18][02:49.64][02:54.13][02:56.62][03:00.42][03:04.80][03:06.85][03:09.78][03:11.98][03:14.01][03:16.22][03:18.35][03:21.02][03:26.01][03:33.82][03:35.82][03:41.26]
[00:23.69]Another ordinary, not extraordinary
[00:26.37]Just a boring Sunday morning
[00:28.37]When doing nothing's the only something we've got planned
[00:31.60]But not today
[00:33.41]We're falling apart and it's showing that we're
[00:36.96]Basically just trapped in captivity
[00:39.30]Wishing our way out
[00:41.01][01:43.25]Just let me cross my fingers behind my back
[00:45.53][01:47.81]And I'll swear on anything you want me to after that
[00:49.27][01:51.80]I've heard that if I cross my heart then I'd have to die
[00:54.78][01:56.95]If you don't want to say goodbye
[00:57.66][01:59.98]Then I guess you'll have to learn to love the lie
[01:01.23][02:03.59]You and me, we're really nothing but enemies
[01:06.32]Pretending we're not meant to be
[01:09.58][01:18.96][02:12.03][02:21.24][03:05.16][03:14.35]I don't want to be the one to stay
[01:11.88][01:23.44][02:14.23][02:25.77][03:07.32][03:18.83][03:23.71]I don't want to be the one that got away
[01:15.03][02:17.28][03:10.35]And if I'm being honest
[01:16.72][02:19.03][03:12.24]You couldn't get rid of me anyway
[01:20.87][02:23.17][03:16.24]What the hell, for heaven's sake
[01:27.67]If Massachusetts had a loyalty
[01:32.24]I hope it wouldn't choose you over me
[01:36.66]And if you're wondering what keeps me up at night
[01:40.37]It's thinking that you might be right
[02:08.23]Pretending that's exactly how it's supposed to be
[02:31.15]You can say what you want about me
[02:34.49]The old me would not apologize
[02:40.23]You can do what you want without me
[02:43.68]If only I could keep us from colliding
[02:47.80]Overanalyzing
[02:50.38]Every move we make we think we're just surviving
[02:54.20]But slowly we were dying
[02:57.26]Until the rattle somehow brings us back to life
[03:01.66]So let's learn to love the lie
[03:28.15]I don't want to be the one that got away (if I cross my heart then I'd have to die)
[03:34.04]But I don't wanna say goodbye
[03:36.94]But we have to love to learn to love the lie
`

/* <span id="karokePos" style="color: rgb(221, 190, 11)"></span> */

function resetControls() {
    document.getElementById("nowPlaying").innerHTML = "No song loaded!"
    document.getElementById("audioUpload").disabled = true;
    document.getElementById("control").disabled = true;
    updateControlButton("play", true);
    document.getElementById("restart").disabled = true;
    document.getElementById("currentTime").innerText = "..";
    document.getElementById("totalTime").innerText = "..";
    document.getElementsByTagName("audio")[0].src = "";
    toggleProgressBar(false);
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
    $("body").tooltip({ selector: "[data-toggle=tooltip]" });
    toggleProgressBar(false);
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
    var status = '';
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

function toggleProgressBar(enabled) {
    var progressDiv = document.getElementById("progressDiv");
    if (enabled) {
        $("#progressDiv").tooltip("enable");
        progressDiv.style.cursor = "pointer";
    }
    else {
        $("#progressDiv").tooltip("disable");
        progressDiv.style.cursor = "default";
    }
}

function initializeSong() {
    var song = document.getElementById("song");
    song.addEventListener("loadedmetadata", function(){
        if (window.currentSong.length > song.duration) {
            displayError(`Audio file is shorter than LRC indicates (${window.currentSong.length}).`);
            document.getElementsByTagName("audio")[0].src = "";
        }
        else {
            toggleProgressBar(true);
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
    return "/static/test/learn_to_love_the_lie.mp3";
}

function initializeControlButton() {
    document.getElementById("control").addEventListener("click", function() {
        this.blur();
        var song = document.getElementById("song");
        if (song.paused) {
            song.play();
            updateControlButton("pause");
            window.updateTime = requestAnimationFrame(continuoslyUpdateCurrentSongTime);
            // window.updateTime = setInterval(updateCurrentSongTime, 50);
        }
        else {
            updateControlButton("play");
            song.pause();
            // clearInterval(window.updateTime)
        }
    });
}

function initializeRestartButton() {
    document.getElementById("restart").addEventListener("click", function() {
        this.blur();
        document.getElementById("song").currentTime = 0;
        updateControlButton("play", true);
        document.getElementById("song").pause();
        updateCurrentSongTime();
    });
}

function updateControlButton(state, initial=false) {
    clearInterval(window.updateTime);
    if (state == "play") {
        document.getElementById("controlIcon").className = "fa fa-play";
        document.getElementById("control").style.background = "rgb(0, 255, 136)";
        $("#control").attr('data-original-title', 'Play Song').tooltip("show");
    }
    else if (state == "pause") {
        document.getElementById("controlIcon").className = "fa fa-pause";
        document.getElementById("control").style.background = "rgb(253, 224, 59)";
        $("#control").attr('data-original-title', 'Pause Song').tooltip("show");
    }
    if (initial) {
        $("#control").tooltip("hide")
    }
}

function continuoslyUpdateCurrentSongTime() {
    updateCurrentSongTime();
    if (!document.getElementById("song").paused) {
        requestAnimationFrame(continuoslyUpdateCurrentSongTime);
    }
    else {
        window.cancelAnimationFrame(window.updateTime);
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
    updateKaroke();
}

function updateKaroke() {

}

/* <h5 class="karokeTextLine">I wish it was just another day.</h5>
<h5 class="karokeTextLine">Another ordinary, not extraordinary</h5>
<h5 class="karokeTextLine">Just a boring Sunday morning</h5>
<h5 class="karokeTextLine">When doing nothing’s the only something we’ve got planned</h5> */