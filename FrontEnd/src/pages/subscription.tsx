import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY)
const API_BASE = import.meta.env.REACT_APP_BACKEND_URL

const SubscriptionSection = () => {
  console.log(stripePromise)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 🧾 Handle Stripe checkout
  const handleSubscribe = async () => {
    const stripe = await stripePromise
    if (!stripe) {
      toast({
        title: "Stripe Error",
        description: "Stripe failed to load. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    const token = localStorage.getItem("authToken")
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe.",
        variant: "destructive",
      })
      navigate("/auth")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const session = await response.json()

      if (response.ok && session.url) {
        window.location.href = session.url
      } else {
        throw new Error(session.message || "Could not initiate checkout session.")
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "Something went wrong during checkout.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br to-sora-dark flex items-center justify-center p-4 mt-20">
      <Card className="w-full max-w-2xl bg-sora-card border-sora-teal/20 shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent mb-2">
            SORA Personal
          </h1>
          <CardTitle className="text-3xl text-white mb-4">Your 24/7 Neurodivergent Ally</CardTitle>
          <p className="text-gray-300 text-5xl font-extrabold mb-2">
            $14<span className="text-xl font-normal text-gray-400">/month</span>
          </p>
          <p className="text-sora-teal text-lg font-semibold">Launch special - first 6 months</p>
          <p className="text-gray-400 text-sm mt-1">Then $19/month</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-3">What's Included:</h3>
          <ul className="space-y-2 text-gray-300">
            {[
              "Unlimited AI companion conversations",
              "Energy pattern tracking & insights",
              "Shutdown prevention & early warnings",
              "Hyperfocus optimization tools",
              "Sensory overload management",
              "Spoon Theory integration",
              "Crisis support protocols",
              "Mobile app access",
              "Masking recovery guidance",
              "Personalized accommodation strategies",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> {item}
              </li>
            ))}
          </ul>
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3 text-lg mt-6 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-5 h-5" /> Redirecting to Stripe...
              </>
            ) : (
              "Start Your Journey – $14/month →"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/chattrials")}
            className="w-full text-white font-semibold py-3 text-lg"
          >
            Try Free Chat Trials
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubscriptionSection
