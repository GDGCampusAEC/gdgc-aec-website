"use client";

import Link from "next/link";
import { useState } from "react";
import {ArrowLeft,ArrowRight,Check,CheckCircle2,ChevronLeft,Loader2} from "lucide-react";

import {RECRUITMENT_DEPARTMENTS,RECRUITMENT_ROLES,RECRUITMENT_YEARS,isValidUrl,normalizeRollNumber} from "@/lib/recruitment";

type FormState = {
  name: string;
  year: string;
  roll: string;
  department: string;
  roles: string[];
  email: string;
  phone: string;
  whyJoin: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  otherClubCoreMember: string;
  otherClubName: string;
};

const initialForm: FormState = {
  name: "",
  year: "",
  roll: "",
  department: "",
  roles: [],
  email: "",
  phone: "",
  whyJoin: "",
  linkedin: "",
  github: "",
  resumeUrl: "",
  otherClubCoreMember: "no",
  otherClubName: "",
};

const TOTAL_STEPS = 3;

const FIRST_YEAR_DOMAIN_HIDDEN = true;

const stepContent = [
  {
    number: "01",
    title: "Tell us about you",
    description: "Your basic academic and contact details.",
  },
  {
    number: "02",
    title: "Find your place",
    description: "Choose the roles where you'd like to contribute.",
  },
  {
    number: "03",
    title: "A little more about you",
    description: "Tell us what motivates you to join GDGC.",
  },
];

