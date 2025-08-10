import { Button } from "@/components/ui/button"

export function RaceControlChat() {
  return (
    <div>
      <div className="h-20 overflow-y-auto text-xs space-y-1 mb-2">
        {[
          { sender: 'RC', message: '5 min to start', color: 'text-sailing-success' },
          { sender: 'SailShark', message: 'Good luck!', color: 'text-primary' },
          { sender: 'TackTitan', message: 'Wind shift right', color: 'text-sailing-warning' }
        ].map((msg, index) => (
          <div key={index} className="leading-tight">
            <strong className={`${msg.color} font-semibold`}>{msg.sender}:</strong> 
            <span className="text-foreground ml-1 font-medium">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input 
          type="text" 
          placeholder="Type..." 
          className="flex-1 bg-transparent border border-border/50 text-foreground px-2 py-1 rounded-none text-xs h-6 font-medium placeholder:text-muted-foreground"
        />
        <Button size="sm" className="text-xs h-6 px-2 font-medium">Send</Button>
      </div>
    </div>
  )
}