import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// My components
import { IoSparkles } from "react-icons/io5";
import Player from "../components/Player";
import SelectField from "../components/SelectField";
import { RiAiGenerate2 } from "react-icons/ri";

function Home() {
  const [getStart, setGetStart] = useState(false);

  return (
    <div
      className="
      flex flex-col gap-8 justify-center items-center
      p-4 min-h-full w-full relative overflow-hidden
    "
    >
      {/* Background Player */}
      <Player customClass="absolute top-0 right-0" />

      {/* INTRO DIV (slides up slightly) */}
      <motion.div
        animate={{
          y: getStart ? -10 : 0, // smooth upward slide
          scale: getStart ? 0.90 : 1, // subtle scale shrink
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="commonBg text-center z-10"
      >
        <motion.h1
          className="font-azonix text-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          AI - CAR SETUP RECOMMENDER
        </motion.h1>

        <motion.p
          className="text-white/50 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Get your optimal F1 car setup instantly — track, weather, and AI logic combined
        </motion.p>

        <motion.ul
          className="flex gap-5 justify-center mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <NavLink
            className="commonBtn flex items-center gap-2"
            onClick={() => setGetStart(!getStart)}
          >
            <IoSparkles className="text-lg" />
            {getStart ? "RESET" : "GET STARTED"}
          </NavLink>
        </motion.ul>
      </motion.div>

      {/* FORM DIV (slides in smoothly below) */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{
          opacity: getStart ? 1 : 0,
          y: getStart ? 0 : 80,
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="commonBg text-center z-0"
      >
        <motion.h2
          className="font-azonix text-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: getStart ? 1 : 0, scale: getStart ? 1 : 0.9 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          ENTER TRACK & WEATHER INFO
        </motion.h2>

        <ul className="flex gap-5 flex-wrap justify-center items-center text-sm mt-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: getStart ? 1 : 0, y: getStart ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SelectField
              label="SELECT YOUR TRACK"
              name="track"
              options={["Track 1", "Track 2", "Track 3"]}
              className="commonDropDowns"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: getStart ? 1 : 0, y: getStart ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <SelectField
              label="SELECT THE WEATHER"
              name="weather"
              options={["Dry", "Rainy", "Foggy"]}
              className="commonDropDowns"
            />
          </motion.div>

          <motion.button
            className="commonBtn flex items-center gap-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <RiAiGenerate2 className="text-xl" />
            GET RECOMMENDATIONS
          </motion.button>
        </ul>
      </motion.div>
    </div>
  );
}

export default Home;
