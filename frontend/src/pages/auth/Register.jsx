import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { registerUser } from "../../api/user.api";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Image,
  ImagePlus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    dispatch(loginStart());

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await registerUser(formData);
      const { user, accessToken } = res.data.data;

      dispatch(
        loginSuccess({
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            isSuperAdmin: user.isSuperAdmin,
            avatar: user.avatar,
          },
          accessToken,
        }),
      );

      navigate("/tenants/select");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      setFormError(message);
      dispatch(loginFailure(message));
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-colors";

  const iconClass =
    "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1.5";

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          Get started
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          Create account.
        </h1>
      </div>

      {/* Error */}
      {formError && (
        <div className="mb-6 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className={labelClass}>Username</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <Lock className={iconClass} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Avatar + Cover — side by side */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Avatar */}
          <div>
            <label className={labelClass}>
              Avatar{" "}
              <span className="text-red-400 normal-case tracking-normal">
                *
              </span>
            </label>
            <label className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 cursor-pointer transition-colors group">
              <Image className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              <span className="text-xs text-zinc-400 group-hover:text-zinc-600 transition-colors text-center leading-tight px-2 truncate w-full text-center">
                {avatar ? avatar.name : "Upload avatar"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
              />
            </label>
          </div>

          {/* Cover Image */}
          <div>
            <label className={labelClass}>
              Cover{" "}
              <span className="text-zinc-300 normal-case tracking-normal">
                (opt)
              </span>
            </label>
            <label className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 cursor-pointer transition-colors group">
              <ImagePlus className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
              <span className="text-xs text-zinc-300 group-hover:text-zinc-500 transition-colors text-center leading-tight px-2 truncate w-full text-center">
                {coverImage ? coverImage.name : "Upload cover"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin w-4 h-4 text-white"
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
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-7 border-t border-zinc-100" />

      <p className="text-sm text-zinc-400 text-center">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
