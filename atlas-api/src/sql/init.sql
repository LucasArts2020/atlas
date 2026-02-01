

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'light';

DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('lendo', 'lido', 'quero_ler');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_date DATE,
  summary TEXT,
  cover_url TEXT,
  status book_status DEFAULT 'quero_ler',
  pages_total INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 0, -- <--- NOVA COLUNA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE books ADD COLUMN notes TEXT;

-- Adicione estas linhas ao seu init.sql ou rode no banco
ALTER TABLE books ADD COLUMN IF NOT EXISTS pages_total INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS pages_read INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0;
-- A coluna notes você já tinha o comando, mas garanta que ela existe
ALTER TABLE books ADD COLUMN IF NOT EXISTS notes TEXT;

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, book_id)
);
