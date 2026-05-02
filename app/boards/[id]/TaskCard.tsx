"use client";

interface Task {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  task: Task;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  return (
    <div className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-3 cursor-pointer transition">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-white leading-snug">{task.title}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs shrink-0"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
      )}
    </div>
  );
}