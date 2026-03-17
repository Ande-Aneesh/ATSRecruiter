import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithMentor } from '../services/ai';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown';

export default function Chat({ resumeContext }: { resumeContext: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your AI Career Mentor. I've reviewed your resume. What would you like to focus on improving?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const responseText = await chatWithMentor(messages, userMsg, resumeContext);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-white/10' : 'bg-blue-600/20 text-blue-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
            }`}>
              {msg.role === 'user' ? (
                msg.text
              ) : (
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.text}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10 bg-[#111]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your resume..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity hover:bg-gray-200 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {["How can I improve my resume?", "What skills should I learn next?", "Make it sound more senior"].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
