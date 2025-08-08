import { HeroSection } from "@/components/landing/hero-section"
import { LeaderboardRegattas } from "@/components/landing/leaderboard-regattas"
import { FeaturesSection } from "@/components/landing/features-section"
import { CommunitySection } from "@/components/landing/community-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { Footer } from "@/components/landing/footer"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <LeaderboardRegattas />
      <FeaturesSection />
      <CommunitySection />
      <PartnersSection />
      <Footer />
    </div>
  )
}