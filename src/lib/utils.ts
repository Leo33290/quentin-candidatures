import type { Company } from '../types';

export function normalizeWebsite(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}

export function buildMailto(company: Company, subject: string, body: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString();
  return `mailto:${company.email}${q ? `?${q}` : ''}`;
}

export function fillTemplate(
  text: string,
  company: Company,
  extra: Record<string, string> = {},
): string {
  const vars: Record<string, string> = {
    entreprise: company.name,
    specialite: company.specialty,
    zone: company.zone,
    adresse: company.address,
    ...extra,
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

export function mapsUrl(company: Company): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;
}

export function phoneHref(phone: string): string {
  const digits = phone.replace(/\s/g, '');
  return `tel:${digits}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function formatPercent(n: number, total: number): string {
  if (total === 0) return '0 %';
  return `${Math.round((n / total) * 100)} %`;
}
