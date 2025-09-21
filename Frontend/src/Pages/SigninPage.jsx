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

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const BackendURL = import.meta.env.VITE_backendURL;
    axios.post(
        `${BackendURL}/user/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
    )
    .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
    })
    .catch((error) => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError("Something went wrong, please try again");
        }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
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
                    placeholder="m@example.com"
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
            <CardAction>
              <Button variant="link" onClick={() => navigate("/signup")}>Sign Up</Button>
            </CardAction>
          </CardFooter>
        </Card>
    </div>
  )
}

export default SigninPage