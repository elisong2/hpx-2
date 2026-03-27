"use client";

import { signInWithGoogle } from "@/utils/auth-actions";
import React from "react";

// delete
const SignInWithGoogleButton = () => {
  return (
    <button
      type="button"
      //   variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      Login with Google
    </button>
  );
};

export default SignInWithGoogleButton;
