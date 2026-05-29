import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExternalLink, Mail, MapPin, Phone, Star, X } from 'lucide-react';
import { useState } from 'react';
import type { Company, Status } from '../types';
import { STATUS_CONFIG } from '../types';
import { buildMailto, fillTemplate, mapsUrl, normalizeWebsite, phoneHref } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

interface Props {
  company: Company;
  onClose: () => void;
}

export function CompanyDrawer({ company, onClose }: Props) {
  const {
    setStatus,
    toggleFavorite,
    toggleChecklist,
    addNote,
    templates,
    markMailSent,
  } = useAppStore();
  const [noteText, setNoteText] = useState('');
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '');

  const template = templates.find((t) => t.id === templateId);
  const subject = template ? fillTemplate(template.subject, company) : '';
  const body = template ? fillTemplate(template.body, company) : '';

  return (
    <div className="drawer-overlay" onClick={onClose} role="presentation">
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={company.name}>
        <header className="drawer-header">
          <div style={{ flex: 1 }}>
            <h2>{company.name}</h2>
            <p className="meta" style={{ margin: '0.25rem 0 0' }}>{company.specialty}</p>
            <span className="zone-tag">{company.zone}</span>
          </div>
          <button type="button" className={`fav-btn ${company.favorite ? 'active' : ''}`} onClick={() => toggleFavorite(company.id)}>
            <Star size={20} fill={company.favorite ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        <div className="drawer-body">
          <section className="drawer-section">
            <h4>Statut</h4>
            <select
              className="status-select"
              value={company.status}
              onChange={(e) => setStatus(company.id, e.target.value as Status)}
            >
              {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </section>

          <section className="drawer-section">
            <h4>Contact</h4>
            <p className="meta" style={{ margin: '0 0 0.5rem' }}>{company.address}</p>
            <div className="contact-grid">
              {company.email && (
                <a className="btn" href={buildMailto(company, subject, body)}>
                  <Mail size={16} /> Email
                </a>
              )}
              {company.phone && (
                <a className="btn" href={phoneHref(company.phone)}>
                  <Phone size={16} /> {company.phone}
                </a>
              )}
              {company.website && (
                <a className="btn" href={normalizeWebsite(company.website)} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Site
                </a>
              )}
              {company.address && (
                <a className="btn" href={mapsUrl(company)} target="_blank" rel="noreferrer">
                  <MapPin size={16} /> Itinéraire
                </a>
              )}
            </div>
            {company.email && template && (
              <div style={{ marginTop: '0.75rem' }}>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem' }}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn btn-primary" onClick={() => markMailSent(company.id)}>
                  Marquer mail envoyé
                </button>
              </div>
            )}
          </section>

          <section className="drawer-section">
            <h4>Checklist</h4>
            <ul className="checklist">
              {company.checklist.map((item) => (
                <li key={item.id} className={item.done ? 'done' : ''}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklist(company.id, item.id)}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>

          {company.mailSentAt && (
            <p className="meta">
              Mail envoyé le{' '}
              {format(new Date(company.mailSentAt), 'd MMMM yyyy', { locale: fr })}
            </p>
          )}

          <section className="drawer-section">
            <h4>Notes</h4>
            <ul className="notes-list">
              {company.notes.map((n) => (
                <li key={n.id} className="note-item">
                  <time>{format(new Date(n.createdAt), 'Pp', { locale: fr })}</time>
                  {n.text}
                </li>
              ))}
            </ul>
            <form
              className="note-form"
              onSubmit={(e) => {
                e.preventDefault();
                addNote(company.id, noteText);
                setNoteText('');
              }}
            >
              <textarea
                placeholder="Ajouter une note…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
            </form>
          </section>

        </div>
      </aside>
    </div>
  );
}
