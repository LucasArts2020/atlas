#   Atlas - Visão Geral Completa do Projeto

##   Estrutura Geral

```
ATLAS (Aplicação de Gerenciamento de Livros)
│
├──  ️ Frontend (Next.js)
│   ├── Autenticação
│   ├── Dashboard
│   ├── Catálogo de Livros
│   ├── Perfil do Usuário
│   ├── Configurações
│   └── Favoritos
│
└──   Backend (Express + TypeScript)
    ├── Autenticação (JWT)
    ├── Gestão de Livros
    ├── Favoritos
    ├── Perfil
    └── Atividades
```

---

##   Estrutura de Diretórios

```
atlas/
├── atlas-api/                    #   Backend API
│   ├── src/
│   │   ├── controllers/          # HTTP handlers
│   │   ├── services/             # Lógica de negócio
│   │   ├── repositories/         # Acesso a dados
│   │   ├── routes/               # Definição de rotas
│   │   ├── middlewares/          # JWT, validação
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Helpers
│   │   ├── config/               # Configurações
│   │   ├── schemas/              # Validação Zod
│   │   ├── server.ts             # Inicialização
│   │   └── database.ts           # Pool PostgreSQL
│   │
│   ├── ARCHITECTURE.md           # Documentação
│   ├── README_API.md             # README da API
│   ├── REFACTORING_SUMMARY.md    # Sumário
│   ├── REFACTORING_COMPLETE.md   # Status final
│   ├── .env.example              # Variáveis
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
└── atlas-web/                    #  ️ Frontend Next.js
    ├── app/
    │   ├── login/
    │   ├── register/
    │   ├── dashboard/
    │   ├── books/
    │   ├── profile/
    │   ├── settings/
    │   ├── favorites/
    │   └── timer/
    │
    ├── components/
    │   ├── BookCard.tsx
    │   ├── BookDetails.tsx
    │   ├── Sidebar.tsx
    │   └── ...
    │
    ├── hooks/
    │   └── useFetchWithAuth.ts
    │
    ├── types/
    │   └── index.ts
    │
    ├── package.json
    └── ...
```

---

##   Fluxo de Dados

### Ao Criar um Livro

```
1. Cliente (Frontend)
   └─ POST /books com dados do livro

2. API (Backend)
   ├─ authMiddleware valida JWT
   ├─ BookController.createBook processa
   ├─ bookSchema valida dados
   ├─ BookService orquestra
   ├─ BookRepository insere no DB
   └─ Response JSON retorna

3. Database
   ├─ INSERT em books table
   └─ Retorna livro criado

4. Frontend
   └─ Atualiza UI com novo livro
```

### Ao Buscar Perfil

```
1. Cliente
   └─ GET /profile com token

2. API
   ├─ authMiddleware → userId
   ├─ ProfileController.getProfile
   ├─ UserService.getUserProfile
   ├─ UserRepository.findById
   ├─ BookRepository.countByUser
   ├─ FavoriteRepository.countByUser
   └─ Response com stats

3. Frontend
   └─ Renderiza perfil + estatísticas
```

---

##   Segurança

### Fluxo de Autenticação

```
REGISTRO (POST /auth/register)
│
├─ Email existe?
│  ├─ Sim → Erro 400
│  └─ Não → Continua
│
├─ Hash da senha (bcryptjs)
│
├─ INSERT user na database
│
└─ Resposta com ID + email

LOGIN (POST /auth/login)
│
├─ Email existe?
│  ├─ Não → Erro 400
│  └─ Sim → Continua
│
├─ Password match?
│  ├─ Não → Erro 400
│  └─ Sim → Continua
│
├─ Gerar JWT token
│  └─ Payload: { id: userId }
│  └─ Secret: config.jwt.secret
│  └─ ExpiresIn: 7 dias
│
└─ Resposta com token

REQUISIÇÕES AUTENTICADAS
│
├─ Header: Authorization: Bearer TOKEN
│
├─ authMiddleware
│  ├─ Extrai token
│  ├─ Valida com JWT.verify
│  ├─ Extrai userId
│  └─ res.locals.userId = userId
│
└─ Controller acessa res.locals.userId
```

---

##   Banco de Dados

### Tabelas

```
USERS
├─ id (PK)
├─ name
├─ email (UNIQUE)
├─ password (hashed)
├─ theme (light/dark)
└─ created_at

BOOKS
├─ id (PK)
├─ title
├─ author
├─ summary
├─ cover_url
├─ status (quero_ler/lendo/lido)
├─ pages_total
├─ pages_read
├─ rating (1-5)
├─ published_date
├─ started_at
├─ finished_at
├─ user_id (FK → users)
└─ created_at

FAVORITES
├─ id (PK)
├─ user_id (FK → users)
├─ book_id (FK → books)
├─ created_at
└─ UNIQUE(user_id, book_id)
```

