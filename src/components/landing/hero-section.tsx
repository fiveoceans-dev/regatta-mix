import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { OvalButton } from "@/components/ui/oval-button"
import { AuthDialog } from "@/components/ui/auth-dialog"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const heroImages = [
  {
    id: 1,
    url: "https://placehold.co/1920x800/blue/white?text=Hero",
    alt: "Sailing catamarans racing at sunset"
  },
  {
    id: 2,
    url: "https://placehold.co/1920x800/blue/white?text=Hero",
    alt: "SailGP racing boats"
  },
  {
    id: 3,
    url: "https://placehold.co/1920x800/blue/white?text=Hero",
    alt: "Yacht racing in open ocean"
  }
]

export function HeroSection() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // TODO: Replace with actual auth state

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
  
  const handlePlayClick = () => {
    if (isLoggedIn) {
      navigate('/play')
    }
    // If not logged in, the AuthDialog will handle login/register
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate('/play')
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-20 h-24"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-12 w-12" />
      </Button>
      <Button
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-20 h-24"
        onClick={nextSlide}
      >
        <ChevronRight className="h-12 w-12" />
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
          <h1 className="text-5xl md:text-7xl font-serif-renaissance font-bold mb-6 animate-fade-in-up text-primary">
            Cyber Sailing
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 animate-fade-in-up font-serif-body" style={{ animationDelay: "0.2s" }}>
            Master the art of virtual sailing racing
          </p>
          
          <div className="flex justify-center items-center">
            {isLoggedIn ? (
              <OvalButton 
                onClick={handlePlayClick}
                className="animate-fade-in-up"
              >
                <Play className="mr-2 h-5 w-5" />
                Play Now
              </OvalButton>
            ) : (
              <AuthDialog onSuccess={handleLoginSuccess}>
                <OvalButton 
                  className="animate-fade-in-up"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Racing
                </OvalButton>
              </AuthDialog>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}