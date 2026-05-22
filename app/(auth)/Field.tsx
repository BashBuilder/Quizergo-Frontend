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
    <div className="flex flex-wrap gap-1 items-center">
      <label
        className="block text-sm min-w-36 font-medium  text-slate-200"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex items-center gap-3 grow rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/20">
        {children}
      </div>
      {error && (
        <p
          className="text-xs text-left w-full text-rose-500 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
