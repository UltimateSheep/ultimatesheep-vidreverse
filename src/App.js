import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { v4 } from "uuid";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

function App() {
  const [videoFile, setVideoFile] = useState({});
  const [reversedVideoFile, setReversedVideoFile] = useState("");
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [loading, setLoading] = useState(null);
  const ffmpeg = createFFmpeg({ log: true });

  const ChangeVideoFile = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    console.log(file["name"])
  };

  const load = async () => {
    await ffmpeg.load();
    setFfmpegReady(true);
  };

  useEffect(() => {
    load();
  });

  const ReverseVideo = async () => {
    setReversedVideoFile("")
    const extension = videoFile["name"].split(".");
    const newName = v4();
    const realExtention = extension[extension.length - 1]


    ffmpeg.FS("writeFile", `${videoFile["name"]}`, await fetchFile(videoFile));
    setLoading(<Spinner animation="border" />);
    await ffmpeg.run(
      "-i",
      `${videoFile["name"]}`,
      "-vf",
      "reverse",
      `${newName}.${realExtention}`
    ).then(()=>{
      
      const data = ffmpeg.FS("readFile", `${newName}.${realExtention}`);
      setReversedVideoFile(
        URL.createObjectURL(
          new Blob([data.buffer], { type: `video/${realExtention}` })
        )
      );
      setLoading(null)
    });
  };

  return !ffmpegReady ? (
    <div className="App">
      <p>Loading...</p>
      <Spinner animation="border" />
    </div>
  ) : (
    <div className="App">
      {reversedVideoFile != "" ? (
        <video src={reversedVideoFile} controls />
      ) : (
        <br />
      )}
      {loading}
      <br />
      <input
        className="VideoFileInput"
        id="Video"
        type="file"
        accept="video/*"
        onChange={ChangeVideoFile}
      />
      <input type="button" onClick={ReverseVideo} value="Reverse video 🔀" />
    </div>
  );
}

export default App;
