import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import  { type Task } from './KanbanBoard';
import { Pencil, Trash2 } from 'lucide-react';

type Props = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
};

const SortableTask = ({ task, onEdit, onDelete }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded shadow cursor-move flex justify-between items-start"
    >
      <div>
        <h4 className="font-semibold">{task.title}</h4>
        <p className="text-sm text-gray-600">Priority: {task.priority}</p>
        <p className="text-xs text-gray-400">Status: {task.status}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-blue-500">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SortableTask;
