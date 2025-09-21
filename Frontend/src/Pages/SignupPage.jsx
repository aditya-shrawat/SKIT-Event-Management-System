import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [selectedRole, setSelectedRole] = useState(null); // 'student' or 'admin'

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Inside handle signup");

    const role = (selectedRole === "admin") ? "admin" : "student";

    const BackendURL = import.meta.env.VITE_backendURL;
    axios.post(
        `${BackendURL}/user/signup`,
        {
          email,password,name,collegeId,branch,role,
        },
        { withCredentials: true }
    )
    .then((response) => {
        if (response.status === 201) {
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
      {
        (selectedRole === null) ? (
        <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Select your role to get started
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-6">
          <Button className="w-full" onClick={() => setSelectedRole("student")}>
            Student
          </Button>
          <Button className="w-full" onClick={() => setSelectedRole("admin")}>
            Admin
          </Button>
        </CardFooter>
      </Card>
        )
        :
        (
          <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{`Sign Up as ${selectedRole}`}</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
          {/* <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction> */}
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
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collegeId">College Id</Label>
                <Input
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  id="collegeId"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  id="branch"
                  type="text"
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
          <Button type="submit" onClick={handleSignUp} className="w-full">
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
          {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          <CardAction>
            <Button variant="link">Login</Button>
          </CardAction>
        </CardFooter>
      </Card>
        )
      }
    </div>
  );
};

export default SignupPage;
