# Supabase Production Security & Client Checklist

Ensure these policies are verified on your Supabase production database instance before routing client requests.

## 1. Row Level Security (RLS)
* **RLS Status**: Row Level Security **must be enabled** on all tables (`workflows`, `categories`, `integrations`, `workflow_feedback`).
* Never run browser clients using `service_role` keys. Only use `anon` keys.

## 2. Public Read Policies
Configure the following public read permission policies:
* **Workflows**: `CREATE POLICY "Allow public read" ON workflows FOR SELECT USING (true);`
* **Categories**: `CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);`
* **Integrations**: `CREATE POLICY "Allow public read" ON integrations FOR SELECT USING (true);`

## 3. Feedback Collection Policies
Allow anonymous users to insert feedback securely:
* **Workflow Feedback**: `CREATE POLICY "Allow anonymous insert" ON workflow_feedback FOR INSERT WITH CHECK (true);`
* **REST Constraints**: Exclude `SELECT` or `UPDATE` capabilities for anonymous anon connections on feedback tables to preserve privacy.
