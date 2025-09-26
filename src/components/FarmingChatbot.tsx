import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Globe } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const predefinedQuestions = {
  en: [
    "When should I plant?",
    "How much fertilizer to use?",
    "Weather impact on my crop?",
    "Market price predictions?",
    "What are the pest risks?",
    "When to harvest?",
    "Irrigation schedule?",
    "Insurance recommendations?"
  ],
  kn: [
    "ನಾನು ಯಾವಾಗ ಬೆಳೆಯಬೇಕು?",
    "ಎಷ್ಟು ಗೊಬ್ಬರ ಬಳಸಬೇಕು?",
    "ನನ್ನ ಬೆಳೆಯ ಮೇಲೆ ಹವಾಮಾನದ ಪರಿಣಾಮ?",
    "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮುನ್ಸೂಚನೆಗಳು?",
    "ಕೀಟ ಅಪಾಯಗಳು ಯಾವುವು?",
    "ಯಾವಾಗ ಕೊಯ್ಲು ಮಾಡಬೇಕು?",
    "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ?",
    "ವಿಮೆ ಶಿಫಾರಸುಗಳು?"
  ]
};

const responses = {
  en: {
    "When should I plant?": "Planting time depends on your crop and season. For Kharif crops, plant during June-July with monsoon. For Rabi crops, November-December is ideal. Always check local weather conditions!",
    "How much fertilizer to use?": "Fertilizer depends on crop type and soil test. Generally: Rice needs 120:60:40 NPK kg/ha, Wheat needs 120:60:40 NPK kg/ha. Always do soil testing first!",
    "Weather impact on my crop?": "Weather greatly affects crops. Excess rain can cause waterlogging, drought affects growth, and extreme temperatures stress plants. Monitor weather forecasts and plan accordingly.",
    "Market price predictions?": "Market prices fluctuate based on demand-supply. Check mandi prices regularly, use government apps like eNAM. Generally, avoid selling immediately after harvest when prices are low.",
    "What are the pest risks?": "Common pests vary by crop. Rice: Brown planthopper, blast. Wheat: Rust, aphids. Cotton: Bollworm. Use IPM practices and monitor fields regularly.",
    "When to harvest?": "Harvest timing is crucial. Rice: 30-35 days after flowering. Wheat: When grains are hard. Look for visual signs like grain color and moisture content.",
    "Irrigation schedule?": "Irrigation depends on crop stage and weather. Critical stages: Rice - transplanting, tillering, flowering. Wheat - crown root, flowering, grain filling. Avoid overwatering!",
    "Insurance recommendations?": "PMFBY (Pradhan Mantri Fasal Bima Yojana) is recommended for all farmers. Low premium, covers weather risks, pest attacks, and natural disasters. Enroll before cutoff dates!"
  },
  kn: {
    "ನಾನು ಯಾವಾಗ ಬೆಳೆಯಬೇಕು?": "ಬೆಳೆಯುವ ಸಮಯವು ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಋತುವಿನ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ. ಖಾರಿಫ್ ಬೆಳೆಗಳಿಗೆ, ಮುಂಗಾರು ಮಳೆಯೊಂದಿಗೆ ಜೂನ್-ಜುಲೈನಲ್ಲಿ ಬೆಳೆಯಿರಿ. ರಬಿ ಬೆಳೆಗಳಿಗೆ, ನವೆಂಬರ್-ಡಿಸೆಂಬರ್ ಆದರ್ಶವಾಗಿದೆ. ಯಾವಾಗಲೂ ಸ್ಥಳೀಯ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ!",
    "ಎಷ್ಟು ಗೊಬ್ಬರ ಬಳಸಬೇಕು?": "ಗೊಬ್ಬರವು ಬೆಳೆಯ ಪ್ರಕಾರ ಮತ್ತು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ. ಸಾಮಾನ್ಯವಾಗಿ: ಅಕ್ಕಿಗೆ 120:60:40 NPK ಕೆಜಿ/ಹೆಕ್ಟೇರ್, ಗೋಧಿಗೆ 120:60:40 NPK ಕೆಜಿ/ಹೆಕ್ಟೇರ್ ಬೇಕು. ಯಾವಾಗಲೂ ಮೊದಲು ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿ!",
    "ನನ್ನ ಬೆಳೆಯ ಮೇಲೆ ಹವಾಮಾನದ ಪರಿಣಾಮ?": "ಹವಾಮಾನವು ಬೆಳೆಗಳ ಮೇಲೆ ಬಹಳ ಪ್ರಭಾವ ಬೀರುತ್ತದೆ. ಅತಿಯಾದ ಮಳೆಯಿಂದ ಜಲಾವರಣವಾಗಬಹುದು, ಬರಗಾಲವು ಬೆಳವಣಿಗೆಯನ್ನು ಪ್ರಭಾವಿಸುತ್ತದೆ, ಮತ್ತು ತೀವ್ರ ತಾಪಮಾನವು ಸಸ್ಯಗಳನ್ನು ಒತ್ತಡಕ್ಕೊಳಪಡಿಸುತ್ತದೆ. ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ಅದಕ್ಕನುಗುಣವಾಗಿ ಯೋಜಿಸಿ.",
    "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮುನ್ಸೂಚನೆಗಳು?": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಬೇಡಿಕೆ-ಪೂರೈಕೆಯ ಆಧಾರದ ಮೇಲೆ ಬದಲಾಗುತ್ತವೆ. ನಿಯಮಿತವಾಗಿ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, eNAM ನಂತಹ ಸರ್ಕಾರಿ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಬಳಸಿ. ಸಾಮಾನ್ಯವಾಗಿ, ಬೆಲೆಗಳು ಕಡಿಮೆ ಇರುವಾಗ ಕೊಯ್ಲು ನಂತರ ತಕ್ಷಣ ಮಾರಾಟ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ.",
    "ಕೀಟ ಅಪಾಯಗಳು ಯಾವುವು?": "ಸಾಮಾನ್ಯ ಕೀಟಗಳು ಬೆಳೆಯ ಪ್ರಕಾರ ಬೇರೆ ಬೇರೆಯಾಗಿವೆ. ಅಕ್ಕಿ: ಕಂದು ಚಿಗಟೆ, ಬ್ಲಾಸ್ಟ್. ಗೋಧಿ: ತುಕ್ಕು, ಸಿಹಿಹುಳ. ಹತ್ತಿ: ಕಾಯಿಕೊರಕ. IPM ಅಭ್ಯಾಸಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಹೊಲಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    "ಯಾವಾಗ ಕೊಯ್ಲು ಮಾಡಬೇಕು?": "ಕೊಯ್ಲು ಸಮಯ ನಿರ್ಣಾಯಕವಾಗಿದೆ. ಅಕ್ಕಿ: ಹೂವು ಬಿಟ್ಟ ನಂತರ 30-35 ದಿನಗಳು. ಗೋಧಿ: ಕಾಳುಗಳು ಗಟ್ಟಿಯಾದಾಗ. ಕಾಳಿನ ಬಣ್ಣ ಮತ್ತು ತೇವಾಂಶದಂತಹ ದೃಶ್ಯ ಸಂಕೇತಗಳನ್ನು ನೋಡಿ.",
    "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ?": "ನೀರಾವರಿ ಬೆಳೆಯ ಹಂತ ಮತ್ತು ಹವಾಮಾನವನ್ನು ಅವಲಂಬಿಸಿದೆ. ಕ್ರಿಟಿಕಲ್ ಹಂತಗಳು: ಅಕ್ಕಿ - ನಾಟಿ, ತಿಳುವು, ಹೂವು. ಗೋಧಿ - ಕಿರೀಟ ಬೇರು, ಹೂವು, ಕಾಳು ತುಂಬುವುದು. ಅತಿ ನೀರಾವರಿಯನ್ನು ತಪ್ಪಿಸಿ!",
    "ವಿಮೆ ಶಿಫಾರಸುಗಳು?": "PMFBY (ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬೀಮಾ ಯೋಜನೆ) ಎಲ್ಲಾ ರೈತರಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ, ಹವಾಮಾನ ಅಪಾಯಗಳು, ಕೀಟದ ದಾಳಿಗಳು ಮತ್ತು ನೈಸರ್ಗಿಕ ವಿಪತ್ತುಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಕಟ್ ಆಫ್ ದಿನಾಂಕಗಳ ಮೊದಲು ದಾಖಲಿಸಿ!"
  }
};

