import React from "react";
import ChristmasCountdown from "./components/ChristmasCountdown";
import SnowEffect from "./components/SnowEffect";
import MusicPlayer from "./components/MusicPlayer";
import ChristmasQuote from "./components/ChristmasQuote";

const Home = () => {
  return (
    <main className="relative">
      <SnowEffect />
      <ChristmasCountdown />
      <div className="absolute bottom-24 left-0 right-0">
        <ChristmasQuote />
      </div>
      <MusicPlayer />
    </main>
  );
};

export default Home;
