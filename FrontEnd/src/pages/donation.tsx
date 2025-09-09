import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Heart, DollarSign, Loader2, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import SoraLogo from "@/components/SoraLogo";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY);
const API_BASE = import.meta.env.REACT_APP_BACKEND_URL;

export default function DonationPage() {
    const [amount, setAmount] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleDonate = async () => {
        try {
            setLoading(true);
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe failed to load");

            const response = await fetch(
                `${API_BASE}/api/donation-stripe/create-donation-session`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                }
            );

            const data = await response.json();

            if (response.ok && data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                throw new Error(data.error || "Failed to start donation session");
            }
        } catch (err: any) {
            toast({
                title: "Donation Error",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sora-dark to-sora-teal/30 p-6">
            <Card className="w-full max-w-lg bg-sora-card/90 border-sora-teal/40 shadow-xl rounded-2xl p-6 text-center">
                <CardHeader>
                    <div className="flex flex-col items-center">
                        <SoraLogo />
                        <p className="text-gray-300 mt-2">
                            Every donation helps us keep building tools for neurodivergent users.
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Donation Input */}
                    <div className="flex items-center justify-center gap-2">
                        <DollarSign className="text-sora-teal w-5 h-5" />
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-32 px-4 py-2 rounded-lg text-center border border-sora-teal/40 bg-transparent text-white text-lg font-semibold focus:ring-2 focus:ring-sora-teal outline-none"
                        />
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="flex justify-center gap-3 flex-wrap">
                        {[5, 10, 20, 50].map((val) => (
                            <Button
                                key={val}
                                variant={amount === val ? "default" : "outline"}
                                onClick={() => setAmount(val)}
                                className={`px-4 py-2 ${amount === val
                                        ? "bg-sora-teal text-sora-dark"
                                        : "text-white border-sora-teal/40"
                                    }`}
                            >
                                ${val}
                            </Button>
                        ))}
                    </div>

                    {/* Donate Button */}
                    <Button
                        onClick={handleDonate}
                        disabled={loading || amount <= 0}
                        className="w-full bg-gradient-to-r from-sora-teal to-sora-orange hover:opacity-90 text-sora-dark font-bold py-3 text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" /> Redirecting...
                            </>
                        ) : (
                            <>
                                <Heart className="w-5 h-5" /> Donate ${amount}
                            </>
                        )}
                    </Button>

                    {/* Cancel Button */}
                    <Button
                        variant="outline"
                        onClick={() => navigate("/app")}
                        className="w-full border-sora-teal/40 text-gray-300 hover:bg-sora-dark/60 flex items-center justify-center gap-2 mt-2"
                    >
                        <XCircle className="w-5 h-5" /> Cancel
                    </Button>

                    {/* Impact Message */}
                    <p className="text-sm text-gray-400 mt-4">
                        💜 Your generosity helps keep SORA free and accessible for everyone.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
