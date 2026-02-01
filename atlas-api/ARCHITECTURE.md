# Atlas API - Arquitetura Melhorada

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Handlers HTTP - Processam requisições
│   ├── authControllers.ts       # Autenticação (register, login)
│   ├── profileController.ts     # Perfil do usuário
│   └── bookController.ts        # Livros, Favoritos e Atividades
│
├── services/            # Lógica de negócios reutilizável
│   └── index.ts              # UserService, BookService
│
├── repositories/        # Abstração de acesso aos dados (Data Access Layer)
│   └── index.ts              # UserRepository, BookRepository, FavoriteRepository
│
├── routes/              # Definição de rotas agrupadas por domínio
│   ├── routes.ts             # Arquivo principal que monta todas as rotas
│   ├── authRoutes.ts         # Rotas de autenticação
│   ├── bookRoutes.ts         # Rotas de livros, favoritos e atividades
│   └── profileRoutes.ts      # Rotas de perfil
│
├── middlewares/         # Middlewares Express
│   └── auth.ts               # Autenticação JWT
│
├── types/               # Tipos TypeScript centralizados
│   └── index.ts              # User, Book, Profile, Stats, etc.
│
├── utils/               # Funções auxiliares e helpers
│   └── helpers.ts            # Funções reutilizáveis
│
├── schemas/             # Validação com Zod
├── database.ts          # Configuração do Pool PostgreSQL
├── server.ts            # Inicialização do Express
└── config/              # Configurações (variáveis de ambiente)
```

## 🏗️ Arquitetura em Camadas

### 1. **Controllers** (Camada de Apresentação)

Responsáveis por:

- Receber requisições HTTP
- Validar dados
- Chamar services
- Retornar respostas HTTP

```typescript
// Exemplo: ProfileController.getProfile
static async getProfile(req: AuthRequest, res: Response) {
  const userId = res.locals.userId;
  const profile = await UserService.getUserProfile(userId);
  res.json(profile);
}
```

### 2. **Services** (Camada de Negócios)

Responsáveis por:

- Lógica de negócio
- Orquestração de repositories
- Transformação de dados
- Cálculos e processamentos

```typescript
// Exemplo: UserService.getUserProfile
static async getUserProfile(userId: number): Promise<Profile | null> {
  const user = await UserRepository.findById(userId);
  const stats = await this.getUserStats(userId);
  return { user, stats };
}
```

### 3. **Repositories** (Camada de Dados)

Responsáveis por:

- Abstrair acesso ao banco de dados
- Executar queries SQL
- Retornar dados brutos

```typescript
// Exemplo: UserRepository.findById
static async findById(id: number): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}
```

## 📦 Fluxo de uma Requisição

```
1. Cliente envia GET /profile
   ↓
2. authMiddleware valida JWT
   ↓
3. ProfileController.getProfile é chamado
   ↓
4. UserService.getUserProfile orquestra a busca
   ↓
5. UserRepository.findById busca no banco
   ↓
6. Dados retornam pelos services → controller
   ↓
7. Response JSON é enviado ao cliente
```

## 🔄 Vantagens da Nova Arquitetura

✅ **Separação de Responsabilidades**

- Cada classe tem uma responsabilidade clara

✅ **Reutilização**

- Services e Repositories podem ser usados por múltiplos controllers

✅ **Testabilidade**

- Cada camada pode ser testada isoladamente
- Fácil fazer mocks de repositories

✅ **Manutenibilidade**

- Código organizado e previsível
- Mudanças no banco afetam apenas repositories

✅ **Escalabilidade**

- Fácil adicionar novos endpoints
- Fácil refatorar sem quebrar tudo

## 🚀 Adicionando Novo Endpoint

### Exemplo: Adicionar rota DELETE /books/:id/favorite

**1. Criar o método no Controller** (bookController.ts)

```typescript
static async removeFavorite(req: AuthRequest, res: Response) {
  const bookId = Number(req.params.id);
  const userId = res.locals.userId;

  const success = await FavoriteRepository.remove(userId, bookId);
  if (!success) return res.status(404).json({ error: "Não encontrado" });

  res.json({ message: "Removido dos favoritos" });
}
```

**2. Adicionar a rota** (bookRoutes.ts)

```typescript
router.delete(
  "/books/:id/favorite",
  authMiddleware,
  FavoriteController.removeFavorite,
);
```

**3. (Opcional) Adicionar método no Repository se necessário**

```typescript
static async remove(userId: number, bookId: number): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2",
    [userId, bookId],
  );
  return result.rowCount > 0;
}
```

## 📝 Convenções

- **Controllers**: PascalCase, sufixo `Controller`
- **Services**: PascalCase, sufixo `Service`
- **Repositories**: PascalCase, sufixo `Repository`
- **Routes**: camelCase, sufixo `Routes`
- **Methods**: camelCase
- **Variables**: camelCase
- **Types**: PascalCase

## 🔐 Segurança

- ✅ Autenticação JWT via `authMiddleware`
- ✅ Validação de entrada com Zod
- ✅ Proteção de rotas com middleware
- ✅ Verificação de propriedade (usuário só acessa seus dados)
- ✅ Senhas hasheadas com bcryptjs

## 📚 Tecnologias

- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **TypeScript** - Tipagem estática
- **Zod** - Validação de schemas
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 🧪 Próximas Melhorias

- [ ] Adicionar testes unitários
- [ ] Implementar tratamento de erros centralizado
- [ ] Adicionar logging estruturado
- [ ] Implementar rate limiting
- [ ] Adicionar documentação API com Swagger
- [ ] Implementar cache com Redis
