import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/slices/authSlice";
import { loginUser } from "../../services/auth.service";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/common/FormInput";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import getErrorMessage from "../../utils/getErrorMessage";

const ROLE_HOME = {
  user: "/user/dashboard",
  driver: "/driver/dashboard",
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email or username is required";
    if (!form.password) next.password = "Password is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await loginUser({ email: form.email, password: form.password });
      const { user, accessToken } = res.data.data;

      // Admin accounts belong to the admin app only
      if (user.role === "admin") {
        setApiError(
          "Admin accounts are managed through the separate Admin application. Please use the admin portal to sign in."
        );
        return;
      }

      dispatch(setCredentials({ user, accessToken }));
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to continue"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={apiError} />

        <FormInput
          label="Email or Username"
          id="email"
          name="email"
          type="text"
          autoComplete="username"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" loading={loading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-red-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
