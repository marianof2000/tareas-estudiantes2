export type Task = {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
};

export type DashboardUser = {
  email: string;
};
