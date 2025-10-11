import { useState } from "react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      // optionally store user info
      // localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/"; // go to app
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <div className="text-red-500">{error}</div>}
      <input value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} placeholder="Username" />
      <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" />
      <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
