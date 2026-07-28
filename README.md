# المصحف Al Kareem — م Quran Reader

> **Al Kareem** — Application PWA de lecture du Coran avec texte Uthmanique, traductions et audio.

![Al Kareem Preview](https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f0606dbf-6ff5-495d-b134-b5be9b7f24ab/id-preview-0ac02a06--8f06a296-fea0-4dd2-b265-5c0aed5864c5.lovable.app-1773666931763.png)

## ✨ Fonctionnalités

- 📖 **Lecture du Coran** — Texte Uthmanique avec versets (āyāt) cliquables
- 🔍 **Recherche** — Recherche par mot-clé dans les versets
- 🔖 **Signets** — Marque-pages synchronisés via Supabase
- 🎧 **Audio** — Lecture audio des versets par récitateur
- 🧭 **Qibla** — Direction de la Qibla (boussole)
- 🕌 **Horaires de prière** — Calendrier des prières
- 📱 **PWA** — Application installable, fonctionne hors ligne
- 🔔 **Notifications push** — Verset du jour
- 🌙 **Thème sombre/clair**

## 🛠️ Technologies

| Technologie | Utilisation |
|---|---|
| [React 18](https://react.dev) | UI Framework |
| [TypeScript](https://www.typescriptlang.org) | Langage |
| [Vite 5](https://vitejs.dev) | Bundler |
| [Tailwind CSS 3](https://tailwindcss.com) | Styles |
| [shadcn/ui](https://ui.shadcn.com) | Composants UI |
| [Supabase](https://supabase.com) | Backend (Auth, DB, Edge Functions) |
| [React Router v6](https://reactrouter.com) | Routage SPA |
| [TanStack Query](https://tanstack.com/query) | Data fetching |
| [Vitest](https://vitest.dev) | Tests unitaires |

## 🚀 Installation

```sh
# Cloner le dépôt
git clone https://github.com/tonpseudo/alkareem-qr.git
cd alkareem-qr

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer le serveur de développement
npm run dev
```

## 📦 Build

```sh
npm run build    # Production → dist/
npm run preview  # Prévisualiser le build
```

## 🧪 Tests

```sh
npm test         # Vitest
```

## 🌐 Déploiement

### GitHub Pages

Ce dépôt inclut un workflow GitHub Actions pour builder et déployer automatiquement sur GitHub Pages.

1. Allez dans **Settings > Pages** de votre repo GitHub
2. Source : **GitHub Actions**
3. Poussez sur `main` pour déclencher le déploiement automatique

### Supabase

Les migrations et Edge Functions Supabase sont incluses dans le dossier `supabase/`.

```sh
npx supabase link --project-ref your-project-id
npx supabase db push
npx supabase functions deploy
```

## 📄 License

Projet privé — Tous droits réservés.
