"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
   const { isLoaded, signUp } = useSignUp();
   const [emailAddress, setEmailAddress] = useState("");
   const [username, setUsername] = useState("");
   const [pendingVerification, setPendingVerification] = useState(false);
   const [code, setCode] = useState(["", "", "", "", "", ""]);
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   const handleSignUpWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isLoaded || isSubmitting) return;

      setIsSubmitting(true);
      try {
         if (pendingVerification) {
            const verificationCode = code.join("");
            await signUp.attemptEmailAddressVerification({ code: verificationCode });

            console.log("User registered successfully");
            router.push("/sign-in");

         } else {
            await signUp.create({ emailAddress, username });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
         }
      } catch (err: unknown) {
         if (err instanceof Error && "errors" in err) {
            const customError = err as { errors: { message: string }[] };
            setError(customError.errors[0]?.message || "Something went wrong. Please try again.");
         } else if (err instanceof Error) {
            setError(err.message || "Something went wrong. Please try again.");
         } else {
            setError("An unexpected error occurred. Please try again.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleCodeChange = (value: string, index: number) => {
      const newCode = [...code];
      newCode[index] = value.slice(-1);
      setCode(newCode);
      if (value && index < code.length - 1) {
         document.getElementById(`code-${index + 1}`)?.focus();
      }
   };

   return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
         <div className="max-w-lg w-full mx-auto p-6 bg-box rounded-lg border-theme border shadow-md">
            <h2 className="text-2xl font-bold text-primary text-center mb-2">
               Register For An Account
            </h2>
            <p className="text-secondary text-center mb-6">
               Please read the terms and conditions before signing up.
            </p>

            <form className="mt-6 space-y-6" onSubmit={handleSignUpWithEmail}>
               {!pendingVerification ? (
                  <>
                     <div className="form-group">
                        <label htmlFor="userName" className="form-label text-primary block mb-2">User Name</label>
                        <input
                           id="userName"
                           placeholder="Enter your username"
                           type="text"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           className="w-full px-4 py-2 rounded-md border-theme bg-background-secondary text-primary focus:outline-none focus:ring-2 focus:ring-highlight-primary"
                           required
                           disabled={isSubmitting || !isLoaded}
                        />
                     </div>

                     <div className="form-group">
                        <label htmlFor="email" className="form-label text-primary block mb-2">Email Address</label>
                        <input
                           id="email"
                           placeholder="Enter your email"
                           type="email"
                           value={emailAddress}
                           onChange={(e) => setEmailAddress(e.target.value)}
                           className="w-full px-4 py-2 rounded-md border-theme bg-background-secondary text-primary focus:outline-none focus:ring-2 focus:ring-highlight-primary"
                           required
                           disabled={isSubmitting || !isLoaded}
                        />
                     </div>

                     {/* CAPTCHA Widget */}
                     <div id="clerk-captcha" className="mt-4"></div>

                     {error && <p className="text-accent-red text-sm mt-2">{error}</p>}

                     <button
                        className="w-full py-3 bg-highlight-primary text-white rounded-md font-medium hover:bg-link-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSubmitting || !isLoaded}
                     >
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                     </button>
                  </>
               ) : (
                  <>
                     {/* otp section */}
                     <div className="form-group">
                        <label htmlFor="code" className="form-label text-primary block mb-4 text-center">Verification Code</label>
                        <div className="flex gap-3 justify-center">
                           {code.map((digit, index) => (
                              <input
                                 key={index}
                                 id={`code-${index}`}
                                 className="w-12 h-12 text-center text-lg font-semibold border-theme rounded-md bg-background-secondary text-primary focus:ring-2 focus:ring-highlight-primary focus:outline-none"
                                 maxLength={1}
                                 value={digit}
                                 onChange={(e) => handleCodeChange(e.target.value, index)}
                                 type="text"
                                 inputMode="numeric"
                                 pattern="[0-9]*"
                                 required
                                 disabled={isSubmitting}
                              />
                           ))}
                        </div>
                     </div>

                     {/* CAPTCHA Widget for verification step */}
                     <div id="clerk-captcha" className="mt-4"></div>

                     {error && <p className="text-accent-red text-sm mt-2 text-center">{error}</p>}

                     <button
                        className="w-full py-3 bg-accent-green text-white rounded-md font-medium hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Verifying..." : "Verify & Sign Up"}
                     </button>
                  </>
               )}

               <div className="border-t border-theme pt-4 mt-4">
                  <p className="text-center text-sm text-secondary">
                     Already have an account?{" "}
                     <Link href="/sign-in" className="link-color hover:link-hover font-medium">
                        Sign In
                     </Link>
                  </p>
               </div>
            </form>
         </div>
      </div>
   );
}