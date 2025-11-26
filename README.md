# EntreproDash 💎

Dashboard tout-en-un pour entrepreneurs et investisseurs. Une alternative élégante à Notion + Finary + TradingView + Google Calendar.

![Dashboard Preview](https://via.placeholder.com/800x450/0a0a0b/c9a962?text=EntreproDash)

## ✨ Fonctionnalités

- **Dashboard** - Vue d'ensemble avec widgets personnalisables
- **Revenus** - Gestion et analyse des sources de revenus
- **Investissements** - Suivi du portfolio (actions, crypto, immobilier)
- **Agenda** - Calendrier et gestion des événements
- **Projets** - Gestion de projets et tâches
- **Fiscalité** - Suivi des obligations et charges déductibles
- **Paramètres** - Personnalisation complète

## 🛠 Stack Technique

- **React 18** avec TypeScript
- **Vite** pour le build ultra-rapide
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Recharts** pour les graphiques
- **React Router v6** pour la navigation
- **TanStack Query** pour la gestion du cache

## 🚀 Installation

```bash
# Cloner ou déplacer le projet
cd entreprodash

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/          # Composants réutilisables (Card, Button, Badge...)
│   ├── dashboard/       # Widgets du dashboard
│   └── layout/          # Layout, Sidebar, Header
├── pages/
│   ├── dashboard/       # Page principale
│   ├── revenus/         # Gestion revenus
│   ├── investissements/ # Portfolio
│   ├── agenda/          # Calendrier
│   ├── projets/         # Projets & tâches
│   ├── fiscalite/       # Vue fiscale
│   └── settings/        # Paramètres
├── utils/               # Fonctions utilitaires
└── types/               # Types TypeScript
```

## 🎨 Design System

Le design utilise un thème **Luxury Dark** avec :
- **Couleur principale** : Gold (#c9a962)
- **Fond** : Noir profond (#0a0a0b)
- **Typographie** : DM Sans + Playfair Display
- **Animations** : Transitions fluides avec Framer Motion

## 🔜 Prochaines Étapes (Backend)

Pour une version complète, il faudra :
1. Backend Node.js + Express
2. Base de données PostgreSQL + Prisma
3. Authentification JWT
4. APIs pour la récupération des prix (Alpha Vantage, CoinGecko)

## 📝 License

MIT
