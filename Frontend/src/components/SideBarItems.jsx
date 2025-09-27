const SideBarItems = ({ icon, text, open, selected, onClick }) => {
  return (
    <button
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
      } ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
};

export default SideBarItems;
