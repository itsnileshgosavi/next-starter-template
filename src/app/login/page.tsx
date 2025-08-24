import { Suspense } from "react";
import LoginFormComponent from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};



export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-purple-200">
        <div className="p-8 rounded-xl bg-white shadow-2xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginFormComponent />
    </Suspense>
  );
}
