// Data persistence and local storage management

export interface FarmData {
  id: string;
  name: string;
  location: string;
  area: number;
  soilType: string;
  coordinates?: { lat: number; lng: number };
  createdAt: number;
  updatedAt: number;
}

export interface PredictionHistory {
  id: string;
  farmId?: string;
  cropType: string;
  conditions: {
    location: string;
    season: string;
    rainfall: number;
    temperature: number;
    humidity: number;
    soilPh: number;
    area: number;
  };
  results: {
    predictedYield: number;
    confidence: number;
    recommendations: string[];
    riskLevel: string;
  };
  timestamp: number;
}

export interface UserPreferences {
  language: 'en' | 'hi';
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    voiceEnabled: boolean;
    reducedMotion: boolean;
  };
  notifications: {
    weatherAlerts: boolean;
    marketPrices: boolean;
    recommendations: boolean;
  };
}

export interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  address: string;
  addedAt: number;
}

class DataPersistenceManager {
  private dbName = 'CropYieldAI';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initIndexedDB();
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create stores
        if (!db.objectStoreNames.contains('farms')) {
          const farmStore = db.createObjectStore('farms', { keyPath: 'id' });
          farmStore.createIndex('name', 'name', { unique: false });
          farmStore.createIndex('location', 'location', { unique: false });
        }

