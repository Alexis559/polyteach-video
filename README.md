# Polyteach POC - Back

<br>

#### Service to generate VTT subtitles for videos.

```
npm start
```

*Will listen on localhost:3030*


| Routes       |     Function     |   Params   |     Results *(in json format)* |
| :------------ | :-------------: | :-------------: | :-------------: |
| poc/video/subtitles     |     Get the subtitles for the given video     | Video file  |  videoURL: URL of the video <br> vttURL: URL of the VTT file generated <br> timings: timings for each sentences *(in secs)*|



