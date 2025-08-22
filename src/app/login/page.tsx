"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const error = params.get("error");
  console.log(error);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-purple-200">
      <div className="p-8 rounded-xl bg-white shadow-2xl flex flex-col items-center">
        <h1 className="mb-6 font-bold text-3xl text-indigo-600">Sign in to your account</h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-3 text-lg font-semibold shadow-md transition-colors duration-200"
          onClick={() => signIn("google")}
        >
          Sign in with Google <FaGoogle />
        </Button>
        {error && <p className="text-red-500 font-roboto">{error}</p>}
      </div>
    </div>
  );
}
