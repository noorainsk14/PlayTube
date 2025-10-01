import React from "react";
import { useNavigate } from "react-router-dom";

const StepThree = ({
  newPass,
  setNewPass,
  conPass,
  setConPass,
  loading,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-6">Reset your password</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter a new password below to regain access to your account.
      </p>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        <div>
          <label htmlFor="newPass" className="block text-sm mb-1 text-gray-300">
            New Password
          </label>
          <input
            type="password"
            id="newPass"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="mt-1 w-full mb-4 px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <label htmlFor="conPass" className="block text-sm mb-1 text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            id="conPass"
            value={conPass}
            onChange={(e) => setConPass(e.target.value)}
            className="mt-1 w-full mb-4 px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
            onClick={onClick}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </div>
      </form>

      <div
        className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
        onClick={() => navigate("/sign-in")}
      >
        Back to SignIn
      </div>
    </div>
  );
};

export default StepThree;
