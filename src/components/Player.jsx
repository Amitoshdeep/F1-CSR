import React, { useState, useEffect, useRef } from "react";

import { GiSmokeBomb } from "react-icons/gi";
import { GiCarWheel } from "react-icons/gi";
import { GiFog } from "react-icons/gi";

const useAudio = (url) => {
  const audioRef = useRef(new Audio(url));
  const [playing, setPlaying] = useState(false); // autoplay on load

  const toggle = () => setPlaying((prev) => !prev);

  useEffect(() => {
    const audio = audioRef.current;
    if (playing) {
      audio.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setPlaying(false);

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  return [playing, toggle];
};

const Player = ({ url = "/audio/audio.mpeg" , customClass} ) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div className={`flex items-center justify-center gap-4 p-4 ${customClass}`}>
      <button
        onClick={toggle}
        className="relative p-1.5 bg-red-600/0 rounded-full flex items-center justify-center transition-all"
      >
        {/* Fog behind */}
        {/* <GiSmokeBomb /> */}
        <GiSmokeBomb
          className={`absolute text-2xl right-7.5 -rotate-[94deg] top-5 animate-pulse ${
            playing ? "block" : "hidden"
          }`}
          style={{
            filter: "blur(1.5px)",
          }}
        />

        {/* Car wheel in front */}
        <GiCarWheel
          className={`relative text-4xl z-10 ${playing ? "animate-spin" : ""}`}
          color="#fff"
        />
      </button>

    </div>
  );
};

export default Player;
