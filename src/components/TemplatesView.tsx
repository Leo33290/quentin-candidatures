import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { MailTemplate } from '../types';

export function TemplatesView() {
  const { templates, updateTemplate, addTemplate, deleteTemplate } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="templates-grid">
      <p className="meta" style={{ margin: 0 }}>
        Utilise les variables <code>{'{{entreprise}}'}</code>, <code>{'{{specialite}}'}</code>,{' '}
        <code>{'{{zone}}'}</code> — remplies automatiquement depuis la fiche entreprise.
      </p>
      {templates.map((t) => (
        <TemplateEditor
          key={t.id}
          template={t}
          isEditing={editingId === t.id}
          onEdit={() => setEditingId(t.id)}
          onSave={(patch) => {
            updateTemplate(t.id, patch);
            setEditingId(null);
          }}
          onDelete={() => deleteTemplate(t.id)}
        />
      ))}
      <button
        type="button"
        className="btn"
        onClick={() => {
          const id = `tpl-${Date.now()}`;
          addTemplate({
            id,
            name: 'Nouveau modèle',
            subject: '',
            body: '',
          });
          setEditingId(id);
        }}
      >
        + Ajouter un modèle
      </button>
    </div>
  );
}

function TemplateEditor({
  template,
  isEditing,
  onEdit,
  onSave,
  onDelete,
}: {
  template: MailTemplate;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<MailTemplate>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  if (!isEditing) {
    return (
      <div className="template-card">
        <strong>{template.name}</strong>
        <p className="meta" style={{ margin: '0.35rem 0' }}>
          Objet : {template.subject}
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', margin: 0, color: 'var(--text-muted)' }}>
          {template.body.slice(0, 200)}
          {template.body.length > 200 ? '…' : ''}
        </pre>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn" onClick={onEdit}>
            Modifier
          </button>
          <button type="button" className="btn" onClick={onDelete}>
            Supprimer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-card">
      <label>
        Nom
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Objet
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label>
        Corps du message
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onSave({ name, subject, body })}
        >
          Enregistrer
        </button>
        <button type="button" className="btn" onClick={onDelete}>
          Supprimer
        </button>
      </div>
    </div>
  );
}
