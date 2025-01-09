"use client";

import Input from "../Util";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useVariant } from "@/context/Variant";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

const LoginPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-2 items-center">
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
          <button
            onClick={() => {
              login(email, password);
              setVariant("home");
            }}
            className="rounded-md py-2 w-[9rem] text-md border-[1px] border-black"
            type="submit"
          >
            Sign In
          </button>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("google", { redirectTo: "/" })}
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
