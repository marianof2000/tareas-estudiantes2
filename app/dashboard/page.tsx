import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '../../lib/supabaseServer';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, title, description, is_completed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient
      initialError={error?.message ?? ''}
      initialTasks={tasks ?? []}
      user={{ email: user.email ?? 'Sin email' }}
    />
  );
}
