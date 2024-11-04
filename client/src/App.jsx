import React, { useState, useRef, useEffect } from "react";

const App = () => {
  
  const [screenStream, setScreenStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      setErrorMessage(null);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
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

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]); // Reset recorded chunks after download
  };

  useEffect(() => {
    if (screenStream && videoRef.current) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  return (
    <div>
      <h1>Screen Capture Example</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {screenStream ? (
        <>
          <video
            style={{ width: "100%", height: "auto" }}
            autoPlay
            controls
            ref={videoRef}
          />
          <button onClick={stopCapture}>Stop Capture</button>
          <button onClick={downloadRecording}>Download Recording</button>
        </>
      ) : (
        <button onClick={startCapture}>Start Screen Capture</button>
      )}
    </div>
  );
};

export default App;