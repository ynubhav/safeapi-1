"use client";

import { useState } from "react";
import Link from "next/link";

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M44.5 20H24v8.5h11.9C34.4 31.9 30 36 24 36 15.7 36 9 29.3 9 21s6.7-15 15-15c4 0 7.5 1.5 10.2 3.9l6.9-6.9C36.3 2.6 30.6 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c13.2 0 24-10.7 24-24 0-1.6-.1-3.1-.5-4.5z" fill="#FFC107"/>
      <path d="M6.3 14.5 12.8 19C14.7 13.7 19.9 9.8 25.9 9.8c4 0 7.5 1.5 10.2 3.9l6.9-6.9C36.3 2.6 30.6 0 24 0 15.6 0 8.7 5.1 6.3 14.5z" fill="#FF3D00"/>
      <path d="M24 48c6.6 0 12.3-2.6 16.7-6.9l-8-6.9C29.7 34.8 27 35.9 24 35.9c-6 0-10.4-4.1-11.9-8.6l-6.6 5.1C9 41.5 15.6 48 24 48z" fill="#4CAF50"/>
      <path d="M44.5 20H24v8.5h11.9c-1.1 3.2-3.5 5.9-6.6 7.6l.1-.1 8 6.9C42.3 40.7 48 32.8 48 24c0-1.6-.1-3.1-.5-4.5z" fill="#1976D2"/>
    </svg>
  );
}

function IconGithub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.15 7.7 10.63.56.1.77-.24.77-.54 0-.27-.01-1-.02-1.95-3.13.68-3.79-1.5-3.79-1.5-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.16 1.71 1.16 1 .71 2.63.51 3.27.39.1-.77.39-1.31.71-1.61-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.17-3.02-.12-.28-.51-1.4.11-2.92 0 0 .96-.31 3.14 1.16.91-.25 1.88-.37 2.84-.37.96 0 1.93.13 2.84.38 2.18-1.47 3.14-1.16 3.14-1.16.62 1.52.23 2.64.11 2.92.73.79 1.17 1.79 1.17 3.02 0 4.32-2.64 5.28-5.15 5.56.4.34.76 1.01.76 2.04 0 1.47-.01 2.65-.01 3.01 0 .3.21.65.78.54 4.48-1.48 7.7-5.67 7.7-10.63C23.25 5.48 18.27.5 12 .5z"/>
    </svg>
  );
}


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // placeholder: implement login logic
    console.log({ email, password });
  }

  return (
    <div className="flex min-w-[400px] items-start justify-center text-white py-10 px-6 rounded-lg ">
      <div className="w-full max-w-sm backdrop-blur-xl bg-white/10 border  border-white/20 
        shadow-[0_8px_30px_rgb(0,0,0,0.15)] rounded-lg">
        {/* Header */}
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold text-white">Log In</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-4">
          {/* Social buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center gap-3 border border-slate-400 rounded-md px-3 py-3 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
            >
              <span className="flex-none">
                <IconGoogle />
              </span>
              <span className="text-sm text-white font-medium">Sign In with Google</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 border border-slate-400 rounded-md px-3 py-3 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 hover:cursor-pointer"
            >
              <span className="flex-none text-white">
                <IconGithub />
              </span>
              <span className="text-sm text-white font-medium">Sign In with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-400" />
            <div className="text-xs text-slate-400 whitespace-nowrap">OR</div>
            <div className="flex-1 h-px bg-slate-400" />
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address*"
                type="email"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password*"
                type={showPassword ? "text" : "password"}
                className="w-full border border-slate-200 rounded-md px-3 py-2 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {/* Simple eye icon */}
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88A3 3 0 0114.12 14.12" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10.66 6.6C12 6 13.46 5.75 15 6.41 18.5 8 21 12 21 12s-3.5 4-6 5.59" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3C3 3 6.5 7 9 8.59" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.47 12.29C3.6 16.2 7 19 12 19c5 0 8.4-2.8 9.53-6.71a1 1 0 000-.58C20.4 7.8 17 5 12 5 7 5 3.6 7.8 2.47 12.29z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            <Link href="/forgot-password" className="text-blue-600 underline text-sm">
             Forgot Password?
            </Link>
          </p>

          {/* Log In Button */}
          <div>
            <button
              type="submit"
              className="w-full pb-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 hover:scale-102 hover:cursor-pointer"
            >
              Log In
            </button>
          </div>

          {/* bottom text */}
          <p className="text-center text-sm pb-6 text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
