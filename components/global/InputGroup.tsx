import React from "react";
import { Input } from "../ui/input";

interface InputGroupProps {
  label: string;
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
  autoComplete?: string;
  icon?: React.ReactNode;
}

const InputGroup = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  type,
  autoComplete = "off",
  icon,
}: InputGroupProps) => {
  return (
    <div className="w-full">
      <label
        className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex h-12 items-center gap-3 rounded-3xl border border-rule bg-sheet px-4 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20">
        {icon}
        <Input
          id={name}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder || ""}
          className="h-full w-full border-0 bg-transparent px-0 text-sm text-ink shadow-none outline-none placeholder:text-ink-quiet"
          type={type || "text"}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
};

export default InputGroup;
