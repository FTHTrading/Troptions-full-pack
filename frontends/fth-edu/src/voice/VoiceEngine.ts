import * as Speech from 'expo-speech';
import { Voice } from '@react-native-voice/voice';
import axios from 'axios';

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Josh voice
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Ollama Local AI Configuration
const OLLAMA_URL = 'http://localhost:11434/api/generate';

interface VoiceCommand {
  type: string;
  action: string;
  params: Record<string, any>;
}

export class VoiceEngine {
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private useElevenLabs: boolean = true;
  private conversationHistory: Array<{role: string, content: string}> = [];
  
  constructor() {
    this.initializeVoice();
  }
  
  private async initializeVoice() {
    try {
      await Voice.destroy();
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechError = this.onSpeechError.bind(this);
    } catch (error) {
      console.error('Voice initialization error:', error);
    }
  }
  
  // Start listening for voice commands
  async startListening(language: string = 'en-US') {
    try {
      this.isListening = true;
      await Voice.start(language);
      return true;
    } catch (error) {
      console.error('Start listening error:', error);
      return false;
    }
  }
  
  // Stop listening
  async stopListening() {
    try {
      this.isListening = false;
      await Voice.stop();
      return true;
    } catch (error) {
      console.error('Stop listening error:', error);
      return false;
    }
  }
  
  // Handle speech results
  private async onSpeechResults(e: any) {
    const spokenText = e.value[0];
    console.log('Heard:', spokenText);
    
    // Process the command
    await this.processVoiceCommand(spokenText);
  }
  
  private onSpeechError(e: any) {
    console.error('Speech error:', e);
    this.isListening = false;
  }
  
  // Process voice command with AI
  private async processVoiceCommand(command: string) {
    try {
      // First, check if it's a system command
      const systemCommand = this.parseSystemCommand(command);
      if (systemCommand) {
        await this.executeSystemCommand(systemCommand);
        return;
      }
      
      // Otherwise, process with Ollama AI
      const aiResponse = await this.queryLocalAI(command);
      
      // Speak the response
      await this.speak(aiResponse);
      
    } catch (error) {
      console.error('Command processing error:', error);
      await this.speak("I'm sorry, I didn't understand that. Could you please repeat?");
    }
  }
  
  // Parse system commands
  private parseSystemCommand(command: string): VoiceCommand | null {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('open')) {
      if (lowerCommand.includes('wallet')) return { type: 'navigate', action: 'wallet', params: {} };
      if (lowerCommand.includes('course')) return { type: 'navigate', action: 'courses', params: {} };
      if (lowerCommand.includes('swap')) return { type: 'navigate', action: 'swap', params: {} };
      if (lowerCommand.includes('home')) return { type: 'navigate', action: 'home', params: {} };
    }
    
    // Wallet commands
    if (lowerCommand.includes('balance') || lowerCommand.includes('how much')) {
      return { type: 'wallet', action: 'get_balance', params: {} };
    }
    
    if (lowerCommand.includes('send') || lowerCommand.includes('transfer')) {
      // Extract amount and recipient
      const amount = this.extractAmount(lowerCommand);
      return { type: 'wallet', action: 'send', params: { amount } };
    }
    
    // Learning commands
    if (lowerCommand.includes('learn') || lowerCommand.includes('teach me')) {
      const topic = lowerCommand.replace(/learn about|teach me about/i, '').trim();
      return { type: 'education', action: 'start_lesson', params: { topic } };
    }
    
    if (lowerCommand.includes('quiz') || lowerCommand.includes('test me')) {
      return { type: 'education', action: 'start_quiz', params: {} };
    }
    
    // AMM/LP commands
    if (lowerCommand.includes('add liquidity') || lowerCommand.includes('lp')) {
      return { type: 'amm', action: 'add_liquidity', params: {} };
    }
    
    if (lowerCommand.includes('swap') || lowerCommand.includes('exchange')) {
      return { type: 'amm', action: 'swap', params: {} };
    }
    
    if (lowerCommand.includes('stake') || lowerCommand.includes('yield')) {
      return { type: 'amm', action: 'stake', params: {} };
    }
    
    return null;
  }
  
  // Extract amount from natural language
  private extractAmount(command: string): number {
    const match = command.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  // Execute system command
  private async executeSystemCommand(command: VoiceCommand) {
    console.log('Executing:', command);
    // This would emit events or call callbacks to the main app
    // Implementation depends on app architecture
  }
  
  // Query local Ollama AI
  private async queryLocalAI(prompt: string): Promise<string> {
    try {
      // Add to conversation history
      this.conversationHistory.push({ role: 'user', content: prompt });
      
      // Keep only last 10 messages for context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }
      
      // Build system prompt for TROPTIONS EDU AI
      const systemPrompt = `You are DONK, the AI tutor for TROPTIONS EDU. You help users learn about:
- Cryptocurrency and blockchain technology
- XRPL, Solana, Stellar, and Ethereum
- Trading and DeFi (AMM, LP, staking, swaps)
- The TROPTIONS ecosystem and $PICK token
- World Cup 2026 and sports commerce

Keep responses concise (2-3 sentences max), engaging, and educational.
Use analogies to explain complex concepts.`;
      
      const response = await axios.post(OLLAMA_URL, {
        model: 'jefe-turbo:latest',
        prompt: `${systemPrompt}\n\nConversation:\n${this.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nassistant:`,
        stream: false,
      }, {
        timeout: 30000,
      });
      
      const aiResponse = response.data.response || "I'm processing that...";
      
      // Add to history
      this.conversationHistory.push({ role: 'assistant', content: aiResponse });
      
      return aiResponse;
      
    } catch (error) {
      console.error('AI query error:', error);
      return "I'm having trouble connecting to my brain right now. Let me try again.";
    }
  }
  
  // Text to Speech using ElevenLabs
  async speak(text: string) {
    if (this.isSpeaking) {
      await this.stopSpeaking();
    }
    
    this.isSpeaking = true;
    
    try {
      if (this.useElevenLabs && ELEVENLABS_API_KEY) {
        await this.speakWithElevenLabs(text);
      } else {
        await this.speakWithExpo(text);
      }
    } catch (error) {
      console.error('Speech error:', error);
      // Fallback to Expo Speech
      await this.speakWithExpo(text);
    } finally {
      this.isSpeaking = false;
    }
  }
  
  // ElevenLabs Text-to-Speech
  private async speakWithElevenLabs(text: string) {
    try {
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 30000,
        }
      );
      
      // Play audio using Expo AV
      const { sound } = await Speech.speakAsync('');
      // Note: In production, you'd save the audio file and play it
      console.log('ElevenLabs audio received:', response.data.byteLength, 'bytes');
      
    } catch (error) {
      console.error('ElevenLabs error:', error);
      throw error;
    }
  }
  
  // Expo Text-to-Speech (fallback)
  private async speakWithExpo(text: string) {
    return new Promise<void>((resolve) => {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => resolve(),
        onError: () => resolve(),
      });
    });
  }
  
  // Stop speaking
  async stopSpeaking() {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Stop speaking error:', error);
    }
  }
  
  // Check if currently speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
  
  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening;
  }
  
  // Set voice preference
  setUseElevenLabs(use: boolean) {
    this.useElevenLabs = use;
  }
  
  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }
}

// Singleton instance
export const voiceEngine = new VoiceEngine();