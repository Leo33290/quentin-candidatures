import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { parseExcelFile } from '../lib/importExcel';
import { useAppStore } from '../store/useAppStore';

export function Onboarding() {
  const initFromSeed = useAppStore((s) => s.initFromSeed);
  const importCompanies = useAppStore((s) => s.importCompanies);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="onboarding">
      <h1>Candidatures Alternance</h1>
      <p>
        Bienvenue Quentin — importe ton fichier Excel ou démarre avec les{' '}
        <strong>77 agences</strong> déjà extraites de ton tableau.
      </p>
      <div className="onboarding-actions">
        <button type="button" className="btn btn-primary" onClick={() => initFromSeed()}>
          Utiliser mes données (recommandé)
        </button>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          <Upload size={16} /> Importer un fichier Excel (.xlsx)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const buffer = await file.arrayBuffer();
            const companies = parseExcelFile(buffer);
            importCompanies(companies, true);
          }}
        />
      </div>
    </div>
  );
}
