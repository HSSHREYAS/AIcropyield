import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GitCompare, TrendingUp, DollarSign, AlertTriangle, Droplets } from "lucide-react";
import { generateFarmingAdvisory, CropConditions } from "@/lib/farming-advisory";

interface CropComparison {
  crop: string;
  predictedYield: number;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  waterRequirement: string;
  marketPrice: string;
  season: string;
}

interface ComparisonToolProps {
  initialConditions?: Partial<CropConditions>;
}

const cropTypes = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

const getCropYieldPrediction = (conditions: CropConditions): number => {
  // Simplified yield prediction algorithm
  const baseYields: { [key: string]: number } = {
    rice: 4.5,
    wheat: 3.2,
    maize: 5.8,
    cotton: 2.1,
    sugarcane: 75.0
  };

  let cropYield = baseYields[conditions.cropType.toLowerCase()] || 3.0;

  // Adjust based on conditions
  if (conditions.rainfall < 600) cropYield *= 0.7;
  else if (conditions.rainfall > 1500) cropYield *= 0.85;
  else cropYield *= 1.1;

  if (conditions.temperature > 35) cropYield *= 0.8;
  else if (conditions.temperature < 15) cropYield *= 0.75;
  else cropYield *= 1.05;

  if (conditions.soilPh >= 6.5 && conditions.soilPh <= 7.5) cropYield *= 1.1;
  else cropYield *= 0.9;

  return Math.round(cropYield * 100) / 100;
};

const getProfitability = (crop: string, cropYield: number): number => {
  const marketPrices: { [key: string]: number } = {
    rice: 22.5,
    wheat: 24.5,
    maize: 20.0,
    cotton: 5750,
    sugarcane: 300
  };

  const costPerHa: { [key: string]: number } = {
    rice: 45000,
    wheat: 40000,
    maize: 35000,
    cotton: 55000,
    sugarcane: 80000
  };

  const price = marketPrices[crop.toLowerCase()] || 20;
  const cost = costPerHa[crop.toLowerCase()] || 40000;
  
  const revenue = cropYield * price * 1000; // Convert to kg
  const profit = revenue - cost;
  
  return Math.round(profit);
};

const getWaterRequirement = (crop: string): string => {
  const requirements: { [key: string]: string } = {
    rice: "1200-1500 mm",
    wheat: "450-650 mm",
    maize: "500-700 mm",
    cotton: "700-1200 mm",
    sugarcane: "1800-2500 mm"
  };
  return requirements[crop.toLowerCase()] || "600-800 mm";
};

