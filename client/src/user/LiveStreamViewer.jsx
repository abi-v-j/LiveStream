import React, { useRef, useEffect } from "react";
import { socket } from "../socket/SocketMain";

const LiveStreamViewer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!window.MediaSource) {
      console.error("MediaSource API not supported in this browser.");
      return;
    }

    const mediaSource = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSource);

    // Wait for media source to be ready
    const handleSourceOpen = () => {
      const mimeCodec = "video/webm; codecs=vp9";
      let sourceBuffer;

      try {
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      } catch (e) {
        console.error("MIME codec or browser compatibility issue:", e);
        return;
      }

      socket.on("stream-data", (chunk) => {
        console.log(chunk);
        
        if (chunk && sourceBuffer && !sourceBuffer.updating) {
          const fileReader = new FileReader();

          fileReader.onload = () => {
            const arrayBuffer = fileReader.result;
            try {
              sourceBuffer.appendBuffer(arrayBuffer);
            } catch (e) {
              console.error("Buffer append error:", e);
            }
          };

          fileReader.readAsArrayBuffer(new Blob([chunk]));
        }
      });

      // Listen for errors in SourceBuffer
      sourceBuffer.addEventListener("error", (e) => {
        console.error("SourceBuffer error:", e);
      });
    };

    mediaSource.addEventListener("sourceopen", handleSourceOpen);

    return () => {
      socket.off("stream-data");
      mediaSource.removeEventListener("sourceopen", handleSourceOpen);
    };
  }, []);

  return <video ref={videoRef} autoPlay controls style={{ width: "100%", height: "auto" }} />;
};

export default LiveStreamViewer;
