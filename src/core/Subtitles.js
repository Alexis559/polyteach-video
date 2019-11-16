const logger = require('../helpers/logger');
const Storage = require('../core/Storage');

/**
 * Function to get the timing by sentences.
 *
 * @param response Results of the Speech To Text API of Google
 * @returns {[]} Array with the timing of beginning and ending of each sentences
 */
const getSubtitlesTiming = (response) => {
    logger.log('info', 'src.core.Subtitles.getSubtitlesTiming called', response);
    const subtitlesTiming = [];
    let sentence = [];

    response.results.forEach(result => {
        result.alternatives[0].words.forEach(wordInfo => {
            if (wordInfo.word[0] === wordInfo.word[0].toUpperCase() && wordInfo.word.endsWith('.')) {
                const startSecs =
                    `${wordInfo.startTime.seconds}` +
                    '.' +
                    wordInfo.startTime.nanos / 100000000;
                if (sentence.length === 0)
                    sentence.push(startSecs);

                const endSecs =
                    `${wordInfo.endTime.seconds}` +
                    '.' +
                    wordInfo.endTime.nanos / 100000000;
                sentence.push(endSecs);
                subtitlesTiming.push(sentence);
                sentence = [];

            } else if (wordInfo.word.endsWith('.')) {
                const endSecs =
                    `${wordInfo.endTime.seconds}` +
                    '.' +
                    wordInfo.endTime.nanos / 100000000;
                sentence.push(endSecs);
                subtitlesTiming.push(sentence);
                sentence = [];
            } else if (wordInfo.word[0] === wordInfo.word[0].toUpperCase()) {
                const startSecs =
                    `${wordInfo.startTime.seconds}` +
                    '.' +
                    wordInfo.startTime.nanos / 100000000;
                if (sentence.length === 0)
                    sentence.push(startSecs);
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
            '.' +
            lastWord.endTime.nanos / 100000000;
        sentence.push(endSecs);
        subtitlesTiming.push(sentence);
    }

    return subtitlesTiming;
};

/**
 *
 * @param response Results of the Speech To Text API of Google
 * @returns {string[]}
 */
const getSentences = (response) => {
    logger.log('info', 'src.core.Subtitles.getSentences called', response);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    return transcription.split('. ');
};

/**
 * Function to create the VTT subtitles file.
 *
 * @param filename The name of the VTT file we want to create
 * @param timing The timings for each sentences of the video
 * @param subtitles The sentences of the video
 * @param contentFolder Path where will be saved the VTT file on the server
 * @returns {*} The path where is stored the VTT file on the server
 */
const createVTTFile = (filename, timing, subtitles, contentFolder) => {
    logger.log('info', 'src.core.Subtitles.createVTTFile called', filename, timing, subtitles);
    let i = 1;
    let text = 'WEBVTT\n';
    subtitles.forEach((line) => {
        text += '\n' + i + '\n';
        text += convertSecondsToVTTFormat(timing[i - 1][0]) + ' --> ' + convertSecondsToVTTFormat(timing[i - 1][1]);
        text += '\n' + line + '\n';
        i++;
    });
    return Storage.writeFile(filename + '-SUB.vtt', text, contentFolder);
};

/**
 * Function to convert seconds timing to hh:mm:s.ms format.
 *
 * @param seconds the seconds
 * @returns {string} seconds timing in hh:mm:s.ms format
 */
const convertSecondsToVTTFormat = (seconds) => {
    logger.log('info', 'src.core.Subtitles.convertSecondsToVTTFormat called', seconds);
    const t = seconds.split('.')[seconds.split('.').length - 1];
    return new Date(seconds * 1000).toISOString().substr(11, 8) + '.' + t + '00';
};

/**
 * Function to parse a VTT file and get the sentences and the timings.
 *
 * @param content The content of the VTT file
 * @returns {{subtitles: *, timings: *}}
 */
const parseVttFile = (content) => {
    logger.log('info', 'src.core.Subtitles.parseVttFile called', content);
    const t = content.split('\n\n').slice(1);
    const subtitles = [];
    const timings = [];
    t.forEach(x => {
        const t = x.split('\n');
        timings.push(transformVttTimeToSeconds(t[1].split(' ')[0]));
        subtitles.push(t[2]);
    });
    return {subtitles: subtitles, timings: timings};
};

/**
 * Function to convert time hh:mm:ss.ms to seconds.ms.
 *
 * @param vttTime The time in VTT format
 * @returns {string} The time in seconds
 */
const transformVttTimeToSeconds = (vttTime) => {
    logger.log('info', 'src.core.Subtitles.transformVttTimeToSeconds called', vttTime);
    const ms = vttTime.split('.');
    const a = ms[0].split(':');
    const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds + '.' + ms[1];
};


module.exports = {
    createVTTFile: createVTTFile,
    getSentences: getSentences,
    getSubtitlesTiming: getSubtitlesTiming,
    parseVttFile: parseVttFile,
};