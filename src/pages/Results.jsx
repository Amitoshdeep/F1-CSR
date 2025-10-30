import React from 'react'

function Results() {
  return (
    <div
    className='flex flex-col gap-8 justify-center items-center
      p-4 min-h-full w-full relative overflow-hidden'>

      <div className='commonBg'>
        <p>TrackName</p>
        <p>Weather</p>
        <p>Downforce</p>
        <p>Suspension</p>
        <p>TirePressure</p>
        <p>BrakeBias</p>
        <p>Notes</p>
      </div>

    </div>
  )
}

export default Results
