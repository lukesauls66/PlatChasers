"use client";

import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import HomePage from "../HomePage/HomePage";
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

  return (
    <div className="bg-[#e7e7e7] min-h-screen">
      {variant === "home" ? (
        <HomePage />
      ) : variant === "login" ? (
        <LoginPage />
      ) : (
        <SignupPage />
      )}
    </div>
  );
};

export default LandingPage;
