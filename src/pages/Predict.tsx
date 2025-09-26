import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Sprout, BarChart3, HelpCircle, Lightbulb, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionForm {
  cropType: string;
  location: string;
  season: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  soilPh: string;
  area: string;
}

const Predict = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionForm>({
    cropType: "",
    location: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    soilPh: "",
    area: "",
  });

  const cropTypes = [
    "Rice",
    "Wheat", 
    "Maize",
    "Cotton",
    "Sugarcane"
  ];

  const seasons = [
    "Kharif (Monsoon)",
    "Rabi (Winter)",
    "Zaid (Summer)"
  ];

  const handleInputChange = (field: keyof PredictionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = Object.entries(formData).filter(([_, value]) => !value);
    if (requiredFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to results with form data
    navigate("/results", { state: formData });
  };

  const features = [
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced ML models process your data with 95% accuracy"
    },
    {
      icon: Sprout,
      title: "Smart Advisory",
      description: "Get personalized recommendations for better yields"
    },
    {
      icon: BarChart3,
      title: "Risk Assessment",
      description: "Weather, pest, and market risk analysis included"
    }
  ];

  const fieldHelp = {
    cropType: "Select your primary crop. Each crop has specific growing requirements and market dynamics.",
    location: "Enter your state or region. This affects weather patterns and soil conditions.",
    season: "Choose growing season: Kharif (monsoon), Rabi (winter), or Zaid (summer).",
    rainfall: "Annual rainfall in millimeters. Check local meteorological data for accuracy.",
    temperature: "Average temperature during growing season in Celsius.",
    humidity: "Relative humidity percentage. Important for pest and disease risk assessment.",
    soilPh: "Soil pH level (6.0-8.0 typical range). Get soil tested for accurate results.",
    area: "Cultivation area in hectares. Used to calculate total production estimates."
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="section-padding py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Crop Yield Prediction
            </h1>
            <p className="text-xl text-muted-foreground">
              Enter your farming parameters to get AI-powered yield predictions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="card-agricultural animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Brain className="w-6 h-6 mr-3 text-primary" />
                    Prediction Parameters
                  </CardTitle>
                  <CardDescription>
                    Provide accurate information for the best yield predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Crop Type */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="cropType" className="text-base font-medium">
                            Crop Type *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.cropType}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select onValueChange={(value) => handleInputChange("cropType", value)}>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropTypes.map((crop) => (
                              <SelectItem key={crop} value={crop}>
                                {crop}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="location" className="text-base font-medium">
                            Location/State *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.location}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="location"
                          placeholder="e.g., Punjab, Maharashtra"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="input-field"
                        />
                      </div>

                      {/* Season */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="season" className="text-base font-medium">
                            Growing Season *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.season}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select onValueChange={(value) => handleInputChange("season", value)}>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            {seasons.map((season) => (
                              <SelectItem key={season} value={season}>
                                {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rainfall */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="rainfall" className="text-base font-medium">
                            Annual Rainfall (mm) *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.rainfall}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="rainfall"
                          type="number"
                          placeholder="e.g., 1200"
                          value={formData.rainfall}
                          onChange={(e) => handleInputChange("rainfall", e.target.value)}
                          className="input-field"
                        />
                      </div>

                      {/* Temperature */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="temperature" className="text-base font-medium">
                            Average Temperature (°C) *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.temperature}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 25.5"
                          value={formData.temperature}
                          onChange={(e) => handleInputChange("temperature", e.target.value)}
                          className="input-field"
                        />
                      </div>

                      {/* Humidity */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="humidity" className="text-base font-medium">
                            Humidity (%) *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.humidity}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="humidity"
                          type="number"
                          placeholder="e.g., 75"
                          value={formData.humidity}
                          onChange={(e) => handleInputChange("humidity", e.target.value)}
                          className="input-field"
                        />
                      </div>

                      {/* Soil pH */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="soilPh" className="text-base font-medium">
                            Soil pH *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.soilPh}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="soilPh"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 6.8"
                          value={formData.soilPh}
                          onChange={(e) => handleInputChange("soilPh", e.target.value)}
                          className="input-field"
                        />
                      </div>

                      {/* Area */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor="area" className="text-base font-medium">
                            Cultivation Area (hectares) *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldHelp.area}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="area"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 10.5"
                          value={formData.area}
                          onChange={(e) => handleInputChange("area", e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full py-4 text-lg font-semibold"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                          Analyzing Data...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Brain className="w-5 h-5 mr-3" />
                          Get AI Prediction & Advisory
                        </div>
                      )}
                    </Button>

                    {/* Help Tips */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-blue-800">Pro Tips for Better Predictions</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
                        <div className="flex items-start">
                          <TrendingUp className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Use recent soil test results for pH values</span>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Check local weather data for accurate rainfall</span>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Include historical averages for temperature</span>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Consider microclimate variations in your area</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Features Sidebar */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="card-agricultural animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;