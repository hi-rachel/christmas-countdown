import React from "react";
import ChristmasCountdown from "./components/ChristmasCountdown";
import SnowEffect from "./components/SnowEffect";
import MusicPlayer from "./components/MusicPlayer";
import ChristmasQuote from "./components/ChristmasQuote";
// import AsciiTree from "./components/AsciiTree";
import TreesBackground from "./components/AsciiTree";
import HolidayAnimation from "./components/HolidayAnimation";

const Home = () => {
  return (
    <main className="relative">
      <ChristmasCountdown />
      <HolidayAnimation />
      <TreesBackground />
      <div className="absolute bottom-24 left-0 right-0 z-20">
        <ChristmasQuote />
      </div>
      <MusicPlayer />
    </main>
  );
};

export default Home;
