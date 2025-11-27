"use client";

interface Props {
  form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  setForm: (v: any) => void;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
}

export default function TrainerClientsCreateScreenLayout({
  form,
  setForm,
  loading,
  error,
  onSubmit,
}: Props) {
  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Client</h1>
        <p className="text-sm text-gray-500">
          Fill in the information below to add a new client.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Last Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-2 rounded-xl border font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Client"}
        </button>
      </div>
    </div>
  );
}
