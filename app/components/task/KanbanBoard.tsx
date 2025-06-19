import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import KanbanColumn from './KanbanColumn';
import FilterBar from './FilterBar';
import TaskModal from './TaskModal';

export type Task = {
  _id: string;
  title: string;
  priority: string;
  status: string;
};

type Props = {
  projectId: string;
};

type Filters = {
  status: string;
  priority: string;
  search: string;
};

const KanbanBoard = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    priority: '',
    search: '',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const statuses = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    fetchFilteredTasks();
  }, [projectId, filters]);

  const fetchFilteredTasks = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    params.append('projectId', projectId);

    const res = await axios.get(`/api/task?${params.toString()}`);
    setTasks(res.data);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find((t) => t._id === active.id);
    if (!draggedTask) return;

    const newStatus = over.id.toString();
    await axios.put(`/api/task/${draggedTask._id}`, { status: newStatus });

    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggedTask._id ? { ...t, status: newStatus } : t
      )
    );
  };

  const handleEdit = (task: Task) => setEditingTask(task);

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await axios.delete(`/api/task/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleModalSave = async (updatedTask: Task) => {
    await axios.put(`/api/task/${updatedTask._id}`, updatedTask);
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
    setEditingTask(null);
  };

  return (
    <div className="space-y-4">
      <FilterBar onFilterChange={setFilters} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <SortableContext
              key={status}
              items={tasks.filter((t) => t.status === status).map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={status}
                title={status}
                tasks={tasks.filter((t) => t.status === status)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
