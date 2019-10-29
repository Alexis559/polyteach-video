const fs = require('fs');

/**
 * Function to get the timing by sentences.
 *
 * @param response Results of the Speech To Text API of Google
 * @returns {[]} Array with the timing of beginning and ending of each sentences
 */
function getSubtitlesTiming(response) {

    var subtitlesTiming = [];
    var sentence = [];

    response.results.forEach(result => {
        result.alternatives[0].words.forEach(wordInfo => {
            if (wordInfo.word[0] === wordInfo.word[0].toUpperCase() && wordInfo.word.endsWith('.')) {
                const startSecs =
                    `${wordInfo.startTime.seconds}` +
                    `.` +
                    wordInfo.startTime.nanos / 100000000;
                if (sentence.length === 0)
                    sentence.push(startSecs);

                const endSecs =
                    `${wordInfo.endTime.seconds}` +
                    `.` +
                    wordInfo.endTime.nanos / 100000000;
                sentence.push(endSecs);
                subtitlesTiming.push(sentence);
                sentence = [];

            } else if (wordInfo.word.endsWith('.')) {
                const endSecs =
                    `${wordInfo.endTime.seconds}` +
                    `.` +
                    wordInfo.endTime.nanos / 100000000;
                sentence.push(endSecs);
                subtitlesTiming.push(sentence);
                sentence = []
            } else if (wordInfo.word[0] === wordInfo.word[0].toUpperCase()) {
                const startSecs =
                    `${wordInfo.startTime.seconds}` +
                    `.` +
                    wordInfo.startTime.nanos / 100000000;
                if (sentence.length === 0)
                    sentence.push(startSecs)
            }
        });
    });

    // If the last sentence is not finished we get the last timing of the last word of the last sentence
    if (sentence.length > 0) {
        const lastResult = response.results[response.results.length - 1];
        const lastAlternatives = lastResult.alternatives[lastResult.alternatives.length - 1];
        const lastWord = lastAlternatives.words[lastAlternatives.words.length - 1];
        const endSecs =
            `${lastWord.endTime.seconds}` +
            `.` +
            lastWord.endTime.nanos / 100000000;
        sentence.push(endSecs);
        subtitlesTiming.push(sentence);
    }

    return subtitlesTiming
}

/**
 *
 * @param response Results of the Speech To Text API of Google
 * @returns {string[]}
 */
function getSentences(response) {
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join("\n");
    return transcription.split(". ")
}

/**
 * Function to create the VTT subtitles file.
 *
 * @param filename The name of the VTT file we want to create
 * @param timing The timings for each sentences of the video
 * @param subtitles The sentences of the video
 * @returns {*} The path where is stored the VTT file on the server
 */
function createVTTFile(filename, timing, subtitles) {
    var i = 1;
    var text = "WEBVTT\n";
    subtitles.forEach((line) => {
        text += "\n" + i + "\n";
        text += convertSecondsToVTTFormat(timing[i - 1][0]) + " --> " + convertSecondsToVTTFormat(timing[i - 1][1]);
        text += "\n" + line + "\n";
        i++
    });
    return writeFile(filename, text)
}

function convertSecondsToVTTFormat(seconds) {
    const t = seconds.split('.')[seconds.split('.').length - 1];
    return new Date(seconds * 1000).toISOString().substr(11, 8) + "." + t;
}

/**
 * Function to write a file.
 *
 * @param filename The name fo the file
 * @param text The text to write
 * @returns {string} The path where is stored the file on the server
 */
function writeFile(filename, text) {
    fs.writeFile("./uploads/subtitles/" + filename + "-SUB.vtt", text, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    })
    return "./uploads/subtitles/" + filename + "-SUB.vtt"
}

module.exports = {
    createVTTFile: createVTTFile,
    getSentences: getSentences,
    getSubtitlesTiming: getSubtitlesTiming
};