        if (!db.objectStoreNames.contains('predictions')) {
          const predictionStore = db.createObjectStore('predictions', { keyPath: 'id' });
          predictionStore.createIndex('timestamp', 'timestamp', { unique: false });
          predictionStore.createIndex('cropType', 'cropType', { unique: false });
          predictionStore.createIndex('farmId', 'farmId', { unique: false });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id' });
          favoritesStore.createIndex('addedAt', 'addedAt', { unique: false });
        }
      };
    });
  }

  // Farm Data Management
  public async saveFarmData(farmData: Omit<FarmData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const farm: FarmData = {
      ...farmData,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await this.saveToIndexedDB('farms', farm);
    return farm.id;
  }

  public async updateFarmData(id: string, updates: Partial<FarmData>): Promise<void> {
    const existing = await this.getFromIndexedDB('farms', id);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updatedAt: Date.now()
      };
      await this.saveToIndexedDB('farms', updated);
    }
  }

  public async getFarmData(id: string): Promise<FarmData | null> {
    return this.getFromIndexedDB('farms', id);
  }

  public async getAllFarms(): Promise<FarmData[]> {
    return this.getAllFromIndexedDB('farms');
  }

  public async deleteFarmData(id: string): Promise<void> {
    await this.deleteFromIndexedDB('farms', id);
  }

  // Prediction History Management
  public async savePrediction(prediction: Omit<PredictionHistory, 'id' | 'timestamp'>): Promise<string> {
    const predictionRecord: PredictionHistory = {
      ...prediction,
      id: this.generateId(),
      timestamp: Date.now()
    };

    await this.saveToIndexedDB('predictions', predictionRecord);
    return predictionRecord.id;
  }

  public async getPredictionHistory(limit = 50): Promise<PredictionHistory[]> {
    const predictions = await this.getAllFromIndexedDB('predictions');
    return predictions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public async getPredictionsByFarm(farmId: string): Promise<PredictionHistory[]> {
    const predictions = await this.getAllFromIndexedDB('predictions');
    return predictions
      .filter(p => p.farmId === farmId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public async deletePrediction(id: string): Promise<void> {
    await this.deleteFromIndexedDB('predictions', id);
  }

  // Favorites Management
  public async addFavoriteLocation(location: Omit<FavoriteLocation, 'id' | 'addedAt'>): Promise<string> {
    const favorite: FavoriteLocation = {
      ...location,
      id: this.generateId(),
      addedAt: Date.now()
    };

    await this.saveToIndexedDB('favorites', favorite);
    return favorite.id;
  }

  public async getFavoriteLocations(): Promise<FavoriteLocation[]> {
    const favorites = await this.getAllFromIndexedDB('favorites');
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
  }

  public async removeFavoriteLocation(id: string): Promise<void> {
    await this.deleteFromIndexedDB('favorites', id);
  }

  // User Preferences
  public saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  public getUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      units: 'metric',
      theme: 'auto',
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        voiceEnabled: false,
        reducedMotion: false
      },
      notifications: {
        weatherAlerts: true,
        marketPrices: true,
        recommendations: true
      }
    };
  }

  // Export/Import functionality
  public async exportData(): Promise<string> {
    const farms = await this.getAllFarms();
    const predictions = await this.getPredictionHistory();
    const favorites = await this.getFavoriteLocations();
    const preferences = this.getUserPreferences();

    const exportData = {
      version: this.version,
      exportDate: new Date().toISOString(),
      data: {
        farms,
        predictions,
        favorites,
        preferences
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  public async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.data.farms) {
        for (const farm of importData.data.farms) {
          await this.saveToIndexedDB('farms', farm);
        }
      }

      if (importData.data.predictions) {
        for (const prediction of importData.data.predictions) {
          await this.saveToIndexedDB('predictions', prediction);
        }
      }

      if (importData.data.favorites) {
        for (const favorite of importData.data.favorites) {
          await this.saveToIndexedDB('favorites', favorite);
        }
      }

      if (importData.data.preferences) {
        this.saveUserPreferences(importData.data.preferences);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid import data format');
    }
  }

  // PDF Export functionality
  public async generatePredictionReport(predictionId: string): Promise<Blob> {
    const prediction = await this.getFromIndexedDB('predictions', predictionId);
    if (!prediction) {
      throw new Error('Prediction not found');
    }

    // Create HTML content for PDF
    const htmlContent = this.generateReportHTML(prediction);
    
    // Convert to PDF (you'll need to add a PDF library like jsPDF or Puppeteer)
    return this.htmlToPDF(htmlContent);
  }

  private generateReportHTML(prediction: PredictionHistory): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CropYieldAI Prediction Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .highlight { background: #f0f9ff; padding: 10px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CropYieldAI Prediction Report</h1>
          <p>Generated on ${new Date(prediction.timestamp).toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Crop Information</h2>
          <div class="grid">
            <div class="card">
              <h3>Basic Details</h3>
              <p><strong>Crop Type:</strong> ${prediction.cropType}</p>
              <p><strong>Location:</strong> ${prediction.conditions.location}</p>
              <p><strong>Season:</strong> ${prediction.conditions.season}</p>
              <p><strong>Area:</strong> ${prediction.conditions.area} hectares</p>
            </div>
            <div class="card">
              <h3>Environmental Conditions</h3>
              <p><strong>Rainfall:</strong> ${prediction.conditions.rainfall} mm</p>
              <p><strong>Temperature:</strong> ${prediction.conditions.temperature}°C</p>
              <p><strong>Humidity:</strong> ${prediction.conditions.humidity}%</p>
              <p><strong>Soil pH:</strong> ${prediction.conditions.soilPh}</p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Prediction Results</h2>
          <div class="highlight">
            <h3>Predicted Yield: ${prediction.results.predictedYield} quintals/hectare</h3>
            <p><strong>Confidence:</strong> ${prediction.results.confidence}%</p>
            <p><strong>Risk Level:</strong> ${prediction.results.riskLevel}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Recommendations</h2>
          <ul>
            ${prediction.results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Generated by CropYieldAI - Smart Farming Assistant</p>
        </div>
      </body>
      </html>
    `;
  }

  private async htmlToPDF(html: string): Promise<Blob> {
    // This is a simplified implementation
    // In a real app, you'd use a proper PDF generation library
    const blob = new Blob([html], { type: 'text/html' });
    return blob;
  }

  // IndexedDB helper methods
  private async saveToIndexedDB(storeName: string, data: any): Promise<void> {
    if (!this.db) {
      await this.initIndexedDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromIndexedDB(storeName: string, id: string): Promise<any> {
    if (!this.db) {
      await this.initIndexedDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllFromIndexedDB(storeName: string): Promise<any[]> {
    if (!this.db) {
      await this.initIndexedDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteFromIndexedDB(storeName: string, id: string): Promise<void> {
    if (!this.db) {
      await this.initIndexedDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup old data
  public async cleanupOldData(daysToKeep = 90): Promise<void> {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    const predictions = await this.getAllFromIndexedDB('predictions');
    for (const prediction of predictions) {
      if (prediction.timestamp < cutoffTime) {
        await this.deleteFromIndexedDB('predictions', prediction.id);
      }
    }
  }
}

export const dataManager = new DataPersistenceManager();