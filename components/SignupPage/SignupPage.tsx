"use client";

import axios from "axios";
import { Input } from "../Util";
import { login } from "../LoginPage/LoginPage";
import { useCallback, useState } from "react";
import { useVariant } from "@/context/Variant";
import { Button } from "../ui/button";

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: React.FC = () => {
  const { setVariant } = useVariant();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  console.log("Errors: ", errors);

  const register = useCallback(async () => {
    setErrors({});
    const validationErrors: ValidationErrors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!firstName) {
      validationErrors.firstName = "First name is required";
    }
    if (firstName && firstName[0] !== firstName[0].toUpperCase()) {
      validationErrors.firstName = "First name must be capitalized";
    }
    if (!lastName) {
      validationErrors.lastName = "Last name is required";
    }
    if (lastName && lastName[0] !== lastName[0].toUpperCase()) {
      validationErrors.lastName = "First name must be capitalized";
    }
    if (!emailRegex.test(email)) {
      validationErrors.email = "Must be a valid email";
    }
    if (username.length < 6) {
      validationErrors.username = "Username must be at least 6 characters";
    }
    if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }
    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords must match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`/api/register`, {
        firstName,
        lastName,
        email,
        username,
        password,
      });

      login(email, password);
      setVariant("home");
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }, [firstName, lastName, email, username, password, login]);

  return (
    <div className="flex flex-col gap-2 items-center bg-[#e7e7e7] min-h-screen">
      <h1 className="text-2xl py-4 font-semibold">Create an Account</h1>
      <div className="flex flex-col gap-7 items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Input
              label="First Name"
              type="firstName"
              id="firstName"
              value={firstName}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
            />
            {errors?.firstName && (
              <p className="text-[#ae3634]">{errors?.firstName}</p>
            )}
            <Input
              label="Last Name"
              type="lastName"
              id="lastName"
              value={lastName}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
            />
            {errors?.lastName && (
              <p className="text-[#ae3634]">{errors?.lastName}</p>
            )}
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            {errors?.email && <p className="text-[#ae3634]">{errors?.email}</p>}
            <Input
              label="Username"
              type="username"
              id="username"
              value={username}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            {errors?.username && (
              <p className="text-[#ae3634]">{errors?.username}</p>
            )}
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {errors?.password && (
              <p className="text-[#ae3634]">{errors?.password}</p>
            )}
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
            {errors?.confirmPassword && (
              <p className="text-[#ae3634]">{errors?.confirmPassword}</p>
            )}
          </div>
          <Button
            onClick={() => {
              register();
            }}
            variant={"destructive"}
            size={"lg"}
            className="bg-[#53285f]/90 hover:bg-purple-700/80"
          >
            Create Account
          </Button>
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
