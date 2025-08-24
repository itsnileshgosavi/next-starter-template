"use client";
import { signIn, getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type LoginFormData = {
    email: string;
    password: string;
  };

export default function LoginFormComponent() {
    const params = useSearchParams();
    const error = params.get("error");
    const callbackUrl = params.get("callbackUrl") || "/";
    const router = useRouter();
    const form = useForm<LoginFormData>();
    const [csrfToken, setCsrfToken] = useState<string>("");
  
    useEffect(() => {
      const fetchCsrfToken = async () => {
        const token = await getCsrfToken();
        setCsrfToken(token || "");
      };
      fetchCsrfToken();
    }, []);
  
    const handleSubmit = async (data: LoginFormData) => {
      if (!data?.email?.trim() || !data?.password?.trim()) {
        toast.error("Please fill in all fields");
        return;
      }
  
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          csrfToken: csrfToken,
          redirect: false,
          callbackUrl: callbackUrl,
        });
  
        if (result?.error) {
          toast.error("Invalid credentials");
        } else if (result?.ok) {
          toast.success("Login successful");
          router.push("/");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        toast.error("An error occurred during sign in");
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-purple-200">
        <div className="p-8 rounded-xl bg-white shadow-2xl flex flex-col items-center">
          <h1 className="mb-6 font-bold text-3xl text-orange-600">
            Sign in to your account
          </h1>
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="outline" className="w-full">
                  Sign in
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 hover:cursor-pointer text-white rounded-lg px-8 py-3 text-lg font-semibold shadow-md transition-colors duration-200 w-full flex items-center justify-center gap-2"
              onClick={() => signIn("google")}
            >
              <FaGoogle /> Google
            </Button>
          </div>
          {error && <p className="text-red-500 font-roboto mt-4">{error}</p>}
        </div>
      </div>
    );
  }