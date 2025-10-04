import React from "react";

const StepThree = ({
  coverImage,
  description,
  setDescription,
  existingAvatarUrl,
  existingCoverImageUrl,
  category,
  setCategory,
  loading,
  text,
  buttonText,
  setLoading,
  prevStep,
  onChange,
  onClick,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{text} </h2>

      <div className="flex flex-col items-center mb-6">
        <label
          htmlFor="coverImage"
          className="cursor-pointer w-full block mb-4 "
        >
          {coverImage ? (
            <img
              src={URL.createObjectURL(coverImage)}
              className="w-full h-30 rounded-lg object-cover border border-gray-700 mb-2"
            />
          ) : existingCoverImageUrl ? (
            <img
              src={existingCoverImageUrl}
              className="w-full h-30 rounded-lg object-cover border border-gray-700 mb-2"
            />
          ) : (
            <div className="w-full h-30 bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
              Click to upload Cover Image
            </div>
          )}
          <span className="text-orange-400 text-sm my-2">
            Upload Cover Image
          </span>
          <input
            type="file"
            className="hidden"
            id="coverImage"
            accept="image/*"
            onChange={onChange}
          />
        </label>
      </div>
      <textarea
        name="description"
        id="description"
        className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Channel Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Category"
        className="w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      ></input>

      <button
        onClick={onClick}
        disabled={
          !category || !description || (!coverImage && !existingCoverImageUrl)
        }
        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 rounded-lg font-meduim disabled:bg-gray-600 "
      >
        {loading ? (
          <span className="loading loading-spinner text-white" />
        ) : (
          { buttonText }
        )}
      </button>
      <span
        className="w-full flex items-center justify-center text-sm text-orange-400 cursor-pointer hover:underline mt-2"
        onClick={prevStep}
      >
        Back
      </span>
    </div>
  );
};

export default StepThree;
