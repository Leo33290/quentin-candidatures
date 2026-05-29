import * as XLSX from 'xlsx';
import type { Company, ChecklistItem } from '../types';

const ZONE_COORDS: Record<string, [number, number]> = {
  BLANQUEFORT: [44.907, -0.636],
  EYSINES: [44.885, -0.651],
  BRUGES: [44.875, -0.615],
  'LE BOUSCAT': [44.865, -0.598],
  MÉRIGNAC: [44.832, -0.633],
  PESSAC: [44.806, -0.631],
  TALENCE: [44.804, -0.589],
  BORDEAUX: [44.837, -0.579],
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'cv', label: "CV adapté à l'agence", done: false },
  { id: 'portfolio', label: 'Portfolio / book joint', done: false },
  { id: 'mail', label: 'Mail de candidature envoyé', done: false },
  { id: 'relance7', label: 'Relance J+7 si pas de réponse', done: false },
  { id: 'relance14', label: 'Relance J+14', done: false },
];

function parseZone(cell: string): string {
  const m = cell.match(/📍\s*(.+)/);
  return m ? m[1].trim().toUpperCase() : '';
}

function jitter(zone: string, index: number): [number, number] {
  const base = ZONE_COORDS[zone] ?? [44.837, -0.579];
  const a = index * 0.0017;
  return [base[0] + Math.sin(a) * 0.008, base[1] + Math.cos(a) * 0.008];
}

function normalizeWebsite(url: string): string {
  if (!url || url === '—') return '';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}

export function parseExcelFile(buffer: ArrayBuffer): Company[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<(string | undefined)[]>(sheet, {
    header: 1,
    defval: '',
  });

  const companies: Company[] = [];
  let currentZone = 'BORDEAUX';
  let zoneIndex = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const a = String(row[0] ?? '').trim();
    if (!a || i < 1) continue;
    if (a.startsWith('📍')) {
      currentZone = parseZone(a) || currentZone;
      zoneIndex = 0;
      continue;
    }
    const address = String(row[1] ?? '').trim();
    const phone = String(row[2] ?? '').trim();
    const emailRaw = String(row[3] ?? '').trim();
    const website = normalizeWebsite(String(row[4] ?? '').trim());
    const specialty = String(row[5] ?? '').trim();
    if (!address && !phone && !specialty) continue;

    const [lat, lng] = jitter(currentZone, zoneIndex++);
    companies.push({
      id: `import-${companies.length}-${Date.now()}`,
      name: a,
      address,
      phone,
      email: emailRaw === '—' ? '' : emailRaw,
      website,
      specialty,
      zone: currentZone,
      status: 'a_contacter',
      lat,
      lng,
      notes: [],
      checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c })),
      events: [],
      favorite: false,
      mailSentAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  return companies;
}
