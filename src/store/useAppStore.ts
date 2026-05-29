import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, Company, MailTemplate, Note, Status, ViewId } from '../types';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import seedData from '../data/seed.json';

const STORAGE_KEY = 'quentin-candidatures-v1';

interface AppState {
  companies: Company[];
  globalEvents: CalendarEvent[];
  templates: MailTemplate[];
  view: ViewId;
  darkMode: boolean;
  selectedId: string | null;
  search: string;
  zoneFilter: string;
  initialized: boolean;
  initFromSeed: () => void;
  importCompanies: (companies: Company[], replace?: boolean) => void;
  setView: (view: ViewId) => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setSelectedId: (id: string | null) => void;
  setSearch: (search: string) => void;
  setZoneFilter: (zone: string) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  setStatus: (id: string, status: Status) => void;
  toggleFavorite: (id: string) => void;
  addNote: (id: string, text: string) => void;
  toggleChecklist: (companyId: string, itemId: string) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (eventId: string) => void;
  updateTemplate: (id: string, patch: Partial<MailTemplate>) => void;
  addTemplate: (template: MailTemplate) => void;
  deleteTemplate: (id: string) => void;
  markMailSent: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      companies: [],
      globalEvents: [],
      templates: DEFAULT_TEMPLATES,
      view: 'kanban',
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      selectedId: null,
      search: '',
      zoneFilter: '',
      initialized: false,

      initFromSeed: () => {
        if (get().initialized) return;
        set({
          companies: seedData.companies as Company[],
          initialized: true,
        });
      },

      importCompanies: (companies, replace = false) => {
        set((s) => ({
          companies: replace
            ? companies
            : [...s.companies, ...companies.map((c) => ({ ...c, id: `${c.id}-${Date.now()}` }))],
          initialized: true,
        }));
      },

      setView: (view) => set({ view }),
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSelectedId: (selectedId) => set({ selectedId }),
      setSearch: (search) => set({ search }),
      setZoneFilter: (zoneFilter) => set({ zoneFilter }),

      updateCompany: (id, patch) =>
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c,
          ),
        })),

      setStatus: (id, status) => {
        const patch: Partial<Company> = { status, updatedAt: new Date().toISOString() };
        if (status === 'mail_envoye') {
          patch.mailSentAt = new Date().toISOString();
          const company = get().companies.find((c) => c.id === id);
          if (company) {
            patch.checklist = company.checklist.map((item) =>
              item.id === 'mail' ? { ...item, done: true } : item,
            );
          }
        }
        get().updateCompany(id, patch);
      },

      toggleFavorite: (id) => {
        const c = get().companies.find((x) => x.id === id);
        if (c) get().updateCompany(id, { favorite: !c.favorite });
      },

      addNote: (id, text) => {
        const company = get().companies.find((c) => c.id === id);
        if (!company || !text.trim()) return;
        const note: Note = {
          id: `note-${Date.now()}`,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        get().updateCompany(id, { notes: [note, ...company.notes] });
      },

      toggleChecklist: (companyId, itemId) => {
        const company = get().companies.find((c) => c.id === companyId);
        if (!company) return;
        get().updateCompany(companyId, {
          checklist: company.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        });
      },

      addEvent: (event) =>
        set((s) => {
          if (event.companyId) {
            return {
              companies: s.companies.map((c) =>
                c.id === event.companyId
                  ? { ...c, events: [...c.events, event], updatedAt: new Date().toISOString() }
                  : c,
              ),
            };
          }
          return { globalEvents: [...s.globalEvents, event] };
        }),

      removeEvent: (eventId) =>
        set((s) => ({
          companies: s.companies.map((c) => ({
            ...c,
            events: c.events.filter((e) => e.id !== eventId),
          })),
          globalEvents: s.globalEvents.filter((e) => e.id !== eventId),
        })),

      updateTemplate: (id, patch) =>
        set((s) => ({
          templates: s.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      addTemplate: (template) =>
        set((s) => ({ templates: [...s.templates, template] })),

      deleteTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      markMailSent: (id) => get().setStatus(id, 'mail_envoye'),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        companies: s.companies,
        globalEvents: s.globalEvents,
        templates: s.templates,
        darkMode: s.darkMode,
        initialized: s.initialized,
      }),
    },
  ),
);

export function useFilteredCompanies() {
  const companies = useAppStore((s) => s.companies);
  const search = useAppStore((s) => s.search);
  const zoneFilter = useAppStore((s) => s.zoneFilter);

  const q = search.toLowerCase().trim();
  return companies.filter((c) => {
    if (zoneFilter && c.zone !== zoneFilter) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.zone.toLowerCase().includes(q) ||
      c.specialty.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });
}

export function useZones() {
  const companies = useAppStore((s) => s.companies);
  return [...new Set(companies.map((c) => c.zone))].sort();
}

export function useAllEvents() {
  const companies = useAppStore((s) => s.companies);
  const globalEvents = useAppStore((s) => s.globalEvents);
  const fromCompanies = companies.flatMap((c) =>
    c.events.map((e) => ({ ...e, companyName: c.name })),
  );
  const standalone = globalEvents.map((e) => ({ ...e, companyName: undefined }));
  return [...fromCompanies, ...standalone].sort((a, b) => a.date.localeCompare(b.date));
}
