import { useState } from "react";
import { useRouter } from "next/router";
import { loginAdmin } from "../../lib/auth";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'ideatama123') {
      loginAdmin(remember);
      toast.success('Login berhasil!');
      router.push('/admin');
    } else {
      toast.error('Username atau Password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Admin</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="remember"
            className="mr-2"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember" className="text-sm">Remember Me</label>
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700">
          Login
        </button>
      </form>
    </div>
  );
}
