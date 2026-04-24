CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE alumni (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  nim TEXT,
  entry_year TEXT,
  graduation_date TEXT,
  faculty TEXT,
  major TEXT,

  linkedin TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  email TEXT,
  phone TEXT,
  workplace TEXT,
  workplace_address TEXT,
  position TEXT,
  employment_type TEXT, -- 
  workplace_social_media TEXT,
  

  name_variations JSONB DEFAULT '[]'::jsonb,
  affiliation_keywords JSONB DEFAULT '[]'::jsonb,
  context_keywords JSONB DEFAULT '[]'::jsonb,
  tracking_status TEXT DEFAULT 'Belum Dilacak', 
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE tracking_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  priority_level INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


INSERT INTO tracking_sources (name, type, priority_level) VALUES
  ('Google Scholar', 'Academic', 1),
  ('LinkedIn', 'Professional', 1),
  ('ORCID', 'Academic', 2),
  ('Company Directory', 'Web', 3);


CREATE TABLE tracking_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alumni_id UUID REFERENCES alumni(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  source_id UUID REFERENCES tracking_sources(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE tracking_candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alumni_id UUID REFERENCES alumni(id) ON DELETE CASCADE,
  source_id UUID REFERENCES tracking_sources(id) ON DELETE SET NULL,
  identity_signals JSONB NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Perlu Verifikasi', 
  proof_pointer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE tracking_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alumni_id UUID REFERENCES alumni(id) ON DELETE CASCADE,
  source_id UUID REFERENCES tracking_sources(id) ON DELETE SET NULL,
  summary TEXT,
  confidence_score NUMERIC DEFAULT 0,
  proof_pointer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alumni_modtime
BEFORE UPDATE ON alumni
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
