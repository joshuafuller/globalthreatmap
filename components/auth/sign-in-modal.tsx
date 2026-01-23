"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { initiateOAuthFlow, isOAuthConfigured } from "@/lib/oauth";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ValyuLogoWithText() {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4L4 20h16L12 4z" />
      </svg>
      <span className="font-semibold tracking-wide">VALYU</span>
    </div>
  );
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValyuSignIn = async () => {
    setIsLoading(true);
    setError(null);

    // Check if OAuth is configured
    if (!isOAuthConfigured()) {
      setError(
        "OAuth is not configured. Please contact the administrator or use self-hosted mode."
      );
      setIsLoading(false);
      return;
    }

    try {
      // Initiate PKCE OAuth flow
      await initiateOAuthFlow();
    } catch (err) {
      console.error("OAuth initiation error:", err);
      setError("Failed to initiate sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <DialogHeader onClose={handleClose}>
        <DialogTitle className="text-center text-xl">
          Sign in with Valyu
        </DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Valyu is the information backbone of Global Threat Map, giving our app
          access to real-time data across web, academic, and proprietary
          sources.
        </p>

        {/* Free Credits Banner */}
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              $10 Free Credits
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            New accounts get $10 in free search credits
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <Button
          onClick={handleValyuSignIn}
          disabled={isLoading}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Redirecting to Valyu...
            </>
          ) : (
            <>
              <span className="mr-2">Sign in with</span>
              <ValyuLogoWithText />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account? You can create one during sign-in.
        </p>
      </DialogContent>
    </Dialog>
  );
}
