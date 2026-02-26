import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updatePassword,
} from "../../api/user.api";
import { setUser } from "../../store/slices/authSlice";
import {
  User,
  Mail,
  Lock,
  Camera,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Save,
} from "lucide-react";

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        const u = res.data.data;
        dispatch(setUser(u));
        setForm({
          fullName: u.fullName || "",
          email: u.email || "",
          avatar: u.avatar || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setSaving(true);
      const res = await updateAccountDetails(form);
      dispatch(setUser(res.data.data.user));
      setSuccess("Profile updated successfully");
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (file) => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    try {
      setSaving(true);
      const res = await updateUserAvatar(file);
      dispatch(setUser(res.data.data.user));
      setSuccess("Avatar updated successfully");
    } catch (e) {
      setError(e.response?.data?.message || "Avatar update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword) {
      setError("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setSaving(true);
      await updatePassword({ oldPassword: currentPassword, newPassword });
      setSuccess("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      setError(e.response?.data?.message || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Centered>Loading profile…</Centered>;
  if (!user) return <Centered>User not found</Centered>;

  const initials = (user.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  const Spinner = () => (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <User className="w-[18px] h-[18px] text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 leading-tight">
            Profile
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal information and security
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 border-l-[3px] border-l-emerald-500 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold ring-2 ring-slate-100">
                {initials}
              </div>
            )}

            {/* Camera overlay */}
            <label className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
              <Camera className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files[0])}
              />
            </label>
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-slate-900 truncate">
              {user.fullName}
            </p>
            <p className="text-sm text-slate-400 truncate mt-0.5">
              {user.email}
            </p>
            <label className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5" />
              Change avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Account details */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Account Details
          </h2>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Spinner /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Change Password
          </h2>
        </div>

        {[
          {
            label: "Current Password",
            key: "currentPassword",
            placeholder: "Enter current password",
          },
          {
            label: "New Password",
            key: "newPassword",
            placeholder: "Min. 8 characters",
          },
          {
            label: "Confirm New Password",
            key: "confirmPassword",
            placeholder: "Repeat new password",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {label}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              <input
                type="password"
                value={passwordForm[key]}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, [key]: e.target.value })
                }
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          </div>
        ))}

        {/* Password strength hint */}
        {passwordForm.newPassword && (
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => {
              const strength = Math.min(
                Math.floor(passwordForm.newPassword.length / 2),
                4,
              );
              return (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength
                      ? strength <= 1
                        ? "bg-red-400"
                        : strength <= 2
                          ? "bg-amber-400"
                          : strength <= 3
                            ? "bg-indigo-400"
                            : "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              );
            })}
            <span className="text-[11px] text-slate-400 shrink-0 w-14">
              {passwordForm.newPassword.length < 4
                ? "Weak"
                : passwordForm.newPassword.length < 6
                  ? "Fair"
                  : passwordForm.newPassword.length < 8
                    ? "Good"
                    : "Strong"}
            </span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Spinner /> : <KeyRound className="w-4 h-4" />}
            {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
