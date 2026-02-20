import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { KeyRound, ArrowLeft } from "lucide-react";
import { authApi } from "@/api/auth";

const DEV_OTP_HINT = "123456";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSent(true);
      toast.success((res as { message?: string }).message || "If an account exists, an OTP has been sent.");
      const hint = (res as { otpHint?: string }).otpHint;
      if (hint) setOtpHint(hint);
      else setOtpHint(DEV_OTP_HINT);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {sent
              ? "Use the OTP below to reset your password. (SMTP will send it by email later.)"
              : "Enter your admin email to receive a one-time code to reset your password."}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@lovetoday.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
              <Link to="/login" className="flex items-center gap-1 text-sm text-primary hover:underline">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent className="space-y-4">
              {otpHint && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium text-foreground mb-1">For development, use this OTP:</p>
                  <p className="font-mono text-lg">{otpHint}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`)}
                  >
                    Go to Reset Password
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button variant="outline" className="w-full" onClick={() => { setSent(false); setOtpHint(null); }}>
                Request again
              </Button>
              <Link to="/login" className="flex items-center gap-1 text-sm text-primary hover:underline">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
