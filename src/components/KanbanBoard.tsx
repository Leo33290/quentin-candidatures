import type { Company, Status } from '../types';
import { STATUS_CONFIG } from '../types';
import { useAppStore, useFilteredCompanies } from '../store/useAppStore';
import { CompanyCard } from './CompanyCard';

const COLUMNS: Status[] = [
  'a_contacter',
  'mail_envoye',
  'relance',
  'entretien',
  'refuse',
  'accepte',
];

export function KanbanBoard() {
  const filtered = useFilteredCompanies();
  const setStatus = useAppStore((s) => s.setStatus);
  const setSelectedId = useAppStore((s) => s.setSelectedId);

  const byStatus = (status: Status) =>
    filtered
      .filter((c) => c.status === status)
      .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

  return (
    <div className="kanban">
      {COLUMNS.map((status) => {
        const items = byStatus(status);
        const cfg = STATUS_CONFIG[status];
        return (
          <div
            key={status}
            className="kanban-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('companyId');
              if (id) setStatus(id, status);
            }}
          >
            <div className="kanban-col-header">
              <span className="kanban-col-dot" style={{ background: cfg.color }} />
              {cfg.label}
              <span className="kanban-col-count">{items.length}</span>
            </div>
            <div className="kanban-col-body">
              {items.length === 0 && (
                <p className="empty-hint" style={{ padding: '1rem 0' }}>
                  Glisse une carte ici
                </p>
              )}
              {items.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  onOpen={() => setSelectedId(c.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
