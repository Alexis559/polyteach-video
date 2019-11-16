# Polyteach POC - Back

<br>

#### Service to generate VTT subtitles for videos.

```
npm start
```

*By default on localhost will listen on localhost:3030*


| Routes       |     Function     |   Params   |     Results *(in json format)* |
| :------------ | :-------------: | :-------------: | :-------------: |
| [POST] /video/upload     |    Get signed URL to upload a file on GCP   | Video file name  | signedURL: The signed URL |
| [POST] /video/subtitles     |     Get the link of the video and the link of the Subtitles file     | Video file name  |  videoURL: URL of the video <br> vttURL: URL of the VTT file generated |
| [POST] /video/vtt     |     Get the subtitles and their timings    | VTT file URL on GCP |  subtitles: The subtitles <br> timings: Timings of each sentences *(in secs)* |


*<b>Deployed on polyteach-video.igpolytech.fr:80</b>*