# Castled API

Ce projet est une API REST pour l'outil d'analyse de parties d'échecs "Castled". Il est développé avec NestJs, un framework Node.js.

## Table des Matières
1. [Prérequis](#prérequis)
2. [Téléchargement du Projet](#téléchargement-du-projet)
3. [Configuration de l'Environnement](#configuration-de-lenvironnement)
   - [Docker](#docker)
4. [Lancement Du Projet Après Installation](#lancement-du-projet-après-installation)
   - [Avec Docker](#avec-docker)
5. [Lancer les commandes dans les conteneurs Docker](#lancer-les-commandes-dans-les-conteneurs-Docker)

## Prérequis
Assurez-vous d'avoir installé les outils suivants :
- Postgresql
- Docker Desktop  ou Docker Engine & Docker Compose
- Node.js
- Git
- Visual Studio Code ou un autre Éditeur de Texte ou IDE

## Téléchargement du Projet
Exécutez la commande suivante dans le répertoire souhaité (Un répertoire dans votre **distro WSL2 est recommandé si vous utilisez Windows**) :

#### https://github.com/CastledChess/Api.git

## Configuration de l'Environnement
**Ouvrez le projet dans votre IDE** et suivez les étapes suivantes pour configurer l'environnement.

### Docker
Pour lancer l'application NestJs dans des conteneurs Docker, suivez les étapes suivantes :

1. Ouvrez votre terminal à la racine du projet et copiez le fichier `.env.example` et renommez-le `.env` :
    ```sh
    cp .env.example .env
    ```

2. Modifiez le fichier `.env` pour **configurer les variables d'environnement nécessaires**.

3. Démarrez les conteneurs Docker :
    ```sh
    docker compose up --build -d
    ```
4. Téléchargez les dépendances Node :
    ```sh
    npm install
    ```

## Lancement Du Projet Après Installation
Pour lancer le projet après l'installation, suivez les étapes suivantes :

### Avec Docker

Lancez les conteneurs Docker :
```sh
docker compose up -d
```

## Lancer les commandes dans les conteneurs Docker
Lorsque vous voulez utiliser des commandes Node ou vous connecter à la base de données, vous devez exécuter ces commandes à l'intérieur des conteneurs Docker :

```sh
docker exec -it <nom_du_conteneur> <la_commande>

# Exemple
docker exec -it castled-api nest g module users
docker exec -it castled-postgres psql -U postgres
```

Ou vous pouvez ouvrir un terminal directement dans le conteneur Docker :

```sh
docker exec -it <nom_du_conteneur> sh

# Exemple
docker exec -it castled-api sh
docker exec -it castled-postgres sh
```

## Accéder à la documentation swagger

Pour accéder à la documentation swagger et tester les endpoints API tout en ayant une documentation.
Vous pouvez vous rendre sur le lien suivant :

#### http://localhost:3000/api/docs

## Accéder à la documentation compodoc

Afin d'accéder à la documentation total du projet.
Vous devez générer la documentation en exécutant la commande suivante :

```sh
docker exec -it castled-api npm run docs
```
ou

```sh
npm run docs
# génère la documentation dans votre environnement local
```

Et ensuite vous rendre sur le lien suivant :

#### http://localhost:8080