"use client";
import React from "react";

export default function Index() {
  return (
    <td className="p-3">
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          affiliate.tier_status === "platinum"
            ? "bg-purple-100 text-purple-800"
            : affiliate.tier_status === "gold"
            ? "bg-yellow-100 text-yellow-800"
            : affiliate.tier_status === "silver"
            ? "bg-gray-100 text-gray-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {affiliate.tier_status
          ? affiliate.tier_status.charAt(0).toUpperCase() +
            affiliate.tier_status.slice(1)
          : "Standard"}
      </span>
    </td>
  );
}