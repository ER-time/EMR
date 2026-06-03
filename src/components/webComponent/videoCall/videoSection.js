import React, { useRef, useState } from "react";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import { OTSession, OTStreams, preloadScript } from "opentok-react";

function VideoSectionSection({ sessionId, tokenId }) {
  const otSession = useRef(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const sessionEvents = {
    sessionConnected: () => {
      setConnected(true);
    },
    sessionDisconnected: () => {
      setConnected(false);
    },
  };

  const onError = (err) => {
    console.log("err:::::>>>>>", err);
    setError(`Failed to connect: ${err.message}`);
  };
console.log(" sessionId, tokenId", sessionId, tokenId);

  return (
    <div className="video-container">
      <OTSession
        ref={otSession}
        apiKey={47602941}
        sessionId={`${sessionId}`}
        token={`${tokenId}`}
        eventHandlers={sessionEvents}
        onError={onError}
      >
        {error ? <div id="error">{error}</div> : null}
        <div className="video_test">
          <OTStreams>
            <Subscriber
              otSession={otSession}
            />
          </OTStreams>
          <div>
            <Publisher otSession={otSession} />
          </div>
        </div>
      </OTSession>
    </div>
  );
}

export default preloadScript(VideoSectionSection);
