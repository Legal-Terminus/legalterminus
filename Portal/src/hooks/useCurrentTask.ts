import { useQuery } from '@tanstack/react-query';
import { getTask } from '../api/tasks';

export function useCurrentTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
  });
}
