import { format, parseISO, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import type { CalendarEvent } from '../types';
import { useAppStore, useAllEvents, useFilteredCompanies } from '../store/useAppStore';

export function CalendarView() {
  const events = useAllEvents();
  const companies = useFilteredCompanies();
  const addEvent = useAppStore((s) => s.addEvent);
  const removeEvent = useAppStore((s) => s.removeEvent);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('entretien');

  const upcoming = events.filter((e) => !isPast(parseISO(e.date)) || isToday(parseISO(e.date)));
  const past = events.filter((e) => isPast(parseISO(e.date)) && !isToday(parseISO(e.date)));

  return (
    <div className="calendar-layout">
      <div>
        <h3 style={{ marginTop: 0 }}>À venir</h3>
        {upcoming.length === 0 && <p className="empty-hint">Aucun événement planifié</p>}
        <ul className="event-list">
          {upcoming.map((e) => (
            <li key={e.id} className="event-item">
              <div style={{ flex: 1 }}>
                <strong>{e.title}</strong>
                <div className="meta">
                  {format(parseISO(e.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  {e.time ? ` · ${e.time}` : ''}
                  {e.companyName ? ` · ${e.companyName}` : ''}
                </div>
              </div>
              <button type="button" className="icon-btn" onClick={() => removeEvent(e.id)} aria-label="Supprimer">
                ×
              </button>
            </li>
          ))}
        </ul>

        {past.length > 0 && (
          <>
            <h3>Passés</h3>
            <ul className="event-list">
              {past.slice(0, 10).map((e) => (
                <li key={e.id} className="event-item" style={{ opacity: 0.7 }}>
                  <div>
                    <strong>{e.title}</strong>
                    <div className="meta">
                      {format(parseISO(e.date), 'd MMM yyyy', { locale: fr })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <form
        className="event-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !date) return;
          const event: CalendarEvent = {
            id: `evt-${Date.now()}`,
            title: title.trim(),
            date,
            time: time || undefined,
            companyId: companyId || undefined,
            type,
          };
          addEvent(event);
          setTitle('');
          setDate('');
          setTime('');
          setCompanyId('');
        }}
      >
        <h3 style={{ margin: 0 }}>Nouvel événement</h3>
        <input placeholder="Titre (ex. Entretien Act' Architecture)" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value as CalendarEvent['type'])}>
          <option value="entretien">Entretien</option>
          <option value="relance">Relance</option>
          <option value="deadline">Deadline école</option>
          <option value="autre">Autre</option>
        </select>
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
          <option value="">Sans entreprise</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>
    </div>
  );
}
