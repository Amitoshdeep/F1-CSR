import { useLocation } from 'react-router-dom';
import { getSetupRecommendation } from '../utils/rules';

function Results() {
  const location = useLocation();
  const { track, weather } = location.state || { track: 'Silverstone', weather: 'Dry' };
  
  const setup = getSetupRecommendation(track, weather);

  return (
    <div className='flex flex-col gap-8 justify-center items-center p-4 min-h-full w-full relative overflow-hidden'>

      <div className='commonBg max-w-2xl'>
        <h2 className='font-azonix text-2xl mb-6 border-b-2 border-white/20 pb-4'>
          RECOMMENDED SETUP
        </h2>
        
        <div className='grid grid-cols-2 gap-6 text-left'>
          <div>
            <p className='text-white/50 text-sm'>Track</p>
            <p className='text-xl font-semibold'>{setup.trackName}</p>
          </div>
          
          <div>
            <p className='text-white/50 text-sm'>Weather</p>
            <p className='text-xl font-semibold'>{setup.weather}</p>
          </div>
          
          <div>
            <p className='text-white/50 text-sm'>Downforce</p>
            <p className='text-xl font-semibold'>{setup.downforce}%</p>
          </div>
          
          <div>
            <p className='text-white/50 text-sm'>Suspension</p>
            <p className='text-xl font-semibold'>{setup.suspension}%</p>
          </div>
          
          <div>
            <p className='text-white/50 text-sm'>Tire Pressure</p>
            <p className='text-xl font-semibold'>{setup.tirePressure} PSI</p>
          </div>
          
          <div>
            <p className='text-white/50 text-sm'>Brake Bias</p>
            <p className='text-xl font-semibold'>{setup.brakeBias}%</p>
          </div>
        </div>
        
        <div className='mt-6 pt-6 border-t-2 border-white/20'>
          <p className='text-white/50 text-sm mb-2'>Notes</p>
          <p className='text-base'>{setup.notes}</p>
        </div>
      </div>

    </div>
  );
}

export default Results;