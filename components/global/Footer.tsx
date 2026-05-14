import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <p className="text-sm text-slate-500">
          © 2025 QuizerGo. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
