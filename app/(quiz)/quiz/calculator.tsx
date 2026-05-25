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
        "flex items-center justify-center rounded-xl text-sm font-semibold h-10 transition-all active:scale-95",
        cls,
      )}
      aria-label={label}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-64 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700"
      role="dialog"
      aria-label="Calculator"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          {/* <Calculator size={12} aria-hidden="true" />  */}
          Calculator
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close calculator"
        >
          <X size={14} />
        </button>
      </div>

      {/* Display */}
      <div className="px-4 py-3 text-right border-b border-slate-800">
        {op && (
          <p className="text-[10px] text-slate-500 mb-0.5">
            {prev} {op}
          </p>
        )}
        <p className="text-2xl font-light text-white truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-3">
        {btn(
          "AC",
          handleClear,
          "bg-slate-600 hover:bg-slate-500 text-white col-span-1",
        )}
        {btn(
          "+/−",
          handleToggleSign,
          "bg-slate-600 hover:bg-slate-500 text-white",
        )}
        {btn("%", handlePct, "bg-slate-600 hover:bg-slate-500 text-white")}
        {btn(
          "÷",
          () => handleOp("÷"),
          cn(
            "text-white",
            op === "÷"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["7", "8", "9"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "×",
          () => handleOp("×"),
          cn(
            "text-white",
            op === "×"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["4", "5", "6"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "−",
          () => handleOp("−"),
          cn(
            "text-white",
            op === "−"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["1", "2", "3"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "+",
          () => handleOp("+"),
          cn(
            "text-white",
            op === "+"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {btn("⌫", handleDel, "bg-slate-700 hover:bg-slate-600 text-white")}
        {btn(
          "0",
          () => handleNum("0"),
          "bg-slate-700 hover:bg-slate-600 text-white",
        )}
        {btn(
          ".",
          () => handleNum("."),
          "bg-slate-700 hover:bg-slate-600 text-white",
        )}
        {btn("=", handleEq, "bg-primary-500 hover:bg-primary-400 text-white")}
      </div>
    </div>
  );
}