export const FarmingChatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your farming assistant. Ask me anything about crops, weather, fertilizers, or market prices. ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಗೊಬ್ಬರ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText, language);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userText: string, lang: 'en' | 'kn'): string => {
    const currentResponses = responses[lang];
    
    // Check for exact matches in predefined questions
    for (const [question, answer] of Object.entries(currentResponses)) {
      if (userText.toLowerCase().includes(question.toLowerCase()) || 
          question.toLowerCase().includes(userText.toLowerCase())) {
        return answer;
      }
    }

    // Check for keywords and provide relevant responses
    const keywords = {
      en: {
        'plant': 'Planting time varies by crop and season. Check our prediction tool for specific recommendations!',
        'fertilizer': 'Fertilizer requirements depend on soil test and crop type. Use our advisory features for personalized recommendations.',
        'weather': 'Weather monitoring is crucial for farming. Check weather forecasts and use our risk assessment tools.',
        'price': 'Market prices change daily. Check local mandi rates and government portals like eNAM for current prices.',
        'water': 'Water management is key to good yields. Follow crop-specific irrigation schedules and avoid overwatering.',
        'pest': 'Pest management requires regular monitoring. Use IPM practices and consult local agriculture experts.',
        'insurance': 'Crop insurance protects against losses. PMFBY is available for most crops with subsidized premiums.'
      },
      kn: {
        'ಬೆಳೆ': 'ಬೆಳೆಯುವ ಸಮಯವು ಬೆಳೆ ಮತ್ತು ಋತುವಿನ ಪ್ರಕಾರ ಬದಲಾಗುತ್ತದೆ. ನಿರ್ದಿಷ್ಟ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಮ್ಮ ಮುನ್ಸೂಚನೆ ಉಪಕರಣವನ್ನು ಪರಿಶೀಲಿಸಿ!',
        'ಗೊಬ್ಬರ': 'ಗೊಬ್ಬರದ ಅವಶ್ಯಕತೆಗಳು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮತ್ತು ಬೆಳೆಯ ಪ್ರಕಾರವನ್ನು ಅವಲಂಬಿಸಿದೆ. ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಮ್ಮ ಸಲಹಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಬಳಸಿ.',
        'ಹವಾಮಾನ': 'ಕೃಷಿಗೆ ಹವಾಮಾನದ ಮೇಲ್ವಿಚಾರಣೆ ಅತ್ಯಂತ ಮಹತ್ವದ್ದಾಗಿದೆ. ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಮ್ಮ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ ಉಪಕರಣಗಳನ್ನು ಬಳಸಿ.',
        'ಬೆಲೆ': 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಪ್ರತಿದಿನ ಬದಲಾಗುತ್ತವೆ. ಸ್ಥಳೀಯ ಮಂಡಿ ದರಗಳನ್ನು ಮತ್ತು eNAM ನಂತಹ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ಪ್ರಸ್ತುತ ಬೆಲೆಗಳಿಗಾಗಿ ಪರಿಶೀಲಿಸಿ.',
        'ನೀರು': 'ನೀರಿನ ನಿರ್ವಹಣೆಯು ಉತ್ತಮ ಇಳುವರಿಗೆ ಪ್ರಮುಖವಾಗಿದೆ. ಬೆಳೆ-ನಿರ್ದಿಷ್ಟ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಗಳನ್ನು ಅನುಸರಿಸಿ ಮತ್ತು ಅತಿಯಾದ ನೀರಾವರಿಯನ್ನು ತಪ್ಪಿಸಿ.',
        'ಕೀಟ': 'ಕೀಟ ನಿರ್ವಹಣೆಗೆ ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ ಅಗತ್ಯವಿದೆ. IPM ಅಭ್ಯಾಸಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'ವಿಮೆ': 'ಬೆಳೆ ವಿಮೆಯು ನಷ್ಟಗಳಿಂದ ರಕ್ಷಿಸುತ್ತದೆ. PMFBY ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ ಸಬ್ಸಿಡಿ ಪಡೆದ ಪ್ರೀಮಿಯಂಗಳೊಂದಿಗೆ ಲಭ್ಯವಿದೆ.'
      }
    };
    
    const currentKeywords = keywords[lang];
    for (const [keyword, response] of Object.entries(currentKeywords)) {
      if (userText.toLowerCase().includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // Default response
    return lang === 'en' 
      ? "I'm here to help with farming questions! Try asking about planting, fertilizers, weather, prices, or pests. You can also use the buttons below for common questions."
      : "ನಾನು ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ! ಬೆಳೆಯುವುದು, ಗೊಬ್ಬರಗಳು, ಹವಾಮಾನ, ಬೆಲೆಗಳು, ಅಥವಾ ಕೀಟಗಳ ಬಗ್ಗೆ ಕೇಳಿ. ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗಾಗಿ ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಸಹ ಬಳಸಬಹುದು.";
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 shadow-2xl border-primary/20">
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            Farming Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="h-7 px-2"
            >
              <Globe className="w-3 h-3 mr-1" />
              {language === 'en' ? 'ಕನ್' : 'EN'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-48">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t">
          <div className="grid grid-cols-2 gap-1 mb-3">
            {predefinedQuestions[language].slice(0, 4).map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => handleSendMessage(question)}
              >
                {question.length > 15 ? question.substring(0, 15) + '...' : question}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'en' ? "Type your question..." : "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ..."}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="text-sm"
            />
            <Button size="sm" onClick={() => handleSendMessage()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ChatbotToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
      size="lg"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};