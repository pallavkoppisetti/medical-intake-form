import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "./AuthLayout";

export function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    newPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (error) setError("");
      if (success) setSuccess("");
    };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Doctor mail is required");
      return false;
    }
    if (!formData.tempPassword) {
      setError("Temporary password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://ceform-api.ezfylr.ai/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            tempPassword: formData.tempPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setSuccess("Password reset successfully! You can now sign in with your new password.");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and temporary password to set a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 text-green-500 border-green-500/20 rounded-lg border p-3 text-sm">
                {success}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Doctor Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tempPassword">Temporary Password</Label>
              <Input
                id="tempPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.tempPassword}
                onChange={handleInputChange("tempPassword")}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.newPassword}
                onChange={handleInputChange("newPassword")}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/" className="underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
