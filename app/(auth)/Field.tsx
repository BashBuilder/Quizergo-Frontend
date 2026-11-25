import React from "react";

const InputField = ({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full">
      <label
        className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex h-12 items-center gap-3 rounded-3xl border border-rule bg-sheet px-4 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20">
        {children}
      </div>
      {error && (
        <p
          id={`${htmlFor}-error`}
          className="mt-2 text-[0.75rem] font-medium text-rose-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
