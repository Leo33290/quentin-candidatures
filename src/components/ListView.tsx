import { STATUS_CONFIG } from '../types';
import type { Status } from '../types';
import { useAppStore, useFilteredCompanies } from '../store/useAppStore';

export function ListView() {
  const filtered = useFilteredCompanies();
  const setSelectedId = useAppStore((s) => s.setSelectedId);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="list-table">
        <thead>
          <tr>
            <th>Entreprise</th>
            <th>Zone</th>
            <th>Spécialité</th>
            <th>Statut</th>
            <th>Email</th>
            <th>Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} onClick={() => setSelectedId(c.id)}>
              <td>
                {c.favorite ? '★ ' : ''}
                {c.name}
              </td>
              <td>{c.zone}</td>
              <td>{c.specialty}</td>
              <td>{STATUS_CONFIG[c.status as Status].label}</td>
              <td>{c.email || '—'}</td>
              <td>{c.phone || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p className="empty-hint">Aucune entreprise trouvée</p>}
    </div>
  );
}
