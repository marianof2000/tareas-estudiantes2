'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  createTaskAction,
  deleteTaskAction,
  logoutAction,
  toggleTaskAction,
  type ActionState,
} from './actions';
import { type DashboardUser, type Task } from '../../lib/types';

type DashboardClientProps = {
  initialError: string;
  initialTasks: Task[];
  user: DashboardUser;
};

function SubmitButton({
  children,
  className,
  pendingText,
}: {
  children: React.ReactNode;
  className: string;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingText : children}
    </button>
  );
}

export default function DashboardClient({
  initialError,
  initialTasks,
  user,
}: DashboardClientProps) {
  const createInitialState: ActionState = {
    message: initialError,
    status: initialError ? 'error' : 'idle',
  };

  const [state, formAction] = useActionState(
    createTaskAction,
    createInitialState
  );

  const message = state.message || initialError;
  const status = state.status === 'idle' && initialError ? 'error' : state.status;

  return (
    <main className="mx-auto mt-10 w-full max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mis tareas</h1>

        <form action={logoutAction}>
          <SubmitButton
            className="border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            pendingText="Saliendo..."
          >
            Salir
          </SubmitButton>
        </form>
      </div>

      <p className="mb-4 text-sm">Usuario: {user.email}</p>

      <section className="mb-6 rounded-lg border p-4">
        <h2 className="mb-3 text-xl font-semibold">Nueva tarea</h2>

        <form action={formAction}>
          <input
            className="mb-3 w-full border p-2"
            name="title"
            required
            type="text"
            placeholder="Título"
          />

          <textarea
            className="mb-3 min-h-24 w-full border p-2"
            name="description"
            placeholder="Descripción"
          />

          <SubmitButton
            className="bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingText="Creando..."
          >
            Crear tarea
          </SubmitButton>
        </form>
      </section>

      {message && (
        <p
          className={`mb-4 ${
            status === 'success' ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <section>
        {initialTasks.length === 0 ? (
          <p>No hay tareas cargadas.</p>
        ) : (
          initialTasks.map((task) => (
            <article key={task.id} className="mb-3 rounded-lg border p-4">
              <h3 className="font-bold">{task.title}</h3>

              {task.description && (
                <p className="mb-2 text-sm">{task.description}</p>
              )}

              <p className="mb-3 text-sm">
                Estado: {task.is_completed ? 'Completada' : 'Pendiente'}
              </p>

              <div className="flex flex-wrap gap-2">
                <form action={toggleTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <input
                    name="isCompleted"
                    type="hidden"
                    value={String(task.is_completed)}
                  />
                  <SubmitButton
                    className="border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
                    pendingText="Guardando..."
                  >
                    Cambiar estado
                  </SubmitButton>
                </form>

                <form action={deleteTaskAction}>
                  <input name="taskId" type="hidden" value={task.id} />
                  <SubmitButton
                    className="border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
                    pendingText="Eliminando..."
                  >
                    Eliminar
                  </SubmitButton>
                </form>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
