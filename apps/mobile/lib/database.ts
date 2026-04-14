import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('silentwill.db');
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT DEFAULT '',
      value REAL DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'pending',
      institution TEXT,
      account_number TEXT,
      routing_number TEXT,
      account_type TEXT,
      location TEXT,
      policy_number TEXT,
      maturity_date TEXT,
      nominee TEXT,
      folio_number TEXT,
      weight TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS nominees (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      relation TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      avatar_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT DEFAULT 'info',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pending_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      action TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export async function cacheAssets(assets: any[]) {
  const database = await getDatabase();
  await database.execAsync('DELETE FROM assets');
  for (const a of assets) {
    await database.runAsync(
      `INSERT OR REPLACE INTO assets (id, user_id, name, category, subcategory, value, currency, status, institution, account_number, routing_number, account_type, location, policy_number, maturity_date, nominee, folio_number, weight, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.user_id, a.name, a.category, a.subcategory ?? '', a.value ?? 0, a.currency ?? 'INR', a.status ?? 'pending', a.institution, a.account_number, a.routing_number, a.account_type, a.location, a.policy_number, a.maturity_date, a.nominee, a.folio_number, a.weight, a.notes, a.created_at, a.updated_at],
    );
  }
}

export async function getCachedAssets(): Promise<any[]> {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM assets ORDER BY created_at DESC');
}

export async function cacheNominees(nominees: any[]) {
  const database = await getDatabase();
  await database.execAsync('DELETE FROM nominees');
  for (const n of nominees) {
    await database.runAsync(
      `INSERT OR REPLACE INTO nominees (id, user_id, name, relation, email, phone, status, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [n.id, n.user_id, n.name, n.relation, n.email, n.phone ?? '', n.status, n.avatar_url, n.created_at, n.updated_at],
    );
  }
}

export async function getCachedNominees(): Promise<any[]> {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM nominees ORDER BY created_at DESC');
}

export async function cacheActivity(activity: any[]) {
  const database = await getDatabase();
  await database.execAsync('DELETE FROM activity_log');
  for (const a of activity) {
    await database.runAsync(
      `INSERT OR REPLACE INTO activity_log (id, user_id, title, type, icon, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [a.id, a.user_id, a.title, a.type, a.icon ?? 'info', a.created_at],
    );
  }
}

export async function getCachedActivity(): Promise<any[]> {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM activity_log ORDER BY created_at DESC');
}

export async function savePendingChange(tableName: string, action: string, data: any) {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO pending_changes (table_name, action, data) VALUES (?, ?, ?)',
    [tableName, action, JSON.stringify(data)],
  );
}

export async function getPendingChanges(): Promise<any[]> {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM pending_changes ORDER BY created_at ASC');
}

export async function clearPendingChange(id: number) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM pending_changes WHERE id = ?', [id]);
}

export async function clearAllData() {
  const database = await getDatabase();
  await database.execAsync(`
    DELETE FROM assets;
    DELETE FROM nominees;
    DELETE FROM activity_log;
    DELETE FROM pending_changes;
  `);
}
