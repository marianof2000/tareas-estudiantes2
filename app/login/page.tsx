'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setMessage('');
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.session) {
      setMessage('Usuario registrado. Revisá tu email para confirmar la cuenta.');
      return;
    }

    router.push('/dashboard');
  }

  async function handleLogin() {
    setMessage('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

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
        required
        disabled={isSubmitting}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        type="password"
        placeholder="Contraseña"
        required
        disabled={isSubmitting}
        minLength={6}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button
        className="w-full bg-black text-white p-2 mb-3 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={handleLogin}
      >
        {isSubmitting ? 'Procesando...' : 'Iniciar sesión'}
      </button>

      <button
        className="w-full border p-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={handleRegister}
      >
        Registrarse
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  );
}
