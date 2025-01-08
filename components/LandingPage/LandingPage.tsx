"use client";

import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import { useVariant } from "@/context/Variant";

const LandingPage = () => {
  const { variant } = useVariant();

  // const toggleVariant = useCallback(() => {
  //   setVariant((currVariant: string) =>
  //     currVariant === "login" ? "register" : "login"
  //   );
  // }, [variant]);

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
  <h1>PlatChasers</h1>;
};

export default LandingPage;
