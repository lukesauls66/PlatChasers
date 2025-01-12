"use client";

import Input from "../Util";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useVariant } from "@/context/Variant";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { Button } from "../ui/button";

export const login = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.error) {
      console.log("Login failed: ", res.error);
      return false;
    }

    console.log("Login successful: ", res);
    return true;
  } catch (error) {
    console.log("ERROR: ", error);
    return false;
  }
};

const LoginPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string | null>(null);

  const handleLogin = async () => {
    const res = await login(email, password);

    if (res) {
      setVariant("home");
    } else {
      setErrors("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-[#e7e7e7] min-h-screen">
      <h1 className="text-2xl py-4 font-semibold">Sign In</h1>
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          {errors && <p className="text-[#ae3634]">{errors}</p>}
          <Button
            onClick={handleLogin}
            variant={"destructive"}
            size={"lg"}
            className="bg-[#53285f]/90 hover:bg-purple-700/80"
          >
            Sign In
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold">DISCLAIMER:</p>
          <p className="flex text-center">
            Please create an account using the email you use with your provider
            (Google, Discord, or Facebook) in order to automatically link
            accounts.
          </p>
          <p>Thank you!</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign in with Google <FcGoogle className="w-7 h-7" />
          </button>
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("discord", { callbackUrl: "/" })}
          >
            Sign in with Discord
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
              <FaDiscord className="text-white" />
            </div>
          </button>
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            Sign in with Facebook{" "}
            <FaFacebook className="w-7 h-7 text-blue-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-.5">
          <p>Don't have an account?</p>
          <span
            onClick={() => setVariant("register")}
            className="hover:underline cursor-pointer font-bold"
          >
            Create an Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
