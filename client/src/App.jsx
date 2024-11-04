import React, { useState, useRef, useEffect } from "react";
import { socket } from "./socket/SocketMain";

const App = () => {
  const [screenStream, setScreenStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      setErrorMessage(null);

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Send the video chunk to the server in real-time
          socket.emit("stream-data", event.data);
        }
      };

      recorder.start(100); // Capture data in chunks every 100ms
    } catch (error) {
      setErrorMessage("Error capturing screen: " + error.message);
    }
  };

  const stopCapture = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  useEffect(() => {
    if (screenStream && videoRef.current) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  return (
    <div>
      <h1>Live Screen Streaming</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {screenStream ? (
        <>
          <video style={{ width: "100%", height: "auto" }} autoPlay ref={videoRef} />
          <button onClick={stopCapture}>Stop Capture</button>
        </>
      ) : (
        <button onClick={startCapture}>Start Screen Capture</button>
      )}
    </div>
  );
};

export default App;
