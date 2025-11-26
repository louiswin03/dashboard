# Configuration des Permissions Hasura

Pour sécuriser votre application, vous devez configurer les permissions pour chaque table.

## 🚀 Comment appliquer ces permissions

1. Allez sur https://app.nhost.io
2. Sélectionnez votre projet
3. Cliquez sur "Hasura Console"
4. Pour chaque table ci-dessous, allez dans l'onglet "Permissions"
5. Configurez le rôle **"user"** avec les permissions indiquées

---

## 📊 Table: `transactions`

### SELECT (Lecture)
**Without any checks** : Décochez
**With custom check** :
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

**Column permissions** : Cochez toutes les colonnes

### INSERT (Création)
**With custom check** :
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

**Column permissions** : Cochez toutes les colonnes SAUF `id`, `user_id`, `created_at`

**Column presets** :
- `user_id` : `x-hasura-user-id`

### UPDATE (Modification)
**Row update permissions** :
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

**Column permissions** : Cochez toutes les colonnes SAUF `id`, `user_id`, `created_at`

### DELETE (Suppression)
**Row delete permissions** :
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 💰 Table: `investments`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 🎯 Table: `goals`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 📁 Table: `projects`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`, `updated_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## ✅ Table: `tasks`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 📅 Table: `events`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 💼 Table: `tax_obligations`

### SELECT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`
**Column presets** : `user_id` → `x-hasura-user-id`

### UPDATE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `user_id`, `created_at`

### DELETE
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## 👤 Table: `profiles` (Optionnel)

### SELECT
```json
{
  "id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes

### INSERT
```json
{
  "id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `created_at`, `updated_at`

### UPDATE
```json
{
  "id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
**Column permissions** : Toutes SAUF `id`, `created_at`

### DELETE
```json
{
  "id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

---

## ✅ Vérification

Une fois terminé, testez en vous connectant à l'application :
- Vous ne devez voir que VOS données
- Vous ne pouvez créer des données qu'avec VOTRE user_id

## 🔍 Note importante

Les **aggregations** (pour les statistiques du dashboard) doivent aussi être configurées :
- Cochez "Allow aggregation queries" pour chaque table
- Avec les mêmes conditions de filtrage
