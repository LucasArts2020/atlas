#   Atlas API

API RESTful para gerenciamento de livros pessoais com sistema de favoritos, ratings e rastreamento de leitura.

##   Features

-   Autenticação com JWT
-   Gerenciamento de livros (CRUD)
-   Sistema de favoritos
-   Ratings e avaliações
-   Rastreamento de leitura (páginas lidas)
-   Perfil do usuário
-   Histórico de atividades
-   Segurança com bcryptjs
-   Validação com Zod

##  ️ Arquitetura

A API segue o padrão de arquitetura em camadas:

```
Controllers → Services → Repositories → Database
```

Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes completos.

## Instalação

### Pré-requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Setup

1. **Clone o repositório**

```bash
git clone <repo-url>
cd atlas-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. **Inicie o banco de dados**

```bash
# Com Docker
docker-compose up -d
```

5. **Execute a migração inicial**

```bash
npm run setup
```

6. **Inicie o servidor**

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

##   Endpoints

### Autenticação

```bash
POST /auth/register
POST /auth/login
```

### Livros

```bash
POST   /books              # Criar livro
GET    /books              # Listar livros (com filtros)
GET    /books/:id          # Obter livro específico
PUT    /books/:id          # Atualizar livro
DELETE /books/:id          # Deletar livro
```

### Favoritos

```bash
GET    /favorites                  # Listar favoritos
GET    /books/:id/is-favorite     # Verificar se é favorito
POST   /books/:id/favorite        # Adicionar aos favoritos
DELETE /books/:id/favorite        # Remover dos favoritos
```

### Perfil

```bash
GET    /profile                    # Obter perfil do usuário
PUT    /profile                    # Atualizar perfil
POST   /profile/change-password   # Alterar senha
GET    /profile/activity          # Obter histórico de atividades
```

##   Exemplos de Uso

### Registrar novo usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar um livro

```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "summary": "Um livro sobre como escrever código limpo...",
    "cover_url": "https://...",
    "status": "lendo",
    "pages_total": 464,
    "pages_read": 120,
    "rating": 5
  }'
```

### Listar livros com filtros

```bash
curl "http://localhost:3000/books?page=1&q=clean&status=lendo" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Adicionar aos favoritos

```bash
curl -X POST http://localhost:3000/books/1/favorite \
  -H "Authorization: Bearer SEU_TOKEN"
```

##   Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após fazer login, você receberá um token que deve ser enviado em todas as requisições protegidas:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##  ️ Banco de Dados

### Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  summary TEXT,
  cover_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'quero_ler',
  pages_total INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 0,
  published_date DATE,
  started_at DATE,
  finished_at DATE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, book_id)
);
```

##   Dependências

- **express**: Framework web
- **pg**: PostgreSQL driver
- **bcryptjs**: Hash de senhas
- **jsonwebtoken**: Geração e validação de JWT
- **zod**: Validação de schemas
- **cors**: Middleware CORS
- **dotenv**: Variáveis de ambiente
- **typescript**: Tipagem estática
- **ts-node-dev**: Desenvolvimento com auto-reload

##   Scripts

```bash
npm run dev      # Inicia em desenvolvimento com auto-reload
npm run build    # Build para produção
npm start        # Inicia o servidor compilado
npm run setup    # Executa setup inicial do banco
```

##   Configuração

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5438
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=atlas_db

# JWT
JWT_SECRET=seu_segredo_super_secreto
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

##   Estrutura de Arquivos

Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para entender a estrutura do projeto.

##   Tratamento de Erros

A API retorna erros em formato JSON:

```json
{
  "error": "Descrição do erro"
}
```

Códigos HTTP principais:

- `200 OK` - Sucesso
- `201 Created` - Criado com sucesso
- `400 Bad Request` - Erro na validação
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

##   Segurança

-   Senhas hasheadas com bcryptjs
-   JWT para autenticação
-   CORS configurado
-   Validação de entrada com Zod
-   Proteção contra SQL injection (prepared statements)
-   Verificação de propriedade (usuário só acessa seus dados)

##   Deploy

### Heroku

```bash
git push heroku main
```

### Docker

```bash
docker build -t atlas-api .
docker run -p 3000:3000 atlas-api
```

##   Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Sumário da refatoração
- [.env.example](./.env.example) - Exemplo de variáveis de ambiente

##   Contribuindo

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

##   Licença

Este projeto está sob a licença ISC.

##   Autor

Atlas API - Sistema de Gerenciamento de Livros Pessoais

---

**Desenvolvido com  ️ usando Express.js e TypeScript**
