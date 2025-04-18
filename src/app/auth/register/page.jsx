// src/app/auth/register/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button"; // Adjust if your path differs
import { SiCodeproject } from "react-icons/si";
import { FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi"; // Added FiArrowLeft

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    displayName: "",
    bio: "",
    socialMediaLinks: { twitter: "", linkedin: "", website: "" },
    profileImage: "",
  });

  const update = (field) => (e) =>
    setFormData((f) => ({ ...f, [field]: e.target.value }));

  const updateSocial = (platform) => (e) =>
    setFormData((f) => ({
      ...f,
      socialMediaLinks: { ...f.socialMediaLinks, [platform]: e.target.value },
    }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((f) => ({ ...f, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const canProceedUsername = formData.username.trim().length >= 3;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordsMatch = formData.password === formData.confirmPassword;
  const canProceedEmail =
    emailRegex.test(formData.email) &&
    formData.password.length >= 8 &&
    passwordsMatch;
  const dob = formData.dateOfBirth ? new Date(formData.dateOfBirth) : null;
  const today = new Date();
  const canProceedDOB = dob instanceof Date && dob < today;
  const canProceedGender = !!formData.gender;
  const canProceedProfile = true;

  const handleNext = () => {
    if (step === 1 && canProceedUsername) setStep(2);
    else if (step === 2 && canProceedEmail) setStep(3);
    else if (step === 3 && canProceedDOB) setStep(4);
    else if (step === 4 && canProceedGender) setStep(5);
    else if (step === 5 && canProceedProfile) setStep(6);
  };

  const handleBack = () => step > 1 && setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Updated outer container with background image
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex items-center justify-center">
          <SiCodeproject className="text-blue-400 mr-2" size={28} />
          <h1 className="text-2xl text-white font-bold">
            Craft Your Rune with Lönnrot
          </h1>
        </div>
        <p className="text-gray-400 text-sm">Step {step} of 6</p>

        {/* STEP 1: Username */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-white">
              Pick a username
            </h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400"
              value={formData.username}
              onChange={update("username")}
            />
            {!canProceedUsername && (
              <p className="text-red-500 text-sm mt-1">
                At least 3 characters
              </p>
            )}
          </>
        )}

        {/* STEP 2: Email & Password */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-white">
              Email & password
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400 mb-2"
              value={formData.email}
              onChange={update("email")}
            />
            {!emailRegex.test(formData.email) && (
              <p className="text-red-500 text-sm">Invalid email</p>
            )}
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400 mb-2"
              value={formData.password}
              onChange={update("password")}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400"
              value={formData.confirmPassword}
              onChange={update("confirmPassword")}
            />
            {!passwordsMatch && (
              <p className="text-red-500 text-sm">Passwords must match</p>
            )}
          </>
        )}

        {/* STEP 3: Date of Birth */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold text-white">
              When were you born?
            </h2>
            <input
              type="date"
              max={today.toISOString().split("T")[0]}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400"
              value={formData.dateOfBirth}
              onChange={update("dateOfBirth")}
            />
            {!canProceedDOB && (
              <p className="text-red-500 text-sm">
                Please select a valid past date
              </p>
            )}
          </>
        )}

        {/* STEP 4: Gender */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold text-white">Your gender</h2>
            <div className="flex space-x-4">
              {["MALE", "FEMALE", "OTHER"].map((g) => (
                <label key={g} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={update("gender")}
                    className="form-radio h-4 w-4 text-blue-400 bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-200">{g.toLowerCase()}</span>
                </label>
              ))}
            </div>
            {!canProceedGender && (
              <p className="text-red-500 text-sm">Please choose one</p>
            )}
          </>
        )}

        {/* STEP 5: Profile & Social */}
        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold text-white">Tell us more</h2>
            <input
              type="text"
              placeholder="Display name (optional)"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400 mb-2"
              value={formData.displayName}
              onChange={update("displayName")}
            />
            <textarea
              placeholder="Short bio (optional)"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400 mb-2"
              value={formData.bio}
              onChange={update("bio")}
              rows={3}
            />
            <label className="block text-gray-300 mb-1">Profile picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="text-sm text-gray-400 mb-2"
            />
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover mb-2"
              />
            )}
            <h3 className="text-gray-200 mt-4 mb-1 text-sm">
              Social links (optional)
            </h3>
            {["twitter", "linkedin", "website"].map((p) => (
              <input
                key={p}
                type="url"
                placeholder={`${p}.com/yourhandle`}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-blue-400 mb-2"
                value={formData.socialMediaLinks[p]}
                onChange={updateSocial(p)}
              />
            ))}
          </>
        )}

        {/* STEP 6: Review & Submit */}
        {step === 6 && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Review & create account
            </h2>
            <ul className="text-gray-200 space-y-2">
              <li>
                <strong>Username:</strong> {formData.username}
              </li>
              <li>
                <strong>Email:</strong> {formData.email}
              </li>
              <li>
                <strong>DOB:</strong> {formData.dateOfBirth}
              </li>
              <li>
                <strong>Gender:</strong> {formData.gender.toLowerCase()}
              </li>
              {formData.displayName && (
                <li>
                  <strong>Display:</strong> {formData.displayName}
                </li>
              )}
              {formData.bio && (
                <li>
                  <strong>Bio:</strong> {formData.bio}
                </li>
              )}
              {formData.profileImage && (
                <li>
                  <strong>Avatar:</strong>
                  <img
                    src={formData.profileImage}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full inline-block ml-2"
                  />
                </li>
              )}
              {Object.entries(formData.socialMediaLinks).map(
                ([k, v]) =>
                  v && (
                    <li key={k}>
                      <strong>{k}:</strong>{" "}
                      <a
                        href={v}
                        target="_blank"
                        rel="noopener"
                        className="text-blue-400 hover:underline"
                      >
                        {v}
                      </a>
                    </li>
                  )
              )}
            </ul>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button
              onClick={handleBack}
              text="Back"
              icon={FiArrowLeft}
              className="px-6 bg-gray-600 hover:bg-gray-500"
            />
          )}
          <Button
            onClick={() => router.push("/auth/login")}
            text="Cancel"
            icon={FiX}
            className="px-6 bg-[#374151] hover:bg-[#111827]"
          />
          {step < 6 ? (
            <Button
              onClick={handleNext}
              text="Next"
              icon={FiArrowRight}
              className={`px-6 ${
                (step === 1 && !canProceedUsername) ||
                (step === 2 && !canProceedEmail) ||
                (step === 3 && !canProceedDOB) ||
                (step === 4 && !canProceedGender)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            />
          ) : (
            <Button
              onClick={handleSubmit}
              text={submitting ? "Creating…" : "Create account"}
              className="px-6"
            />
          )}
        </div>
      </div>
    </div>
  );
}
