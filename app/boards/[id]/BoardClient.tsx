"use client";

import { useState } from "react";
import Link from "next/link";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  order: number;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  color: string;
  columns: Column[];
}

export default function BoardClient({ board: initial }: { board: Board }) {
  const [board, setBoard] = useState(initial);
  const [newColTitle, setNewColTitle] = useState("");
  const [addingCol, setAddingCol] = useState(false);
  const [loading, setLoading] = useState(false);

  const addColumn = async () => {
    if (!newColTitle.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/boards/${board.id}/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newColTitle }),
    });
    const col = await res.json();
    setLoading(false);
    if (res.ok) {
      setBoard({ ...board, columns: [...board.columns, { ...col, tasks: [] }] });
      setNewColTitle("");
      setAddingCol(false);
    }
  };

  const deleteColumn = async (colId: string) => {
    await fetch(`/api/columns/${colId}`, { method: "DELETE" });
    setBoard({ ...board, columns: board.columns.filter((c) => c.id !== colId) });
  };

  const addTask = async (columnId: string, title: string) => {
    const res = await fetch(`/api/columns/${columnId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const task = await res.json();
    if (res.ok) {
      setBoard({
        ...board,
        columns: board.columns.map((c) =>
          c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c
        ),
      });
    }
  };

  const deleteTask = async (columnId: string, taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    setBoard({
      ...board,
      columns: board.columns.map((c) =>
        c.id === columnId
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c
      ),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-slate-400 hover:text-white transition text-sm">
          ← Dashboard
        </Link>
        <div className="w-px h-4 bg-slate-700" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: board.color }} />
          <h1 className="font-bold">{board.title}</h1>
        </div>
      </nav>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 items-start min-w-max">
          {board.columns.map((col) => (
            <div
              key={col.id}
              className="w-72 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col"
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{col.title}</span>
                  <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                    {col.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => deleteColumn(col.id)}
                  className="text-slate-600 hover:text-red-400 transition text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Tasks */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                {col.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => deleteTask(col.id, task.id)}
                  />
                ))}
              </div>

              {/* Add task */}
              <AddTaskInput columnId={col.id} onAdd={(title) => addTask(col.id, title)} />
            </div>
          ))}

          {/* Add column */}
          <div className="w-72 shrink-0">
            {addingCol ? (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <input
                  autoFocus
                  type="text"
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addColumn()}
                  placeholder="Column name..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addColumn}
                    disabled={loading || !newColTitle.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition px-3 py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setAddingCol(false)}
                    className="text-slate-400 hover:text-white transition text-sm px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingCol(true)}
                className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 border-dashed rounded-2xl py-4 text-slate-500 hover:text-white transition text-sm"
              >
                + Add Column
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTaskInput({ columnId, onAdd }: { columnId: string; onAdd: (title: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="p-3 pt-0">
      {adding ? (
        <div>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Task title..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1.5 rounded-lg text-xs font-semibold">
              Add Task
            </button>
            <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-white transition text-xs px-2">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full text-slate-500 hover:text-white hover:bg-slate-800 transition rounded-xl py-2 text-sm text-left px-3"
        >
          + Add task
        </button>
      )}
    </div>
  );
}