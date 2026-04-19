---
title: CLI Overview
description: Use the MailAtlas CLI to ingest files, receive Gmail or IMAP messages, list and inspect documents, export JSON, Markdown, HTML, or PDF, send outbound email, run doctor, and start the MCP server.
slug: docs/cli/overview
---

The MailAtlas CLI provides a local workflow for email I/O:

1. Ingest email files from disk.
2. Receive Gmail or IMAP messages from a live mailbox.
3. List stored documents.
4. Inspect or export one document.
5. Send outbound email through configured providers when needed.
6. Run local self-checks and optional MCP tools.

Across all ingest paths, MailAtlas preserves raw messages, cleaned text, normalized HTML, extracted inline images, regular attachments, metadata, and source provenance.

## Root and defaults

MailAtlas stores data in one workspace root. The default is `.mailatlas` in the current directory.

Root resolution order:

1. `--root`
2. `MAILATLAS_HOME`
3. Project config from `.mailatlas.toml` or `pyproject.toml`
4. Fallback `.mailatlas`

The default workspace contains `store.db`, `raw/`, `html/`, `assets/`, `exports/`, and `outbound/`. Receive account state, cursors, and run history live in `store.db`.

## Command summary

| Command | Purpose |
| --- | --- |
| `mailatlas ingest` | Ingest `.eml` files or `mbox` archives from disk. |
| `mailatlas receive` | Receive Gmail or IMAP messages into the local workspace. |
| `mailatlas list` | List stored document references. |
| `mailatlas get` | Read or export one stored document. |
| `mailatlas send` | Render, store, and optionally send outbound email. |
| `mailatlas doctor` | Run a local self-check for install and export behavior. |
| `mailatlas mcp` | Run the optional MCP server. |
| `mailatlas auth gmail` | Authorize the local Gmail API provider workflow. |
| `mailatlas auth status gmail` | Check local Gmail auth status. |
| `mailatlas auth logout gmail` | Remove local Gmail auth token material. |

## Ingest files from disk

```bash
mailatlas ingest \
  sample-data/fixtures/eml/atlas-market-map.eml \
  sample-data/fixtures/eml/atlas-inline-chart.eml
```

MailAtlas auto-detects `.eml` files and `mbox` archives. The command prints a JSON summary with ingested and duplicate counts plus document refs.

Use an explicit type only when auto-detection is not enough:

```bash
mailatlas ingest path/to/input --type eml
mailatlas ingest path/to/archive.mbox --type mbox
```

Accepted `--type` values are `auto`, `eml`, and `mbox`.

## Receive IMAP folders

```bash
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_PASSWORD=app-password

mailatlas receive \
  --provider imap \
  --folder INBOX \
  --folder Newsletters
```

Use OAuth access token auth when your auth layer already has a token:

```bash
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token
mailatlas receive --provider imap --folder INBOX
```

MailAtlas consumes the token but does not run a browser login flow or manage refresh tokens for IMAP.

Run foreground polling when you want selected folders to stay current:

```bash
mailatlas receive watch \
  --provider imap \
  --folder INBOX \
  --interval 60
```

## Receive Gmail

Authorize a read-only Gmail token before running receive:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Run one bounded receive pass:

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 50
```

The command prints JSON with `status`, `account_id`, message counts, `document_ids`, cursor data, and a `run_id`. MailAtlas stores received messages in the same document store used by `ingest` and IMAP receive.

Run foreground polling when you want the local workspace to stay current:

```bash
mailatlas receive watch \
  --provider gmail \
  --label INBOX \
  --interval 60
```

`watch` prints one compact JSON line per run. Stop it with your shell or process manager, or pass `--max-runs` for a bounded script.

Inspect local receive accounts, cursors, and recent runs:

```bash
mailatlas receive status
```

Gmail receive is read-only. MailAtlas does not archive, delete, label, or mark messages read.

## List and inspect documents

```bash
mailatlas list
mailatlas list --query "invoice"
mailatlas get <document-id>
```

`get` prints the full stored document as JSON by default, including metadata and extracted asset references.

## Export documents

```bash
mailatlas get <document-id> --format json --out ./document.json
mailatlas get <document-id> --format markdown --out ./document-markdown
mailatlas get <document-id> --format html --out ./document.html
mailatlas get <document-id> --format pdf --out ./document.pdf
```

Supported formats are `json`, `markdown`, `html`, and `pdf`.

PDF export uses Chrome or Chromium. Set `MAILATLAS_PDF_BROWSER` if the browser executable is not on the default path.

## Send outbound email

Simple send:

```bash
mailatlas send \
  --from agent@example.com \
  --to user@example.com \
  --subject "Build complete" \
  --text "The build passed."
```

Dry run:

```bash
mailatlas send \
  --dry-run \
  --from agent@example.com \
  --to user@example.com \
  --subject "Build complete" \
  --text "The build passed."
```

Body inputs:

```bash
mailatlas send --from agent@example.com --to user@example.com --subject "Plain" --text "Plain body"
mailatlas send --from agent@example.com --to user@example.com --subject "File" --text-file body.txt
mailatlas send --from agent@example.com --to user@example.com --subject "HTML" --html-file body.html
```

Attachments and custom headers:

```bash
mailatlas send \
  --from agent@example.com \
  --to user@example.com \
  --subject "Report" \
  --text-file report-summary.txt \
  --attach report.pdf \
  --header "X-Campaign-ID: weekly"
