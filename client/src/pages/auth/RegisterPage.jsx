import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/common/FormInput";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import getErrorMessage from "../../utils/getErrorMessage";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
  });
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
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    if (!form.phone.trim()) next.phone = "Phone number is required";
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
      // role is intentionally not sent — backend defaults it to "user"
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        username: form.username,
        password: form.password,
        phone: form.phone,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Rapid Rescue to request ambulance services"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={apiError} />

        <FormInput
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <FormInput
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          label="Username"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="johndoe"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />

        <PasswordInput
          label="Password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <FormInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="03001234567"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Button type="submit" loading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
