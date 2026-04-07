#!/bin/sh
set -eu

COMPOSE_URL="https://raw.githubusercontent.com/fbcgulfport/1tap/main/docker-compose.yml"
TTY_IN="/dev/tty"
TTY_OUT="/dev/tty"

if [ ! -r "$TTY_IN" ] || [ ! -w "$TTY_OUT" ]; then
	echo "This installer needs an interactive terminal (/dev/tty)."
	echo "Run it directly in a terminal, e.g.: curl -fsSL <url> | sh"
	exit 1
fi

say() {
	printf "%s\n" "$1" >"$TTY_OUT"
}

ask() {
	name="$1"
	prompt="$2"
	default="${3-}"
	if [ -n "$default" ]; then
		printf "%s [%s]: " "$prompt" "$default" >"$TTY_OUT"
	else
		printf "%s: " "$prompt" >"$TTY_OUT"
	fi
	IFS= read -r value <"$TTY_IN" || true
	if [ -z "$value" ]; then
		value="$default"
	fi
	eval "$name=\$value"
}

escape_env() {
	printf "%s" "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

gen_hex() {
	bytes="$1"
	if command -v openssl >/dev/null 2>&1; then
		openssl rand -hex "$bytes"
		return
	fi
	head -c "$bytes" /dev/urandom | od -An -tx1 | tr -d ' \n'
}

if ! command -v docker >/dev/null 2>&1; then
	say "docker not found. install Docker first."
	exit 1
fi

if docker compose version >/dev/null 2>&1; then
	COMPOSE_MODE="plugin"
elif command -v docker-compose >/dev/null 2>&1; then
	COMPOSE_MODE="legacy"
else
	say "docker compose not found (plugin or docker-compose)."
	exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
	say "curl not found. install curl first."
	exit 1
fi

say "1Tap docker installer"
say "--------------------"

DEFAULT_DIR="$PWD/1tap"
DEFAULT_API_KEY="$(gen_hex 16)"
DEFAULT_AUTH_SECRET="$(gen_hex 32)"

ask INSTALL_DIR "Install directory" "$DEFAULT_DIR"
ask PORT "Host port" "3000"
ask PRODUCT_NAME "Product name" "1Tap"
ask LOGO_URL "Logo URL" "/logo.png"
ask API_KEY "API key" "$DEFAULT_API_KEY"
ask BETTER_AUTH_SECRET "Better Auth secret (64+ hex chars recommended)" "$DEFAULT_AUTH_SECRET"
ask NEXT_PUBLIC_BETTER_AUTH_URL "Public app URL" "http://localhost:$PORT"
ask AUTHORIZED_DOMAIN "Authorized email domain" "example.com"
ask GOOGLE_CLIENT_ID "Google client ID" "replace-me"
ask GOOGLE_CLIENT_SECRET "Google client secret" "replace-me"
ask POSTHOG_API_KEY "PostHog API key (optional)" ""
ask NEXT_PUBLIC_POSTHOG_KEY "PostHog public key (optional)" ""

mkdir -p "$INSTALL_DIR/persist/data" "$INSTALL_DIR/persist/uploads"

curl -fsSL "$COMPOSE_URL" -o "$INSTALL_DIR/docker-compose.yml"

PRODUCT_NAME_ESC="$(escape_env "$PRODUCT_NAME")"
LOGO_URL_ESC="$(escape_env "$LOGO_URL")"
API_KEY_ESC="$(escape_env "$API_KEY")"
BETTER_AUTH_SECRET_ESC="$(escape_env "$BETTER_AUTH_SECRET")"
NEXT_PUBLIC_BETTER_AUTH_URL_ESC="$(escape_env "$NEXT_PUBLIC_BETTER_AUTH_URL")"
AUTHORIZED_DOMAIN_ESC="$(escape_env "$AUTHORIZED_DOMAIN")"
GOOGLE_CLIENT_ID_ESC="$(escape_env "$GOOGLE_CLIENT_ID")"
GOOGLE_CLIENT_SECRET_ESC="$(escape_env "$GOOGLE_CLIENT_SECRET")"
POSTHOG_API_KEY_ESC="$(escape_env "$POSTHOG_API_KEY")"
NEXT_PUBLIC_POSTHOG_KEY_ESC="$(escape_env "$NEXT_PUBLIC_POSTHOG_KEY")"

umask 077
cat >"$INSTALL_DIR/.env" <<EOF
PORT=$PORT
PRODUCT_NAME="$PRODUCT_NAME_ESC"
LOGO_URL="$LOGO_URL_ESC"
API_KEY="$API_KEY_ESC"
BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET_ESC"
NEXT_PUBLIC_BETTER_AUTH_URL="$NEXT_PUBLIC_BETTER_AUTH_URL_ESC"
AUTHORIZED_DOMAIN="$AUTHORIZED_DOMAIN_ESC"
GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID_ESC"
GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET_ESC"
POSTHOG_API_KEY="$POSTHOG_API_KEY_ESC"
NEXT_PUBLIC_POSTHOG_KEY="$NEXT_PUBLIC_POSTHOG_KEY_ESC"
EOF

run_compose() {
	if [ "$COMPOSE_MODE" = "plugin" ]; then
		docker compose "$@"
	else
		docker-compose "$@"
	fi
}

(
	cd "$INSTALL_DIR"
	run_compose pull
	run_compose up -d
)

say ""
say "done."
say "app: $NEXT_PUBLIC_BETTER_AUTH_URL"
say "install dir: $INSTALL_DIR"
say "data dir: $INSTALL_DIR/persist/data"
say "uploads dir: $INSTALL_DIR/persist/uploads"
say ""
say "manage later:"
say "  cd $INSTALL_DIR"
if [ "$COMPOSE_MODE" = "plugin" ]; then
	say "  docker compose ps"
	say "  docker compose logs -f"
else
	say "  docker-compose ps"
	say "  docker-compose logs -f"
fi
