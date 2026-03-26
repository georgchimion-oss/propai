import { useState, useEffect, useRef } from 'react'
import { Send, Upload, ImagePlus, MapPin, Building2 } from 'lucide-react'
import { demoConversation, properties } from '@/data/mock'
import { PropertySelector } from '@/components/PropertySelector'
import type { ChatMessage } from '@/data/types'

interface TenantViewProps {
  onTriageStart: () => void
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

export function TenantView({ onTriageStart, selectedProperty, onPropertyChange }: TenantViewProps) {
  const currentProperty = properties.find(p => p.id === selectedProperty)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [demoIndex, setDemoIndex] = useState(0)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (demoIndex < demoConversation.length) {
      const msg = demoConversation[demoIndex]
      const delay = msg.role === 'ai' ? 1200 : 600

      if (msg.role === 'ai') {
        setIsTyping(true)
        const typingTimer = setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [...prev, msg])
          setDemoIndex((i) => i + 1)
        }, delay)
        return () => clearTimeout(typingTimer)
      } else {
        const timer = setTimeout(() => {
          setMessages((prev) => [...prev, msg])
          setDemoIndex((i) => i + 1)
        }, delay)
        return () => clearTimeout(timer)
      }
    }
  }, [demoIndex])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'tenant',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content:
            "Thank you. I've collected all the information I need. Let me analyze this and dispatch the right vendor for you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setTimeout(() => onTriageStart(), 1500)
    }, 2000)
  }

  const handleOptionClick = (option: string) => {
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'tenant',
      content: option,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    // Continue demo
    if (demoIndex < demoConversation.length) {
      setDemoIndex((i) => i)
      // Trigger next AI message
      setTimeout(() => setDemoIndex((i) => i), 100)
    }
  }

  const handleUpload = () => {
    setPhotoUploaded(true)
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'tenant',
      content: '📸 Photo uploaded — bathroom ceiling leak',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content:
            "I can see significant ceiling damage with active water intrusion. This confirms a **critical priority** issue.\n\nI'm now generating a work order and dispatching an emergency plumber.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setTimeout(() => onTriageStart(), 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-20 pb-4 px-4 flex flex-col max-w-2xl mx-auto">
      {/* Property Selector */}
      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Building Info Card */}
      <div className="mb-6 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/25">
            <Building2 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {currentProperty?.name ?? 'Bayshore Tower Residences'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-fg">
              <MapPin className="w-3 h-3" />
              <span>{currentProperty?.address ?? '1200 Brickell Ave, Miami, FL 33131'}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-fg leading-relaxed">
          Report a maintenance issue below. Our AI will assess urgency, match the right vendor, and create a work order — typically in under 60 seconds.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'tenant' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'tenant'
                  ? 'bg-gold/15 border border-gold/20 rounded-2xl rounded-br-md'
                  : 'bg-card border border-border rounded-2xl rounded-bl-md'
              } px-4 py-3`}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal" />
                  </div>
                  <span className="text-[10px] font-semibold text-teal uppercase tracking-wider">
                    Vestia AI
                  </span>
                </div>
              )}
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {msg.content.split('**').map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-semibold text-gold">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
              <span className="text-[10px] text-muted mt-1.5 block">{msg.timestamp}</span>

              {/* Quick Reply Options */}
              {msg.options && msg === messages[messages.length - 1] && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-border text-foreground hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {msg.showUpload && msg === messages[messages.length - 1] && !photoUploaded && (
                <button
                  onClick={handleUpload}
                  className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-teal/10 border border-teal/25 text-teal text-sm font-medium hover:bg-teal/20 transition-all"
                >
                  <ImagePlus className="w-4 h-4" />
                  Upload Photo
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal" />
                </div>
                <span className="text-[10px] font-semibold text-teal uppercase tracking-wider">
                  Vestia AI
                </span>
              </div>
              <div className="flex gap-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-muted-fg typing-dot" />
                <div className="w-2 h-2 rounded-full bg-muted-fg typing-dot" />
                <div className="w-2 h-2 rounded-full bg-muted-fg typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-2 shadow-xl shadow-black/20">
          <button className="p-2.5 rounded-xl text-muted-fg hover:text-foreground hover:bg-white/5 transition-colors">
            <Upload className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your issue..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted outline-none px-2"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 disabled:opacity-30 disabled:hover:bg-gold/15 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
