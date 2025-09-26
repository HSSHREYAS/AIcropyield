import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Zap, Shield, Lightbulb, TrendingUp, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const Hero = () => {
  const features = [
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze your data"
    },
    {
      icon: Zap,
      title: "Instant Predictions",
      description: "Get accurate yield forecasts in seconds"
    },
    {
      icon: Shield,
      title: "Reliable Results",
      description: "Trust our proven accuracy in crop yield prediction"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 section-padding w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Agriculture
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Transform Your 
              <span className="text-gradient block">Farming Success</span>
              with AI Intelligence
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Get accurate crop yield predictions, smart recommendations, risk assessments, 
              and market insights using advanced AI technology. Perfect for Rice, 
              Wheat, Maize, Cotton, and Sugarcane farming.
            </p>

            {/* Key Benefits */}
            <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 text-primary mr-2" />
                <span className="font-semibold text-primary">New! Smart Farming Advisory</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span>Real-time market insights</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Weather risk alerts</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-purple-600 mr-2" />
                  <span>Multilingual chatbot support</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-orange-600 mr-2" />
                  <span>Crop comparison tool</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button asChild size="lg" className="btn-primary px-8 py-4 text-lg group">
                <Link to="/predict" className="flex items-center">
                  Start Free Prediction
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                <Link to="/about">See How It Works</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">₹50L+</div>
                  <div className="text-sm text-green-700">Farmer Income Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">10K+</div>
                  <div className="text-sm text-green-700">Successful Predictions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-green-700">Accuracy Rate</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="flex items-start space-x-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Card */}
          <div className="animate-slide-in-right lg:block hidden">
            <Card className="card-agricultural p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
              
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Trusted by Indian Farmers
                </h3>
                <p className="text-muted-foreground">
                  AI-powered agriculture for better yields
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Predictions Made</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Crop Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Assistant</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/predict" className="flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Quick Prediction
                  </Link>
                </Button>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Free & Secure
                  </div>
                </div>
              </div>

              {/* Testimonial Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm italic text-blue-700 mb-2">
                  "Increased my wheat yield by 15% using CropYieldAI recommendations!"
                </div>
                <div className="text-xs text-blue-600">- Rajesh K., Punjab Farmer</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;