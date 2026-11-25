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
    <div className="w-full">
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          className="mt-2 text-[0.75rem] font-medium text-rose-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
