"use client";

import Input from "../Util";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useVariant } from "@/context/Variant";

const LoginPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const credentialsAction = (formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    signIn("credentials", {
      callbackUrl: "/",
      ...data,
    });
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-4xl mb-8 font-semibold">Sign In</h1>

      <form
        action={credentialsAction}
        className="flex flex-col gap-3 items-center"
      >
        <Input
          label="email"
          type="email"
          id="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Input
          label="password"
          type="password"
          id="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <button
          className="rounded-md px-6 pt-6 pb-1 w-[15rem] text-md appearance-none focus:outline-none focus:ring-0 border-[1px] border-black"
          type="submit"
        >
          Sign In
        </button>
      </form>

      <div className="flex flex-col gap-2">
        <button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign in with Google
        </button>
        <button onClick={() => signIn("discord", { callbackUrl: "/" })}>
          Sign in with Discord
        </button>
        <button onClick={() => signIn("facebook", { callbackUrl: "/" })}>
          Sign in with Facebook
        </button>
      </div>

      <div>
        <p>Don't have an account?</p>
        <span
          onClick={() => setVariant("register")}
          className="hover:underline cursor-pointer font-bold"
        >
          Create an Account
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
