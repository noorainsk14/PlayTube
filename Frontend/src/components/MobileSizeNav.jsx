import React from "react";

const MobileSizeNav = ({ icon, text, onClick, active }) => {
  return (
    <button
      className={`flex, flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? "text-white" : "text-gray-400"
      } hover:scale-105`}
      onClick={onClick}
    >
      <span className="text-2xl flex justify-center items-center">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
};

export default MobileSizeNav;
