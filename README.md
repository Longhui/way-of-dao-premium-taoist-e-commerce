# Way of DAO

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Longhui/way-of-dao-premium-taoist-e-commerce)

A modern, full-stack chat application built on Cloudflare Workers. This project demonstrates a scalable real-world chat system using Durable Objects for entity storage (Users, Chats, Messages), React with shadcn/ui for the frontend, and Hono for the API backend. Perfect for developers building collaborative apps with strong consistency and global replication.

## Features

- **Entity-Based Storage**: Durable Objects manage Users and ChatBoards (with embedded messages) for strong consistency without databases.
- **Type-Safe API**: Shared TypeScript types between frontend and worker ensure end-to-end type safety.
- **Modern UI**: Responsive design with shadcn/ui components, Tailwind CSS, dark mode, and animations.
- **CRUD Operations**: Create, list, send messages, and delete users/chats with pagination support.
- **Production-Ready**: Error boundaries, client-side caching with Tanstack Query, theme toggle, and Cloudflare deployment.
- **Indexed Listing**: Efficient prefix-based indexes for listing entities with cursors.
- **Seed Data**: Mock users and chats for quick testing.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Tanstack React Query, React Router, Sonner, Lucide React, Framer Motion
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed)
- **Tools**: Bun (package manager), wrangler (deployment), clsx, Zod
- **Dev Tools**: ESLint, TypeScript strict mode, hot reload

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Cloudflare CLI (wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged in: `bunx wrangler login`

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Run Locally**:
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or `$PORT`).

## Development

- **Frontend**: Edits to `src/` hot-reload automatically.
- **Backend Routes**: Add API endpoints in `worker/user-routes.ts`. Core utilities in `worker/core-utils.ts` and entities in `worker/entities.ts`.
- **New Entities**: Extend `IndexedEntity` in `worker/entities.ts` (see `UserEntity`, `ChatBoardEntity`).
- **Type Generation**: `bun run cf-typegen` after `wrangler` changes.
- **Lint**: `bun run lint`
- **Build**: `bun run build`
- **Preview**: `bun run preview`

### API Usage Examples

All endpoints under `/api/` return `{ success: boolean; data?: T; error?: string }`.

```bash
# List users (paginated)
curl "http://localhost:8787/api/users?limit=10"

# Create user
curl -X POST "http://localhost:8787/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# List chats
curl "http://localhost:8787/api/chats"

# Create chat
curl -X POST "http://localhost:8787/api/chats" \
  -H "Content-Type: application/json" \
  -d '{"title": "General"}'

# List messages
curl "http://localhost:8787/api/chats/c1/messages"

# Send message
curl -X POST "http://localhost:8787/api/chats/c1/messages" \
  -H "Content-Type: application/json" \
  -d '{"userId": "u1", "text": "Hello!"}'

# Delete user
curl -X DELETE "http://localhost:8787/api/users/u1"
```

Frontend uses `api(path, init)` helper in `src/lib/api-client.ts`.

## Deployment

1. **Build Assets**:
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare**:
   ```bash
   bun run deploy
   ```
   Or use the one-click deploy:

   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Longhui/way-of-dao-premium-taoist-e-commerce)

3. **Custom Domain**: Edit `wrangler.jsonc` and run `wrangler deploy`.
4. **Environment Variables**: Set via `wrangler secret put` or dashboard.
5. **Migrations**: Durable Object classes auto-migrate on deploy (see `wrangler.jsonc`).

## Customization

- **UI**: Replace `src/pages/HomePage.tsx` with your app. Use shadcn components via `npx shadcn@latest add <component>`.
- **Sidebar**: Edit `src/components/app-sidebar.tsx` or use `AppLayout` in `src/components/layout/AppLayout.tsx`.
- **Theme**: Toggle with `ThemeToggle`. CSS vars in `src/index.css`.
- **Entities**: Add new ones in `worker/entities.ts` and routes in `worker/user-routes.ts`.

## License

MIT License. See [LICENSE](LICENSE) for details.