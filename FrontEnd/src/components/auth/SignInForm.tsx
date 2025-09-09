"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export const SignInForm = () => {
  const [mode, setMode] = useState<"signin" | "forgot" | "reset">("signin")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = useAuth()

  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`

  const safeJson = async (res: Response) => {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  // 🔑 Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(email, password)
      toast({ title: "Welcome back!", description: "Signed in successfully." })
      navigate("/donation")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // 📧 Request OTP
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data?.message || "Failed to send OTP")

      toast({ title: "OTP Sent", description: "Check your email for the OTP." })
      setMode("reset") // switch to reset mode
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔐 Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data?.message || "Failed to reset password")

      toast({ title: "Password Reset", description: "You can now sign in." })
      setMode("signin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={
        mode === "signin"
          ? handleSignIn
          : mode === "forgot"
          ? handleForgotPassword
          : handleResetPassword
      }
      className="space-y-4"
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Shared Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Sign In Mode */}
      {mode === "signin" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p
            className="text-sm text-blue-600 cursor-pointer text-center"
            onClick={() => setMode("forgot")}
          >
            Forgot Password?
          </p>
        </>
      )}

      {/* Forgot Password Mode */}
      {mode === "forgot" && (
        <>
          <p className="text-sm text-gray-600">
            Enter your email to receive a reset OTP.
          </p>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>

          <p
            className="text-sm text-gray-600 cursor-pointer text-center"
            onClick={() => setMode("signin")}
          >
            Back to Sign In
          </p>
        </>
      )}

      {/* Reset Password Mode */}
      {mode === "reset" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <p
            className="text-sm text-gray-600 cursor-pointer text-center"
            onClick={() => setMode("signin")}
          >
            Back to Sign In
          </p>
        </>
      )}
    </form>
  )
}
