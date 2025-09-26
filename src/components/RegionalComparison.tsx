import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RegionalComparisonProps {
  cropType: string;
  location: string;
  predictedYield: number;
}

// Regional average yields for different crops (quintals/hectare)
const REGIONAL_AVERAGES: Record<string, Record<string, number>> = {
  'Rice': {
    'Punjab': 57, 'Haryana': 54, 'Uttar Pradesh': 48, 'West Bengal': 52,
    'Tamil Nadu': 46, 'Andhra Pradesh': 50, 'Telangana': 49, 'Karnataka': 45,
    'Maharashtra': 44, 'Bihar': 42, 'Odisha': 40, 'Gujarat': 47,
    'Madhya Pradesh': 43, 'Rajasthan': 38
  },
  'Wheat': {
    'Punjab': 42, 'Haryana': 40, 'Uttar Pradesh': 36, 'Madhya Pradesh': 34,
    'Rajasthan': 32, 'Maharashtra': 30, 'Gujarat': 35, 'Bihar': 29,
    'West Bengal': 31, 'Karnataka': 28, 'Tamil Nadu': 26, 'Andhra Pradesh': 27,
    'Telangana': 28, 'Odisha': 25
  },
  'Maize': {
    'Karnataka': 65, 'Telangana': 62, 'Tamil Nadu': 58, 'Andhra Pradesh': 60,
    'Maharashtra': 55, 'Gujarat': 57, 'Madhya Pradesh': 52, 'Uttar Pradesh': 54,
    'Bihar': 48, 'Punjab': 59, 'Haryana': 58, 'Rajasthan': 45,
    'West Bengal': 50, 'Odisha': 47
  },
  'Cotton': {
    'Gujarat': 18, 'Maharashtra': 16, 'Telangana': 17, 'Andhra Pradesh': 16,
    'Karnataka': 15, 'Punjab': 19, 'Haryana': 18, 'Rajasthan': 14,
    'Madhya Pradesh': 15, 'Tamil Nadu': 14
  },
  'Sugarcane': {
    'Uttar Pradesh': 780, 'Maharashtra': 820, 'Karnataka': 850, 'Tamil Nadu': 890,
    'Andhra Pradesh': 860, 'Telangana': 840, 'Gujarat': 800, 'Punjab': 760,
    'Haryana': 770, 'Bihar': 720, 'West Bengal': 750
  }
};

const RegionalComparison = ({ cropType, location, predictedYield }: RegionalComparisonProps) => {
  const regionalAverage = REGIONAL_AVERAGES[cropType]?.[location] || 
    Object.values(REGIONAL_AVERAGES[cropType] || {}).reduce((a, b) => a + b, 0) / 
    Object.keys(REGIONAL_AVERAGES[cropType] || {}).length;

  const difference = predictedYield - regionalAverage;
  const percentageDifference = ((difference / regionalAverage) * 100);

  const getComparisonStatus = () => {
    if (Math.abs(percentageDifference) < 5) return 'similar';
    return percentageDifference > 0 ? 'above' : 'below';
  };

  const status = getComparisonStatus();

  return (
    <Card className="card-agricultural">
      <CardHeader>
        <CardTitle className="text-lg">Regional Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          How your prediction compares to {location} average
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Comparison Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {predictedYield}
              </div>
              <div className="text-xs text-muted-foreground">Your Prediction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {Math.round(regionalAverage * 10) / 10}
              </div>
              <div className="text-xs text-muted-foreground">Regional Average</div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline"
              className={`flex items-center space-x-1 ${
                status === 'above' ? 'bg-success/10 text-success border-success' :
                status === 'below' ? 'bg-warning/10 text-warning border-warning' :
                'bg-secondary/10 text-secondary border-secondary'
              }`}
            >
              {status === 'above' && <TrendingUp className="w-3 h-3" />}
              {status === 'below' && <TrendingDown className="w-3 h-3" />}
              {status === 'similar' && <Minus className="w-3 h-3" />}
              <span>
                {status === 'above' && `+${Math.abs(percentageDifference).toFixed(1)}% Above Average`}
                {status === 'below' && `-${Math.abs(percentageDifference).toFixed(1)}% Below Average`}
                {status === 'similar' && 'Similar to Average'}
              </span>
            </Badge>
          </div>

          {/* Interpretation */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {status === 'above' && 
                "Excellent! Your predicted yield is above regional average. Your farming practices and conditions are well-optimized."
              }
              {status === 'below' && 
                "Your predicted yield is below regional average. Consider implementing the recommendations to improve outcomes."
              }
              {status === 'similar' && 
                "Your predicted yield aligns with regional standards. This indicates typical performance for your area."
              }
            </p>
          </div>

          {/* Yield Difference */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Difference:</span>
              <span className={`text-sm font-bold ${
                difference > 0 ? 'text-success' : 
                difference < 0 ? 'text-warning' : 
                'text-muted-foreground'
              }`}>
                {difference > 0 ? '+' : ''}{Math.round(difference * 10) / 10} quintals/ha
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalComparison;