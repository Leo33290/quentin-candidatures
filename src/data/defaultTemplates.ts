import type { MailTemplate } from '../types';

export const DEFAULT_TEMPLATES: MailTemplate[] = [
  {
    id: 'premier-contact',
    name: 'Premier contact',
    subject: 'Candidature alternance — {{entreprise}}',
    body: `Madame, Monsieur,

Actuellement en recherche d'une alternance en architecture, je me permets de vous contacter car votre agence {{entreprise}} et votre spécialité en {{specialite}} correspondent particulièrement à mon projet professionnel.

Je serais ravi(e) d'échanger avec vous sur une éventuelle collaboration au sein de votre équipe.

Vous trouverez ci-joint mon CV et mon portfolio. Je reste à votre disposition pour un entretien.

Cordialement,
Quentin`,
  },
  {
    id: 'relance',
    name: 'Relance (J+7)',
    subject: 'Relance — Candidature alternance',
    body: `Madame, Monsieur,

Je me permets de revenir vers vous concernant ma candidature pour une alternance, envoyée il y a quelques jours.

Votre structure {{entreprise}} m'intéresse toujours vivement. Seriez-vous disponible pour un bref échange ?

Je reste à votre disposition.

Cordialement,
Quentin`,
  },
  {
    id: 'remerciement',
    name: 'Remerciement après entretien',
    subject: 'Remerciement — Entretien {{entreprise}}',
    body: `Madame, Monsieur,

Je vous remercie pour le temps accordé lors de notre entretien concernant une alternance au sein de {{entreprise}}.

Notre échange a confirmé mon intérêt pour rejoindre votre équipe. Je reste disponible pour toute suite à donner à ma candidature.

Cordialement,
Quentin`,
  },
];
