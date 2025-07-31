'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw, User, Heart } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: string[]
}

const FAQ_RESPONSES = {
  'how to hire': {
    text: '🚗 **How to hire a driver:**\n\n1. 🔍 Browse our verified drivers\n2. ⭐ Check their profiles and ratings\n3. 📞 Click "View Profile & Book"\n4. 💬 Contact them directly using provided info\n\nTip: Compare multiple drivers for the best rates! 💰',
    suggestions: ['What vehicle types are available?', 'How much does it cost?', 'Are drivers verified?']
  },
  'become driver': {
    text: '🚙 **How to become a driver:**\n\n1. 📝 Sign up and choose "Become a Driver"\n2. 📋 Complete the driver registration form\n3. 📄 Upload required documents (license, Aadhar)\n4. ⏳ Wait for admin approval (24-48 hours)\n5. 🎉 Start receiving booking requests!\n\nReady to start earning? Let\'s get you registered! 💪',
    suggestions: ['What documents do I need?', 'How long is approval?', 'How much can I earn?']
  },
  'payment': {
    text: '💳 **Payment Information:**\n\n💰 Payment is handled directly between you and the driver:\n• 🗣️ Discuss rates before booking\n• 💱 Agree on payment method (cash/UPI/card)\n• ✅ Confirm all terms upfront\n\nThis gives you flexibility and better rates! 🎯',
    suggestions: ['What are typical rates?', 'Is it safe to pay directly?', 'Can I negotiate prices?']
  },
  'verification': {
    text: '✅ **Driver Verification Process:**\n\n🔒 All our drivers go through:\n• 📄 Document verification (license, Aadhar)\n• 🔍 Background checks\n• 👨‍💼 Admin approval process\n• ⭐ Continuous rating system\n\nYour safety is our top priority! 🛡️',
    suggestions: ['How do I check driver ratings?', 'What if I have issues?', 'Can I report a driver?']
  },
  'contact support': {
    text: '📞 **Contact Support:**\n\n• 📧 Email: support@hiredrive.in\n• 📱 Phone: +91 98765 43210\n• 🕐 Available: 24/7 for urgent issues\n• 💬 Live chat: Right here with me!\n\nI\'m always here to help! What else can I do for you? 😊',
    suggestions: ['I have a complaint', 'How to report an issue?', 'Emergency support?']
  },
  'vehicle types': {
    text: '🚛 **Available Vehicle Types:**\n\n🚗 Cars • 🏍️ Motorcycles • 🚛 Trucks\n🚌 Buses • 🛺 Auto Rickshaws • 🚖 Taxis\n🚐 Tempos • 🚜 JCBs • ✈️ Private Jets\n🚲 Bicycles • 🛵 Scooters\n\nWe\'ve got wheels for every need! 🎉',
    suggestions: ['Which is most popular?', 'Luxury vehicle options?', 'Budget-friendly choices?']
  }
}

const QUICK_QUESTIONS = [
  '🚗 How to hire a driver?',
  '🚙 How to become a driver?',
  '💳 How does payment work?',
  '✅ Are drivers verified?',
  '🚛 What vehicles available?',
  '📞 Contact support'
]

const CONVERSATION_STARTERS = [
  "I'm new here, how does this work? 🤔",
  "What's the best way to find a driver? 🔍",
  "Is it safe to hire drivers here? 🛡️",
  "How much does it cost typically? 💰",
  "Can I become a driver too? 🚗",
  "Tell me about your verification process 📋"
]

