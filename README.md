<p align="center">
  <img src="https://raw.githubusercontent.com/idhem85/alkareem-qr/main/public/logo.png" alt="Al Kareem Logo" height="96" />
</p>

<h1 align="center">المصحف Al Kareem</h1>

<p align="center">
  <strong>Application premium de lecture du Coran</strong>
  <br />
  Texte Uthmanique · Audio · Signets cloud · Recherche · Qibla · Horaires de prière
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-captures-décran">Captures</a> •
  <a href="#-stack-technique">Stack</a> •
  <a href="#-déploiement">Déploiement</a> •
  <a href="#-développement">Développement</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-2.111-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-✅-5A0FC8" alt="PWA" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-✅-F38020?logo=cloudflare" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/langue-arabe-success" alt="Arabic Support" />
</p>

<p align="center" dir="rtl">
  <strong>تطبيق راقي لقراءة القرآن الكريم</strong>
  <br />
  بالرسم العثماني · الصوت · العلامات المرجعية · البحث · القبلة · أوقات الصلاة
</p>

---

## ✨ Fonctionnalités

### 📖 Lecture du Coran
- **Texte Uthmanique** — Police <em>UthmanicHafs</em> pour une expérience authentique
- **114 Sourates** — Navigation complète avec index des sourates
- **Verset du jour** — Ayat quotidienne avec traductions (FR/AR/EN)
- **Poursuite de lecture** — Reprenez là où vous vous êtes arrêté
- **Sourates recommandées** — Accès rapide aux sourates populaires (Yā Sīn, Ar-Raḥmān, Al-Mulk…)

### 🎧 Audio
- **Récitation intégrale** — Lecture audio sourate par sourate
- **Contrôle avancé** — Play, Pause, Saut avant/arrière
- **Indicateur visuel** — Verset en cours de lecture synchronisé
- **Mini-lecteur** — Contrôle audio depuis la page d'accueil

### ☪️ Outils spirituels
- **🕋 Qibla** — Boussole interactive pour trouver la direction de la prière
- **🕌 Horaires de prière** — Calendrier des 5 prières basé sur votre localisation
- **📅 Date hégirienne** — Affichage de la date islamique (Umm al-Qura)

### 🔍 Recherche
- **Recherche plein texte** — Parcourez les versets par mot-clé
- **Multilingue** — Recherche en arabe, français et anglais
- **Résultats instantanés** — Indexation locale pour une réponse rapide

### 🔖 Signets (Cloud)
- **Synchronisation cloud** — Signets sauvegardés sur Supabase
- **Multi-appareils** — Vos signets vous suivent partout
- **Hors-ligne** — Accès aux signets même sans connexion

### ⚙️ Personnalisation
- **Thème sombre/clair** — Interface adaptative selon vos préférences
- **Multilingue** — Interface en français, arabe et anglais
- **Notifications push** — Rappels quotidiens et verset du jour (via Supabase Edge Functions)
- **PWA** — Installez l'application sur votre téléphone ou ordinateur

## 🖼️ Pages

| Page | Description |
|------|-------------|
| **Accueil** | Verset du jour, horaires de prière, poursuite de lecture, sourates recommandées |
| **Sourates** | Index complet des 114 sourates avec numérotation et traductions |
| **Lecture (Mushaf)** | Versets avec texte Uthmanique, navigation, audio, traduction |
| **Recherche** | Recherche plein texte dans les versets |
| **Signets** | Gestion des signets synchronisés sur le cloud |
| **Qibla** | Boussole interactive pour trouver la direction de la prière |
| **Paramètres** | Langue, thème, police, notifications |
| **Hors-ligne** | Contenu accessible sans connexion internet |

## 🛠️ Stack Technique

| Technologie | Usage |
|-------------|-------|
| **React 18** | UI — Architecture composants modernes |
| **TypeScript** | Typage statique pour un code robuste |
| **Vite 5** | Bundler — Build ultra-rapide avec HMR |
| **Tailwind CSS 3** | Styles — Design system utilitaire responsive |
| **shadcn/ui** | Composants — Bibliothèque d'interface premium accessible |
| **Supabase** | Backend — Authentification, base de données PostgreSQL, Edge Functions |
| **TanStack Query** | Requêtes serveur — Cache et synchronisation |
| **React Router v6** | Navigation — Routage SPA avec lazy loading |
| **Sonner** | Notifications — Toasts élégants et légers |
| **Lucide React** | Icônes — Bibliothèque d'icônes cohérente |
| **Service Worker** | PWA — Cache offline, installation sur mobile |
| **Geolocation API** | Localisation — Calcul des horaires de prière et direction de la Qibla |

## 🚀 Déploiement

L'application est déployée sur **Cloudflare Pages** — une SPA statique rapide, scalable et disponible mondialement.

```bash
# Build de production
npm run build

# Aperçu local
npm run preview

# Tests
npm test
```

### 🌐 URL de production

**https://alkareem-qr.pages.dev**

### 📦 Variables d'environnement

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique Supabase (anon) |
| `VITE_SUPABASE_PROJECT_ID` | ID du projet Supabase |

## 💻 Développement

```bash
# Cloner le projet
git clone https://github.com/idhem85/alkareem-qr.git
cd alkareem-qr

# Installer les dépendances
npm install

# Créer le fichier d'environnement
# (copie les variables ci-dessous dans un fichier .env)
# VITE_SUPABASE_URL=votre_url
# VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer les tests
npm test
```

### Structure du projet

```
src/
├── pages/                    # Pages de l'application
│   ├── Index.tsx             # Accueil
│   ├── SurahIndex.tsx        # Index des sourates
│   ├── MushafReader.tsx      # Lecteur coranique
│   ├── SearchPage.tsx        # Recherche
│   ├── BookmarksPage.tsx     # Signets
│   ├── QiblaPage.tsx         # Direction de la Qibla
│   ├── SettingsPage.tsx      # Paramètres
│   └── OfflinePage.tsx       # Mode hors-ligne
├── components/               # Composants UI
│   ├── quran/                # Composants du Mushaf
│   ├── home/                 # Composants de l'accueil
│   ├── audio/                # Lecteur audio
│   ├── layout/               # Navigation, sidebar, bottom nav
│   └── ui/                   # Composants shadcn/ui
├── contexts/                 # Contextes React
├── hooks/                    # Hooks personnalisés
├── lib/                      # Utilitaires
├── data/                     # Données (sourates, versets, juz)
│   ├── surahs.ts             # 114 sourates
│   ├── ayahs.ts              # Versets avec numérotation
│   └── juz.ts                # Division en 30 juz
├── integrations/supabase/    # Client Supabase + types
└── styles/                   # Styles globaux (mushaf.css)
```

### 📂 Données coraniques

Le projet inclut des données complètes pour les 114 sourates :
- Nom en arabe, translittération et traduction
- Nombre de versets (āyāt)
- Lieu de révélation (Mecquoise / Médinoise)
- Division en 30 juz' et hizb
- Texte Uthmanique pour tous les versets

## 📄 Licence

Projet privé — Tous droits réservés.

---

<p align="center">
  Développé avec ❤️ par <a href="https://github.com/idhem85">idhem85</a>
  <br />
  <span style="font-family: 'Traditional Arabic', serif;">القرآن الكريم — كتاب الله المبين</span>
</p>
