import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">⚡ Taskflow</h1>
        <p className="text-slate-400 text-lg mb-8">
          Project management made simple
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 transition px-6 py-3 rounded-xl font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}