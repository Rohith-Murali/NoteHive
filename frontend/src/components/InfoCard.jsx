import React from "react";

export default function InfoCard({ icon, title, children, className = "" }) {
  return (
    <div className={"card shadow-sm border-1 bg-gray-300 rounded hover:bg-gray-200 p-3 m-3"}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="text-lg font-medium" style={{ color: 'var(--text-color)' }}>{title}</h3>
      </div>
      <div className="mt-2 text-sm" style={{ color: 'var(--text-color)' }}>{children}</div>
    </div>
  );
}
