import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BarChart3, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced Machine Learning",
      description: "Our AI models are trained on millions of agricultural data points to provide accurate predictions."
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description: "Get comprehensive analysis with visualizations that help you make informed farming decisions."
    },
    {
      icon: Shield,
      title: "Reliable Accuracy",
      description: "95% prediction accuracy backed by rigorous testing and validation across different regions."
    },
    {
      icon: Zap,
      title: "Instant Results", 
      description: "Get your crop yield predictions in seconds, not days. Fast analysis for time-sensitive decisions."
    },
    {
      icon: Globe,
      title: "Multi-Region Support",
      description: "Optimized for various climatic conditions and agricultural practices across different regions."
    },
    {
      icon: Users,
      title: "Farmer-Focused",
      description: "Built by agricultural experts and farmers to address real-world farming challenges."
    }
  ];

  const stats = [
    { number: "95%", label: "Prediction Accuracy" },
    { number: "50K+", label: "Successful Predictions" },
    { number: "5", label: "Crop Types Supported" },
    { number: "24/7", label: "Available Support" }
  ];

  const supportedCrops = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Input Data",
      description: "Enter your crop and environmental parameters including rainfall, temperature, soil conditions."
    },
    {
      step: "2", 
      title: "AI Analysis",
      description: "Our machine learning algorithms analyze your data against historical patterns and weather trends."
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive accurate yield predictions with confidence levels and actionable recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="section-padding py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-primary border-primary">
              <Award className="w-4 h-4 mr-2" />
              AI-Powered Agriculture
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About CropYieldAI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing agriculture with AI-powered crop yield predictions, 
              helping farmers make data-driven decisions to optimize their harvests and 
              increase productivity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label}
                className="card-agricultural text-center animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Why Choose CropYieldAI?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="card-agricultural group hover:shadow-agricultural transition-all duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div 
                  key={item.step}
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block">
                      <ArrowRight className="w-8 h-8 text-muted-foreground mx-auto mt-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Supported Crops */}
          <Card className="card-agricultural mb-16 animate-fade-up">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Supported Crops
                </h2>
                <p className="text-muted-foreground mb-8">
                  Currently supporting prediction for these major crop types
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {supportedCrops.map((crop, index) => (
                    <Badge 
                      key={crop}
                      variant="outline" 
                      className="px-6 py-2 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="card-agricultural hero-gradient text-center animate-fade-up">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Optimize Your Crop Yield?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of farmers who trust CropYieldAI for accurate yield predictions. 
                Start making data-driven farming decisions today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4">
                  <Link to="/predict" className="flex items-center">
                    Start Predicting
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;