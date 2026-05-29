export type Status =
  | 'a_contacter'
  | 'mail_envoye'
  | 'relance'
  | 'entretien'
  | 'refuse'
  | 'accepte';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  companyId?: string;
  type: 'entretien' | 'relance' | 'deadline' | 'autre';
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  specialty: string;
  zone: string;
  status: Status;
  lat: number;
  lng: number;
  notes: Note[];
  checklist: ChecklistItem[];
  events: CalendarEvent[];
  favorite: boolean;
  mailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export type ViewId = 'kanban' | 'liste' | 'carte' | 'calendrier' | 'modeles' | 'stats';

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; order: number }
> = {
  a_contacter: { label: 'À contacter', color: 'var(--status-todo)', order: 0 },
  mail_envoye: { label: 'Mail envoyé', color: 'var(--status-sent)', order: 1 },
  relance: { label: 'Relance', color: 'var(--status-follow)', order: 2 },
  entretien: { label: 'Entretien', color: 'var(--status-interview)', order: 3 },
  refuse: { label: 'Refusé', color: 'var(--status-refused)', order: 4 },
  accepte: { label: 'Accepté', color: 'var(--status-accepted)', order: 5 },
};
