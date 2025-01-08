"use client";

import { signIn } from "next-auth/react";

const LoginPage: React.FC = () => {
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
    <div className="flex flex-col">
      <form action={credentialsAction} className="flex flex-col gap-3">
        <label htmlFor="credentials-email">
          Email
          <input
            className="
          block
          rounded-md
          px-6
          pt-6
          pb-1
          w-full
          text-md
          appearance-none
          focus:outline-none
          focus:ring-0
          peer
          border-[1px]
          border-black
          "
            type="email"
            id="credentials-email"
            name="email"
          />
        </label>
        <label htmlFor="credentials-password">
          Password
          <input
            className="
          block
          rounded-md
          px-6
          pt-6
          pb-1
          w-full
          text-md
          appearance-none
          focus:outline-none
          focus:ring-0
          peer
          border-[1px]
          border-black
          "
            type="password"
            id="credentials-password"
            name="password"
          />
        </label>
        <input
          className="
          block
          rounded-md
          px-6
          pt-6
          pb-1
          w-full
          text-md
          appearance-none
          focus:outline-none
          focus:ring-0
          peer
          border-[1px]
          border-black
          "
          type="submit"
          value="Sign In"
        />
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
    </div>
  );
};

export default LoginPage;
