import { useState } from 'react';

type FilterState = {
  status: string;
  priority: string;
  search: string;
};

type FilterBarProps = {
  onFilterChange: (filters: FilterState) => void;
};

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');

  const applyFilters = () => {
    onFilterChange({
      status,
      priority,
      search,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border rounded shadow-sm">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title"
        className="p-2 border rounded"
      />

      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterBar;

