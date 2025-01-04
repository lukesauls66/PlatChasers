"use client";

import { signIn } from "next-auth/react";

const LogIn: React.FC = () => {
  return (
    <div className="flex flex-col">
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("discord")}>Sign in with Discord</button>
      <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
    </div>
  );
};

export default LogIn;
