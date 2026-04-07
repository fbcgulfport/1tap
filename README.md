# 1Tap

A simple link aggregator page designed for use with NFC tap tags

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- SQLite database

### Installation

1. Clone the repository:
	```bash
	git clone <your-repo-url>
	cd 1tap
	```

2. Install dependencies:
	```bash
	bun install
	```

3. Set up environment variables:
	```bash
	cp .env.example .env.local
	```
	
	Add your configuration:
	```env
	EDIT_PASSWORD=your-secure-password
	PRODUCT_NAME=1Tap
	LOGO_URL=/logo.png
	```

4. Set up the database:
	```bash
	bun run db:push
	```

5. Start the development server:
	```bash
	bun run dev
	```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Docker

### Fast install (curl + prompts)

```bash
curl -fsSL https://raw.githubusercontent.com/fbcgulfport/1tap/main/install-docker.sh | sh
```

Installer does all setup:
- prompts for required config values
- downloads latest `docker-compose.yml`
- creates persistent folders (`persist/data`, `persist/uploads`)
- writes `.env`
- starts the app with Docker Compose

### Manual Docker Compose

```bash
curl -fsSL https://raw.githubusercontent.com/fbcgulfport/1tap/main/docker-compose.yml -o docker-compose.yml
cp .env.example .env
# edit .env (required: API_KEY, BETTER_AUTH_SECRET, NEXT_PUBLIC_BETTER_AUTH_URL, AUTHORIZED_DOMAIN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
mkdir -p persist/data persist/uploads
docker compose up -d
```

Data locations:
- SQLite DB: `./persist/data/app.db`
- Uploaded files: `./persist/uploads/`

Upgrade flow (keeps data):
```bash
docker compose pull
docker compose up -d
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run linting
- `bun run typecheck` - Run TypeScript type checking
- `bun run db:push` - Push database schema changes

## License

MIT License - see LICENSE file for details.