---

##   API Endpoints

### Autenticação

```
POST   /auth/register
POST   /auth/login
```

### Livros

```
POST   /books                      # Criar
GET    /books                      # Listar (com filtros)
GET    /books/:id                  # Detalhe
PUT    /books/:id                  # Atualizar
DELETE /books/:id                  # Deletar
```

### Favoritos

```
GET    /favorites                  # Listar
GET    /books/:id/is-favorite     # Verificar
POST   /books/:id/favorite        # Adicionar
DELETE /books/:id/favorite        # Remover
```

### Perfil

```
GET    /profile                    # Dados + stats
PUT    /profile                    # Atualizar
POST   /profile/change-password   # Alterar senha
GET    /profile/activity          # Histórico
```

---

##   Tecnologias

### Backend

- **Express.js** - Framework web
- **TypeScript** - Tipagem
- **PostgreSQL** - Banco
- **JWT** - Autenticação
- **bcryptjs** - Hash
- **Zod** - Validação
- **CORS** - Cross-origin

### Frontend

- **Next.js 16** - Framework React
- **Turbopack** - Bundler
- **TypeScript** - Tipagem
- **Tailwind CSS** - Estilos
- **Lucide Icons** - Ícones
- **js-cookie** - Gerenciar cookies

### DevOps

- **Docker** - Containerização
- **PostgreSQL** - Database
- **Node.js** - Runtime

---

##   Scripts Disponíveis

### Backend

```bash
npm run dev      # Desenvolvimento com auto-reload
npm run build    # Build para produção
npm start        # Inicia servidor compilado
npm run setup    # Setup inicial do banco
```

### Frontend

```bash
npm run dev      # Desenvolvimento com Turbopack
npm run build    # Build otimizado
npm run start    # Inicia servidor compilado
npm run lint     # Lint do código
```

---

##   Recursos Implementados

###   Completados

- [x] Autenticação com JWT
- [x] CRUD de livros
- [x] Sistema de favoritos
- [x] Perfil do usuário
- [x] Histórico de atividades
- [x] Ratings e avaliações
- [x] Rastreamento de leitura
- [x] Temas (light/dark)
- [x] Validação de entrada
- [x] Arquitetura refatorada

###   Em Progresso

- [ ] Testes unitários
- [ ] Documentação Swagger
- [ ] Rate limiting
- [ ] Caching (Redis)

###   Planejados

- [ ] Sistema de resenhas
- [ ] Comentários em livros
- [ ] Listas de leitura
- [ ] Recomendações
- [ ] Exportação de dados

---

##   Documentação

1. **ARCHITECTURE.md** - Arquitetura detalhada
2. **README_API.md** - Documentação da API
3. **REFACTORING_SUMMARY.md** - Resumo da refatoração
4. **REFACTORING_COMPLETE.md** - Status completo
5. **.env.example** - Variáveis de ambiente

---

##   Como Rodar Localmente

### 1. Setup Inicial

```bash
# Backend
cd atlas-api
npm install
cp .env.example .env
npm run setup
npm run dev

# Frontend (novo terminal)
cd atlas-web
npm install
npm run dev
```

### 2. Acessar

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Database: localhost:5438

### 3. Credenciais Padrão (se criadas)

```
Email: user@example.com
Password: senha123
```

---

##   Stack Final

```
┌─────────────────────────────────────────────────────────────┐
│                  ATLAS - Arquitetura Final                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Cliente (Browser)                                           │
│  ├─ Next.js 16 + Turbopack                                 │
│  ├─ React Components + Tailwind CSS                        │
│  └─ HTTP/REST + JWT                                        │
│        │                                                    │
│        ↓                                                    │
│  API Server (Express)                                       │
│  ├─ Controllers → Services → Repositories                  │
│  ├─ JWT Middleware + Zod Validation                        │
│  ├─ RESTful Endpoints                                      │
│  └─ Error Handling                                         │
│        │                                                    │
│        ↓                                                    │
│  Database (PostgreSQL)                                      │
│  ├─ Users, Books, Favorites                                │
│  ├─ Relationships & Constraints                            │
│  └─ ACID Compliance                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

##   Conclusão

Atlas é uma aplicação **moderna, escalável e bem arquitetada** para gerenciamento de livros pessoais. Com separação clara de responsabilidades, tipagem TypeScript e padrões de design estabelecidos, está pronta para crescimento futuro.

### Status:   PRONTA PARA DESENVOLVIMENTO E PRODUÇÃO

---

**Desenvolvido com  ️ em TypeScript, React e Express.js**
