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
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle login logic here
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setLoading(false);
      console.log(result.error);
    } else {
      setLoading(false)
      router.push("/dashboard");
    }
  };

  if (status === "authenticated") {
    console.log(session);
    return <div>You&apos;re Already Logged In!!</div>;
  }

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
      <Card className={`w-full max-w-md ${loading ? "pointer-events-none" : ""}`}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full group">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
