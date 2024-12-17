# Étape 1 : Étape de build
FROM node:22.8.0-alpine AS build

WORKDIR /usr/src/app

# Copier les fichiers de dépendances et installer les modules
COPY package*.json ./
RUN npm ci

# Copier tout le code source
COPY . .

# Compiler le code TypeScript (vers JavaScript)
RUN npm run build

# Étape 2 : Image de production
FROM node:22.8.0-alpine

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les fichiers nécessaires pour la production
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Démarrage de l'application en production
CMD ["npm", "run", "start:prod"]


# Étape 3 : Mode développement
FROM node:22.8.0-alpine AS development

# Installer bash et autres outils pour le dev si nécessaire
RUN apk add --no-cache bash

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copier tout le code source
COPY . .

CMD ["npm", "run", "start:dev"]
