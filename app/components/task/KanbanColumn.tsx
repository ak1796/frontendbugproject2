import { useDroppable } from '@dnd-kit/core';
import SortableTask from './SortableTask';
import type { Task } from './KanbanBoard';

type Props = {
  id: string;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

const KanbanColumn = ({ id, title, tasks, onEdit, onDelete }: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="bg-gray-100 p-4 rounded-md min-h-[300px]">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div ref={setNodeRef} className="space-y-2">
        {tasks.map((task) => (
          <SortableTask
            key={task._id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
