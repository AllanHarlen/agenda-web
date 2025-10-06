# Agenda Web (Vue 3 + Vite)

Frontend da aplicação de agenda, construído com Vue 3 e Vite. A aplicação é servida em produção via Nginx e se comunica com a API por meio do path `/api/` (proxy reverso).

## Executar com Docker Compose (recomendado)

Este projeto é construído junto com a API pelo `docker-compose.yml` que vive em `agenda-api/WebApis`.

Passos:
1. Acesse `agenda-api/WebApis`
2. Execute:
   ```sh
   docker compose up -d --build
   ```

URLs úteis após o up:
- Frontend: `http://localhost/`
- API via proxy: `http://localhost/api/`

Notas de build:
- O Dockerfile do frontend aceita `ARG/ENV VITE_API_BASE_URL` (default definido no compose para `"/api/"`).
- Em desenvolvimento local (sem Docker), você pode configurar `VITE_API_BASE_URL` para apontar para a API, por exemplo `http://localhost:5000/api/`.

## Desenvolvimento local (sem Docker)

1. Instalar dependências:
   ```sh
   npm install
   ```
2. Configurar a URL da API (opcional):
   - Crie um arquivo `.env.local` na raiz deste projeto com:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api/
     ```
   - Alternativamente, use o proxy do `vite.config.js` já mapeado para `/api`.
3. Rodar o dev server:
   ```sh
   npm run dev
   ```
4. Build de produção:
   ```sh
   npm run build
   ```
5. Testes unitários (Vitest):
   ```sh
   npm run test:unit
   ```
6. Lint:
   ```sh
   npm run lint
   ```

## Integração com a API
- O cliente HTTP (`src/services/api.js`) resolve a base a partir de `import.meta.env.VITE_API_BASE_URL` e cai para `"/api/"` por padrão.
- Em produção com Nginx (compose), as rotas `/api/` são encaminhadas ao container da API.

## Estrutura (resumo)
- `src/components/` componentes reutilizáveis
- `src/views/` páginas de alto nível
- `src/services/` chamadas HTTP e serviços
- `src/stores/` Pinia stores
- `src/styles/` estilos globais
