// import React, { useState, useRef, useEffect } from "react";
// import { socket } from "./socket/SocketMain";

// const App = () => {
//   const [screenStream, setScreenStream] = useState(null);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const videoRef = useRef(null);

//   const startCapture = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });
//       setScreenStream(stream);
//       setErrorMessage(null);

//       const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
//       setMediaRecorder(recorder);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           // Send the video chunk to the server in real-time
//           socket.emit("stream-data", event.data);
//           socket.emit("check", {data:'correct'});
//         }
//       };

//       recorder.start(100); // Capture data in chunks every 100ms
//     } catch (error) {
//       setErrorMessage("Error capturing screen: " + error.message);
//     }
//   };

//   const stopCapture = () => {
//     if (screenStream) {
//       screenStream.getTracks().forEach((track) => track.stop());
//       setScreenStream(null);
//     }
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setMediaRecorder(null);
//     }
//   };

//   useEffect(() => {
//     if (screenStream && videoRef.current) {
//       videoRef.current.srcObject = screenStream;
//     }
//   }, [screenStream]);

//   return (
//     <div>
//       <h1>Live Screen Streaming</h1>
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//       {screenStream ? (
//         <>
//           <video style={{ width: "100%", height: "auto" }} autoPlay ref={videoRef} />
//           <button onClick={stopCapture}>Stop Capture</button>
//         </>
//       ) : (
//         <button onClick={startCapture}>Start Screen Capture</button>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useRef, useState } from 'react';
import { socket } from './socket/SocketMain';

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    setPeerConnection(pc);

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };

    pc.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });

    socket.on('offer', async offer => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async answer => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async candidate => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    });

    return () => pc.close();
  }, []);

  const createOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);
  };

  return (
    <div>
      <h1>Google Meet Clone</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <button onClick={createOffer}>Create Offer</button>
    </div>
  );
}

export default App;
