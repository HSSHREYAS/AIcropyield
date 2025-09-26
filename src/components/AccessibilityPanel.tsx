import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { accessibilityManager, AccessibilitySettings } from '@/lib/accessibility';
import { 
  Volume2, 
  VolumeX, 
  Type, 
  Eye, 
  Zap, 
  Mic, 
  MicOff,
  Settings2,
  Accessibility as AccessibilityIcon,
  Languages,
  Headphones
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(accessibilityManager.getSettings());
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    setVoiceSupported(accessibilityManager.isVoiceSupported());
  }, []);

  useEffect(() => {
    const checkListening = () => {
      setIsListening(accessibilityManager.isListeningActive());
    };

    const interval = setInterval(checkListening, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    accessibilityManager.updateSettings({ [key]: value });
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      accessibilityManager.stopListening();
    } else {
      accessibilityManager.startListening();
    }
  };

  const testTextToSpeech = () => {
    accessibilityManager.speak('Text to speech is working correctly. This feature will help you navigate the farming app.', 'en');
  };

  const startVoiceFormFilling = () => {
    accessibilityManager.startFormFilling();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AccessibilityIcon className="h-6 w-6 text-green-600" />
              Accessibility Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <CardDescription>
            Configure accessibility features to make the farming app easier to use for all farmers.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Voice Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Voice Features</h3>
              {voiceSupported && <Badge variant="secondary" className="text-xs">Supported</Badge>}
              {!voiceSupported && <Badge variant="destructive" className="text-xs">Not Available</Badge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Voice Commands</Label>
                  <p className="text-xs text-muted-foreground">Control app with voice</p>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => updateSetting('voiceEnabled', checked)}
                  disabled={!voiceSupported}
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={toggleVoiceRecognition}
                  disabled={!voiceSupported || !settings.voiceEnabled}
                  variant={isListening ? "destructive" : "default"}
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Voice Control
                    </>
                  )}
                </Button>

                <Button 
                  onClick={testTextToSpeech}
                  disabled={!voiceSupported}
                  variant="outline"
                  className="w-full text-xs"
                >
                  <Headphones className="h-3 w-3 mr-2" />
                  Test Speech
                </Button>
              </div>
            </div>

            {settings.voiceEnabled && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Voice Commands (Kannada/English)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <p><strong>"Go Home"</strong> / <strong>"ಮನೆಗೆ ಹೋಗಿ"</strong></p>
                    <p><strong>"Predict Yield"</strong> / <strong>"ಬೆಳೆ ಇಳುವರಿ ಭವಿಷ್ಯ"</strong></p>
                    <p><strong>"Open Chat"</strong> / <strong>"ಚಾಟ್ ತೆರೆಯಿರಿ"</strong></p>
                  </div>
                  <div>
                    <p><strong>"Help"</strong> / <strong>"ಸಹಾಯ"</strong></p>
                    <p><strong>"Fill Form"</strong> / <strong>"ಫಾರಂ ತುಂಬಿರಿ"</strong></p>
                    <p><strong>"Read Page"</strong> / <strong>"ಪುಟ ಓದಿ"</strong></p>
                  </div>
                </div>
                <Button 
                  onClick={startVoiceFormFilling}
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  Start Voice Form Filling
                </Button>
              </div>
            )}
          </div>

          {/* Visual Accessibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Visual Accessibility</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => updateSetting('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">Better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Screen Reader Mode</Label>
                  <p className="text-xs text-muted-foreground">Optimize for screen readers</p>
                </div>
                <Switch
                  checked={settings.screenReaderOptimized}
                  onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                onClick={() => accessibilityManager.increaseFontSize()}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                <Type className="h-3 w-3 mr-1" />
                Font +
              </Button>

              <Button 
                onClick={() => accessibilityManager.decreaseFontSize()}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                <Type className="h-3 w-3 mr-1" />
                Font -
              </Button>

              <Button 
                onClick={() => accessibilityManager.toggleHighContrast()}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Contrast
              </Button>

              <Button 
                onClick={() => accessibilityManager.readCurrentPage()}
                variant="outline" 
                size="sm"
                className="text-xs"
                disabled={!settings.voiceEnabled}
              >
                <Volume2 className="h-3 w-3 mr-1" />
                Read Page
              </Button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Accessibility Help
            </h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Use voice commands to navigate without touching the screen</p>
              <p>• Adjust font size for better readability</p>
              <p>• Enable high contrast for better visibility in bright sunlight</p>
              <p>• Voice form filling helps illiterate farmers input data easily</p>
              <p>• All features work offline for remote farming areas</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button onClick={onClose} className="flex-1">
              Save & Close
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSettings(accessibilityManager.getSettings())}
              className="flex-1"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Floating Accessibility Button
export const AccessibilityFloatingButton: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const checkListening = () => {
      setIsListening(accessibilityManager.isListeningActive());
    };

    const interval = setInterval(checkListening, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Button
        onClick={() => setShowPanel(true)}
        className={`fixed bottom-20 right-4 z-40 rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label="Open accessibility settings"
      >
        {isListening ? (
          <Mic className="h-6 w-6" />
        ) : (
          <AccessibilityIcon className="h-6 w-6" />
        )}
      </Button>

      <AccessibilityPanel 
        isOpen={showPanel} 
        onClose={() => setShowPanel(false)} 
      />
    </>
  );
};