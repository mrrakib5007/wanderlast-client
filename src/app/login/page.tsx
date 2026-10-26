"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Security Regex Patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Password regex: minimum 6 characters (can include any characters)
const PASSWORD_REGEX = /^.{6,}$/;

// Google Brand Icon
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.675-5.17 3.675-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.14C3.26 21.31 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.38l4-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.69 1.27 6.62l4 3.14c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate single field using regex
  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!EMAIL_REGEX.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!PASSWORD_REGEX.test(value)) {
          error = "Password must be at least 6 characters";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    if (type !== "checkbox") {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const validateAll = () => {
    const newErrors: typeof errors = {};

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Async Sign In handler
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "You have signed in successfully.",
          confirmButtonColor: "#15a1bf",
        });
        setIsLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Sign In Failed",
        text: "Invalid email or password. Please try again.",
        confirmButtonColor: "#15a1bf",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/login",
      newUserCallbackURL: "/",
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign In Failed",
        text: "There was an issue signing in with Google. Please try again.",
        confirmButtonColor: "#15a1bf",
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-[#f9fafc] flex flex-col justify-center items-center px-4 py-12 sm:px-6">
      {/* Header outside card */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-normal font-josefin text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-sans">
          Resume your adventure with Wanderlast
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-115 bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-none p-8 sm:p-10">
        <form onSubmit={handleSignIn} noValidate className="space-y-4">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full bg-[#f8fafc] border ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#15a1bf] focus:ring-1 focus:ring-[#15a1bf]/30"
                } text-slate-900 text-sm pl-10 pr-3.5 py-2.5 rounded-none outline-none transition-all placeholder:text-slate-400`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-normal">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full bg-[#f8fafc] border ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#15a1bf] focus:ring-1 focus:ring-[#15a1bf]/30"
                } text-slate-900 text-sm pl-10 pr-10 py-2.5 rounded-none outline-none transition-all placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-normal">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="size-3.5 rounded-none border-slate-300 accent-[#15a1bf] cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#15a1bf] hover:underline font-medium text-xs"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#15a1bf] hover:bg-[#128ea9] active:bg-[#0e7d95] text-white py-2.5 px-4 text-xs font-semibold tracking-wide transition-colors rounded-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-slate-400 font-normal">
            Or continue with
          </span>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer rounded-none"
        >
          <GoogleIcon />
          <span>Sign In With Google</span>
        </button>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#15a1bf] hover:underline font-semibold ml-0.5"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
