import { ExternalLink, Mail, MapPin, Phone, Star } from 'lucide-react';
import type { Company } from '../types';
import { mapsUrl, normalizeWebsite, phoneHref } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

interface Props {
  company: Company;
  compact?: boolean;
  onOpen: () => void;
}

export function CompanyCard({ company, compact, onOpen }: Props) {
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <article
      className="company-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('companyId', company.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
        <h3>{company.name}</h3>
        <button
          type="button"
          className={`fav-btn ${company.favorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(company.id);
          }}
          aria-label="Favori"
        >
          <Star size={14} fill={company.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      {!compact && <p className="meta">{company.specialty}</p>}
      <span className="zone-tag">{company.zone}</span>
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        {company.email && (
          <a className="card-action" href={`mailto:${company.email}`} title="Email">
            <Mail size={12} /> Mail
          </a>
        )}
        {company.phone && (
          <a className="card-action" href={phoneHref(company.phone)} title="Téléphone">
            <Phone size={12} /> Tel
          </a>
        )}
        {company.website && (
          <a
            className="card-action"
            href={normalizeWebsite(company.website)}
            target="_blank"
            rel="noreferrer"
            title="Site web"
          >
            <ExternalLink size={12} /> Site
          </a>
        )}
        {company.address && (
          <a
            className="card-action"
            href={mapsUrl(company)}
            target="_blank"
            rel="noreferrer"
            title="Carte"
          >
            <MapPin size={12} /> Carte
          </a>
        )}
      </div>
    </article>
  );
}
