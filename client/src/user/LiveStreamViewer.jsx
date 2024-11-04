import React, { useRef, useEffect } from "react";
import { socket } from "../socket/SocketMain";

const LiveStreamViewer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const mediaSource = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", () => {
      const sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=vp9");

      socket.on("stream-data", (chunk) => {
        if (chunk && sourceBuffer && !sourceBuffer.updating) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const arrayBuffer = fileReader.result;
            sourceBuffer.appendBuffer(arrayBuffer);
          };
          fileReader.readAsArrayBuffer(chunk);
        }
      });
    });

    return () => {
      socket.off("stream-data");
    };
  }, []);

  return <video ref={videoRef} autoPlay controls style={{ width: "100%", height: "auto" }} />;
};

export default LiveStreamViewer;
