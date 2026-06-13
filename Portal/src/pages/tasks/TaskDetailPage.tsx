import { useParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  return (
    <PageShell title="Task Detail">
      <p>Task ID: {taskId}</p>
      <p>Tabs: Steps | Documents | Payments</p>
    </PageShell>
  );
}
