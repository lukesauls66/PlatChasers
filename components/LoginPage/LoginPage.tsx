"use client";

import { Input } from "../Util";
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
      return false;
    }

    return true;
  } catch (error) {
    console.error("ERROR: ", error);
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

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    const res = await login(demoEmail, demoPassword);

    if (res) {
      setVariant("home");
    } else {
      setErrors("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-2 pb-5 px-3 items-center bg-[#e7e7e7] min-h-screen w-full">
      <h1 className="text-2xl md:text-3xl xl:text-4xl py-4 font-semibold">
        Sign In
      </h1>
      <div className="flex flex-col gap-6 sm:gap-[3rem] items-center w-full">
        <div className="flex flex-col items-center gap-5 sm:gap-8 w-full">
          <div className="flex flex-col items-center gap-1 w-full px-8">
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              className="w-full md:text-xl lg:text-2xl"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              className="w-full md:text-xl lg:text-2xl"
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
            className="bg-[#53285f]/90 hover:bg-purple-700/80 md:text-lg"
          >
            Sign In
          </Button>
        </div>

        <div className="flex justify-between w-full max-w-[25rem]">
          <Button
            onClick={() =>
              handleDemoLogin("demo-good@example.com", "password1")
            }
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5.8rem] md:w-[7rem] md:text-lg"
          >
            Good User
          </Button>
          <Button
            onClick={() => handleDemoLogin("demo-bad@example.com", "password2")}
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5.8rem] md:w-[7rem] md:text-lg"
          >
            Bad User
          </Button>
          <Button
            onClick={() =>
              handleDemoLogin("demo-admin@example.com", "password3")
            }
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5.8rem] md:w-[7rem] md:text-lg"
          >
            Demo Admin
          </Button>
        </div>

        <div className="flex flex-col items-center sm:text-lg gap-1 w-full max-w-[38rem]">
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
            Sign in with Google{" "}
            <FcGoogle className="w-7 h-7 md:w-[2.5rem] md:h-[2.5rem]" />
          </button>
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("discord", { callbackUrl: "/" })}
          >
            Sign in with Discord
            <div className="w-7 h-7 md:w-[2.5rem] md:h-[2.5rem] bg-blue-600 rounded-full flex items-center justify-center">
              <FaDiscord className="text-white md:w-[1.5rem] md:h-[1.5rem]" />
            </div>
          </button>
          <button
            className="flex flex-col-reverse gap-1 items-center text-xl"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            Sign in with Facebook{" "}
            <FaFacebook className="w-7 h-7 md:w-[2.5rem] md:h-[2.5rem] text-blue-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-.5 sm:gap-1.5">
          <p className="sm:text-lg">Don&apos;t have an account?</p>
          <span
            onClick={() => setVariant("register")}
            className="hover:underline cursor-pointer font-bold sm:text-lg"
          >
            Create an Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
