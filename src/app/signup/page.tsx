"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Security Regex Patterns
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Password regex: minimum 8 characters, at least 1 uppercase, 1 lowercase, and 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

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

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate single field using regex
  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (!NAME_REGEX.test(value.trim())) {
          error = "Name must be at least 2 characters and contain only letters";
        }
        break;

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
          error =
            "Password must be at least 8 characters with uppercase, lowercase, and a number";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate dynamically when user types
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    // Re-validate confirm password if password is being edited
    if (name === "password" && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateAll = () => {
    const newErrors: typeof errors = {};

    const nameError = validateField("fullName", formData.fullName);
    if (nameError) newErrors.fullName = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validateField(
      "confirmPassword",
      formData.confirmPassword,
    );
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Async Signup handler
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        image: "https://i.ibb.co.com/rKVjm5wy/profile.jpg",
      });

      if (error) {
        console.error("Signup error:", error);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            error.message ||
            "Something went wrong while creating your account. Please try again.",
          confirmButtonColor: "#15a1bf",
        });
        return;
      }

      // ============================================================
      // TODO: Add your backend signup / authentication API call here
      // Example:
      // await authClient.signUp.email({
      //   name: formData.fullName,
      //   email: formData.email,
      //   password: formData.password,
      // });
      // ============================================================

      if (data) {
        await Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: `Welcome, ${formData.fullName.trim()}! Your account has been created successfully.`,
          confirmButtonColor: "#15a1bf",
        });
      }
      setIsLoading(false);
      router.push("/");

      // Optionally clear form or redirect
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong while creating your account. Please try again.",
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
          Create Account
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-sans">
          Start your adventure with Wanderlast
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-115 bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-none p-8 sm:p-10">
        <form onSubmit={handleSignup} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full bg-[#f8fafc] border ${
                  errors.fullName
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#15a1bf] focus:ring-1 focus:ring-[#15a1bf]/30"
                } text-slate-900 text-sm pl-10 pr-3.5 py-2.5 rounded-none outline-none transition-all placeholder:text-slate-400`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 font-normal">
                {errors.fullName}
              </p>
            )}
          </div>

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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full bg-[#f8fafc] border ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#15a1bf] focus:ring-1 focus:ring-[#15a1bf]/30"
                } text-slate-900 text-sm pl-10 pr-10 py-2.5 rounded-none outline-none transition-all placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmed password"
                    : "Show confirmed password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 font-normal">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#15a1bf] hover:bg-[#128ea9] active:bg-[#0e7d95] text-white py-2.5 px-4 text-xs font-semibold tracking-wide transition-colors rounded-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-slate-400 font-normal">
            Or sign up with
          </span>
        </div>

        {/* Google Sign Up */}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#15a1bf] hover:underline font-semibold ml-0.5"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
