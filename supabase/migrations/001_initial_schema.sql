-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  original_workflow_json JSONB NOT NULL,
  normalized_workflow_json JSONB NOT NULL,
  node_count INTEGER DEFAULT 0,
  integration_count INTEGER DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_setup_time TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  security_status TEXT DEFAULT 'Passed' CHECK (security_status IN ('Passed', 'Review Recommended', 'Potential Risk')),
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  workflow_origin TEXT NOT NULL CHECK (workflow_origin IN ('third_party_import', 'flowmatch_original')),
  instruction_status TEXT,
  prerequisites JSONB,
  setup_instructions JSONB,
  required_credentials JSONB,
  configuration_steps JSONB,
  testing_steps JSONB,
  expected_result TEXT,
  troubleshooting JSONB,
  security_notes JSONB,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  validation_status TEXT CHECK (validation_status IN ('Valid', 'Valid With Warnings', 'Invalid')),
  provenance_status TEXT,
  import_batch TEXT,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workflow Integrations (Many-to-Many mapping)
CREATE TABLE IF NOT EXISTS workflow_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  UNIQUE(workflow_id, integration_id)
);

-- Workflow Fingerprints
CREATE TABLE IF NOT EXISTS workflow_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL UNIQUE REFERENCES workflows(id) ON DELETE CASCADE,
  exact_hash TEXT NOT NULL,
  structural_hash TEXT NOT NULL,
  node_signature TEXT,
  connection_signature TEXT
);

-- Workflow Sources table
CREATE TABLE IF NOT EXISTS workflow_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_author TEXT,
  source_license TEXT,
  source_repository TEXT,
  source_file_path TEXT,
  discovered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Security Scans
CREATE TABLE IF NOT EXISTS security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Passed', 'Review Recommended', 'Potential Risk')),
  findings JSONB NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workflow Validation Reports
CREATE TABLE IF NOT EXISTS workflow_validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Valid', 'Valid With Warnings', 'Invalid')),
  issues JSONB NOT NULL,
  validated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workflow Quality Reports
CREATE TABLE IF NOT EXISTS workflow_quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  breakdown JSONB NOT NULL,
  scored_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references auth.users(id) in Supabase
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, workflow_id)
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references auth.users(id) in Supabase
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Collection Workflows mapping
CREATE TABLE IF NOT EXISTS collection_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  UNIQUE(collection_id, workflow_id)
);

-- Workflow Downloads
CREATE TABLE IF NOT EXISTS workflow_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID, -- references auth.users(id) if logged in
  downloaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workflow Views
CREATE TABLE IF NOT EXISTS workflow_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID, -- references auth.users(id) if logged in
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- AI Searches
CREATE TABLE IF NOT EXISTS ai_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  query TEXT NOT NULL,
  detected_intent JSONB,
  detected_integrations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- AI Matches
CREATE TABLE IF NOT EXISTS ai_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID NOT NULL REFERENCES ai_searches(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reason TEXT,
  UNIQUE(search_id, workflow_id)
);

-- Duplicate Review Queue
CREATE TABLE IF NOT EXISTS duplicate_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  new_workflow_name TEXT NOT NULL,
  new_workflow_path TEXT NOT NULL,
  existing_workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  existing_workflow_name TEXT,
  similarity_score INTEGER NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 100),
  reasons TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Import Batches
CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  batch_name TEXT NOT NULL,
  files_scanned INTEGER DEFAULT 0,
  valid_workflows INTEGER DEFAULT 0,
  invalid_workflows INTEGER DEFAULT 0,
  unique_workflows INTEGER DEFAULT 0,
  exact_duplicates INTEGER DEFAULT 0,
  possible_duplicates INTEGER DEFAULT 0,
  imported_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Generation Batches
CREATE TABLE IF NOT EXISTS generation_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  generated_count INTEGER DEFAULT 0,
  valid_count INTEGER DEFAULT 0,
  invalid_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index configurations
CREATE INDEX IF NOT EXISTS idx_workflows_slug ON workflows(slug);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON workflows(category_id);
CREATE INDEX IF NOT EXISTS idx_workflows_security ON workflows(security_status);
CREATE INDEX IF NOT EXISTS idx_workflows_verified ON workflows(verified);
CREATE INDEX IF NOT EXISTS idx_workflows_featured ON workflows(featured);
CREATE INDEX IF NOT EXISTS idx_workflows_quality ON workflows(quality_score);
CREATE INDEX IF NOT EXISTS idx_workflows_origin ON workflows(workflow_origin);
CREATE INDEX IF NOT EXISTS idx_workflows_validation ON workflows(validation_status);
CREATE INDEX IF NOT EXISTS idx_fingerprints_exact ON workflow_fingerprints(exact_hash);
CREATE INDEX IF NOT EXISTS idx_fingerprints_structural ON workflow_fingerprints(structural_hash);

