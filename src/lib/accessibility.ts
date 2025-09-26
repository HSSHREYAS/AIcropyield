// Accessibility utilities for voice input, screen readers, and mobile optimization

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceEnabled: boolean;
  screenReaderOptimized: boolean;
}

class AccessibilityManager {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private commands: Map<string, VoiceCommand> = new Map();
  private settings: AccessibilitySettings;

  constructor() {
    this.settings = this.loadSettings();
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.setupVoiceCommands();
    this.applySettings();
  }

  // Speech Recognition Setup
  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'kn-IN,en-IN'; // Support both Kannada and English

      this.recognition.onstart = () => {
        console.log('Voice recognition started');
        this.isListening = true;
        this.showVoiceIndicator();
      };

      this.recognition.onend = () => {
        console.log('Voice recognition ended');
        this.isListening = false;
        this.hideVoiceIndicator();
      };

      this.recognition.onresult = (event: any) => {
        this.processVoiceInput(event);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.handleVoiceError(event.error);
      };
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      // Configure similar to webkitSpeechRecognition
    }
  }

  // Speech Synthesis Setup
  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Voice Commands Setup
  private setupVoiceCommands(): void {
    const commands: VoiceCommand[] = [
      {
        command: 'predict yield|ಬೆಳೆ ಇಳುವರಿ ಭವಿಷ್ಯ',
        action: () => this.navigateToPage('/predict'),
        description: 'Navigate to prediction page'
      },
      {
        command: 'go home|ಮನೆಗೆ ಹೋಗಿ',
        action: () => this.navigateToPage('/'),
        description: 'Navigate to home page'
      },
      {
        command: 'open chat|ಚಾಟ್ ತೆರೆಯಿರಿ',
        action: () => this.openChatbot(),
        description: 'Open chatbot'
      },
      {
        command: 'show results|ಫಲಿತಾಂಶಗಳನ್ನು ತೋರಿಸಿ',
        action: () => this.navigateToPage('/results'),
        description: 'Show prediction results'
      },
      {
        command: 'help|ಸಹಾಯ',
        action: () => this.showHelpDialog(),
        description: 'Show help information'
      },
      {
        command: 'read page|ಪುಟ ಓದಿ',
        action: () => this.readCurrentPage(),
        description: 'Read current page content'
      },
      {
        command: 'increase font|ಫಾಂಟ್ ಹೆಚ್ಚಿಸಿ',
        action: () => this.increaseFontSize(),
        description: 'Increase font size'
      },
      {
        command: 'decrease font|ಫಾಂಟ್ ಕಡಿಮೆ ಮಾಡಿ',
        action: () => this.decreaseFontSize(),
        description: 'Decrease font size'
      },
      {
        command: 'high contrast|ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್',
        action: () => this.toggleHighContrast(),
        description: 'Toggle high contrast mode'
      },
      {
        command: 'fill form|ಫಾರಂ ತುಂಬಿರಿ',
        action: () => this.startFormFilling(),
        description: 'Start voice form filling'
      }
    ];

    commands.forEach(cmd => {
      this.commands.set(cmd.command, cmd);
    });
  }

  // Voice Recognition Methods
  public startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.speak('Voice commands activated. Say "help" for available commands.', 'en');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  private processVoiceInput(event: any): void {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    
    if (event.results[event.results.length - 1].isFinal) {
      console.log('Voice input:', transcript);
      this.executeVoiceCommand(transcript);
    }
  }

  private executeVoiceCommand(transcript: string): void {
    let commandExecuted = false;

    for (const [pattern, command] of this.commands.entries()) {
      const patterns = pattern.split('|');
      
      if (patterns.some(p => transcript.includes(p.toLowerCase()))) {
        try {
          command.action();
          this.speak('Command executed', 'en');
          commandExecuted = true;
          break;
        } catch (error) {
          console.error('Error executing voice command:', error);
          this.speak('Sorry, there was an error executing that command', 'en');
        }
      }
    }

    if (!commandExecuted) {
      this.handleUnknownCommand(transcript);
    }
  }

  private handleUnknownCommand(transcript: string): void {
    // Try to parse as form input
    if (this.isFormFillMode) {
      this.handleFormInput(transcript);
    } else {
      this.speak('Command not recognized. Say "help" for available commands.', 'en');
    }
  }

  // Text-to-Speech Methods
  public speak(text: string, lang: string = 'en', rate: number = 1): void {
    if (!this.synthesis || !this.settings.voiceEnabled) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Select appropriate voice
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    this.synthesis.speak(utterance);
  }

  public readText(text: string): void {
    if (this.settings.voiceEnabled) {
      this.speak(text);
    }
  }

  // Form Filling Support
  private isFormFillMode = false;
  private currentFormField: HTMLElement | null = null;

  public startFormFilling(): void {
    this.isFormFillMode = true;
    this.speak('Form filling mode activated. I will help you fill the form fields.', 'en');
    this.focusNextFormField();
  }

  public stopFormFilling(): void {
    this.isFormFillMode = false;
    this.currentFormField = null;
    this.speak('Form filling mode deactivated.', 'en');
  }

  private focusNextFormField(): void {
    const formFields = document.querySelectorAll('input, select, textarea');
    const currentIndex = this.currentFormField ? 
      Array.from(formFields).indexOf(this.currentFormField as any) : -1;
    
    const nextField = formFields[currentIndex + 1] as HTMLElement;
    
    if (nextField) {
      this.currentFormField = nextField;
      nextField.focus();
      
      const label = this.getFieldLabel(nextField);
      this.speak(`Please provide ${label}`, 'en');
      
      // Add visual highlight
      nextField.style.border = '3px solid #10b981';
      nextField.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
    } else {
      this.speak('All form fields completed', 'en');
      this.stopFormFilling();
    }
  }

  private getFieldLabel(field: HTMLElement): string {
    const id = field.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent || 'field';
    }
    
    const placeholder = field.getAttribute('placeholder');
    if (placeholder) return placeholder;
    
    return 'field';
  }

  private handleFormInput(transcript: string): void {
    if (!this.currentFormField) return;

    const field = this.currentFormField;
    
    // Parse voice input based on field type
    if (field.tagName === 'INPUT') {
      const inputField = field as HTMLInputElement;
      if (inputField.type === 'number') {
        const number = this.parseNumberFromSpeech(transcript);
        if (number !== null) {
          inputField.value = number.toString();
          this.speak(`Entered ${number}`, 'en');
          this.focusNextFormField();
        }
      } else {
        inputField.value = transcript;
        this.speak(`Entered ${transcript}`, 'en');
        this.focusNextFormField();
      }
    } else if (field.tagName === 'SELECT') {
      const selectField = field as HTMLSelectElement;
      const option = this.findSelectOption(selectField, transcript);
      if (option) {
        selectField.value = option;
        this.speak(`Selected ${option}`, 'en');
        this.focusNextFormField();
      }
    } else if (field.tagName === 'TEXTAREA') {
      const textareaField = field as HTMLTextAreaElement;
      textareaField.value = transcript;
      this.speak(`Entered ${transcript}`, 'en');
      this.focusNextFormField();
    }
  }

  private parseNumberFromSpeech(speech: string): number | null {
    // Handle both English and Kannada numbers
    const numberWords: { [key: string]: string } = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
      'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
      'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000',
      // Kannada numbers
      'ಸೊನ್ನೆ': '0', 'ಒಂದು': '1', 'ಎರಡು': '2', 'ಮೂರು': '3', 'ನಾಲ್ಕು': '4',
      'ಐದು': '5', 'ಆರು': '6', 'ಏಳು': '7', 'ಎಂಟು': '8', 'ಒಂಬತ್ತು': '9', 'ಹತ್ತು': '10'
    };

    // First try to extract direct numbers
    const numberMatch = speech.match(/\d+(\.\d+)?/);
    if (numberMatch) {
      return parseFloat(numberMatch[0]);
    }

    // Try word-to-number conversion
    for (const [word, num] of Object.entries(numberWords)) {
      if (speech.includes(word)) {
        return parseInt(num);
      }
    }

    return null;
  }

  private findSelectOption(select: HTMLSelectElement, speech: string): string | null {
    const options = Array.from(select.options);
    
    for (const option of options) {
      if (speech.toLowerCase().includes(option.text.toLowerCase()) ||
          speech.toLowerCase().includes(option.value.toLowerCase())) {
        return option.value;
      }
    }
    
    return null;
  }

  // Visual Accessibility Methods
  public increaseFontSize(): void {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(this.settings.fontSize);
    
    if (currentIndex < sizes.length - 1) {
      this.settings.fontSize = sizes[currentIndex + 1] as any;
      this.applyFontSize();
      this.saveSettings();
      this.speak('Font size increased', 'en');
    }
  }

  public decreaseFontSize(): void {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(this.settings.fontSize);
    
    if (currentIndex > 0) {
      this.settings.fontSize = sizes[currentIndex - 1] as any;
      this.applyFontSize();
      this.saveSettings();
      this.speak('Font size decreased', 'en');
    }
  }

  public toggleHighContrast(): void {
    this.settings.highContrast = !this.settings.highContrast;
    this.applyHighContrast();
    this.saveSettings();
    this.speak(this.settings.highContrast ? 'High contrast enabled' : 'High contrast disabled', 'en');
  }

  private applySettings(): void {
    this.applyFontSize();
    this.applyHighContrast();
    this.applyReducedMotion();
  }

  private applyFontSize(): void {
    const sizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '22px'
    };

    document.documentElement.style.fontSize = sizeMap[this.settings.fontSize];
  }

  private applyHighContrast(): void {
    if (this.settings.highContrast) {
      document.body.classList.add('high-contrast');
      
      // Add high contrast styles
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      style.textContent = `
        .high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }
        .high-contrast * {
          color: #000 !important;
          background-color: #fff !important;
          border-color: #000 !important;
        }
        .high-contrast button, .high-contrast .btn-primary {
          background-color: #000 !important;
          color: #fff !important;
        }
        .high-contrast a {
          color: #0000ff !important;
        }
      `;
      
      document.head.appendChild(style);
    } else {
      document.body.classList.remove('high-contrast');
      const existingStyle = document.getElementById('high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }

  private applyReducedMotion(): void {
    if (this.settings.reducedMotion) {
      const style = document.createElement('style');
      style.id = 'reduced-motion-styles';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      
      document.head.appendChild(style);
    }
  }

  // Navigation and Interaction Methods
  private navigateToPage(path: string): void {
    window.location.href = path;
  }

  private openChatbot(): void {
    const chatButton = document.querySelector('[data-chatbot-toggle]') as HTMLElement;
    if (chatButton) {
      chatButton.click();
    }
  }

  private showHelpDialog(): void {
    const commands = Array.from(this.commands.values())
      .map(cmd => cmd.description)
      .join(', ');
    
    this.speak(`Available voice commands: ${commands}`, 'en');
  }

  public readCurrentPage(): void {
    const mainContent = document.querySelector('main, article, .main-content');
    if (mainContent) {
      const text = mainContent.textContent || '';
      const summary = text.substring(0, 500) + (text.length > 500 ? '...' : '');
      this.speak(summary, 'en');
    }
  }

  // Voice Indicator UI
  private showVoiceIndicator(): void {
    let indicator = document.getElementById('voice-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'voice-indicator';
      indicator.innerHTML = `
        <div class="voice-indicator-content">
          <div class="voice-wave"></div>
          <span>Listening...</span>
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        #voice-indicator {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1001;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: pulse 2s infinite;
        }

        .voice-wave {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          animation: wave 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes wave {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(indicator);
    }
    
    indicator.style.display = 'flex';
  }

  private hideVoiceIndicator(): void {
    const indicator = document.getElementById('voice-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  private handleVoiceError(error: string): void {
    console.error('Voice recognition error:', error);
    
    switch (error) {
      case 'no-speech':
        this.speak('No speech detected. Please try again.', 'en');
        break;
      case 'audio-capture':
        this.speak('Microphone not available.', 'en');
        break;
      case 'not-allowed':
        this.speak('Microphone permission denied.', 'en');
        break;
      default:
        this.speak('Voice recognition error. Please try again.', 'en');
    }
  }

  // Settings Management
  private loadSettings(): AccessibilitySettings {
    try {
      const stored = localStorage.getItem('accessibilitySettings');
      if (stored) {
        return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
    
    return this.getDefaultSettings();
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  private getDefaultSettings(): AccessibilitySettings {
    return {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: false,
      screenReaderOptimized: false
    };
  }

  // Public API
  public updateSettings(newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.applySettings();
    this.saveSettings();
  }

  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  public isVoiceSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  public isListeningActive(): boolean {
    return this.isListening;
  }
}

export const accessibilityManager = new AccessibilityManager();