function Input({
  label,
  required = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium text-[#3c4043]">
        {label}
        {required && <span className="ml-1 text-[#ea4335]">*</span>}
      </span>

      <input
        {...props}
        className="h-13 w-full rounded-2xl border border-[#dadce0] bg-[#f8fafd] px-4 text-[16px] text-[#202124] outline-none transition-all placeholder:text-[#9aa0a6] hover:border-[#bdc1c6] focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-[#1a73e8]/10"
      />
    </label>
  );
}

function Select({
  label,
  required = false,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium text-[#3c4043]">
        {label}
        {required && <span className="ml-1 text-[#ea4335]">*</span>}
      </span>

      <select
        {...props}
        className="h-13 w-full appearance-none rounded-2xl border border-[#dadce0] bg-[#f8fafd] px-4 text-[16px] text-[#202124] outline-none transition-all hover:border-[#bdc1c6] focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-[#1a73e8]/10"
      >
        {children}
      </select>
    </label>
  );
}

export default function RecruitmentApplyPage() {
  const [form, setForm] = useState<FormState>(initialForm);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleRole = (role: string) => {
    setError(null);

    setForm((prev) => {
      const exists = prev.roles.includes(role);

      if (exists) {
        return {
          ...prev,
          roles: prev.roles.filter((item) => item !== role),
        };
      }

      if (prev.roles.length >= 3) {
        return prev;
      }

      return {
        ...prev,
        roles: [...prev.roles, role],
      };
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!form.name.trim()) return "Full Name is required.";
      if (!form.year) return "Year is required.";
      if (!form.roll.trim()) return "Roll Number is required.";
      if (!form.department) return "Department is required.";
      if (!form.email.trim()) return "Email is required.";

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
      ) {
        return "Please enter a valid email address.";
      }

      if (!form.phone.trim()) return "Phone Number is required.";

      if (!/^[0-9+()\-\s]{8,20}$/.test(form.phone.trim())) {
        return "Please enter a valid phone number.";
      }
    }

    if (currentStep === 2) {
      const isYear1st = form.year === "1st Year";
      
      if (!isYear1st && !form.roles.length) {
        return "Please select at least one role.";
      }

      if (!isYear1st && form.roles.length > 3) {
        return "You can select a maximum of 3 roles.";
      }
    }

    if (currentStep === 3) {
      if (!form.whyJoin.trim()) {
        return "Please tell us why you want to join GDGC.";
      }

      if (
        form.linkedin.trim() &&
        !isValidUrl(form.linkedin)
      ) {
        return "LinkedIn URL is invalid.";
      }

      if (
        form.github.trim() &&
        !isValidUrl(form.github)
      ) {
        return "GitHub URL is invalid.";
      }

      if (
        form.resumeUrl.trim() &&
        !isValidUrl(form.resumeUrl)
      ) {
        return "Resume URL is invalid.";
      }

      if (
        form.otherClubCoreMember === "yes" &&
        !form.otherClubName.trim()
      ) {
        return "Please enter the club or society name.";
      }
    }

    return null;
  };

  const goNext = () => {
    setError(null);

    const validationError = validateStep(step);

    if (validationError) {
      setError(validationError);
      return;
    }

    let newStep = step + 1;
    
    if (FIRST_YEAR_DOMAIN_HIDDEN && step === 2 && form.year === "1st Year") {
      newStep = 3;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goBack = () => {
    setError(null);

    let newStep = step - 1;
    
    if (FIRST_YEAR_DOMAIN_HIDDEN && step === 3 && form.year === "1st Year") {
      newStep = 1;
    }

    setStep((current) => Math.max(current - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    const validationError = validateStep(3);

    if (validationError) {
      setError(validationError);
      return;
    }

    const isYear1st = form.year === "1st Year";
    
    if (!isYear1st && form.roles.length > 3) {
      setError("You can select a maximum of 3 roles.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      year: form.year,
      roll: normalizeRollNumber(form.roll.trim()),
      department: form.department,
      roles: isYear1st ? [] : form.roles,
      email: form.email.trim(),
      phone: form.phone.trim(),
      whyJoin: form.whyJoin.trim(),
      linkedin: form.linkedin.trim(),
      github: form.github.trim(),
      resumeUrl: form.resumeUrl.trim(),
      otherClubCoreMember:
        form.otherClubCoreMember === "yes",
      otherClubName:
        form.otherClubCoreMember === "yes"
          ? form.otherClubName.trim()
          : "",
    };

    try {
      const response = await fetch("/api/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setError(
            "An application with this university roll number has already been submitted.",
          );
          return;
        }

        setError(
          data.error ||
            "Unable to submit application. Please try again.",
        );

        return;
      }

      setSuccess(true);
      setForm(initialForm);
    } catch {
      setError(
        "Unable to submit application. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     SUCCESS
  ============================================================ */

  if (success) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#fbfaff] px-5 pb-20 pt-24 sm:px-8 sm:pt-32">
        <div className="relative mx-auto flex min-h-[75vh] max-w-xl items-center justify-center">
          {/* Google-inspired decorations */}
          <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-[#4285f4] opacity-90" />
          <div className="absolute -left-8 bottom-16 h-16 w-16 rounded-full bg-[#fbbc04]" />
          <div className="absolute right-16 bottom-10 h-5 w-20 -rotate-12 rounded-full bg-[#ea4335]" />

          <div className="relative w-full rounded-[2rem] bg-white p-7 text-center shadow-[0_20px_60px_rgba(60,64,67,0.10)] ring-1 ring-[#e8eaed] sm:p-12">
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#e6f4ea] text-[#188038]">
              <CheckCircle2 size={40} strokeWidth={1.8} />
            </div>

            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#34a853]">
              Application received
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#202124] sm:text-4xl">
              You&apos;re in the queue.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#5f6368]">
              Thanks for applying to GDGC AEC. We&apos;ll review your
              application and get back to you soon.
            </p>

            <Link
              href="/recruitment"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#dadce0] px-6 text-sm font-semibold text-[#3c4043] transition hover:bg-[#f8fafd]"
            >
              <ArrowLeft size={16} />
              Back to recruitment
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaff] text-[#202124] pt-18">

      <div className="mx-auto max-w-5xl px-5 pb-32 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f6368]">
              Application
            </span>

            <span className="text-xs font-semibold text-[#5f6368]">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[#e8eaed]">
            <div
              className="h-full rounded-full bg-[#1a73e8] transition-all duration-500"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step heading */}
        <div className="mb-8">
          <div className="mb-3 text-xs font-bold tracking-[0.18em] text-[#1a73e8]">
            {stepContent[step - 1].number}
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#202124] sm:text-4xl">
            {stepContent[step - 1].title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5f6368] sm:text-base">
            {stepContent[step - 1].description}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex gap-3 rounded-2xl border border-[#f1c3c0] bg-[#fce8e6] px-4 py-3 text-sm font-medium text-[#b3261e]"
          >
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#ea4335]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {step === 1 && (
            <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                />

                <Select
                  label="Year"
                  required
                  value={form.year}
                  onChange={(e) =>
                    updateField("year", e.target.value)
                  }
                >
                  <option value="">Select year</option>

                  {RECRUITMENT_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>

                <Input
                  label="University Roll Number"
                  required
                  value={form.roll}
                  onChange={(e) =>
                    updateField("roll", e.target.value)
                  }
                  placeholder="e.g. 23CSE123"
                  autoComplete="off"
                />

                <Select
                  label="Department"
                  required
                  value={form.department}
                  onChange={(e) =>
                    updateField(
                      "department",
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select department
                  </option>

                  {RECRUITMENT_DEPARTMENTS.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    ),
                  )}
                </Select>

                <Input
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <Input
                  label="Phone Number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>

              <div className="mt-7 rounded-2xl bg-[#f8fafd] p-4">
                <p className="text-xs leading-5 text-[#5f6368]">
                  Your academic details help us understand your
                  background and connect you with the right team.
                </p>
              </div>
            </div>
          )}

          {step === 2 && !FIRST_YEAR_DOMAIN_HIDDEN && (
            <div className="space-y-5">
              <div className="rounded-[2rem] bg-[#202124] p-5 text-white sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                      Your choices
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      What would you like to work on?
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/65">
                      Choose up to three roles. Pick the areas
                      where you&apos;re most interested in learning
                      and contributing.
                    </p>
                  </div>

                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      form.roles.length === 3
                        ? "bg-[#34a853] text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {form.roles.length}/3
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#202124]">
                      Available roles
                    </h3>

                    <p className="mt-1 text-xs text-[#5f6368]">
                      {form.roles.length === 0
                        ? "Select at least one"
                        : `${form.roles.length} selected`}
                    </p>
                  </div>

                  {form.roles.length === 3 && (
                    <span className="rounded-full bg-[#e6f4ea] px-3 py-1.5 text-xs font-semibold text-[#188038]">
                      Maximum reached
                    </span>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {RECRUITMENT_ROLES.map((role, index) => {
                    const selected =
                      form.roles.includes(role);

                    const disabled =
                      !selected && form.roles.length >= 3;

                    const accentColors = [
                      "bg-[#e8f0fe] text-[#1a73e8]",
                      "bg-[#fce8e6] text-[#d93025]",
                      "bg-[#fef7e0] text-[#b06000]",
                      "bg-[#e6f4ea] text-[#188038]",
                    ];

                    return (
                      <button
                        key={role}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleRole(role)}
                        className={`group flex min-h-[62px] items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          selected
                            ? "border-[#1a73e8] bg-[#e8f0fe] shadow-[0_0_0_3px_rgba(26,115,232,0.08)]"
                            : disabled
                              ? "cursor-not-allowed border-[#e8eaed] bg-[#f8fafd] opacity-40"
                              : "border-[#dadce0] bg-white hover:border-[#bdc1c6] hover:bg-[#f8fafd]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            selected
                              ? "bg-[#1a73e8] text-white"
                              : accentColors[
                                  index %
                                    accentColors.length
                                ]
                          }`}
                        >
                          {selected ? (
                            <Check size={17} />
                          ) : (
                            String(index + 1).padStart(
                              2,
                              "0",
                            )
                          )}
                        </span>

                        <span
                          className={`text-sm font-semibold ${
                            selected
                              ? "text-[#174ea6]"
                              : "text-[#3c4043]"
                          }`}
                        >
                          {role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-3 rounded-2xl bg-[#f8fafd] p-4">
                  <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#4285f4]" />

                  <p className="text-xs leading-5 text-[#5f6368]">
                    You can choose up to <strong>3 roles</strong>.
                    Your first selection can represent your strongest
                    preference.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && FIRST_YEAR_DOMAIN_HIDDEN && (
            <div className="rounded-[2rem] bg-[#e6f4ea] p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#188038] text-white">
                  <Check size={20} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#202124]">
                    Domain Selection for 1st Year Students
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f6368]">
                    As a first-year student, you will be guided to the domain
                    selection in your second year. For now, please proceed to
                    the final step to share your motivation for joining GDGC.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
                <div>
                  <label className="block">
                    <span className="mb-2.5 block text-sm font-medium text-[#3c4043]">
                      Why do you want to join GDGC?
                      <span className="ml-1 text-[#ea4335]">
                        *
                      </span>
                    </span>

                    <textarea
                      value={form.whyJoin}
                      onChange={(e) =>
                        updateField(
                          "whyJoin",
                          e.target.value,
                        )
                      }
                      rows={6}
                      placeholder="Tell us what interests you about GDGC, what you'd like to learn, or what you'd like to contribute."
                      className="w-full resize-none rounded-2xl border border-[#dadce0] bg-[#f8fafd] px-4 py-3 text-[16px] leading-7 text-[#202124] outline-none transition-all placeholder:text-[#9aa0a6] hover:border-[#bdc1c6] focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-[#1a73e8]/10"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#202124]">
                    Your links
                  </h2>

                  <p className="mt-1 text-sm text-[#5f6368]">
                    Optional, but useful if you&apos;ve built or
                    contributed to something.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="LinkedIn"
                    value={form.linkedin}
                    onChange={(e) =>
                      updateField(
                        "linkedin",
                        e.target.value,
                      )
                    }
                    placeholder="https://linkedin.com/in/you"
                    type="url"
                  />

                  <Input
                    label="GitHub"
                    value={form.github}
                    onChange={(e) =>
                      updateField(
                        "github",
                        e.target.value,
                      )
                    }
                    placeholder="https://github.com/you"
                    type="url"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Resume"
                      value={form.resumeUrl}
                      onChange={(e) =>
                        updateField(
                          "resumeUrl",
                          e.target.value,
                        )
                      }
                      placeholder="Google Drive / portfolio / resume link"
                      type="url"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.06)] ring-1 ring-[#e8eaed] sm:p-8">
                <h2 className="text-lg font-semibold text-[#202124]">
                  One last thing
                </h2>

                <p className="mt-1 text-sm text-[#5f6368]">
                  This helps us understand your existing commitments.
                </p>

                <div className="mt-5">
                  <span className="mb-3 block text-sm font-medium text-[#3c4043]">
                    Are you a sub/core committee member of another club/society?
                  </span>

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "otherClubCoreMember",
                          "yes",
                        )
                      }
                      className={`min-h-11 rounded-full px-6 text-sm font-semibold transition ${
                        form.otherClubCoreMember === "yes"
                          ? "bg-[#1a73e8] text-white"
                          : "border border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8fafd]"
                      }`}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "otherClubCoreMember",
                          "no",
                        )
                      }
                      className={`min-h-11 rounded-full px-6 text-sm font-semibold transition ${
                        form.otherClubCoreMember === "no"
                          ? "bg-[#202124] text-white"
                          : "border border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8fafd]"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {form.otherClubCoreMember === "yes" && (
                  <div className="mt-5">
                    <Input
                      label="Club / Society Name"
                      required
                      value={form.otherClubName}
                      onChange={(e) =>
                        updateField(
                          "otherClubName",
                          e.target.value,
                        )
                      }
                      placeholder="Name of the club or society"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

              {/* DESKTOP NAVIGATION */}
         

          <div className="mt-7 hidden items-center justify-between sm:flex">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-[#5f6368] transition hover:bg-white hover:text-[#202124]"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#1a73e8] px-7 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(26,115,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1769d3]"
              >
                Continue
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#1a73e8] px-7 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(26,115,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1769d3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit application
                    <Check size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

     
          {/* MOBILE STICKY NAVIGATION */}
     

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dadce0] bg-white/95 p-3 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-5xl gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#dadce0] text-[#3c4043]"
              aria-label="Go back"
            >
              <ChevronLeft size={19} />
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-semibold text-white"
            >
              Continue
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="submit"
              form=""
              onClick={() => {
                const formElement =
                  document.querySelector("form");

                if (formElement) {
                  formElement.requestSubmit();
                }
              }}
              disabled={isSubmitting}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  Submit application
                  <Check size={17} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}