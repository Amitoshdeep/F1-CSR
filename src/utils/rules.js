// Track-specific setup rules
export const trackRules = {
  'Silverstone': {
    trackType: 'high-speed',
    avgSpeedKph: 240,
    cornerCount: 'many',
    recommendedSetup: {
      downforce: 65,
      suspension: 60,
      tirePressure: 24,
      brakeBias: 56
    }
  },
  'Spa-Francorchamps': {
    trackType: 'high-speed',
    avgSpeedKph: 245,
    cornerCount: 'moderate',
    recommendedSetup: {
      downforce: 55,
      suspension: 50,
      tirePressure: 23,
      brakeBias: 54
    }
  },
  'Monaco': {
    trackType: 'street',
    avgSpeedKph: 160,
    cornerCount: 'many',
    recommendedSetup: {
      downforce: 90,
      suspension: 75,
      tirePressure: 22,
      brakeBias: 62
    }
  }
};

// Weather adjustment rules
export const weatherAdjustments = {
  'Dry': {
    downforce: 0,
    suspension: 0,
    tirePressure: 0,
    brakeBias: 0
  },
  'Rainy': {
    downforce: 15,
    suspension: 10,
    tirePressure: -2,
    brakeBias: 3
  },
  'Foggy': {
    downforce: 10,
    suspension: 5,
    tirePressure: -1,
    brakeBias: 2
  }
};

export function getSetupRecommendation(trackName, weather) {
  const track = trackRules[trackName] || trackRules['Silverstone'];
  const weatherMod = weatherAdjustments[weather] || weatherAdjustments['Dry'];
  
  return {
    trackName,
    weather,
    downforce: Math.min(100, track.recommendedSetup.downforce + weatherMod.downforce),
    suspension: Math.min(100, track.recommendedSetup.suspension + weatherMod.suspension),
    tirePressure: Math.max(20, track.recommendedSetup.tirePressure + weatherMod.tirePressure),
    brakeBias: Math.min(70, Math.max(40, track.recommendedSetup.brakeBias + weatherMod.brakeBias)),
    notes: `Optimized for ${track.trackType} track with ${weather.toLowerCase()} conditions`
  };
}