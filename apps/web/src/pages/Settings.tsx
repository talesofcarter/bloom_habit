import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { isAxiosError } from "axios";
import {
  IconUser,
  IconShieldLock,
  IconTrash,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function Settings() {
  const { user } = useAuth();

  // Profile State
  const [name, setName] = useState(user?.name || "");

  // Password State
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- New State

  // Password Visibility State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Danger Zone State
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Handlers ---

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Frontend Validation: Ensure passwords match before hitting the API
    if (newPassword !== confirmPassword) {
      setPasswordError("Your new passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await api.put("/users/password", { currentPassword, newPassword });
      setPasswordSuccess(true);

      // Clear all fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

      setTimeout(() => {
        setIsEditingPassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setPasswordError(err.response.data.error);
      } else {
        setPasswordError("A network error occurred.");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      await api.delete("/users");
      window.location.href = "/register";
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setDeleteError(err.response.data.error);
      } else {
        setDeleteError("Failed to connect to the server.");
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide">
          Your <span className="font-medium">Settings</span>.
        </h1>
        <p className="text-sm text-white/50 tracking-wide">
          Manage your profile, preferences, and privacy.
        </p>
      </div>

      <div className="space-y-8">
        {/* PROFILE SECTION */}
        <section className="bg-white/3 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-brand-green/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <IconUser size={20} className="text-white/70" stroke={1.5} />
            </div>
            <h2 className="text-lg font-medium text-white tracking-wide">
              Profile Information
            </h2>
          </div>

          <div className="space-y-6 relative z-10 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-widest text-white/50 uppercase">
                  Preferred Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-widest text-white/50 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & DANGER ZONE SECTION */}
        <section className="bg-white/3 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <IconShieldLock
                size={20}
                className="text-white/70"
                stroke={1.5}
              />
            </div>
            <h2 className="text-lg font-medium text-white tracking-wide">
              Security
            </h2>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* Update Password Engine */}
            <div className="p-5 rounded-2xl border border-white/5 bg-white/2 transition-all duration-300">
              {!isEditingPassword ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-white">Password</h3>
                    <p className="text-xs text-white/50 mt-1">
                      Ensure your account is using a long, random password.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-colors border border-white/10 whitespace-nowrap"
                  >
                    Update Password
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleUpdatePassword}
                  className="space-y-4 animate-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-brand-green">
                      Change your password
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingPassword(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <IconX size={18} />
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Current Password Field */}
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-brand-green"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                      >
                        {showCurrent ? (
                          <IconEyeOff size={18} />
                        ) : (
                          <IconEye size={18} />
                        )}
                      </button>
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        placeholder="New Password (min 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-brand-green"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                      >
                        {showNew ? (
                          <IconEyeOff size={18} />
                        ) : (
                          <IconEye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-brand-green"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                      >
                        {showConfirm ? (
                          <IconEyeOff size={18} />
                        ) : (
                          <IconEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={
                        isSavingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      className="bg-brand-green text-black font-bold tracking-widest uppercase text-xs px-6 py-3 rounded-xl hover:bg-brand-green-hover transition-colors disabled:opacity-50"
                    >
                      {isSavingPassword ? "Saving..." : "Confirm Change"}
                    </button>
                    {passwordSuccess && (
                      <span className="text-brand-green text-xs font-medium flex items-center gap-1 animate-in fade-in">
                        <IconCheck size={16} /> Updated
                      </span>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Delete Account Engine */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 ${isConfirmingDelete ? "border-red-500/30 bg-red-500/10" : "border-red-500/10 bg-red-500/5"}`}
            >
              {!isConfirmingDelete ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Delete Account
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      Permanently remove your data and journal history.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold tracking-widest uppercase rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <IconTrash size={16} />
                    Delete Account
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-red-400 mb-1">
                      Are you absolutely sure?
                    </h3>
                    <p className="text-xs text-red-400/70">
                      This action will permanently delete your account, your
                      current streak, and every check-in you have ever written.
                      This cannot be undone.
                    </p>
                  </div>

                  {deleteError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 text-white text-xs rounded-lg">
                      {deleteError}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold tracking-widest uppercase text-xs px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Destroy My Data"}
                    </button>
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      disabled={isDeleting}
                      className="text-white/50 hover:text-white text-xs font-semibold tracking-widest uppercase px-4 py-3 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
