"use client";

interface Props {
  clients: any[];
  loading: boolean;
  error: string | null;
  onCreateClient: () => void;
}

export default function TrainerClientsScreenLayout({
  clients,
  loading,
  error,
  onCreateClient,
}: Props) {
  return (
    <div className="trainer-clients-page">

    <div className="trainer-clients-header">
    <div>
        <h1 className="trainer-clients-title">Your Clients</h1>
        <p className="trainer-clients-subtitle">
        These are the clients assigned to you.
        </p>
    </div>

    <button className="trainer-clients-create-btn" onClick={onCreateClient}>
        + New Client
    </button>
    </div>

    {loading && (
    <div className="client-list">
        {[1, 2, 3].map((i) => (
        <div key={i} className="client-skeleton">
            <div className="client-skeleton-line"></div>
            <div className="client-skeleton-line"></div>
        </div>
        ))}
    </div>
    )}

    {error && <div className="client-error">{error}</div>}

    {!loading && !error && (
    <div className="client-list">
        {clients.length === 0 && (
        <p className="client-empty">You currently have no clients.</p>
        )}

        {clients.map((client) => (
        <div key={client.userId ?? client.id ?? client.email} className="client-card">
          <div>
          <p className="client-card-name">{client.firstName} {client.lastName} - ClientId: {client.userId ?? client.id}</p>
          <p className="client-card-email">{client.email}</p>
          </div>
        </div>
        ))}
    </div>
    )}
    </div>

  );
}
