import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Predict Yield", href: "/predict" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/contact" },
    { name: "Documentation", href: "/about" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-primary rounded-lg">
                  <Leaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-background">CropYieldAI</span>
              </Link>
              <p className="text-background/70 mb-6 max-w-md leading-relaxed">
                Empowering farmers with AI-driven crop yield predictions. 
                Make data-driven decisions to optimize your harvest and 
                increase agricultural productivity.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-background/70">
                  <Mail className="w-4 h-4" />
                  <span>support@cropyieldai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-background/70">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-background/70">
                  <MapPin className="w-4 h-4" />
                  <span>123 Agricultural Tech Park, Farm City</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-background mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-background/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-background mb-6">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-background/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-background/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-background/60 text-sm mb-4 md:mb-0">
                © {currentYear} CropYieldAI. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link to="#" className="text-background/60 hover:text-primary transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-background/60 hover:text-primary transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
                <Link to="#" className="text-background/60 hover:text-primary transition-colors duration-200 text-sm">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;