"use client";

import Input from "../Util";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { useVariant } from "@/context/Variant";

const LoginPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useCallback(async () => {
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
  }, [email, password]);

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault;

  //   try {
  //     await signIn("credentials", {
  //       email,
  //       password,
  //     });
  //   } catch (error) {
  //     console.log("ERROR: ", error);
  //   }
  // };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-4xl mb-8 font-semibold">Sign In</h1>
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
            login();
            setVariant("home");
          }}
          className="rounded-md py-2 w-[9rem] text-md border-[1px] border-black"
          type="submit"
        >
          Sign In
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={() => signIn("google", { redirectTo: "/" })}>
          Sign in with Google
        </button>
        <button onClick={() => signIn("discord", { callbackUrl: "/" })}>
          Sign in with Discord
        </button>
        <button onClick={() => signIn("facebook", { callbackUrl: "/" })}>
          Sign in with Facebook
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
  );
};

export default LoginPage;
