import React from "react";

interface InputGroupProps {
  label: string;
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // onFocus : () => void;
  placeholder: string;
  type: string;
  autoComplete?: string;
}

const InputGroup = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  type,
}: InputGroupProps) => {
  return (
    <div className="space-y-5">
      <label
        className="block text-sm font-medium text-slate-200"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400/20">
        {/* <BookOpen className="text-violet-300" size={18} /> */}
        <input
          id={name}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder || ""}
          className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          type={type || "text"}
          autoComplete="off"
          // onFocus={onFocus}
        />
      </div>
    </div>
  );
};

export default InputGroup;
