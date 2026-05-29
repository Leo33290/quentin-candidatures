import {
  BarChart3,
  Calendar,
  Columns3,
  FileText,
  List,
  Map,
  Moon,
  Sun,
  Upload,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useAppStore } from './store/useAppStore';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { MapView } from './components/MapView';
import { CalendarView } from './components/CalendarView';
import { TemplatesView } from './components/TemplatesView';
import { StatsView } from './components/StatsView';
import { CompanyDrawer } from './components/CompanyDrawer';
import { Onboarding } from './components/Onboarding';
import { parseExcelFile } from './lib/importExcel';
import type { ViewId } from './types';

const NAV: { id: ViewId; label: string; icon: typeof Columns3 }[] = [
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'liste', label: 'Liste', icon: List },
  { id: 'carte', label: 'Carte', icon: Map },
  { id: 'calendrier', label: 'Calendrier', icon: Calendar },
  { id: 'modeles', label: 'Modèles', icon: FileText },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
];

function App() {
  const {
    view,
    setView,
    darkMode,
    toggleDarkMode,
    initialized,
    initFromSeed,
    importCompanies,
    search,
    setSearch,
    zoneFilter,
    setZoneFilter,
    selectedId,
    setSelectedId,
    companies,
  } = useAppStore();

  const importRef = useRef<HTMLInputElement>(null);
  const selected = companies.find((c) => c.id === selectedId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', darkMode ? '#111111' : '#fafafa');
  }, [darkMode]);

  useEffect(() => {
    if (!initialized) initFromSeed();
  }, [initialized, initFromSeed]);

  if (!initialized || companies.length === 0) {
    return (
      <div className="app-shell" data-theme={darkMode ? 'dark' : 'light'}>
        <Onboarding />
        <button
          type="button"
          className="icon-btn"
          style={{ position: 'fixed', top: 16, right: 16 }}
          onClick={toggleDarkMode}
          aria-label="Thème"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="app-header">
        <h1 className="app-title">Candidatures</h1>
        <nav className="app-nav" aria-label="Navigation principale">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav-btn ${view === id ? 'active' : ''}`}
              onClick={() => setView(id)}
            >
              <Icon size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={() => importRef.current?.click()} title="Réimporter Excel">
            <Upload size={18} />
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (!confirm('Remplacer toutes les données par ce fichier ?')) return;
              const buffer = await file.arrayBuffer();
              importCompanies(parseExcelFile(buffer), true);
            }}
          />
          <button type="button" className="icon-btn" onClick={toggleDarkMode} aria-label="Thème">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {view !== 'modeles' && view !== 'stats' && (
        <div className="search-bar">
          <input
            type="search"
            placeholder="Rechercher une agence, une zone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="">Toutes les zones</option>
            {[...new Set(companies.map((c) => c.zone))].sort().map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      )}

      <main className="app-main">
        {view === 'kanban' && <KanbanBoard />}
        {view === 'liste' && <ListView />}
        {view === 'carte' && <MapView />}
        {view === 'calendrier' && <CalendarView />}
        {view === 'modeles' && <TemplatesView />}
        {view === 'stats' && <StatsView />}
      </main>

      {selected && <CompanyDrawer company={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

export default App;
