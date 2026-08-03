import { useState } from 'react'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'

interface ChatMessage {
  id: number
  sender: 'bot' | 'user'
  text: string
}

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hi! I can help with account access, deposits, routing numbers, and general banking questions.'
  }
]

export default function LiveChatWidget() {
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages)

  const quickReplies = [
    'Open an account',
    'Mortgage help',
    'Find a location',
    'Account balance'
  ]

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim()
    }

    const botResponse = buildBotReply(input.trim())
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botResponse
    }

    setMessages((current) => [...current, userMessage, botMessage])
    setInput('')
  }

  const buildBotReply = (message: string) => {
    const normalized = message.toLowerCase()

    if (normalized.includes('balance') || normalized.includes('available')) {
      return 'Your available balance is shown in the dashboard summary cards after you sign in. Admins can also update the account balance from the admin management screen.'
    }

    if (normalized.includes('deposit') || normalized.includes('fund')) {
      return 'Use the Add Funds action on the banking dashboard to add money to your account. Your new balance updates immediately in the dashboard summary.'
    }

    if (normalized.includes('withdraw') || normalized.includes('transfer')) {
      return 'Use the Withdraw button from the dashboard. The flow verifies your account details before the transfer is approved.'
    }

    if (normalized.includes('login') || normalized.includes('signin') || normalized.includes('sign in')) {
      return 'Use the Sign In link in the top navigation. If your admin created your account, you can sign in with the email and password assigned by the admin.'
    }

    if (normalized.includes('account') || normalized.includes('open')) {
      return 'You can create a new member account from the Sign Up page, or an admin can create a bank profile and assign a login email and password for you.'
    }

    if (normalized.includes('mortgage') || normalized.includes('loan') || normalized.includes('home equity')) {
      return 'Midwest Heritage offers mortgage support, home equity guidance, and local banker assistance for qualifying borrowers.'
    }

    if (normalized.includes('insurance') || normalized.includes('coverage')) {
      return 'You can review insurance, protection, and savings options from the services section and our support team can walk you through the best fit.'
    }

    if (normalized.includes('location') || normalized.includes('branch') || normalized.includes('chariton')) {
      return 'Midwest Heritage serves members from Chariton, Iowa and surrounding communities. You can also use the Locations links in the footer and navigation.'
    }

    if (normalized.includes('admin') || normalized.includes('create user')) {
      return 'The admin panel can create a user, set a login email and password, and then edit the account balance for that member from the user management table.'
    }

    if (normalized.includes('routing') || normalized.includes('routing number')) {
      return 'The routing number and account details are protected in the secure transfer workflow, and the app guides you through the transfer verification steps.'
    }

    return 'I can help with account access, deposits, withdrawals, mortgage questions, savings support, and admin account setup. Try asking about balance, login, funds, transfers, or mortgage help.'
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[360px] rounded-3xl border border-[var(--mh-primary)]/10 bg-white shadow-2xl overflow-hidden">
          <div className="bg-[var(--mh-primary)] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm">Live Support</div>
                <div className="text-[11px] text-white/75">Banking assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[var(--mh-accent-soft)] border-b border-[var(--mh-primary)]/10">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setInput(reply)}
                  className="px-3 py-1.5 rounded-full bg-white text-[var(--mh-primary)] text-xs font-semibold border border-[var(--mh-primary)]/10 hover:border-[var(--mh-primary)]/20"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-[var(--mh-primary)] text-white' : 'bg-[var(--mh-accent-soft)] text-[var(--mh-primary)]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    <span className="font-semibold capitalize">{msg.sender}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[var(--mh-primary)]/10 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-[var(--mh-primary)]/10 px-3 py-2 text-sm outline-none focus:border-[var(--mh-primary)]"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-[var(--mh-primary)] text-white flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-[var(--mh-primary)] text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
