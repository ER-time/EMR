import React, { useState } from "react";
import { OTSubscriber } from "opentok-react";

export default function Subscriber(props) {
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  const onError = (err) => {
    setError(`Failed to subscribe: ${err.message}`);
  };
  let ref = React.useRef();
  return (
    <div className="subscriber--container">
      <OTSubscriber
        ref={ref}
        properties={{
          subscribeToAudio: audio,
          subscribeToVideo: video,
          resolution: "1280x720",
          frameRate: 30,
        }}
        onError={onError}
      />
    </div>
  );
}
