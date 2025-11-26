/**
 * Script pour configurer automatiquement toutes les permissions Hasura
 *
 * Usage: node setup-permissions.js
 */

import https from 'https';

// ⚠️ CONFIGUREZ VOS INFORMATIONS ICI
const HASURA_ENDPOINT = 'https://lfflccyjdwpoeqcjxtos.hasura.eu-central-1.nhost.run/v1/metadata';
const ADMIN_SECRET = '{{ secrets.HASURA_GRAPHQL_ADMIN_SECRET }}';



// Liste des tables à configurer
const TABLES = [
  { schema: 'public', name: 'transactions' },
  { schema: 'public', name: 'investments' },
  { schema: 'public', name: 'goals' },
  { schema: 'public', name: 'projects' },
  { schema: 'public', name: 'tasks' },
  { schema: 'public', name: 'events' },
  { schema: 'public', name: 'tax_obligations' },
];

// Colonnes à exclure pour INSERT et UPDATE
const EXCLUDED_COLUMNS = {
  insert: ['id', 'user_id', 'created_at'],
  update: ['id', 'user_id', 'created_at'],
};

// Fonction pour faire une requête à l'API Hasura
function hasuraRequest(body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(HASURA_ENDPOINT, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error || parsed.errors) {
            reject(parsed);
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fonction pour obtenir les colonnes d'une table
async function getTableColumns(schema, tableName) {
  const response = await hasuraRequest({
    type: 'run_sql',
    args: {
      sql: `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '${schema}'
        AND table_name = '${tableName}'
        ORDER BY ordinal_position;
      `,
    },
  });

  // La première ligne est le header, on la skip
  return response.result.slice(1).map(row => row[0]);
}

// Fonction pour créer les permissions pour une table
async function createPermissionsForTable(schema, tableName) {
  console.log(`\n📋 Configuration de ${schema}.${tableName}...`);

  // Récupérer les colonnes
  const allColumns = await getTableColumns(schema, tableName);
  console.log(`   Colonnes trouvées: ${allColumns.length}`);

  const insertColumns = allColumns.filter(col => !EXCLUDED_COLUMNS.insert.includes(col));
  const updateColumns = allColumns.filter(col => !EXCLUDED_COLUMNS.update.includes(col));

  // Configuration de la permission INSERT
  console.log(`   ✏️  Création permission INSERT...`);
  try {
    await hasuraRequest({
      type: 'pg_create_insert_permission',
      args: {
        table: { schema, name: tableName },
        role: 'user',
        permission: {
          check: {
            user_id: { _eq: 'X-Hasura-User-Id' },
          },
          set: {
            user_id: 'x-hasura-User-Id',
          },
          columns: insertColumns,
        },
      },
    });
    console.log(`   ✅ INSERT configuré`);
  } catch (error) {
    console.log(`   ⚠️  INSERT déjà existant ou erreur:`, error.error || error.message);
  }

  // Configuration de la permission SELECT
  console.log(`   👁️  Création permission SELECT...`);
  try {
    await hasuraRequest({
      type: 'pg_create_select_permission',
      args: {
        table: { schema, name: tableName },
        role: 'user',
        permission: {
          filter: {
            user_id: { _eq: 'X-Hasura-User-Id' },
          },
          columns: allColumns,
          allow_aggregations: true,
        },
      },
    });
    console.log(`   ✅ SELECT configuré`);
  } catch (error) {
    console.log(`   ⚠️  SELECT déjà existant ou erreur:`, error.error || error.message);
  }

  // Configuration de la permission UPDATE
  console.log(`   ✏️  Création permission UPDATE...`);
  try {
    await hasuraRequest({
      type: 'pg_create_update_permission',
      args: {
        table: { schema, name: tableName },
        role: 'user',
        permission: {
          filter: {
            user_id: { _eq: 'X-Hasura-User-Id' },
          },
          columns: updateColumns,
        },
      },
    });
    console.log(`   ✅ UPDATE configuré`);
  } catch (error) {
    console.log(`   ⚠️  UPDATE déjà existant ou erreur:`, error.error || error.message);
  }

  // Configuration de la permission DELETE
  console.log(`   🗑️  Création permission DELETE...`);
  try {
    await hasuraRequest({
      type: 'pg_create_delete_permission',
      args: {
        table: { schema, name: tableName },
        role: 'user',
        permission: {
          filter: {
            user_id: { _eq: 'X-Hasura-User-Id' },
          },
        },
      },
    });
    console.log(`   ✅ DELETE configuré`);
  } catch (error) {
    console.log(`   ⚠️  DELETE déjà existant ou erreur:`, error.error || error.message);
  }

  console.log(`   ✅ ${tableName} terminé!`);
}

// Fonction principale
async function main() {
  console.log('🚀 Configuration automatique des permissions Hasura\n');
  console.log('📍 Endpoint:', HASURA_ENDPOINT);
  console.log('👤 Rôle: user\n');

  if (ADMIN_SECRET === 'VOTRE_ADMIN_SECRET_ICI') {
    console.error('❌ ERREUR: Veuillez configurer votre ADMIN_SECRET dans le script!');
    console.log('\n📖 Pour trouver votre Admin Secret:');
    console.log('   1. Allez sur https://app.nhost.io');
    console.log('   2. Sélectionnez votre projet');
    console.log('   3. Settings > Environment Variables');
    console.log('   4. Cherchez NHOST_ADMIN_SECRET\n');
    process.exit(1);
  }

  console.log('⏳ Configuration en cours...\n');

  for (const table of TABLES) {
    try {
      await createPermissionsForTable(table.schema, table.name);
    } catch (error) {
      console.error(`❌ Erreur sur ${table.name}:`, error);
    }
  }

  console.log('\n\n✅ Configuration terminée!');
  console.log('\n📌 Prochaines étapes:');
  console.log('   1. Vérifiez dans Hasura Console que les permissions sont bien créées');
  console.log('   2. Testez votre application');
  console.log('   3. Chaque utilisateur ne verra que ses propres données!\n');
}

// Exécution
main().catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
