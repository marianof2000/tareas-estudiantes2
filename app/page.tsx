import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Gestor de tareas para estudiantes
      </h1>

      <p className="mb-6">
        Aplicación simple usando Next.js, Vercel y Supabase.
      </p>

      <Link
        className="bg-black text-white px-4 py-2"
        href="/login"
      >
        Ingresar
      </Link>
    </main>
  );
}