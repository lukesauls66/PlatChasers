"use client";

import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import { useVariant } from "@/context/Variant";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const { variant, setVariant } = useVariant();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const queryParams = new URLSearchParams(window.location.search);
      const variantQuery = queryParams.get("Variant");

      if (variantQuery) {
        setVariant(variantQuery);
      }
    }
  }, [isClient, setVariant]);

  if (!isClient) {
    return null;
  }

  console.log("VARIANT: ", variant);

  return (
    <div className="bg-[#e7e7e7] min-h-screen">
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
