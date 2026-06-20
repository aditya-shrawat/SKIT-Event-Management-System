import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUser } from '@/Context/UserContext';

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const BackendURL = import.meta.env.VITE_backendURL;

    try {
      await axios.post(
        `${BackendURL}/user/signin`,
        { email, password },
        { withCredentials: true }
      );

      // fetch user and update context immediately
      const res = await axios.get(`${BackendURL}/user/me`, {
        withCredentials: true,
      });
      setUser(res.data);

      navigate("/");

    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="flex items-center justify-center">
              <img src="/logo.png" className="h-24 w-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#A94442]">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
              </div>
            </form>
            {error && error.trim() !== "" && (
              <div>
                <p className="text-sm text-red-600 mt-2">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" onClick={handleSignIn} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
            <CardAction className="w-full flex justify-center">
              <p className="text-sm text-muted-foreground mt-2">
                Don't have an account?{" "}
                <span
                  className="text-primary underline cursor-pointer underline-offset-4"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </CardAction>
          </CardFooter>
        </Card>
    </div>
  )
}

export default SigninPage