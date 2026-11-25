"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export default function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);

  const handleNum = (n: string) => {
    if (fresh) {
      setDisplay(n);
      setFresh(false);
      return;
    }
    if (display === "0" && n !== ".") setDisplay(n);
    else if (n === "." && display.includes(".")) return;
    else setDisplay(display + n);
  };

  const handleOp = (o: string) => {
    setPrev(display);
    setOp(o);
    setFresh(true);
  };

  const handleEq = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev),
      b = parseFloat(display);
    let result = 0;
    if (op === "+") result = a + b;
    else if (op === "−") result = a - b;
    else if (op === "×") result = a * b;
    else if (op === "÷") result = b !== 0 ? a / b : 0;
    const str = parseFloat(result.toFixed(8)).toString();
    setDisplay(str);
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const handleDel = () =>
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(false);
  };
  const handleToggleSign = () =>
    setDisplay((parseFloat(display) * -1).toString());
  const handlePct = () => setDisplay((parseFloat(display) / 100).toString());

  const btn = (label: string, onClick: () => void, cls = "") => (
    <button
      key={label}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center rounded-lg text-[0.8125rem] font-semibold transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        cls,
      )}
      aria-label={label}
    >
      {label}
    </button>
  );

  const digit = "border border-white/10 bg-white/5 text-white hover:bg-white/10";
  const fn = "bg-white/10 text-white/75 hover:bg-white/15";
  const operator = (active: boolean) =>
    cn(
      "border text-white",
      active
        ? "border-primary-400 bg-primary-500"
        : "border-white/10 bg-white/5 text-primary-300 hover:bg-white/10",
    );

  return (
    <div
      className="fixed bottom-24 right-4 z-50 w-[17rem] overflow-hidden rounded-xl border border-white/10 bg-exam shadow-xl sm:right-6"
      role="dialog"
      aria-label="Calculator"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="eyebrow text-white/55">Calculator</span>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          aria-label="Close calculator"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Display */}
      <div className="border-b border-white/10 px-4 py-4 text-right">
        {op && (
          <p className="mb-1 text-[0.6875rem] tabular-nums text-white/55">
            {prev} {op}
          </p>
        )}
        <p className="truncate text-[1.75rem] font-semibold leading-none tabular-nums tracking-[-0.02em] text-white">
          {display}
        </p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-3">
        {btn("AC", handleClear, fn)}
        {btn("+/−", handleToggleSign, fn)}
        {btn("%", handlePct, fn)}
        {btn("÷", () => handleOp("÷"), operator(op === "÷"))}

        {["7", "8", "9"].map((n) => btn(n, () => handleNum(n), digit))}
        {btn("×", () => handleOp("×"), operator(op === "×"))}

        {["4", "5", "6"].map((n) => btn(n, () => handleNum(n), digit))}
        {btn("−", () => handleOp("−"), operator(op === "−"))}

        {["1", "2", "3"].map((n) => btn(n, () => handleNum(n), digit))}
        {btn("+", () => handleOp("+"), operator(op === "+"))}

        {btn("⌫", handleDel, digit)}
        {btn("0", () => handleNum("0"), digit)}
        {btn(".", () => handleNum("."), digit)}
        {btn("=", handleEq, "bg-primary-500 text-white hover:bg-primary-600")}
      </div>
    </div>
  );
}
