import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign } from "lucide-react"

interface BuyCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuyCreditsDialog({ open, onOpenChange }: BuyCreditsDialogProps) {
  const subscriptionPlans = [
    { price: 1, credits: 1000 },
    { price: 3, credits: 3000 },
    { price: 5, credits: 5000 }
  ]

  const handlePayPal = (price: number) => {
    // TODO: Implement PayPal integration
    console.log(`PayPal payment for $${price}`)
  }

  const handleCreditCard = (price: number) => {
    // TODO: Implement credit card payment
    console.log(`Credit card payment for $${price}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Buy Credits
          </DialogTitle>
          <DialogDescription>
            $1 = 1000 credits. Choose a plan to get credits for racing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.price}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">${plan.price}</CardTitle>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">{plan.credits}</div>
                <div className="text-sm text-muted-foreground">Credits per month</div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handlePayPal(plan.price)}
                  >
                    PayPal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCreditCard(plan.price)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}