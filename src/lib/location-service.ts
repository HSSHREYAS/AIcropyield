// Location-based services for weather data and regional recommendations

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  description: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  rainfall: number;
  description: string;
}

export interface RegionalData {
  state: string;
  district: string;
  recommendedCrops: string[];
  soilType: string;
  averageRainfall: number;
  marketPrices: { [crop: string]: number };
  nearbyMarkets: Market[];
}

export interface Market {
  name: string;
  distance: number;
  prices: { [crop: string]: number };
  contact?: string;
}

class LocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;
  private weatherCache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private regionalCache: Map<string, { data: RegionalData; timestamp: number }> = new Map();

  constructor() {
    this.loadCachedLocation();
  }

  public async getCurrentLocation(enableHighAccuracy = true): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };

          this.currentLocation = locationData;
          this.saveLocationToCache(locationData);
          resolve(locationData);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Try to use cached location if available
          if (this.currentLocation) {
            resolve(this.currentLocation);
          } else {
            reject(this.getLocationError(error));
          }
        },
        options
      );
    });
  }

  public startLocationWatching(callback: (location: LocationData) => void): void {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 10 * 60 * 1000 // 10 minutes
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };

        this.currentLocation = locationData;
        this.saveLocationToCache(locationData);
        callback(locationData);
      },
      (error) => {
        console.error('Location watching error:', error);
      },
      options
    );
  }

  public stopLocationWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  public async getWeatherData(location?: LocationData): Promise<WeatherData> {
    const loc = location || this.currentLocation;
    if (!loc) {
      throw new Error('Location not available');
    }

    const cacheKey = `${loc.latitude.toFixed(2)},${loc.longitude.toFixed(2)}`;
    const cached = this.weatherCache.get(cacheKey);
    
    // Return cached data if it's less than 30 minutes old
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return cached.data;
    }

    try {
      // In a real app, you would call a weather API here
      // For demo purposes, we'll simulate weather data based on location
      const weatherData = await this.fetchWeatherData(loc);
      
      this.weatherCache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      // If network fails, try to return cached data even if old
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  public async getRegionalData(location?: LocationData): Promise<RegionalData> {
    const loc = location || this.currentLocation;
    if (!loc) {
      throw new Error('Location not available');
    }

    const cacheKey = `region_${loc.latitude.toFixed(1)},${loc.longitude.toFixed(1)}`;
    const cached = this.regionalCache.get(cacheKey);
    
    // Return cached data if it's less than 24 hours old
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.data;
    }

    try {
      const regionalData = await this.fetchRegionalData(loc);
      
      this.regionalCache.set(cacheKey, {
        data: regionalData,
        timestamp: Date.now()
      });

      return regionalData;
    } catch (error) {
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  private async fetchWeatherData(location: LocationData): Promise<WeatherData> {
    // Simulate API call - replace with actual weather API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate realistic weather data based on location
        const baseTemp = this.getRegionalBaseTemperature(location);
        const seasonalFactor = this.getSeasonalFactor();
        
        const weatherData: WeatherData = {
          temperature: baseTemp + seasonalFactor + (Math.random() - 0.5) * 10,
          humidity: 60 + Math.random() * 30,
          rainfall: Math.random() * 50,
          windSpeed: 5 + Math.random() * 15,
          pressure: 1010 + (Math.random() - 0.5) * 20,
          description: this.getWeatherDescription(),
          forecast: this.generateForecast(baseTemp, seasonalFactor)
        };

        resolve(weatherData);
      }, 1000);
    });
  }

  private async fetchRegionalData(location: LocationData): Promise<RegionalData> {
    // Simulate regional data based on coordinates
    return new Promise((resolve) => {
      setTimeout(() => {
        const regionInfo = this.getRegionInfo(location);
        resolve(regionInfo);
      }, 800);
    });
  }

  private getRegionalBaseTemperature(location: LocationData): number {
    // Rough temperature estimation based on latitude
    const lat = Math.abs(location.latitude);
    if (lat < 10) return 28; // Tropical
    if (lat < 20) return 26; // Subtropical
    if (lat < 30) return 24; // Warm temperate
    return 20; // Cool temperate
  }

  private getSeasonalFactor(): number {
    const month = new Date().getMonth();
    // Northern hemisphere seasons (adjust for southern hemisphere if needed)
    if (month >= 2 && month <= 4) return 2; // Spring
    if (month >= 5 && month <= 7) return 5; // Summer
    if (month >= 8 && month <= 10) return 0; // Autumn
    return -3; // Winter
  }

  private getWeatherDescription(): string {
    const descriptions = [
      'Clear sky',
      'Partly cloudy',
      'Cloudy',
      'Light rain',
      'Scattered showers',
      'Sunny'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateForecast(baseTemp: number, seasonalFactor: number): WeatherForecast[] {
    const forecast: WeatherForecast[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const tempVariation = (Math.random() - 0.5) * 6;
      const temp = baseTemp + seasonalFactor + tempVariation;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(temp - 3),
          max: Math.round(temp + 5)
        },
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 20,
        description: this.getWeatherDescription()
      });
    }
    
    return forecast;
  }

  private getRegionInfo(location: LocationData): RegionalData {
    // Simulate Indian regional data based on coordinates
    const regions = [
      {
        state: 'Punjab',
        district: 'Ludhiana',
        recommendedCrops: ['Wheat', 'Rice', 'Maize'],
        soilType: 'Alluvial',
        averageRainfall: 650,
        coords: { lat: 30.9, lng: 75.8 }
      },
      {
        state: 'Maharashtra',
        district: 'Nashik',
        recommendedCrops: ['Cotton', 'Sugarcane', 'Wheat'],
        soilType: 'Black cotton',
        averageRainfall: 750,
        coords: { lat: 20.0, lng: 73.8 }
      },
      {
        state: 'Karnataka',
        district: 'Mysore',
        recommendedCrops: ['Rice', 'Sugarcane', 'Cotton'],
        soilType: 'Red laterite',
        averageRainfall: 850,
        coords: { lat: 12.3, lng: 76.6 }
      },
      {
        state: 'Uttar Pradesh',
        district: 'Agra',
        recommendedCrops: ['Wheat', 'Rice', 'Maize'],
        soilType: 'Alluvial',
        averageRainfall: 600,
        coords: { lat: 27.2, lng: 78.0 }
      }
    ];

    // Find closest region
    let closestRegion = regions[0];
    let minDistance = this.calculateDistance(
      location.latitude, location.longitude,
      closestRegion.coords.lat, closestRegion.coords.lng
    );

    for (const region of regions) {
      const distance = this.calculateDistance(
        location.latitude, location.longitude,
        region.coords.lat, region.coords.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }

    return {
      state: closestRegion.state,
      district: closestRegion.district,
      recommendedCrops: closestRegion.recommendedCrops,
      soilType: closestRegion.soilType,
      averageRainfall: closestRegion.averageRainfall,
      marketPrices: {
        'Rice': 2200 + Math.random() * 400,
        'Wheat': 2000 + Math.random() * 500,
        'Maize': 1800 + Math.random() * 300,
        'Cotton': 5500 + Math.random() * 1000,
        'Sugarcane': 280 + Math.random() * 40
      },
      nearbyMarkets: this.generateNearbyMarkets(closestRegion.state)
    };
  }

  private generateNearbyMarkets(state: string): Market[] {
    const marketNames = {
      'Punjab': ['Ludhiana Mandi', 'Jalandhar Market', 'Amritsar APMC'],
      'Maharashtra': ['Nashik APMC', 'Pune Market', 'Mumbai Wholesale'],
      'Karnataka': ['Mysore Mandi', 'Bangalore Market', 'Hubli APMC'],
      'Uttar Pradesh': ['Agra Mandi', 'Delhi Market', 'Kanpur APMC']
    };

    const names = marketNames[state as keyof typeof marketNames] || ['Local Mandi', 'District Market', 'Regional APMC'];
    
    return names.map((name, index) => ({
      name,
      distance: 5 + index * 15 + Math.random() * 10,
      prices: {
        'Rice': 2000 + Math.random() * 600,
        'Wheat': 1900 + Math.random() * 600,
        'Maize': 1700 + Math.random() * 400,
        'Cotton': 5200 + Math.random() * 1200,
        'Sugarcane': 270 + Math.random() * 50
      },
      contact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getLocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location access denied. Please enable location services.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information unavailable. Please try again.');
      case error.TIMEOUT:
        return new Error('Location request timed out. Please try again.');
      default:
        return new Error('An unknown location error occurred.');
    }
  }

  private saveLocationToCache(location: LocationData): void {
    try {
      localStorage.setItem('lastLocation', JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location to cache:', error);
    }
  }

  private loadCachedLocation(): void {
    try {
      const cached = localStorage.getItem('lastLocation');
      if (cached) {
        this.currentLocation = JSON.parse(cached);
      }
    } catch (error) {
      console.error('Failed to load cached location:', error);
    }
  }

  public getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }

  public async reverseGeocode(location: LocationData): Promise<string> {
    // Simulate reverse geocoding
    return new Promise((resolve) => {
      setTimeout(() => {
        const addresses = [
          'Rural Area, Punjab, India',
          'Agricultural Zone, Maharashtra, India',
          'Farming District, Karnataka, India',
          'Crop Growing Region, Uttar Pradesh, India'
        ];
        resolve(addresses[Math.floor(Math.random() * addresses.length)]);
      }, 500);
    });
  }
}

export const locationService = new LocationService();