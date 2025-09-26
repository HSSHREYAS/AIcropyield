export interface CropConditions {
  cropType: string;
  location: string;
  season: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  soilPh: number;
  area: number;
}

export interface WeatherRisk {
  level: 'low' | 'medium' | 'high';
  type: string;
  description: string;
  recommendation: string;
}

export interface SoilRecommendation {
  condition: string;
  advice: string;
  fertilizer: string;
  timing: string;
}

export interface PestRisk {
  pest: string;
  risk: 'low' | 'medium' | 'high';
  prevention: string;
  treatment: string;
}

export interface FarmingAdvisory {
  recommendations: string[];
  weatherRisks: WeatherRisk[];
  soilAdvice: SoilRecommendation;
  pestRisks: PestRisk[];
  plantingDate: string;
  harvestDate: string;
  irrigationSchedule: string[];
  fertilizerSchedule: string[];
  marketInsights: {
    currentPrice: string;
    trend: 'rising' | 'falling' | 'stable';
    recommendation: string;
  };
  insuranceAdvice: string;
}

export const generateFarmingAdvisory = (conditions: CropConditions): FarmingAdvisory => {
  const { cropType, rainfall, temperature, humidity, soilPh, season } = conditions;

  // Weather Risk Assessment
  const weatherRisks: WeatherRisk[] = [];
  
  if (rainfall < 600) {
    weatherRisks.push({
      level: 'high',
      type: 'Drought Risk',
      description: 'Low rainfall detected for the season',
      recommendation: 'Install drip irrigation system and use mulching'
    });
  } else if (rainfall > 2000) {
    weatherRisks.push({
      level: 'medium',
      type: 'Excess Water',
      description: 'High rainfall may cause waterlogging',
      recommendation: 'Ensure proper drainage and consider raised bed farming'
    });
  }

  if (temperature > 35) {
    weatherRisks.push({
      level: 'medium',
      type: 'Heat Stress',
      description: 'High temperature may affect crop growth',
      recommendation: 'Increase irrigation frequency and provide shade nets'
    });
  }

  // Soil Recommendations
  let soilAdvice: SoilRecommendation;
  if (soilPh < 6.0) {
    soilAdvice = {
      condition: 'Acidic soil detected',
      advice: 'Apply lime to increase soil pH',
      fertilizer: 'Use alkaline fertilizers like wood ash',
      timing: 'Apply 2-3 weeks before planting'
    };
  } else if (soilPh > 8.0) {
    soilAdvice = {
      condition: 'Alkaline soil detected',
      advice: 'Add organic matter and sulfur',
      fertilizer: 'Use acidic fertilizers like ammonium sulfate',
      timing: 'Apply during land preparation'
    };
  } else {
    soilAdvice = {
      condition: 'Optimal soil pH',
      advice: 'Maintain current soil conditions',
      fertilizer: 'Standard NPK fertilizers recommended',
      timing: 'Follow crop-specific schedule'
    };
  }

  // Pest Risk Assessment
  const pestRisks: PestRisk[] = getCropSpecificPestRisks(cropType, humidity, temperature);

  // Planting and Harvesting Dates
  const { plantingDate, harvestDate } = getOptimalDates(cropType, season);

  // Irrigation Schedule
  const irrigationSchedule = getIrrigationSchedule(cropType, rainfall, temperature);

  // Fertilizer Schedule
  const fertilizerSchedule = getFertilizerSchedule(cropType, soilPh);

  // Market Insights
  const marketInsights = getMarketInsights(cropType);

  // General Recommendations
  const recommendations = generateRecommendations(conditions, weatherRisks, soilAdvice);

  // Insurance Advice
  const insuranceAdvice = getInsuranceAdvice(weatherRisks, cropType);

  return {
    recommendations,
    weatherRisks,
    soilAdvice,
    pestRisks,
    plantingDate,
    harvestDate,
    irrigationSchedule,
    fertilizerSchedule,
    marketInsights,
    insuranceAdvice
  };
};

