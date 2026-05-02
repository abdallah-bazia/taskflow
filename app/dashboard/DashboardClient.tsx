"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Board {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
}

interface Props {
  boards: Board[];
  user: { name?: string | null; email?: string | null; id: string };
}

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];

export default function DashboardClient({ boards: initial, user }: Props) {
  const [boards, setBoards] = useState(initial);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const createBoard = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, color }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setBoards([data, ...boards]);
      setTitle("");
      setShowForm(false);
    }
  };

  const deleteBoard = async (id: string) => {
    await fetch(`/api/boards/${id}`, { method: "DELETE" });
    setBoards(boards.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">⚡ Taskflow</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hey, {user.name} 👋</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">My Boards</h2>
            <p className="text-slate-400 text-sm mt-1">{boards.length} board{boards.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl font-semibold text-sm"
          >
            + New Board
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Create a new board</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createBoard()}
              placeholder="Board name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2 mb-4">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={createBoard}
                disabled={loading || !title.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition px-4 py-2 rounded-xl font-semibold text-sm"
              >
                {loading ? "Creating..." : "Create Board"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white transition px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Boards grid */}
        {boards.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg font-medium mb-2">No boards yet</p>
            <p className="text-sm">Create your first board to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div key={board.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition">
                <div className="h-2" style={{ backgroundColor: board.color }} />
                <div className="p-5">
                  <Link href={`/boards/${board.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-indigo-400 transition">{board.title}</h3>
                  </Link>
                  <p className="text-slate-500 text-xs">
                   {new Date(board.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}