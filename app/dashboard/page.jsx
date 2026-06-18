'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      router.push('/login');
      return;
    }

    setUser(data.user);
    loadTasks();
  }

  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTasks(data);
  }

  async function createTask() {
    if (!title.trim()) {
      setMessage('El título es obligatorio.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          user_id: userData.user.id,
        },
      ]);

    if (error) {
      setMessage(error.message);
      return;
    }

    setTitle('');
    setDescription('');
    setMessage('');
    loadTasks();
  }

  async function toggleTask(task) {
    const { error } = await supabase
      .from('tasks')
      .update({
        is_completed: !task.is_completed,
      })
      .eq('id', task.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    loadTasks();
  }

  async function deleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      setMessage(error.message);
      return;
    }

    loadTasks();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <main className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis tareas</h1>

        <button
          className="border px-3 py-2"
          onClick={logout}
        >
          Salir
        </button>
      </div>

      {user && (
        <p className="mb-4 text-sm">
          Usuario: {user.email}
        </p>
      )}

      <section className="border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Nueva tarea</h2>

        <input
          className="w-full border p-2 mb-3"
          type="text"
          placeholder="Título"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Descripción"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2"
          onClick={createTask}
        >
          Crear tarea
        </button>
      </section>

      {message && (
        <p className="mb-4 text-red-600">
          {message}
        </p>
      )}

      <section>
        {tasks.length === 0 ? (
          <p>No hay tareas cargadas.</p>
        ) : (
          tasks.map((task) => (
            <article
              key={task.id}
              className="border rounded-lg p-4 mb-3"
            >
              <h3 className="font-bold">
                {task.title}
              </h3>

              <p className="text-sm mb-2">
                {task.description}
              </p>

              <p className="text-sm mb-3">
                Estado: {task.is_completed ? 'Completada' : 'Pendiente'}
              </p>

              <button
                className="border px-3 py-1 mr-2"
                onClick={() => toggleTask(task)}
              >
                Cambiar estado
              </button>

              <button
                className="border px-3 py-1"
                onClick={() => deleteTask(task.id)}
              >
                Eliminar
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}