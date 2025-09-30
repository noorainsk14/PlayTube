import React from "react";

const MobileProfileMenu = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-ful rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default MobileProfileMenu;
