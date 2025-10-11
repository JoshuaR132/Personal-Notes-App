import { useState } from "react";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="text-red-500">{error}</div>}
      <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" />
      <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