```

The command prints JSON with fields such as `status`, `id`, `provider`, `provider_message_id`, and `error`.

Statuses include `draft`, `dry_run`, `sending`, `sent`, `queued`, and `error`.

BCC recipients are included in the provider envelope and stored in SQLite for audit. They are omitted from local raw MIME snapshots.

## Run doctor

```bash
mailatlas doctor
mailatlas doctor --skip-pdf
mailatlas doctor --require-pdf
```

`doctor` creates a temporary store, ingests a synthetic message, and verifies JSON export. If Chrome or Chromium is available, it also verifies PDF export.

## Run the MCP server

```bash
python -m pip install "mailatlas[mcp]"
mailatlas mcp --root .mailatlas
```

The MCP server exposes document, export, outbound-list, outbound-get, and draft tools over MCP. The live send tool is hidden unless `MAILATLAS_MCP_ALLOW_SEND=1` is set before the server starts.

Mailbox receive tools are hidden unless `MAILATLAS_MCP_ALLOW_RECEIVE=1` is set before server startup.

## Common flags

| Flag | Purpose |
| --- | --- |
| `--root` | Select the MailAtlas workspace root. |
| `--query` | Optional substring search for `list`. |
| `--folder` | Repeatable folder selector for IMAP receive. Defaults to `INBOX`. |
| `--label` | Gmail label for receive. Defaults to `INBOX`. |
| `--limit` | Maximum Gmail messages to receive in one pass. Defaults to `50`. |
| `--full-sync` | Ignore the stored Gmail cursor and run an explicit full sync pass. |
| `--interval` | Polling interval for `receive watch`. Defaults to `60` seconds. |
| `--max-runs` | Optional run limit for `receive watch`. |
| `--type` | Optional ingest type override. |
| `--dry-run` | Render and store outbound email without contacting a provider. |
| `--to`, `--cc`, `--bcc` | Add outbound recipients. |
| `--reply-to` | Set Reply-To for outbound email. |
| `--attach` | Attach a file to outbound email. |
| `--header` | Add a custom outbound header. |
| `--transport` | MCP transport. Currently `stdio`. |

## Parser cleaning flags

The `ingest` and `receive --provider imap` commands accept parser-cleaning flags such as:

- `--strip-forwarded-headers`
- `--strip-boilerplate`
- `--strip-link-only-lines`
- `--stop-at-footer`
- `--strip-invisible-chars`
- `--normalize-whitespace`

Each also supports a `--no-...` form. Use [Parser Cleaning](/docs/config/parser-cleaning/) for behavior and tradeoffs.

## Output behavior

- `ingest` prints a JSON summary with counts and created document refs.
- `receive` prints a JSON result with counts, document IDs, cursor state, run ID, and provider-specific details when available.
- `receive watch` prints one compact JSON object per line.
- `receive status` prints accounts, cursors, recent runs, and the last error when one exists.
- `list` prints stored document refs as JSON.
- `get` prints one stored document as JSON by default.
- `get --format markdown --out <directory>` writes `document.md` plus an `assets/` bundle and prints the resolved path to `document.md`.
- `get --out ...` writes a file and prints the resolved output path for `json`, `html`, and `pdf`.
- `get --format pdf` writes to `exports/<document-id>.pdf` if `--out` is omitted.
- `get --format markdown` prints Markdown to stdout with absolute local asset paths when `--out` is omitted.
- `send` prints a send result as JSON and returns non-zero when the provider result is `error`.

## Outbound provider configuration

Choose a provider with `--provider` or `MAILATLAS_SEND_PROVIDER`.

Supported values: `smtp`, `cloudflare`, and `gmail`.

SMTP variables: `MAILATLAS_SMTP_HOST`, `MAILATLAS_SMTP_PORT`, `MAILATLAS_SMTP_USERNAME`, `MAILATLAS_SMTP_PASSWORD`, `MAILATLAS_SMTP_STARTTLS`, `MAILATLAS_SMTP_SSL`.

Cloudflare variables: `MAILATLAS_CLOUDFLARE_ACCOUNT_ID`, `MAILATLAS_CLOUDFLARE_API_TOKEN`, `MAILATLAS_CLOUDFLARE_API_BASE`.

Gmail send variables: `MAILATLAS_GMAIL_ACCESS_TOKEN`, `MAILATLAS_GMAIL_API_BASE`, `MAILATLAS_GMAIL_USER_ID`, `MAILATLAS_GMAIL_TOKEN_FILE`, `MAILATLAS_GMAIL_TOKEN_STORE`, `MAILATLAS_GMAIL_CLIENT_ID`, `MAILATLAS_GMAIL_CLIENT_SECRET`.

Receive variables: `MAILATLAS_RECEIVE_PROVIDER`, Gmail variables such as `MAILATLAS_GMAIL_ACCESS_TOKEN`, `MAILATLAS_GMAIL_API_BASE`, `MAILATLAS_GMAIL_USER_ID`, `MAILATLAS_GMAIL_RECEIVE_LABEL`, `MAILATLAS_GMAIL_RECEIVE_QUERY`, `MAILATLAS_GMAIL_RECEIVE_LIMIT`, `MAILATLAS_GMAIL_TOKEN_FILE`, and `MAILATLAS_GMAIL_TOKEN_STORE`, plus IMAP variables such as `MAILATLAS_IMAP_HOST`, `MAILATLAS_IMAP_PORT`, `MAILATLAS_IMAP_USERNAME`, `MAILATLAS_IMAP_PASSWORD`, and `MAILATLAS_IMAP_ACCESS_TOKEN`.

For personal Gmail addresses, prefer the Gmail API provider with OAuth:

```bash
python -m pip install "mailatlas[keychain]"
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com

mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "Gmail API test" \
  --text "Sent with Gmail API OAuth."
```

Provider secrets and OAuth tokens are consumed at runtime from flags, environment variables, Python config, or the Gmail auth token store. They are not written to `store.db`, raw snapshots, logs, or JSON receive/send results.
