import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "dayatalamsyah@gmail.com" && password === "ideatama123!") {
      setIsLoggedIn(true);
    } else {
      alert("Email atau password salah!");
    }
  };

  if (isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Selamat Datang, Admin!</h1>
          <p className="mb-2">Dashboard PT. IC-IDEATAMA</p>
          <p className="text-sm text-gray-500">Fitur kelola layanan, kontak, galeri dan laporan segera tersedia!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded"
          required
        />
        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700">
          Login
        </button>
      </form>
    </main>
  );
}
