"use client";

import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import { useVariant } from "@/context/Variant";

const LandingPage = () => {
  const { variant } = useVariant();

  console.log("VARIANT: ", variant);

  return (
    <div>
      {variant === "home" ? (
        <h1>PlatChasers</h1>
      ) : variant === "login" ? (
        <LoginPage />
      ) : (
        <SignupPage />
      )}
    </div>
  );
};

export default LandingPage;
