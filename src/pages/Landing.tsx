import { HeroSection } from "@/components/landing/hero-section"
import { LeaderboardRegattas } from "@/components/landing/leaderboard-regattas"
import { UpdatedFeaturesSection } from "@/components/landing/updated-features-section"
import { CommunitySection } from "@/components/landing/community-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { Footer } from "@/components/landing/footer"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="font-serif-renaissance">
        <HeroSection />
        <LeaderboardRegattas />
        <UpdatedFeaturesSection />
        <CommunitySection />
        <PartnersSection />
        <Footer />
      </div>
    </div>
  )
}