"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full" style={{ backgroundColor: "#0a1628" }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold" style={{ color: "#003da5" }}>
              PACE
            </span>
            <span className="text-xl font-bold text-white tracking-wide">
              UNIVERSITY
            </span>
          </div>
          <span className="text-[10px] text-gray-400 tracking-wider -mt-1">
            Education Abroad
          </span>
        </Link>
        <Link
          href="/admin"
          className="text-white text-sm hover:text-gray-300 transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
