import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });
      setAuth({ user: data.user, loading: false });
      alert(data.message);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("error:" + error?.response?.data?.message);
    }
  };
  return (
    <form className="bg-gray-200 h-50" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border"
      />
      <button type="submit" className="border">
        Login
      </button>
    </form>
  );
};

export default Login;
