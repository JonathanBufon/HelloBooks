# Quickstart: Frontend — Catalogo e Shell

**Feature**: 003-frontend-catalogo | **Date**: 2026-06-20

## Pre-requisitos

- Node.js 18+ e npm 9+ (ou equivalente)
- Backend HelloBooks rodando em `localhost:8015` (ver docker-compose abaixo)

## 1. Subir o Backend (Docker)

```bash
cd docker
docker compose up -d
```

Aguardar o backend ficar saudavel:

```bash
docker compose ps  # backend deve estar "running"
curl http://localhost:8015/api/v1/livros  # deve retornar 401 (OK, significa que esta rodando)
```

Rodar migrations e seed (se primeira vez):

```bash
docker compose exec backend php artisan migrate --seed
```

## 2. Scaffolding do Projeto Frontend

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

### Dependencias adicionais

```bash
npm install react-router-dom axios lucide-react
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 3. Configuracao do Vite (proxy)

Em `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8015',
        changeOrigin: true,
      },
    },
  },
})
```

## 4. Importar Tokens CSS

Copiar os arquivos de tokens do Design System para `src/styles/`:

```bash
mkdir -p src/styles
cp Hello_Books_Design_System/tokens/*.css src/styles/
```

Em `src/main.tsx`, importar:

```typescript
import './styles/fonts.css'
import './styles/colors.css'
import './styles/typography.css'
import './styles/spacing.css'
import './styles/radii.css'
import './styles/base.css'
```

## 5. Rodar em Desenvolvimento

```bash
cd frontend
npm run dev
```

Abrir `http://localhost:5173`. O proxy redireciona `/api/*` para o backend em `localhost:8015`.

## 6. Rodar Testes

```bash
cd frontend
npx vitest
```

Ou com watch:

```bash
npx vitest --watch
```

## 7. Smoke Test

1. Abrir `http://localhost:5173/login`
2. Fazer login com credenciais do seed (ex: `admin@hellobooks.com` / `password`)
3. Verificar redirect para Dashboard
4. Navegar pela Sidebar: Catalogo, Autores, Editoras, Categorias, Usuarios, Auditoria
5. Verificar que cada pagina carrega dados da API sem erros no console

## Estrutura de Diretorios Esperada

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Hello_Books_Design_System/   # Referencia (somente leitura)
├── src/
│   ├── main.tsx
│   ├── routes.tsx
│   ├── api/                     # Cliente HTTP + modulos por recurso
│   ├── components/
│   │   ├── ds/                  # 26 componentes portados do DS
│   │   └── layout/              # AppShell, ProtectedRoute
│   ├── features/                # Paginas por dominio
│   ├── hooks/                   # useAuth, usePagination, useToast
│   ├── types/                   # Interfaces TypeScript
│   └── styles/                  # Tokens CSS + global.css
└── __tests__/                   # Testes Vitest + RTL
```