export const CropComparisonTool = ({ initialConditions }: ComparisonToolProps) => {
  const [baseConditions, setBaseConditions] = useState<CropConditions>({
    cropType: initialConditions?.cropType || "",
    location: initialConditions?.location || "",
    season: initialConditions?.season || "",
    rainfall: initialConditions?.rainfall || 1000,
    temperature: initialConditions?.temperature || 25,
    humidity: initialConditions?.humidity || 70,
    soilPh: initialConditions?.soilPh || 6.8,
    area: initialConditions?.area || 1
  });

  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [comparisons, setComparisons] = useState<CropComparison[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleConditionChange = (field: keyof CropConditions, value: string | number) => {
    setBaseConditions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCropForComparison = (crop: string) => {
    if (!selectedCrops.includes(crop) && selectedCrops.length < 4) {
      setSelectedCrops(prev => [...prev, crop]);
    }
  };

  const removeCropFromComparison = (crop: string) => {
    setSelectedCrops(prev => prev.filter(c => c !== crop));
  };

  const generateComparison = () => {
    if (selectedCrops.length < 2) return;

    const newComparisons: CropComparison[] = selectedCrops.map(crop => {
      const conditions = { ...baseConditions, cropType: crop };
      const advisory = generateFarmingAdvisory(conditions);
      const predictedYield = getCropYieldPrediction(conditions);
      const profitability = getProfitability(crop, predictedYield);
      
      const riskLevel = advisory.weatherRisks.length > 0 
        ? advisory.weatherRisks.reduce((highest, risk) => {
            if (risk.level === 'high') return 'high';
            if (risk.level === 'medium' && highest !== 'high') return 'medium';
            return highest;
          }, 'low' as 'low' | 'medium' | 'high')
        : 'low';

      return {
        crop,
        predictedYield,
        profitability,
        riskLevel,
        waterRequirement: getWaterRequirement(crop),
        marketPrice: advisory.marketInsights.currentPrice,
        season: baseConditions.season
      };
    });

    setComparisons(newComparisons);
    setShowComparison(true);
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const getBestOption = () => {
    if (comparisons.length === 0) return null;
    return comparisons.reduce((best, current) => 
      current.profitability > best.profitability ? current : best
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <GitCompare className="w-6 h-6 mr-3 text-primary" />
            Crop Comparison Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Set Base Conditions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Location/State</Label>
                <Input
                  value={baseConditions.location}
                  onChange={(e) => handleConditionChange('location', e.target.value)}
                  placeholder="e.g., Punjab"
                />
              </div>
              <div>
                <Label>Season</Label>
                <Select 
                  value={baseConditions.season}
                  onValueChange={(value) => handleConditionChange('season', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season} value={season}>{season}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area (hectares)</Label>
                <Input
                  type="number"
                  value={baseConditions.area}
                  onChange={(e) => handleConditionChange('area', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Rainfall (mm)</Label>
                <Input
                  type="number"
                  value={baseConditions.rainfall}
                  onChange={(e) => handleConditionChange('rainfall', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Temperature (°C)</Label>
                <Input
                  type="number"
                  value={baseConditions.temperature}
                  onChange={(e) => handleConditionChange('temperature', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Soil pH</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={baseConditions.soilPh}
                  onChange={(e) => handleConditionChange('soilPh', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Crop Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Crops to Compare</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {cropTypes.map(crop => (
                <Button
                  key={crop}
                  variant={selectedCrops.includes(crop) ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectedCrops.includes(crop) 
                    ? removeCropFromComparison(crop)
                    : addCropForComparison(crop)
                  }
                  disabled={!selectedCrops.includes(crop) && selectedCrops.length >= 4}
                >
                  {crop}
                  {selectedCrops.includes(crop) && " ✓"}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select 2-4 crops to compare. Selected: {selectedCrops.length}/4
            </p>
            
            <Button 
              onClick={generateComparison}
              disabled={selectedCrops.length < 2}
              className="w-full"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Generate Comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {showComparison && comparisons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Comparison Results</CardTitle>
            {getBestOption() && (
              <div className="text-sm text-muted-foreground">
                💡 <strong>Best Option:</strong> {getBestOption()?.crop} with highest profitability of ₹{getBestOption()?.profitability.toLocaleString()}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {comparisons.map((comparison, index) => (
                <Card key={comparison.crop} className={`relative ${
                  getBestOption()?.crop === comparison.crop ? 'ring-2 ring-primary' : ''
                }`}>
                  {getBestOption()?.crop === comparison.crop && (
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      Best Choice
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{comparison.crop}</CardTitle>
                    <Badge className={getRiskColor(comparison.riskLevel)}>
                      {comparison.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Yield:
                      </span>
                      <span className="font-bold text-green-600">
                        {comparison.predictedYield} 
                        {comparison.crop.toLowerCase() === 'sugarcane' ? ' tons/ha' : ' tons/ha'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Profit:
                      </span>
                      <span className={`font-bold ${comparison.profitability > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{comparison.profitability.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center">
                        <Droplets className="w-4 h-4 mr-1" />
                        Water:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {comparison.waterRequirement}
                      </span>
                    </div>
                    
                    <div className="text-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Market Price</span>
                      <div className="font-semibold text-primary">
                        {comparison.marketPrice}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* What-if Scenarios */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">💡 What-if Scenarios:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-700">If rainfall increases by 20%:</p>
                  <p className="text-blue-600">Rice and Sugarcane yields may increase by 5-8%</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">If temperature rises by 2°C:</p>
                  <p className="text-blue-600">All crops may face 10-15% yield reduction</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">With improved soil pH (6.5-7.5):</p>
                  <p className="text-blue-600">Expect 10-15% yield improvement across crops</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Market price fluctuation (±20%):</p>
                  <p className="text-blue-600">Profitability may vary by ₹15,000-₹25,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};