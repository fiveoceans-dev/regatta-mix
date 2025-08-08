import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlowingButton } from "@/components/ui/glowing-button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const heroImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1566053530509-1b4b1cc6c09d?w=1920&h=800&fit=crop",
    alt: "Sailing catamarans racing at sunset"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=800&fit=crop",
    alt: "SailGP racing boats"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=800&fit=crop",
    alt: "Yacht racing in open ocean"
  }
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-hero">
      {/* Hero Carousel */}
      <div className="absolute inset-0">
        {!imagesLoaded && (
          <Skeleton className="w-full h-full" />
        )}
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              onLoad={() => setImagesLoaded(true)}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Top Online Sailing Game
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Practice your sailing strategy online
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <GlowingButton
              variant="play"
              onClick={() => setShowVideo(!showVideo)}
              className="animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Play className="mr-2 h-6 w-6" />
              {showVideo ? "Close Video" : "Play Now"}
            </GlowingButton>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal/Overlay */}
      {showVideo && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="relative w-full max-w-4xl mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setShowVideo(false)}
            >
              ×
            </Button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full h-full"
                allowFullScreen
                title="Sailing Game Trailer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}