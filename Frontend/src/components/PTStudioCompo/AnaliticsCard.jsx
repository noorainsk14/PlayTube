import React from "react";

const AnaliticsCard = ({ label, value, onClick }) => {
  return (
    <div
      className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2">
        {label}
      </div>
      <h4 className="text-lg sm:text-xl text-start font-bold">{value}</h4>
    </div>
  );
};

export default AnaliticsCard;
