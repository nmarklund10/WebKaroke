// 230.870204 -> 03:50.87
function secondsToString(seconds) {
    var datetime = new Date(seconds * 1000)
    var mins = datetime.getMinutes().toString().padStart(2, '0');
    var secs = datetime.getSeconds().toString().padStart(2, '0');
    var ms = datetime.getMilliseconds().toString().padStart(3, '0').substr(0, 2)
    return `${mins}:${secs}.${ms}`
}

//03:45.00 -> 225
function stringToSeconds(timeString) {
    var secs = parseInt(timeString.slice(0, 2)) * 60;
    secs += parseInt(timeString.slice(3, 5));
    secs += parseInt(timeString.slice(6)) / 100
    return secs;
}