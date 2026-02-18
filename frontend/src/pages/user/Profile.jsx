import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updatePassword,
} from "../../api/user.api";
import { setUser } from "../../store/slices/authSlice";

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

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
        // console.log(u, ":User data");
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
      setSuccess("Avatar updated");
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
      await updatePassword({
        oldPassword: currentPassword,
        newPassword,
      });
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

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Header />

      {error && <ErrorBox>{error}</ErrorBox>}
      {success && <SuccessBox>{success}</SuccessBox>}

      <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-medium">
            {user.fullName?.[0] || "U"}
            {console.log(user)}
          </div>
        )}

        <div>
          <p className="text-lg font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>

          <label className="mt-2 inline-block text-sm text-blue-600 cursor-pointer">
            Change avatar
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      <form
        onSubmit={handleUpdateProfile}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold">Account Details</h2>

        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(v) => setForm({ ...form, fullName: v })}
        />

        <Input
          label="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />

        <div className="flex justify-end">
          <button
            disabled={saving}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold">Change Password</h2>

        <Input
          label="Current Password"
          type="password"
          value={passwordForm.currentPassword}
          onChange={(v) =>
            setPasswordForm({ ...passwordForm, currentPassword: v })
          }
        />

        <Input
          label="New Password"
          type="password"
          value={passwordForm.newPassword}
          onChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })}
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(v) =>
            setPasswordForm({ ...passwordForm, confirmPassword: v })
          }
        />

        <div className="flex justify-end">
          <button
            disabled={saving}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

const Header = () => (
  <div>
    <h1 className="text-2xl font-semibold">Profile</h1>
    <p className="text-sm text-gray-500">Manage your personal information</p>
  </div>
);

const Centered = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    {children}
  </div>
);

const ErrorBox = ({ children }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
    {children}
  </div>
);

const SuccessBox = ({ children }) => (
  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded text-sm">
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2 text-sm"
    />
  </div>
);
