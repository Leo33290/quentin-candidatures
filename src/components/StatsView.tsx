import { differenceInDays, parseISO } from 'date-fns';
import { STATUS_CONFIG, type Status } from '../types';
import { formatPercent } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

export function StatsView() {
  const companies = useAppStore((s) => s.companies);
  const setSelectedId = useAppStore((s) => s.setSelectedId);

  const needsRelance = companies.filter((c) => {
    if (c.status !== 'mail_envoye' || !c.mailSentAt) return false;
    return differenceInDays(new Date(), parseISO(c.mailSentAt)) >= 7;
  });
  const total = companies.length;
  const sent = companies.filter((c) => c.status !== 'a_contacter').length;
  const interviews = companies.filter((c) => c.status === 'entretien').length;
  const accepted = companies.filter((c) => c.status === 'accepte').length;
  const refused = companies.filter((c) => c.status === 'refuse').length;
  const favorites = companies.filter((c) => c.favorite).length;

  const byZone = companies.reduce<Record<string, number>>((acc, c) => {
    acc[c.zone] = (acc[c.zone] ?? 0) + 1;
    return acc;
  }, {});
  const maxZone = Math.max(...Object.values(byZone), 1);

  const byStatus = (Object.keys(STATUS_CONFIG) as Status[]).map((s) => ({
    status: s,
    count: companies.filter((c) => c.status === s).length,
    label: STATUS_CONFIG[s].label,
    color: STATUS_CONFIG[s].color,
  }));
  const maxStatus = Math.max(...byStatus.map((x) => x.count), 1);

  return (
    <div>
      {needsRelance.length > 0 && (
        <div
          className="template-card"
          style={{ marginBottom: '1.5rem', borderColor: 'var(--status-follow)' }}
        >
          <strong>Relances suggérées ({needsRelance.length})</strong>
          <p className="meta" style={{ margin: '0.35rem 0 0.75rem' }}>
            Mail envoyé il y a plus de 7 jours sans changement de statut.
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
            {needsRelance.slice(0, 8).map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="nav-btn"
                  style={{ padding: '0.2rem 0', background: 'none', color: 'var(--text)' }}
                  onClick={() => setSelectedId(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{total}</div>
          <div className="label">Agences au total</div>
        </div>
        <div className="stat-card">
          <div className="value">{sent}</div>
          <div className="label">Contactées ({formatPercent(sent, total)})</div>
        </div>
        <div className="stat-card">
          <div className="value">{interviews}</div>
          <div className="label">Entretiens</div>
        </div>
        <div className="stat-card">
          <div className="value">{accepted}</div>
          <div className="label">Acceptées</div>
        </div>
        <div className="stat-card">
          <div className="value">{refused}</div>
          <div className="label">Refusées</div>
        </div>
        <div className="stat-card">
          <div className="value">{favorites}</div>
          <div className="label">Favoris</div>
        </div>
      </div>

      <h3>Par statut</h3>
      <div className="bar-chart">
        {byStatus.map(({ status, count, label, color }) => (
          <div key={status} className="bar-row">
            <span>{label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(count / maxStatus) * 100}%`, background: color }}
              />
            </div>
            <span>{count}</span>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '2rem' }}>Par zone</h3>
      <div className="bar-chart">
        {Object.entries(byZone)
          .sort((a, b) => b[1] - a[1])
          .map(([zone, count]) => (
            <div key={zone} className="bar-row">
              <span>{zone}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / maxZone) * 100}%` }} />
              </div>
              <span>{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