export function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🎉 Hey there! Welcome to Hire Drive! I'm your personal assistant and I'm super excited to help you! 😊\n\n✨ Whether you want to:\n🚗 Hire an amazing driver\n🚙 Become a driver yourself\n💡 Learn how everything works\n\nI've got all the answers! What sounds interesting to you?",
      isBot: true,
      timestamp: new Date(),
      suggestions: CONVERSATION_STARTERS.slice(0, 3)
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): { text: string; suggestions: string[] } => {
    const message = userMessage.toLowerCase()
    
    // Check for keyword matches in FAQ
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (message.includes(key.replace(/ /g, '')) || message.includes(key)) {
        return response
      }
    }
    
    // Specific keyword responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello there! 👋 Great to see you here! I'm absolutely thrilled to help you out! 🌟\n\n🎯 I can help you with:\n🚗 Finding the perfect driver\n🚙 Starting your driver journey\n💰 Understanding pricing\n🛡️ Learning about safety\n\nWhat would you like to explore first? 😊",
        suggestions: ['How to hire a driver?', 'Become a driver', 'Safety and verification']
      }
    }
    
    if (message.includes('thank')) {
      return {
        text: "Aww, you're so welcome! 🥰 It makes me happy to help! \n\nIs there anything else I can assist you with? I'm here all day, every day! 💪",
        suggestions: ['Ask another question', 'Learn about pricing', 'Contact support']
      }
    }

    if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('money')) {
      return {
        text: '💰 **Pricing Made Simple:**\n\n🎯 Prices depend on:\n• 🚗 Vehicle type\n• ⏰ Duration of service\n• 📍 Distance/location\n• ⭐ Driver experience\n\n💡 Pro tip: Most drivers are flexible with pricing! Compare a few to get the best deal! 🎉',
        suggestions: ['What are typical rates?', 'How to negotiate?', 'Payment methods?']
      }
    }

    if (message.includes('safe') || message.includes('security') || message.includes('trust')) {
      return FAQ_RESPONSES['verification']
    }

    // Default response with personality
    return {
      text: "🤔 Hmm, I want to give you the perfect answer! Let me help you find exactly what you're looking for! 🎯\n\n✨ **I'm great at helping with:**\n🚗 Hiring professional drivers\n🚙 Becoming a verified driver\n💳 Payment & pricing questions\n🛡️ Safety & verification info\n📞 Getting support when you need it\n\nJust ask me anything in your own words! I'm here to help! 😊",
      suggestions: CONVERSATION_STARTERS.slice(0, 4)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const addMessage = (text: string, isBot: boolean, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      suggestions
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputText.trim()
    if (!textToSend) return

    // Add user message
    addMessage(textToSend, false)
    setInputText('')
    setIsTyping(true)

    // Simulate thinking time
    setTimeout(() => {
      const response = getBotResponse(textToSend)
      addMessage(response.text, true, response.suggestions)
      setIsTyping(false)
    }, 800 + Math.random() * 1000) // 0.8-1.8 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: "🔄 All refreshed and ready to go! I'm here to help you with anything about Hire Drive! 😊\n\nWhat would you like to know?",
        isBot: true,
        timestamp: new Date(),
        suggestions: CONVERSATION_STARTERS.slice(0, 3)
      }
    ])
    setInputText('')
    setIsTyping(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-700 transform hover:scale-110 ${
          isOpen 
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 rotate-180' 
            : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 animate-pulse hover:animate-none'
        } text-white group relative overflow-hidden`}
        title="Chat with our AI Assistant"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 scale-0 group-hover:scale-150 transition-transform duration-700 opacity-30 blur-md"></div>
        
        <div className="relative z-10">
          {isOpen ? (
            <X className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="h-7 w-7 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          )}
          
          {/* Notification badge */}
          {!isOpen && (
            <>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                <Heart className="h-2 w-2 text-white" />
              </div>
            </>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[650px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-8 backdrop-blur-sm">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-5 flex items-center justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
            
            <div className="flex items-center relative z-10">
              <div className="relative mr-3">
                <Bot className="h-9 w-9" />
                <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 animate-ping"></div>
              </div>
              <div>
                <h3 className="font-bold text-xl">Hire Drive Assistant</h3>
                <p className="text-sm text-blue-100 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg"></div>
                  Always here to help you! 
                </p>
              </div>
            </div>
            
            <button
              onClick={resetChat}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 relative z-10 group"
              title="Reset Chat"
            >
              <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                      message.isBot
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white'
                    } transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.isBot && (
                        <Bot className="h-5 w-5 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                      {!message.isBot && (
                        <User className="h-5 w-5 mt-1 text-blue-100 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.isBot 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-blue-100'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.isBot && message.suggestions && (
                  <div className="mt-3 ml-12 space-y-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="block w-full text-left text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-300 border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transform hover:scale-[1.02] hover:shadow-md"
                      >
                        💭 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only show initially) */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium flex items-center">
                💡 <span className="ml-1">Quick questions to get started:</span>
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_QUESTIONS.slice(0, 3).map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSendMessage(question)}
                    className="text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 text-left border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transform hover:scale-[1.02] hover:shadow-md"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Hire Drive... 😊"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 pr-12"
                  disabled={isTyping}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  💬
                </div>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <Send className="h-5 w-5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
