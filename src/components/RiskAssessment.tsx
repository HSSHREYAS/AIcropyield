import { AlertTriangle, Shield, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeatherRisk, FarmingAdvisory } from "@/lib/farming-advisory";

interface RiskAssessmentProps {
  advisory: FarmingAdvisory;
  cropType: string;
}

const getRiskColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low': return <Shield className="w-4 h-4" />;
    case 'medium': return <AlertTriangle className="w-4 h-4" />;
    case 'high': return <AlertTriangle className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const getMarketTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
  switch (trend) {
    case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
    case 'falling': return <TrendingDown className="w-4 h-4 text-red-600" />;
    case 'stable': return <DollarSign className="w-4 h-4 text-blue-600" />;
    default: return <DollarSign className="w-4 h-4 text-gray-600" />;
  }
};

export const RiskAssessment = ({ advisory, cropType }: RiskAssessmentProps) => {
  const overallRiskLevel = advisory.weatherRisks.length > 0 
    ? advisory.weatherRisks.reduce((highest, risk) => {
        if (risk.level === 'high') return 'high';
        if (risk.level === 'medium' && highest !== 'high') return 'medium';
        return highest;
      }, 'low' as 'low' | 'medium' | 'high')
    : 'low';

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
            Risk Assessment for {cropType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">Overall Risk Level:</span>
            <Badge className={`${getRiskColor(overallRiskLevel)} flex items-center gap-2`}>
              {getRiskIcon(overallRiskLevel)}
              {overallRiskLevel.toUpperCase()}
            </Badge>
          </div>
          
          <Alert className={`border-2 ${overallRiskLevel === 'high' ? 'border-red-200 bg-red-50' : 
                                       overallRiskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                                       'border-green-200 bg-green-50'}`}>
            <AlertDescription className="text-sm">
              {overallRiskLevel === 'high' && "High risk conditions detected. Take immediate preventive measures and consider insurance coverage."}
              {overallRiskLevel === 'medium' && "Moderate risk conditions. Monitor closely and follow recommendations."}
              {overallRiskLevel === 'low' && "Low risk conditions. Continue with normal farming practices and regular monitoring."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Weather Risk Details */}
      {advisory.weatherRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisory.weatherRisks.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{risk.type}</h4>
                  <Badge className={getRiskColor(risk.level)}>
                    {getRiskIcon(risk.level)}
                    {risk.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm font-medium text-blue-800">Recommendation:</p>
                  <p className="text-sm text-blue-700">{risk.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Market Volatility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Price:</span>
                <span className="text-lg font-bold text-green-600">
                  {advisory.marketInsights.currentPrice}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Market Trend:</span>
                <div className="flex items-center gap-2">
                  {getMarketTrendIcon(advisory.marketInsights.trend)}
                  <span className={`font-medium ${
                    advisory.marketInsights.trend === 'rising' ? 'text-green-600' :
                    advisory.marketInsights.trend === 'falling' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {advisory.marketInsights.trend.charAt(0).toUpperCase() + advisory.marketInsights.trend.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Market Strategy:</p>
              <p className="text-sm text-gray-700">{advisory.marketInsights.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pest Risk Assessment */}
      {advisory.pestRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pest & Disease Risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisory.pestRisks.map((pest, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{pest.pest}</h4>
                  <Badge className={getRiskColor(pest.risk)}>
                    {getRiskIcon(pest.risk)}
                    {pest.risk}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-green-700 mb-1">Prevention:</p>
                    <p className="text-green-600">{pest.prevention}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-700 mb-1">Treatment:</p>
                    <p className="text-blue-600">{pest.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Insurance Recommendation */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-blue-800">
            <Shield className="w-5 h-5 mr-2" />
            Insurance Advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">{advisory.insuranceAdvice}</p>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">PMFBY Benefits:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Low premium rates (1.5-5% of sum insured)</li>
              <li>• Coverage against natural disasters</li>
              <li>• Protection from pest attacks and diseases</li>
              <li>• Quick claim settlement process</li>
              <li>• Government subsidy on premiums</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};