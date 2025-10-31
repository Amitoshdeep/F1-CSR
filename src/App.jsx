import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Components
import Hyperspeed from './components/Hyperspeed'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RealHome from './pages/RealHome'
import Results from './pages/Results'
import Tracks from './pages/Tracks'
import Player from './components/Player';
import Explanation from './pages/Explanation'

function App() {
  return (
    <div
    data-scroll-container
    className='h-screen w-screen bg-black relative overflow-x-hidden text-white font-montserrat cursor-default'>

      <div className='h-screen w-screen absolute top-0 left-0 overflow-hidden'>
        <Hyperspeed
          effectOptions={{
          onSpeedUp: () => { },
          onSlowDown: () => { },
          distortion: 'turbulentDistortion',
          length: 400,
          roadWidth: 20,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x0d0d0d,          // dark asphalt black
            islandColor: 0x1a1a1a,        // slightly lighter black for track edges
            background: 0x000000,          // deep black background
            shoulderLines: 0xb30000,       // F1 red glow for track lines
            brokenLines: 0xff1e00,         // bright red for dynamic road markings
            leftCars: [0xd90429, 0xff1e00, 0x9b0000],  // red team / Ferrari style
            rightCars: [0xcccccc, 0x999999, 0xe5e5e5], // silver / white team (Mercedes, McLaren)
            sticks: 0xff1e00               // glowing red roadside lightsa
          }
        }}
        />
      </div>

      <div
      className='
      flex relative
      z-10 min-h-screen h-full
      p-4
      '>

      {/* Background Player */}
      <Player customClass="absolute top-0 right-0" />

        {/* NAV DIV */}
        <div
        className='
        flex items-center py-4 pr-4
        '>
          <Navbar/>
        </div>

        <ScrollToTop />

        <Routes>
          {/* <Route path='/' element={<RealHome />} /> */}
          <Route path='/' element={<Home />} />
          <Route path='/results' element={<Results/>} />
          <Route path='/tracks' element={<Tracks/>} />
          <Route path='/explanation' element={<Explanation/>} />
        </Routes>

      </div>

    </div>
  )
}

export default App
