

# Al-Mushaf — Application de Lecture du Coran Premium

## Vision
Une application de lecture du Coran de qualité production, mobile-first, RTL native, avec une expérience visuelle exceptionnelle inspirée d'un Mushaf physique premium combiné à l'ergonomie d'outils modernes comme Linear/Notion.

---

## Architecture & Design System

### Thème & Typographie
- **Palette** : Deep Islamic Green (#1B4332), Soft Gold (#C5A059), Antique Paper (#FDFBF7), Deep Charcoal (#121212)
- **Polices** : `Amiri` pour les headers arabes, `KFGQPC Uthmanic Script HAFS` (via @font-face) pour le texte coranique, `Plus Jakarta Sans` pour l'UI latine
- **Mode sombre/clair** avec toggle fluide
- **RTL natif** sur tout le layout

### Données Mock
- Index complet des 114 sourates (nom arabe, translittération, traduction, nombre d'ayat, type révélation)
- Texte coranique mock réaliste pour ~5 sourates complètes (Al-Fatiha, Al-Baqarah début, Al-Ikhlas, Al-Falaq, An-Nas)
- Données de tafsir et traduction mock

---

## Pages & Fonctionnalités

### 1. Page d'accueil (Home)
- Salutation contextuelle (Salam + heure)
- Carte "Continuer la lecture" avec dernière position
- Sourates favorites / récemment lues
- Verset du jour avec fond décoratif doré

### 2. Index des Sourates
- Liste complète des 114 sourates avec recherche/filtre
- Filtres : Mecquoise/Médinoise, nombre d'ayat
- Vue liste et vue grille
- Indicateur de progression de lecture

### 3. Écran Mushaf (Lecture)
- Texte coranique centré, grande taille, line-height ≥ 2.0
- Marqueurs d'ayah dorés (numéros en arabe)
- Bismillah stylisé en en-tête de sourate
- Toolbar de lecture sticky (taille police, mode nuit, navigation)
- UI qui s'efface au scroll pour immersion totale
- Tap sur une ayah → Drawer contextuel

### 4. Drawer Contextuel d'Ayah
- Bottom drawer avec animation spring
- Onglets : Tafsir, Traduction (FR), Audio
- Boutons : Copier, Partager, Ajouter aux signets
- Affichage de l'ayah sélectionnée en haut

### 5. Recherche
- Recherche dans le texte coranique et les traductions
- Résultats avec contexte et surlignage
- Filtres par sourate

### 6. Signets (Bookmarks)
- Liste des ayat marquées avec notes optionnelles
- Organisation par sourate
- Accès rapide à la position

### 7. Audio Player Sticky
- Barre compacte en bas avec effet frosted-glass
- Contrôles : play/pause, précédent/suivant ayah
- Nom du récitateur + sourate en cours
- Expansion en plein écran avec geste

### 8. Paramètres
- Taille de la police coranique (slider)
- Mode d'affichage (clair/sombre/auto)
- Langue de traduction
- Choix du récitateur
- Afficher/masquer traduction en ligne

---

## Navigation

### Mobile — Bottom Nav (4 items)
- Accueil, Recherche, Signets, Paramètres
- Icônes avec labels, état actif en or

### Desktop — Sidebar collapsible
- Navigation slim à gauche
- Collapsible avec icônes seules
- Même items + index des sourates intégré

---

## Animations & Transitions
- Cross-fade entre sourates
- Drawers avec physique spring (vaul)
- Toolbar qui fade au scroll
- Transitions de page douces
- Hover states subtils avec scale

---

## Structure des Composants
- `Layout` (responsive shell avec bottom nav / sidebar)
- `MushafReader` (composant de lecture principal)
- `SurahHeader` (bismillah + nom de sourate décoré)
- `AyahText` (rendu d'une ayah avec marqueur)
- `AyahDrawer` (drawer contextuel)
- `AudioPlayer` (player sticky)
- `SurahIndex` (liste des sourates)
- `SearchView` (recherche)
- `BookmarksList` (signets)
- `ReadingToolbar` (contrôles de lecture)
- `ThemeToggle` (mode sombre/clair)

