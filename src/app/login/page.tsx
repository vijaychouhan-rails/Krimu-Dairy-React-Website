"use client";

import { Suspense, useState } from "react";
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Link from "next/link";
import { login, register, verifyOtp } from "@/services/auth";
import { useSearchParams } from "next/navigation";
import { authWrapper } from "@/lib/authWrapper";
import showErrorMessages from "@/lib/errorHandle";
import { BiMobile } from "react-icons/bi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

const LoginRegister = () => {
  // Login state
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register state
  const [fullName, setFullName] = useState("");
  const [registerMobileNo, setRegisterMobileNo] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // OTP modal state
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // Login submit
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!mobileNo || !password) {
        setError("Mobile number and password are required.");
        return;
      }

      const result = await login({ mobileNo, password });
      if (result?.success) {
        // route.push(redirectTo)
        window.location.replace(redirectTo);
      } else {
        showErrorMessages({ error: result.error, action: "auth" });
      }
    };

    // Register submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!fullName || !registerMobileNo || !registerPassword) {
      setRegisterError("All fields are required.");
      return;
    }


    const result = await register({
      name: fullName,
      mobileNo: registerMobileNo,
      password: registerPassword,
      role: "buyer_customer",
    });

    if (result?.success) {
      setIsOtpOpen(true);
    } else {
      showErrorMessages({ error: result.error, action: "auth" });
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpValue || !registerMobileNo || !fullName || !registerPassword) return;

    const result = await verifyOtp({
      mobileNo: registerMobileNo,
      otp: otpValue,
      name: fullName,
      password: registerPassword,
      role: "buyer_customer",
    });

    debugger

    if (result?.success) {

      setIsOtpOpen(false);
      window.location.replace(redirectTo);
    } else {
      showErrorMessages({ error: result.error, action: "auth" });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to DairyFresh</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your account or create a new one
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNo">Mobile Number</Label>
                      <div className="relative">
                        <BiMobile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="mobileNo"
                          type="tel"
                          placeholder="Enter your mobile number"
                          className="pl-10"
                          maxLength={10}
                          value={mobileNo}
                          onChange={(e) => setMobileNo(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerMobileNo">Mobile Number</Label>
                      <div className="relative">
                        <BiMobile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="registerMobileNo"
                          type="tel"
                          placeholder="Enter your mobile number"
                          className="pl-10"
                          maxLength={10}
                          value={registerMobileNo}
                          onChange={(e) => setRegisterMobileNo(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="registerPassword"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>



                    {registerError && <p className="text-red-500 text-sm">{registerError}</p>}

                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              We have sent an OTP to your mobile number. Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <InputOTP maxLength={5} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setIsOtpOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleOtpSubmit} disabled={!otpValue}>
              Verify OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoginRegisterPage = () => (
  <Suspense fallback={null}>
    <LoginRegister />
  </Suspense>
);

export default authWrapper(LoginRegisterPage);
