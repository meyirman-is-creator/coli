"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClientTranslation } from "@/i18n/client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { verifyEmail } from "@/store/slices/authSlice";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { status, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Get email from URL params
  const emailFromParams = searchParams.get("email");
  
  const [email, setEmail] = useState(emailFromParams || "");
  const [code, setCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!email || !code) {
      toast.error(t("auth.allFieldsRequired") || "All fields are required");
      return;
    }
    
    try {
      // Dispatch verify email action
      const resultAction = await dispatch(verifyEmail({ 
        email, 
        code 
      }));
      
      // Check if verification was successful
      if (verifyEmail.fulfilled.match(resultAction)) {
        setIsSubmitted(true);
        toast.success(t("auth.emailVerified") || "Email verified successfully");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };
  
  const handleResendCode = async () => {
    if (!email) {
      toast.error(t("auth.emailRequired") || "Email is required");
      return;
    }
    
    try {
      // In a real app, you'd dispatch an action to resend code
      // For demo purposes, we'll just show a success toast
      toast.success(t("auth.codeSent") || "Verification code sent");
    } catch (err) {
      console.error("Failed to resend code:", err);
    }
  };
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-16rem)] py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.verifyAccount")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.verifyAccountDescription")}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("auth.accountVerified")}</h3>
                <p className="text-muted-foreground">
                  {t("auth.accountVerifiedDescription")}
                </p>
              </div>
              
              <Button 
                className="w-full" 
                asChild
              >
                <Link href="/login">
                  {t("auth.proceedToLogin")}
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={!!emailFromParams}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">{t("auth.code")}</Label>
                <Input 
                  id="code" 
                  placeholder="123456" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("auth.verifying")}
                  </span>
                ) : (
                  t("auth.verifyCode")
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("auth.didntReceiveCode")}
                </p>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-xs"
                >
                  {t("auth.resendCode")}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {!isSubmitted && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                {t("auth.backToLogin")}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}