"use client";

import axios from "axios";
import Input from "../Util";
import { login } from "../LoginPage/LoginPage";
import { useCallback, useState } from "react";
import { useVariant } from "@/context/Variant";

const SignupPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = useCallback(async () => {
    try {
      await axios.post(`/api/register`, {
        firstName,
        lastName,
        email,
        username,
        password,
      });

      login(email, password);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }, [firstName, lastName, email, username, password, login]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-2xl py-4 font-semibold">Create an Account</h1>
      <div className="flex flex-col gap-14 items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Input
              label="First Name"
              type="firstName"
              id="firstName"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
            />
            <Input
              label="Last Name"
              type="lastName"
              id="lastName"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
            />
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
              label="Username"
              type="username"
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
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
            className="rounded-md py-2 w-[9rem] text-md border-[1px] border-black"
            type="submit"
            onClick={() => {
              register();
              setVariant("home");
            }}
          >
            Create account
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Already have an account?</p>
          <span
            onClick={() => setVariant("login")}
            className="hover:underline cursor-pointer font-bold"
          >
            Sign in!
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
