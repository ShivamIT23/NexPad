"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react";

export function RegisterPageComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [otp, setOtp] = useState(0);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otpVeri, setOtpVeri] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVeri) {
      alert("Please verify your email before registering.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      alert("You must accept the terms and conditions.");
      return;
    }
  
    // Handle successful registration logic
    console.log('Registration successful with:', { name, email, password });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const verifyCall = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    setOtp(generatedOtp);

    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: generatedOtp }),
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      setSendOtp(true);
    } else {
      alert(result.message);
    }
  };

  const handleOtpVerification = () => {
    if (parseInt(enteredOtp) === otp) {
      setOtpVeri(true);
      alert("OTP Verified!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
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
                />
              </div>
            </div>
            <Button
              onClick={verifyCall}
              type="button"
              className=" w-full group"
              disabled={!email || !isValidEmail(email)}
            >
              Verify Email
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
            ): (
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
        </CardFooter>
      </Card>
    </div>
  );
}
