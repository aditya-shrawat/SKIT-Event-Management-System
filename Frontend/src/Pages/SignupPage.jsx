import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "CE", "AI", "DS", "IOT"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeId: "",
    branch: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSelectChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (!form.branch) {
      return setError("Please select your branch.");
    }
    if (selectedRole === "student" && !form.semester) {
      return setError("Please select your semester.");
    }

    if (!/^[A-Z][0-9]{6}$/.test(form.collegeId)) {
      return setError("College ID must be in the format B230709");
    }

    setIsLoading(true);
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      await axios.post(`${BackendURL}/user/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        collegeId: form.collegeId,
        branch: form.branch,
        semester: form.semester,
        role: selectedRole,
      });
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection
  if (selectedRole === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
              <div className="flex items-center justify-center">
                <img src="/logo.png" className="h-24 w-auto" />
              </div>
            <CardTitle className="text-2xl font-bold text-[#A94442]">Create Account</CardTitle>
            <CardDescription>Select your role to get started</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-3">
            <Button className="w-full" size="lg" onClick={() => setSelectedRole("student")}>
              Student
            </Button>
            <Button className="w-full" size="lg" variant="outline" onClick={() => setSelectedRole("admin")}>
              Admin (Teacher)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <span
                className="text-primary underline cursor-pointer underline-offset-4"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Signup form
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center justify-center">
            <img src="/logo.png" className="h-24 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#A94442]">
            Sign Up as {selectedRole === "admin" ? "Admin" : "Student"}
          </CardTitle>
          <CardDescription>
            Fill in your details to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">

            {/* Name + College ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collegeId">College ID</Label>
                <Input
                  id="collegeId"
                  name="collegeId"
                  type="text"
                  placeholder="B23XXXX"
                  value={form.collegeId}
                  onChange={handleChange}
                  maxLength={7}
                  pattern="[A-Z][0-9]{6}"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Branch + Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 w-full">
                <Label>Branch</Label>
                <Select onValueChange={(val) => handleSelectChange("branch", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Only show semester for students */}
              {selectedRole === "student" && (
                <div className="grid gap-2 w-full">
                  <Label>Semester</Label>
                  <Select onValueChange={(val) => handleSelectChange("semester", val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map((s) => (
                        <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="text-primary underline cursor-pointer underline-offset-4"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;