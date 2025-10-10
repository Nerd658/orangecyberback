# Guide de Migration de Supabase vers PostgreSQL en Local

Ce guide vous explique comment faire passer le backend d'une base de données Supabase à une instance PostgreSQL tournant sur votre machine locale.

## Étape 1 : Modification du code

Le code actuel utilise une configuration SSL spécifique à Supabase. Pour une connexion locale, il faut la retirer.

**Action :** Modifiez le fichier `backend/src/db/index.js` comme suit :

**Ancien code :**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

**Nouveau code :**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```
**Justification :** La configuration `ssl` n'est pas nécessaire pour une base de données locale et peut causer des erreurs de connexion.

## Étape 2 : Mise en place de la base de données PostgreSQL locale

1.  **Installez PostgreSQL** sur votre machine. Si vous ne l'avez pas, suivez la documentation officielle pour votre système d'exploitation (Linux, macOS, Windows).

2.  **Créez un utilisateur et une base de données.** Ouvrez le terminal `psql` et exécutez les commandes suivantes. Remplacez `myuser` et `mypassword` par vos propres identifiants.

    ```sql
    CREATE USER myuser WITH PASSWORD 'mypassword';
    CREATE DATABASE cyber_quiz_db OWNER myuser;
    ```

3.  **Créez les tables.** Placez-vous dans le dossier `backend` avec votre terminal, puis utilisez `psql` pour exécuter les fichiers de schéma. Vous devrez le faire pour les deux fichiers `schema.sql` et `schema_cuid.sql`.

    ```bash
    # Connectez-vous à votre nouvelle base de données
    psql -U myuser -d cyber_quiz_db

    # Une fois dans l'interface psql, exécutez les commandes suivantes pour importer les schémas
    \i schema.sql
    \i schema_cuid.sql
    ```
    Cela créera toutes les tables nécessaires (`users`, `questions`, `attempts`, `results`, `cuids`).

## Étape 3 : Configuration des variables d'environnement

Modifiez le fichier `.env` à la racine du dossier `backend` pour qu'il pointe vers votre nouvelle base de données locale.

**Action :** Mettez à jour la variable `DATABASE_URL` dans le fichier `backend/.env`. Supprimez les anciennes variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` qui ne sont plus nécessaires.

```
# Remplacez par vos identifiants de l'étape 2
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/cyber_quiz_db
```

## Étape 4 : Lancement de l'application

1.  Assurez-vous que toutes les dépendances sont installées :
    ```bash
    npm install
    ```
2.  Lancez le serveur backend :
    ```bash
    npm start
    ```

Votre backend devrait maintenant être connecté à votre base de données PostgreSQL locale et fonctionner correctement.
