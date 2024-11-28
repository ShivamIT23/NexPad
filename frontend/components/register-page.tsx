"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signup } from "@/app/lib/actions/register";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function RegisterPageComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otpVeri, setOtpVeri] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const verifyCall = async () => {
    setLoading(true);
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    setCanResend(false);

    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      setSendOtp(true);
      setLoading(false);
    } else {
      alert(result.message);
      setLoading(false);
    }
  };

  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedVerifyCall = useCallback(debounce(verifyCall, 500), [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otpVeri) {
      alert("Please verify your email before registering.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!acceptTerms) {
      alert("You must accept the terms and conditions.");
      setLoading(false);
      return;
    }

    // Handle successful registration logic

    try {
      const response = await signup(name, email, password);
      setLoading(false);
      if (response == "Signed up!") {
        try {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          if (result?.error) {
            setLoading(false);
            console.log(result.error);
            alert("Registeration Done! Please Signin");
            router.push("/login");
          } else {
            setLoading(false);
            router.push("/dashboard");
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
          alert("Registeration Done! Please Signin");
          router.push("/login");
        }
      }
      alert(response);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Error while registeration");
    }
  };

  const handleOtpVerification = async () => {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, enteredOtp }),
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      setOtpVeri(true);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    if (sendOtp) {
      const timer = setTimeout(() => setCanResend(true), 60000); // 60 seconds
      return () => clearTimeout(timer);
    }
  }, [sendOtp]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm pointer-events-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            className="w-40 h-40"
          >
            <defs>
              <radialGradient id="outer-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#4e9eff" stop-opacity="0.8" />
                <stop offset="70%" stop-color="#0040ff" stop-opacity="0.5" />
                <stop offset="100%" stop-color="transparent" />
              </radialGradient>
              <linearGradient
                id="ring-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#00f0ff" />
                <stop offset="100%" stop-color="#0040ff" />
              </linearGradient>
            </defs>
            <circle
              cx="200"
              cy="200"
              r="170"
              fill="none"
              stroke="url(#outer-glow)"
              stroke-width="20"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="url(#ring-gradient)"
              stroke-width="12"
              stroke-dasharray="942"
              stroke-dashoffset="0"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="-360 200 200"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="942"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="200"
              cy="200"
              r="100"
              fill="none"
              stroke="#0ff"
              stroke-width="10"
              stroke-opacity="0.6"
              stroke-dasharray="628"
              stroke-dashoffset="0"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.4;0.8;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="200" cy="200" r="15" fill="#0ff" opacity="0.8">
              <animate
                attributeName="r"
                values="12;20;12"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}
      <Card
        className={`w-full max-w-md ${loading ? "pointer-events-none" : ""}`}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={sendOtp}
                />
              </div>
            </div>
            <Button
              onClick={debouncedVerifyCall}
              type="button"
              className=" w-full group"
              disabled={!email || !isValidEmail(email) || sendOtp}
            >
              Verify Email
            </Button>
            <Button
              onClick={debouncedVerifyCall}
              type="button"
              className="w-full"
              disabled={!canResend}
            >
              Resend OTP
            </Button>
            {sendOtp && !otpVeri && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    placeholder="1234"
                    className="pl-10"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    required
                  />
                </div>
                <Button
                  onClick={handleOtpVerification}
                  type="button"
                  className="w-full"
                >
                  Verify OTP
                </Button>
              </div>
            )}
            {otpVeri ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Please verify your email to set your name and password.
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                <a href="#" className="text-primary hover:underline">
                  terms and conditions
                </a>
              </Label>
            </div>
            <Button type="submit" className="w-full group" disabled={!otpVeri}>
              Register
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </p>
          {sendOtp && (
            <p className="text-end text-sm text-gray-600 mt-2 ml-auto">
              <a
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Change Email
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
