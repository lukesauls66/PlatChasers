"use client";

import { useVariant } from "@/context/Variant";

const SignupPage: React.FC = () => {
  const { setVariant } = useVariant();

  return (
    <div>
      <h1 className="text-4xl mb-8 font-semibold">Create an Account</h1>;
      <div>
        <p>Already have an account?</p>
        <span
          onClick={() => setVariant("login")}
          className="hover:underline cursor-pointer font-bold"
        >
          Sign in!
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
