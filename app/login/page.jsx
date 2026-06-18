'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');

  async function handleRegister() {
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Usuario registrado. Ahora podés iniciar sesión.');
  }

  async function handleLogin() {
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Ingreso</h1>

      <input
        className="w-full border p-2 mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button
        className="w-full bg-black text-white p-2 mb-3"
        onClick={handleLogin}
      >
        Iniciar sesión
      </button>

      <button
        className="w-full border p-2"
        onClick={handleRegister}
      >
        Registrarse
      </button>

      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}
    </main>
  );
}