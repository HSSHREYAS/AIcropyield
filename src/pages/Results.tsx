import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Target, Shield, ThermometerSun, CloudRain, Brain, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { predictCropYield, generateHistoricalTrend, generateFactorAnalysis } from "@/lib/prediction-engine";
import { generateFarmingAdvisory } from "@/lib/farming-advisory";
import { RiskAssessment } from "@/components/RiskAssessment";
import { CropComparisonTool } from "@/components/CropComparisonTool";
import RegionalComparison from "@/components/RegionalComparison";

const Results = () => {
  const location = useLocation();
  const formData = location.state;

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="card-agricultural p-8 text-center max-w-md">
          <CardContent>
            <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-6">
              Please complete the prediction form first.
            </p>
            <Button asChild className="btn-primary">
              <Link to="/predict">Go to Prediction Form</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use advanced AI prediction engine
  const prediction = predictCropYield({
    cropType: formData.cropType,
    location: formData.location,
    season: formData.season,
    rainfall: parseFloat(formData.rainfall),
    temperature: parseFloat(formData.temperature),
    humidity: parseFloat(formData.humidity),
    soilPh: parseFloat(formData.soilPh),
    area: parseFloat(formData.area)
  });

  // Generate farming advisory
  const advisory = generateFarmingAdvisory({
    cropType: formData.cropType,
    location: formData.location,
    season: formData.season,
    rainfall: parseFloat(formData.rainfall),
    temperature: parseFloat(formData.temperature),
    humidity: parseFloat(formData.humidity),
    soilPh: parseFloat(formData.soilPh),
    area: parseFloat(formData.area)
  });

  // Generate visualization data
  const historicalData = generateHistoricalTrend(prediction.yieldPerHectare);
  const factorAnalysis = generateFactorAnalysis({
    cropType: formData.cropType,
    location: formData.location,
    season: formData.season,
    rainfall: parseFloat(formData.rainfall),
    temperature: parseFloat(formData.temperature),
    humidity: parseFloat(formData.humidity),
    soilPh: parseFloat(formData.soilPh),
    area: parseFloat(formData.area)
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="section-padding py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <Button asChild variant="ghost" className="mb-4">
                <Link to="/predict" className="flex items-center text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Prediction
                </Link>
              </Button>
              <h1 className="text-4xl font-bold text-foreground">
                AI Prediction Results
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Advanced crop yield forecast for {formData.cropType} in {formData.location}
              </p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/predict">Predict Again</Link>
            </Button>
          </div>

          {/* Main Results */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Predicted Yield */}
            <Card className="card-agricultural animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-3 text-primary" />
                  Predicted Yield
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {prediction.yieldPerHectare}
                  </div>
                  <div className="text-muted-foreground mb-4">quintals per hectare</div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      prediction.riskColor === 'success' ? 'bg-success/10 text-success border-success' :
                      prediction.riskColor === 'warning' ? 'bg-warning/10 text-warning border-warning' :
                      'bg-destructive/10 text-destructive border-destructive'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {prediction.confidence}% Confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Total Production */}
            <Card className="card-agricultural animate-slide-in-right" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="w-5 h-5 mr-3 text-secondary" />
                  Total Production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {prediction.totalProduction}
                  </div>
                  <div className="text-muted-foreground mb-4">quintals total</div>
                  <div className="text-sm text-muted-foreground">
                    Area: {formData.area} hectares
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="card-agricultural animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-3 text-accent" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    prediction.riskColor === 'success' ? 'text-success' :
                    prediction.riskColor === 'warning' ? 'text-warning' :
                    'text-destructive'
                  }`}>
                    {prediction.riskLevel.toUpperCase()}
                  </div>
                  <div className="text-muted-foreground mb-4">risk level</div>
                  <div className="flex justify-between text-xs">
                    <span>Weather: {prediction.weatherScore}%</span>
                    <span>Soil: {prediction.soilScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Info */}
            <Card className="card-agricultural animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              <CardHeader>
                <CardTitle className="text-lg">Crop Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crop:</span>
                  <span className="font-medium">{formData.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Season:</span>
                  <span className="font-medium">{formData.season}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{formData.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Historical Trend Chart */}
            <Card className="card-agricultural animate-slide-in-right">
              <CardHeader>
                <CardTitle>6-Year Yield Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Historical vs predicted</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="yield" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ r: 6, fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Factor Analysis */}
            <Card className="card-agricultural animate-slide-in-right" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle>Factor Impact</CardTitle>
                <p className="text-sm text-muted-foreground">Environmental conditions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {factorAnalysis.map((factor) => (
                    <div key={factor.factor} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {factor.factor === 'Rainfall' && <CloudRain className="w-4 h-4 text-primary" />}
                          {factor.factor === 'Temperature' && <ThermometerSun className="w-4 h-4 text-secondary" />}
                          {factor.factor === 'Soil pH' && <Target className="w-4 h-4 text-accent" />}
                          {factor.factor === 'Humidity' && <BarChart3 className="w-4 h-4 text-muted-foreground" />}
                          <span className="font-medium">{factor.factor}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          factor.status === 'good' ? 'bg-success/10 text-success border-success' :
                          factor.status === 'moderate' ? 'bg-warning/10 text-warning border-warning' :
                          'bg-destructive/10 text-destructive border-destructive'
                        }`}>
                          {factor.impact}% {factor.status}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.status === 'good' ? 'bg-success' :
                            factor.status === 'moderate' ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${factor.impact}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Comparison */}
            <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <RegionalComparison
                cropType={formData.cropType}
                location={formData.location}
                predictedYield={prediction.yieldPerHectare}
              />
            </div>
          </div>

          {/* AI Recommendations */}
          <Tabs defaultValue="predictions" className="animate-fade-up">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Predictions
              </TabsTrigger>
              <TabsTrigger value="advisory" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Smart Advisory
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Risk Assessment
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Compare Crops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="mt-6">
              <Card className="card-agricultural">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-primary" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {prediction.recommendations.map((rec, index) => (
                      <div 
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50 border border-muted"
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          rec.type === 'success' ? 'bg-success/10' :
                          rec.type === 'warning' ? 'bg-warning/10' : 
                          'bg-secondary/10'
                        }`}>
                          <CheckCircle2 className={`w-5 h-5 ${
                            rec.type === 'success' ? 'text-success' :
                            rec.type === 'warning' ? 'text-warning' :
                            'text-secondary'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                          <p className="text-muted-foreground text-sm">{rec.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advisory" className="mt-6">
              <div className="grid gap-6">
                {/* Smart Recommendations */}
                <Card className="card-agricultural">
                  <CardHeader>
                    <CardTitle className="text-xl">Smart Farming Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {advisory.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-blue-50/50">
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Farming Schedule */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-agricultural">
                    <CardHeader>
                      <CardTitle className="text-lg">Planting & Harvest Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-green-700">Optimal Planting Time</h4>
                        <p className="text-green-600">{advisory.plantingDate}</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold text-orange-700">Expected Harvest</h4>
                        <p className="text-orange-600">{advisory.harvestDate}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-agricultural">
                    <CardHeader>
                      <CardTitle className="text-lg">Irrigation & Fertilizer Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">Irrigation Guide:</h4>
                        {advisory.irrigationSchedule.map((item, index) => (
                          <p key={index} className="text-sm text-blue-600 mb-1">• {item}</p>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">Fertilizer Schedule:</h4>
                        {advisory.fertilizerSchedule.map((item, index) => (
                          <p key={index} className="text-sm text-purple-600 mb-1">• {item}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Soil & Pest Management */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-agricultural">
                    <CardHeader>
                      <CardTitle className="text-lg">Soil Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <h4 className="font-medium text-yellow-800">{advisory.soilAdvice.condition}</h4>
                          <p className="text-sm text-yellow-700 mt-1">{advisory.soilAdvice.advice}</p>
                        </div>
                        <div className="text-sm">
                          <p><strong>Recommended Fertilizer:</strong> {advisory.soilAdvice.fertilizer}</p>
                          <p><strong>Application Timing:</strong> {advisory.soilAdvice.timing}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-agricultural">
                    <CardHeader>
                      <CardTitle className="text-lg">Market Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Current Price:</span>
                          <span className="text-green-600 font-bold">{advisory.marketInsights.currentPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Market Trend:</span>
                          <Badge className={`${
                            advisory.marketInsights.trend === 'rising' ? 'bg-green-100 text-green-800' :
                            advisory.marketInsights.trend === 'falling' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {advisory.marketInsights.trend}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{advisory.marketInsights.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risks" className="mt-6">
              <RiskAssessment advisory={advisory} cropType={formData.cropType} />
            </TabsContent>

            <TabsContent value="compare" className="mt-6">
              <CropComparisonTool initialConditions={{
                location: formData.location,
                season: formData.season,
                rainfall: parseFloat(formData.rainfall),
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                soilPh: parseFloat(formData.soilPh),
                area: parseFloat(formData.area)
              }} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Results;