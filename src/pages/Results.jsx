import { useLocation } from "react-router-dom";
import { getSetupRecommendation } from "../utils/rules";

function Results() {
  const location = useLocation();
  const { track, weather } = location.state || { track: "Silverstone", weather: "Dry" };

  const setup = getSetupRecommendation(track, weather);

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-4 min-h-full w-full relative overflow-hidden">
      <div className="commonBg max-w-3xl w-full">
        <h2 className="font-azonix text-2xl mb-6 border-b-2 border-white/20 pb-4">
          RECOMMENDED SETUP
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
          <Info label="Track" value={setup.trackName} />
          <Info label="Weather" value={setup.weather} />
          <Info label="Track Type" value={setup.trackType} />
          <Info label="Avg Speed" value={setup.avgSpeedKph && `${setup.avgSpeedKph} km/h`} />
          <Info label="Corner Count" value={setup.cornerCount} />
          <Info label="Downforce" value={setup.recommendedSetup?.downforce && `${setup.recommendedSetup.downforce}%`} />
          <Info label="Suspension" value={setup.recommendedSetup?.suspension && `${setup.recommendedSetup.suspension}%`} />
          <Info label="Aero Balance" value={setup.recommendedSetup?.aeroBalance && `${setup.recommendedSetup.aeroBalance}%`} />
          <Info label="Ride Height (F/R)" value={
            setup.recommendedSetup?.rideHeightFront && setup.recommendedSetup?.rideHeightRear
              ? `${setup.recommendedSetup.rideHeightFront}/${setup.recommendedSetup.rideHeightRear} mm`
              : null
          } />
          <Info label="Tire Pressure (F/R)" value={
            setup.recommendedSetup?.tirePressureFront && setup.recommendedSetup?.tirePressureRear
              ? `${setup.recommendedSetup.tirePressureFront}/${setup.recommendedSetup.tirePressureRear} PSI`
              : `${setup.recommendedSetup?.tirePressure} PSI`
          } />
          <Info label="Brake Bias" value={setup.recommendedSetup?.brakeBias && `${setup.recommendedSetup.brakeBias}%`} />
          <Info label="Differential (On/Off)" value={
            setup.recommendedSetup?.differential
              ? `${setup.recommendedSetup.differential.onThrottle}/${setup.recommendedSetup.differential.offThrottle}%`
              : null
          } />
          <Info label="Gear Ratios" value={setup.recommendedSetup?.gearRatios} />
          <Info label="Tire Compound" value={setup.recommendedTireCompound} />
          <Info label="Fuel Consumption" value={setup.fuelConsumptionLevel} />
          <Info label="Tire Wear" value={setup.tireWearLevel} />
          <Info label="ERS Strategy" value={setup.ersUsageStrategy} />
          <Info label="Overtake Difficulty" value={setup.overtakeDifficulty} />
          <Info label="DRS Zones" value={setup.drsZones} />
        </div>

        {setup.notes && (
          <div className="mt-8 pt-6 border-t-2 border-white/20">
            <p className="text-white/50 text-sm mb-2">Notes</p>
            <p className="text-base leading-relaxed">{setup.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-lg font-semibold break-words">{value}</p>
    </div>
  );
}

export default Results;
