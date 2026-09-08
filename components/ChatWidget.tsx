import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Key } from 'lucide-react';
import { createShoeCareChat, checkAIConfiguration, requestAIKey } from '../services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your 24/7 shoe care assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    const checkConfig = async () => {
      const configured = await checkAIConfiguration();
      setIsAIConfigured(configured);
    };
    checkConfig();
  }, []);

  const handleConnectAI = async () => {
    await requestAIKey();
    const configured = await checkAIConfiguration();
    setIsAIConfigured(configured);
    if (configured) {
      chatSessionRef.current = createShoeCareChat();
    }
  };

  useEffect(() => {
    if (isAIConfigured && !chatSessionRef.current) {
      chatSessionRef.current = createShoeCareChat();
    }
  }, [isAIConfigured]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    if (!isAIConfigured) {
      await handleConnectAI();
      return;
    }

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createShoeCareChat();
      }
      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { text: response.text || "I'm sorry, I couldn't process that request.", isBot: true }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errMsg = error.message || String(error);
      const lowerErrMsg = errMsg.toLowerCase();
      
      if (lowerErrMsg.includes('api_key_invalid') || lowerErrMsg.includes('not found') || lowerErrMsg.includes('key') || lowerErrMsg.includes('unregistered callers') || lowerErrMsg.includes('permission_denied')) {
        setIsAIConfigured(false);
        chatSessionRef.current = null; // Clear stale session
        setMessages(prev => [...prev, { text: "AI connection error: Please ensure your Gemini API key is properly configured in your environment variables (VITE_GEMINI_API_KEY).", isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: `Sorry, our AI system encountered an error: ${errMsg}`, isBot: true }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <MessageSquare size={28} className="group-hover:animate-pulse" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
            1
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in">
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">RIC Assistant</h3>
                <p className="text-primary-100 text-xs">24/7 Support</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.isBot 
                      ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm' 
                      : 'bg-primary-600 text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  {msg.isBot ? (
                    <div className="markdown-body text-sm prose prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            {!isAIConfigured ? (
              <button 
                onClick={handleConnectAI}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Key size={18} /> Connect AI to Chat
              </button>
            ) : (
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
