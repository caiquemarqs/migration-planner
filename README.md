# ImigraFlow — Gerente Financeiro de Imigração

O ImigraFlow é um MVP focado no planejamento financeiro para imigração. Este repositório contém a API em Node.js (backend), e será expandido com um frontend estático via Next.js (/web) e app mobile com Expo (/app-mobile).

## Estrutura Atual
- `/backend`: API construída com Node.js, Express e PostgreSQL (via Prisma).

## Pré-requisitos
- Node.js (v18 ou v20)
- PostgreSQL (ou banco da nuvem, recomendado Supabase)
- Opcional: Redis (para cache em produção, fallback local em memória)
- Git

## Configuração do Backend Localmente

1. **Instale as dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Copie as variáveis de ambiente:**
   ```bash
   copy .env.example .env
   ```
   *Preencha os valores do banco de dados (eg., Supabase URL), Stripe e Mercado Pago no `.env`.*

3. **Inicialize o Banco de Dados:**
   ```bash
   npx prisma generate
   npx prisma db push # (ou npx prisma migrate dev)
   ```

4. **Inicie o servidor localmente:**
   ```bash
   npm run dev
   ```

## Deploy - Cloud Run (Backend)

1. Crie o aplicativo na Google Cloud e autentique via `gcloud`:
   ```bash
   gcloud auth login
   gcloud config set project [PROJECT_ID]
   ```
2. Realize o deploy a partir do código-fonte (Cloud Run automatiza o build via Buildpacks ou Dockerfile):
   ```bash
   cd backend
   gcloud run deploy imigraflow-backend --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NODE_ENV=production,DATABASE_URL=xxx,..."
   ```

## Frontend Web (Landing & Painel) e App Expo

As instruções para inicialização do frontend em (/web) e do mobile em (/app-mobile) serão adicionadas a seguir, incluindo:
- **Deploy do Web no Firebase Hosting:** `firebase deploy --only hosting`
- **Ambiente de testes Expo (app-mobile):** `npx expo start`
