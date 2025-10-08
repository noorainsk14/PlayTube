import React, { useState } from "react";

const Description = ({ text }) => {
  const [expand, setExpand] = useState(false);

  const showButton = text?.length > 100;
  return (
    <div>
      <p
        className={`text-sm text-gray-300 whitespace-pre-line ${
          expand ? "" : "line-clamp-1"
        }`}
      >
        {text}
      </p>
      {showButton && (
        <button
          onClick={() => setExpand(!expand)}
          className="text-xs text-blue-400 mt-1 hover:underline"
        >
          {expand ? "show less" : "show more"}
        </button>
      )}
    </div>
  );
};

export default Description;
