import Link from "next/link";

export default function HomeScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
            <main className="mx-auto max-w-5xl py-20 px-6">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Fitness App</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300">A lightweight trainer/client workout management app — built with Next.js.</p>
                </header>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Get started</h2>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-300">Log in to your account to access role-specific dashboards. Managers can create trainers and clients; trainers manage programs; clients view assigned workouts.</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">Login</Link>
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">About this hand-in</h2>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-300">This frontend demonstrates role-based flows using a backend API. Seed the API group and create users via the provided endpoints before testing manager flows.</p>
                        <ul className="mt-3 list-inside list-disc text-zinc-600 dark:text-zinc-300">
                            <li>Manager: create trainers & clients</li>
                            <li>Trainer: create and assign workout programs</li>
                            <li>Client: view and follow assigned programs</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}