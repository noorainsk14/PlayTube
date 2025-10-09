import React, { useState } from "react";

const ReplyComment = ({ comment, handleReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  return (
    <div className="mt-3 w-full px-4">
      {showReplyInput && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 pl-20 pr-4">
          <input
            onChange={(e) => {
              setReplyText(e.target.value);
            }}
            type="text"
            placeholder="Add a reply"
            name="reply"
            id="reply"
            className="flex-1 mb-4 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
          />
          <button
            className="bg-orange-600 mb-4 hover:bg-orange-700 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            onClick={() => {
              handleReply({comment._id:comment._id,replyText: replyText}),
                setReplyText(""),
                setShowReplyInput(false);
            }}
          >
            Reply
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setShowReplyInput(!showReplyInput);
        }}
        className="ml-4 text-2xl text-gray-400 mt-1 hover:bg-gray-400  hover:text-black rounded-full w-19 p-2 cursor-pointer hover:underline"
      >
        reply
      </button>
    </div>
  );
};

export default ReplyComment;
