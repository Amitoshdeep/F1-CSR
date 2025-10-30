// Track-specific setup rules (base data)
export const trackRules = {
  Silverstone: {
    trackType: "high-speed",
    avgSpeedKph: 240,
    cornerCount: "many",
    recommendedSetup: {
      downforce: 65,
      suspension: 60,
      aeroBalance: 54,
      antiRollBar: 55,
      rideHeightFront: 28,
      rideHeightRear: 38,
      tirePressureFront: 24,
      tirePressureRear: 23,
      brakeBias: 56,
      differential: { onThrottle: 60, offThrottle: 45 },
      gearRatios: "medium",
    },
    notes: "Requires aerodynamic efficiency and smooth corner exits. Balance between speed and stability.",
  },

  "Spa-Francorchamps": {
    trackType: "high-speed",
    avgSpeedKph: 245,
    cornerCount: "moderate",
    recommendedSetup: {
      downforce: 55,
      suspension: 50,
      aeroBalance: 53,
      antiRollBar: 50,
      rideHeightFront: 27,
      rideHeightRear: 36,
      tirePressureFront: 23,
      tirePressureRear: 22,
      brakeBias: 54,
      differential: { onThrottle: 58, offThrottle: 42 },
      gearRatios: "long",
    },
    notes: "Fast track with elevation changes. Prioritize straight-line speed with controlled high-speed corners.",
  },

  Monaco: {
    trackType: "street",
    avgSpeedKph: 160,
    cornerCount: "many",
    recommendedSetup: {
      downforce: 90,
      suspension: 75,
      aeroBalance: 58,
      antiRollBar: 65,
      rideHeightFront: 32,
      rideHeightRear: 40,
      tirePressureFront: 22,
      tirePressureRear: 22,
      brakeBias: 62,
      differential: { onThrottle: 55, offThrottle: 48 },
      gearRatios: "short",
    },
    notes: "Tight, technical circuit — prioritize traction and downforce for slow corners.",
  },
};

// Weather adjustment rules (more nuanced for pros)
export const weatherAdjustments = {
  Dry: {
    downforce: 0,
    suspension: 0,
    aeroBalance: 0,
    tirePressureFront: 0,
    tirePressureRear: 0,
    brakeBias: 0,
  },
  Rainy: {
    downforce: 12,
    suspension: 8,
    aeroBalance: 2,
    tirePressureFront: -1,
    tirePressureRear: -2,
    brakeBias: 3,
  },
  Foggy: {
    downforce: 8,
    suspension: 4,
    aeroBalance: 1,
    tirePressureFront: -0.5,
    tirePressureRear: -1,
    brakeBias: 1,
  },
};

// Utility to clamp values
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

/**
 * Generates the final setup recommendation
 * Merges base track rules with weather modifiers
 */
export function getSetupRecommendation(trackName, weather) {
  const track = trackRules[trackName] || trackRules["Silverstone"];
  const mod = weatherAdjustments[weather] || weatherAdjustments["Dry"];

  const r = track.recommendedSetup;

  const setup = {
    trackName,
    weather,
    trackType: track.trackType,
    avgSpeedKph: track.avgSpeedKph,
    cornerCount: track.cornerCount,

    recommendedSetup: {
      aeroBalance: clamp(r.aeroBalance + (mod.aeroBalance || 0), 40, 60),
      downforce: clamp(r.downforce + (mod.downforce || 0), 0, 100),
      suspension: clamp(r.suspension + (mod.suspension || 0), 0, 100),
      antiRollBar: clamp(r.antiRollBar, 0, 100),
      rideHeightFront: clamp(r.rideHeightFront, 20, 40),
      rideHeightRear: clamp(r.rideHeightRear, 30, 45),
      tirePressureFront: clamp(r.tirePressureFront + (mod.tirePressureFront || 0), 20, 50),
      tirePressureRear: clamp(r.tirePressureRear + (mod.tirePressureRear || 0), 20, 50),
      brakeBias: clamp(r.brakeBias + (mod.brakeBias || 0), 40, 70),
      differential: r.differential,
      gearRatios: r.gearRatios,
    },

    fuelConsumptionLevel:
      track.trackType === "high-speed" ? "high" : track.trackType === "technical" ? "medium" : "low",
    tireWearLevel: track.trackType === "street" ? "high" : "medium",
    ersUsageStrategy:
      track.trackType === "high-speed" ? "aggressive" : track.trackType === "street" ? "balanced" : "conservative",
    overtakeDifficulty:
      track.trackType === "street" ? "hard" : track.trackType === "high-speed" ? "medium" : "easy",
    drsZones: track.trackType === "high-speed" ? 2 : 1,
    recommendedTireCompound: weather === "Rainy" ? "wet" : weather === "Foggy" ? "intermediate" : "soft",

    notes:
      track.notes +
      ` Adjusted for ${weather.toLowerCase()} conditions. Expect ${
        weather === "Rainy" ? "increased grip demands and longer braking zones." :
        weather === "Foggy" ? "lower visibility and cautious braking performance." :
        "optimal dry performance with minimal compromise."
      }`,
  };

  return setup;
}
