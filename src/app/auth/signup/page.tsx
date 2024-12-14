"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startRegistration } from "@simplewebauthn/browser";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/api.service";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);


  const handleRegister = async () => {
    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    setIsRegistering(true);
    try {
      const {data : SignupResponse} = await axiosInstance.post(`/auth/register/start/${username}`);

      const credential = await startRegistration({ optionsJSON: SignupResponse.publicKey });

      if (!credential) {
        toast.error("Failed to create credentials");
        return;
      }

      const {data : response} = await axiosInstance.post(`/auth/register/finish/${username}`, credential);
      toast.success(response);
    } catch (err: any) {
      toast.error(err.data?.message || "SignUp Failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sainath@19"
              required
            />
          </div>
          <Button onClick={handleRegister} disabled={isRegistering} className="w-full">
            {isRegistering ? "Registering..." : "Sign up with Passkey"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}