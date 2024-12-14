"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import useLoading from "@/hooks/useLoading";
import { startAuthentication } from "@simplewebauthn/browser";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/api.service";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const { isLoading, setLoading } = useLoading();
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!username) {
      toast.error("Please enter Username");
      return;
    }
    setLoading(true);
    try {
      const {data : OptionsResponse} = await axiosInstance.post(`/auth/authenticate/start/${username}`);

      const credential = await startAuthentication({ optionsJSON: OptionsResponse.publicKey });

      if (!credential) {
        toast.error("Failed to verify Passkey");
      }
      const {data : response} = await axiosInstance.post(`/auth/authenticate/finish/${username}`, credential);
      toast.success(response);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Signin Failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="sainath@19"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? "Signing in.." : "Sign in with Passkey"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
