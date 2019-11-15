# Polyteach POC - Back

<br>

#### Service to generate VTT subtitles for videos.

```
npm start
```

*By default on localhost will listen on localhost:3030*


| Routes       |     Function     |   Params   |     Results *(in json format)* |
| :------------ | :-------------: | :-------------: | :-------------: |
| /video/upload     |    Upload a video to GCP   | Video file name  | signedURL: The signed URL for the Client to upload the video to GCP. |
| /video/subtitles     |     Get the subtitles for the given video     | Video file name  |  videoURL: URL of the video <br> vttURL: URL of the VTT file generated <br> timings: timings for each sentences *(in secs)*|


*<b>Deployed on polyteach-video.igpolytech.fr:80</b>*