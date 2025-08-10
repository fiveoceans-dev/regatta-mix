import { Button } from "@/components/ui/button"

export function RaceControlChat() {
  return (
    <div>
      <div className="h-20 overflow-y-auto text-xs space-y-1 mb-2">
        {[
          { sender: 'RC', message: '5 min to start', color: 'chat-text-system' },
          { sender: 'SailShark', message: 'Good luck!', color: 'chat-text-sender' },
          { sender: 'TackTitan', message: 'Wind shift right', color: 'chat-text-sender' }
        ].map((msg, index) => (
          <div key={index} className="leading-tight">
            <strong className={msg.color}>{msg.sender}:</strong> 
            <span className="chat-text-primary ml-1">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input 
          type="text" 
          placeholder="Type..." 
          className="flex-1 bg-transparent border border-border/50 chat-text-primary px-2 py-1 rounded-none text-xs h-6 placeholder:chat-text-secondary"
        />
        <Button size="sm" className="text-xs h-6 px-2">Send</Button>
      </div>
    </div>
  )
}