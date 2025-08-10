import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RaceControlChat() {
  return (
    <div>
      <div className="h-20 overflow-y-auto text-xs space-y-1 mb-2">
        {[
          { sender: 'RC', message: '5 min to start', isSystem: true, isUser: false },
          { sender: 'SailShark', message: 'Good luck!', isSystem: false, isUser: true },
          { sender: 'TackTitan', message: 'Wind shift right', isSystem: false, isUser: false }
        ].map((msg, index) => (
          <div key={index} className="leading-tight flex items-start gap-1">
            <Avatar className="h-3 w-3 mt-0.5">
              <AvatarImage src={`/placeholder-avatar-${index}.png`} />
              <AvatarFallback className="text-[6px] bg-primary text-primary-foreground">
                {msg.sender[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <strong className="standing-text-primary font-bold">
                {msg.sender}{msg.isUser ? ' (you)' : ''}:
              </strong> 
              <span className="standing-text-primary ml-1">{msg.message}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input 
          type="text" 
          placeholder="Type..." 
          className="flex-1 bg-transparent border border-border/50 standing-text-primary px-2 py-1 rounded-none text-xs h-6 placeholder:text-muted-foreground"
        />
        <Button size="compact" className="text-xs h-6 px-2">Send</Button>
      </div>
    </div>
  )
}