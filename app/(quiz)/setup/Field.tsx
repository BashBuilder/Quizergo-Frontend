export default function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