-- GIN Index for search_vector
CREATE INDEX IF NOT EXISTS idx_workflows_search_vector ON workflows USING gin(search_vector);

-- Search vector trigger function
CREATE OR REPLACE FUNCTION workflows_search_vector_update() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

-- Trigger to maintain search_vector on insert/update
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON workflows FOR EACH ROW EXECUTE FUNCTION workflows_search_vector_update();


-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_validation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_batches ENABLE ROW LEVEL SECURITY;

-- Helpers for determining roles
-- For simplicity, role is queried from the profiles table.
-- Admins have profiles.role = 'admin'.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by anyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (is_admin());

-- Categories Policies
CREATE POLICY "Categories viewable by anyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());

-- Integrations Policies
CREATE POLICY "Integrations viewable by anyone" ON integrations FOR SELECT USING (true);
CREATE POLICY "Admins can manage integrations" ON integrations FOR ALL USING (is_admin());

-- Workflows Policies
CREATE POLICY "Valid workflows viewable by anyone" ON workflows FOR SELECT USING (validation_status = 'Valid' OR validation_status = 'Valid With Warnings' OR is_admin());
CREATE POLICY "Admins can manage workflows" ON workflows FOR ALL USING (is_admin());

-- Workflow Integrations Policies
CREATE POLICY "Workflow integrations viewable by anyone" ON workflow_integrations FOR SELECT USING (true);
CREATE POLICY "Admins can manage workflow integrations" ON workflow_integrations FOR ALL USING (is_admin());

-- Workflow Fingerprints Policies
CREATE POLICY "Fingerprints viewable by admins" ON workflow_fingerprints FOR ALL USING (is_admin());

-- Workflow Sources Policies
CREATE POLICY "Sources viewable by anyone" ON workflow_sources FOR SELECT USING (true);
CREATE POLICY "Admins can manage sources" ON workflow_sources FOR ALL USING (is_admin());

-- Security Scans Policies
CREATE POLICY "Security scans viewable by admins" ON security_scans FOR ALL USING (is_admin());
CREATE POLICY "Security scans summary viewable by anyone" ON security_scans FOR SELECT USING (true);

-- Validation Reports Policies
CREATE POLICY "Validation reports viewable by admins" ON workflow_validation_reports FOR ALL USING (is_admin());

-- Quality Reports Policies
CREATE POLICY "Quality reports viewable by anyone" ON workflow_quality_reports FOR SELECT USING (true);
CREATE POLICY "Admins can manage quality reports" ON workflow_quality_reports FOR ALL USING (is_admin());

-- Favorites Policies
CREATE POLICY "Users view/manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all favorites" ON favorites FOR SELECT USING (is_admin());

-- Collections Policies
CREATE POLICY "Public collections viewable by anyone" ON collections FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users manage own collections" ON collections FOR ALL USING (auth.uid() = user_id);

-- Collection Workflows Policies
CREATE POLICY "Collection workflows viewable if collection viewable" ON collection_workflows FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM collections 
    WHERE collections.id = collection_id AND (collections.is_public = true OR collections.user_id = auth.uid())
  )
);
CREATE POLICY "Users manage own collection workflows" ON collection_workflows FOR ALL USING (
  EXISTS (
    SELECT 1 FROM collections 
    WHERE collections.id = collection_id AND collections.user_id = auth.uid()
  )
);

-- Downloads and Views Policies
CREATE POLICY "Anyone can insert view/download" ON workflow_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert view" ON workflow_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own history" ON workflow_downloads FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users view own view history" ON workflow_views FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- AI Searches and Matches Policies
CREATE POLICY "Users view own AI searches" ON ai_searches FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users view own AI matches" ON ai_matches FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM ai_searches 
    WHERE ai_searches.id = search_id AND (ai_searches.user_id = auth.uid() OR is_admin())
  )
);
CREATE POLICY "Anyone can create AI search" ON ai_searches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create AI matches" ON ai_matches FOR INSERT WITH CHECK (true);

-- Duplicate Review Queue, Import Batches, Generation Batches
CREATE POLICY "Admins manage duplicate review queue" ON duplicate_review_queue FOR ALL USING (is_admin());
CREATE POLICY "Admins manage import batches" ON import_batches FOR ALL USING (is_admin());
CREATE POLICY "Admins manage generation batches" ON generation_batches FOR ALL USING (is_admin());
