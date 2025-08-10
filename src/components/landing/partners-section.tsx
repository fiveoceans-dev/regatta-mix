import { ContactFormDialog } from "@/components/ui/contact-form-dialog"

const partners = [
  { name: "SailGP", logo: "SG" },
  { name: "World Sailing", logo: "WS" },
  { name: "B&G", logo: "B&G" },
  { name: "Rolex", logo: "RLX" },
  { name: "Oracle", logo: "ORC" },
  { name: "Red Bull", logo: "RB" },
  { name: "Mercedes", logo: "MB" },
  { name: "Emirates", logo: "EM" },
  { name: "Volvo", logo: "VO" },
  { name: "Prada", logo: "PR" },
  { name: "Louis Vuitton", logo: "LV" },
  { name: "Aston Martin", logo: "AM" }
]

export function PartnersSection() {
  return (
    <section className="py-20 px-4 bg-muted/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-accent">In Collaboration With</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partnering with the biggest names in sailing and motorsports
          </p>
        </div>

        {/* First Row - Left to Right */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex animate-scroll-x space-x-12">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={`row1-${index}`}
                className="flex-shrink-0 rounded-lg p-8 hover:bg-muted/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4 min-w-[200px]">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{partner.logo}</span>
                  </div>
                  <span className="font-semibold text-lg whitespace-nowrap">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-x space-x-12" style={{ animationDirection: "reverse" }}>
            {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, index) => (
              <div 
                key={`row2-${index}`}
                className="flex-shrink-0 p-8 hover:bg-muted/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4 min-w-[200px]">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{partner.logo}</span>
                  </div>
                  <span className="font-semibold text-lg whitespace-nowrap">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-16 bg-gradient-primary rounded-lg p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Become a Partner
            </h3>
            <p className="text-primary/90 mb-6">
              Join leading brands in the future of cyber sailing
            </p>
            <ContactFormDialog>
              <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors">
                Contact Us
              </button>
            </ContactFormDialog>
          </div>
        </div>
      </div>
    </section>
  )
}