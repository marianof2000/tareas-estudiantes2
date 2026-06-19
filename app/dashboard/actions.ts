'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '../../lib/supabaseServer';

export type ActionState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

const dashboardPath = '/dashboard';

async function getAuthenticatedSupabase() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return { supabase, user };
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function createTaskAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = getFormString(formData, 'title');
  const description = getFormString(formData, 'description');

  if (!title) {
    return {
      message: 'El título es obligatorio.',
      status: 'error',
    };
  }

  const { supabase, user } = await getAuthenticatedSupabase();

  const { error } = await supabase.from('tasks').insert([
    {
      title,
      description: description || null,
      user_id: user.id,
    },
  ]);

  if (error) {
    return {
      message: error.message,
      status: 'error',
    };
  }

  revalidatePath(dashboardPath);

  return {
    message: 'Tarea creada.',
    status: 'success',
  };
}

export async function toggleTaskAction(formData: FormData) {
  const taskId = getFormString(formData, 'taskId');
  const isCompleted = getFormString(formData, 'isCompleted') === 'true';

  if (!taskId) {
    return;
  }

  const { supabase, user } = await getAuthenticatedSupabase();

  await supabase
    .from('tasks')
    .update({ is_completed: !isCompleted })
    .eq('id', taskId)
    .eq('user_id', user.id);

  revalidatePath(dashboardPath);
}

export async function deleteTaskAction(formData: FormData) {
  const taskId = getFormString(formData, 'taskId');

  if (!taskId) {
    return;
  }

  const { supabase, user } = await getAuthenticatedSupabase();

  await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id);

  revalidatePath(dashboardPath);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect('/login');
}