const getCropSpecificPestRisks = (cropType: string, humidity: number, temperature: number): PestRisk[] => {
  const risks: PestRisk[] = [];

  switch (cropType.toLowerCase()) {
    case 'rice':
      if (humidity > 80) {
        risks.push({
          pest: 'Brown Planthopper',
          risk: 'high',
          prevention: 'Use resistant varieties and maintain proper plant spacing',
          treatment: 'Apply neem oil or approved insecticides'
        });
      }
      if (temperature > 30) {
        risks.push({
          pest: 'Rice Blast',
          risk: 'medium',
          prevention: 'Ensure proper drainage and avoid excess nitrogen',
          treatment: 'Apply fungicides at early symptoms'
        });
      }
      break;

    case 'wheat':
      if (humidity > 70 && temperature < 20) {
        risks.push({
          pest: 'Rust Disease',
          risk: 'high',
          prevention: 'Use rust-resistant varieties',
          treatment: 'Apply fungicides at tillering stage'
        });
      }
      break;

    case 'maize':
      if (temperature > 32) {
        risks.push({
          pest: 'Fall Armyworm',
          risk: 'medium',
          prevention: 'Regular monitoring and pheromone traps',
          treatment: 'Early application of bio-pesticides'
        });
      }
      break;

    case 'cotton':
      if (humidity < 50) {
        risks.push({
          pest: 'Bollworm',
          risk: 'high',
          prevention: 'Use Bt cotton varieties and trap crops',
          treatment: 'Integrated pest management approach'
        });
      }
      break;

    case 'sugarcane':
      if (temperature > 35) {
        risks.push({
          pest: 'Red Rot',
          risk: 'medium',
          prevention: 'Use disease-free setts and proper drainage',
          treatment: 'Remove affected plants and apply fungicides'
        });
      }
      break;
  }

  return risks;
};

const getOptimalDates = (cropType: string, season: string) => {
  const dates: { [key: string]: { [key: string]: { planting: string; harvest: string } } } = {
    rice: {
      'Kharif (Monsoon)': { planting: 'June-July', harvest: 'November-December' },
      'Rabi (Winter)': { planting: 'November-December', harvest: 'April-May' },
      'Zaid (Summer)': { planting: 'March-April', harvest: 'July-August' }
    },
    wheat: {
      'Rabi (Winter)': { planting: 'November-December', harvest: 'March-April' }
    },
    maize: {
      'Kharif (Monsoon)': { planting: 'June-July', harvest: 'September-October' },
      'Rabi (Winter)': { planting: 'November-December', harvest: 'March-April' },
      'Zaid (Summer)': { planting: 'February-March', harvest: 'June-July' }
    },
    cotton: {
      'Kharif (Monsoon)': { planting: 'May-June', harvest: 'November-January' }
    },
    sugarcane: {
      'Kharif (Monsoon)': { planting: 'February-March', harvest: 'December-March (next year)' }
    }
  };

  const cropDates = dates[cropType.toLowerCase()]?.[season] || { planting: 'Consult local expert', harvest: 'Consult local expert' };
  return { plantingDate: cropDates.planting, harvestDate: cropDates.harvest };
};

const getIrrigationSchedule = (cropType: string, rainfall: number, temperature: number): string[] => {
  const schedule: string[] = [];

  if (rainfall < 800) {
    schedule.push('Frequent irrigation needed - every 7-10 days');
    schedule.push('Use drip irrigation to conserve water');
  } else if (rainfall > 1500) {
    schedule.push('Minimal irrigation required');
    schedule.push('Focus on drainage management');
  } else {
    schedule.push('Moderate irrigation - every 10-14 days');
  }

  if (temperature > 30) {
    schedule.push('Early morning irrigation recommended');
    schedule.push('Avoid midday watering to prevent evaporation');
  }

  return schedule;
};

const getFertilizerSchedule = (cropType: string, soilPh: number): string[] => {
  const schedule: string[] = [];

  switch (cropType.toLowerCase()) {
    case 'rice':
      schedule.push('Basal: 50% N, 100% P, 100% K at transplanting');
      schedule.push('Top dress: 25% N at tillering stage');
      schedule.push('Top dress: 25% N at panicle initiation');
      break;
    case 'wheat':
      schedule.push('Basal: 50% N, 100% P, 100% K at sowing');
      schedule.push('Top dress: 50% N at crown root initiation');
      break;
    case 'maize':
      schedule.push('Basal: 25% N, 100% P, 100% K at sowing');
      schedule.push('Top dress: 50% N at knee height stage');
      schedule.push('Top dress: 25% N at tasseling stage');
      break;
    default:
      schedule.push('Follow crop-specific fertilizer recommendations');
      schedule.push('Apply based on soil test results');
  }

  if (soilPh < 6.0) {
    schedule.push('Additional lime application recommended');
  } else if (soilPh > 8.0) {
    schedule.push('Add gypsum to improve soil structure');
  }

  return schedule;
};

const getMarketInsights = (cropType: string) => {
  // Simulated market data - in real app, this would come from market APIs
  const marketData: { [key: string]: any } = {
    rice: { price: '₹20-25/kg', trend: 'stable', recommendation: 'Good time to sell, prices stable' },
    wheat: { price: '₹22-27/kg', trend: 'rising', recommendation: 'Consider holding for better prices' },
    maize: { price: '₹18-22/kg', trend: 'falling', recommendation: 'Sell soon, prices may decline further' },
    cotton: { price: '₹5,500-6,000/quintal', trend: 'stable', recommendation: 'Market conditions favorable' },
    sugarcane: { price: '₹280-320/quintal', trend: 'rising', recommendation: 'Good demand expected' }
  };

  return marketData[cropType.toLowerCase()] || { price: 'Contact local market', trend: 'stable', recommendation: 'Monitor market conditions' };
};

const generateRecommendations = (conditions: CropConditions, weatherRisks: WeatherRisk[], soilAdvice: SoilRecommendation): string[] => {
  const recommendations: string[] = [];

  // Weather-based recommendations
  if (weatherRisks.some(risk => risk.type === 'Drought Risk')) {
    recommendations.push('Install water-efficient irrigation systems');
    recommendations.push('Use drought-resistant crop varieties');
  }

  if (weatherRisks.some(risk => risk.type === 'Heat Stress')) {
    recommendations.push('Provide shade nets during peak summer');
    recommendations.push('Increase irrigation frequency');
  }

  // Soil-based recommendations
  if (conditions.soilPh < 6.5 || conditions.soilPh > 7.5) {
    recommendations.push(soilAdvice.advice);
  }

  // Crop-specific recommendations
  switch (conditions.cropType.toLowerCase()) {
    case 'rice':
      recommendations.push('Maintain 2-3 cm water level in field');
      recommendations.push('Use certified seeds for better yield');
      break;
    case 'wheat':
      recommendations.push('Ensure proper seed rate (100-125 kg/ha)');
      recommendations.push('Monitor for rust diseases regularly');
      break;
    case 'maize':
      recommendations.push('Maintain plant spacing of 20x75 cm');
      recommendations.push('Remove side shoots for better grain development');
      break;
  }

  // General recommendations
  recommendations.push('Regular soil testing every 2-3 years');
  recommendations.push('Use organic fertilizers to improve soil health');
  recommendations.push('Implement integrated pest management');

  return recommendations;
};

const getInsuranceAdvice = (weatherRisks: WeatherRisk[], cropType: string): string => {
  const highRisks = weatherRisks.filter(risk => risk.level === 'high');
  
  if (highRisks.length > 0) {
    return `High weather risks detected. Strongly recommend Pradhan Mantri Fasal Bima Yojana (PMFBY) insurance for ${cropType}. Coverage includes drought, flood, and pest damages.`;
  }
  
  return `Consider crop insurance for protection against unforeseen weather events. PMFBY offers affordable premiums for ${cropType} cultivation.`;
};