---
title: Command Reference
description: Reference the current MailAtlas CLI commands and commonly used flags for ingest, sync, list, get, send, doctor, auth, receive, and MCP server workflows.
slug: docs/cli/commands
---

This page summarizes the current command surface from the MailAtlas CLI. Use `mailatlas --help` and `mailatlas <command> --help` as the source of truth for the installed version.

## Top-level usage

```bash
mailatlas [--root ROOT] <command> ...
```

The top-level `--root` flag selects the workspace root. If it is omitted, MailAtlas checks `MAILATLAS_HOME`, project config, then falls back to `./.mailatlas`.

## Commands

| Command | Purpose |
| --- | --- |
| `ingest` | Ingest one or more email sources from disk. |
| `get` | Read or export a stored document. |
| `list` | List stored documents. |
| `sync` | Sync one or more IMAP folders. |
| `receive` | Receive Gmail messages into the local workspace. |
| `send` | Compose, send, and audit an outbound email. |
| `auth` | Manage provider authentication. |
| `mcp` | Run the MailAtlas MCP server. |
| `doctor` | Run a local self-check. |

## `mailatlas ingest`

```bash
mailatlas ingest [--root ROOT] [--type auto|eml|mbox] paths...
```

Use `ingest` for `.eml` files and `mbox` archives already on disk.

Parser-cleaning flags:

- `--strip-forwarded-headers` / `--no-strip-forwarded-headers`
- `--strip-boilerplate` / `--no-strip-boilerplate`
- `--strip-link-only-lines` / `--no-strip-link-only-lines`
- `--stop-at-footer` / `--no-stop-at-footer`
- `--strip-invisible-chars` / `--no-strip-invisible-chars`
- `--normalize-whitespace` / `--no-normalize-whitespace`

## `mailatlas sync`

```bash
mailatlas sync [--root ROOT] [--host HOST] [--port PORT] [--username USERNAME] \
  [--password PASSWORD | --access-token ACCESS_TOKEN] [--folder FOLDER]
```

Use `sync` for manual IMAP folder pulls. Repeat `--folder` for multiple folders. If no folder is provided, MailAtlas uses `INBOX`.

Environment variables:

- `MAILATLAS_IMAP_HOST`
- `MAILATLAS_IMAP_PORT`
- `MAILATLAS_IMAP_USERNAME`
- `MAILATLAS_IMAP_PASSWORD`
- `MAILATLAS_IMAP_ACCESS_TOKEN`

## `mailatlas list`

```bash
mailatlas list [--root ROOT] [--query QUERY]
```

Use `list` to find stored document IDs in the current workspace.

## `mailatlas get`

```bash
mailatlas get [--root ROOT] [--format json|markdown|html|pdf] [--out OUT] document_id
```

Use `get` to inspect or export one stored document. Markdown expects a bundle directory when `--out` is provided; other formats write a file path.

## `mailatlas send`

```bash
mailatlas send [--root ROOT] [--provider PROVIDER] --from FROM --to TO \
  --subject SUBJECT [--text TEXT | --text-file TEXT_FILE] [--html-file HTML_FILE]
```

Common send flags:

- `--from-name`
- `--cc`
- `--bcc`
- `--reply-to`
- `--attach`
- `--header`
- `--in-reply-to`
- `--references`
- `--source-document-id`
- `--idempotency-key`
- `--dry-run`

Provider flags:

- SMTP: `--smtp-host`, `--smtp-port`, `--smtp-username`, `--smtp-password`, `--smtp-starttls`, `--no-smtp-starttls`, `--smtp-ssl`, `--no-smtp-ssl`
- Cloudflare: `--cloudflare-account-id`, `--cloudflare-api-token`, `--cloudflare-api-base`
- Gmail: `--gmail-access-token`, `--gmail-api-base`, `--gmail-user-id`, `--gmail-token-file`, `--gmail-token-store`

## `mailatlas doctor`

```bash
mailatlas doctor [--root ROOT] [--skip-pdf] [--require-pdf]
```

Use `doctor` to verify local install and export behavior. PDF checks can be skipped or required explicitly.

## `mailatlas auth gmail`

```bash
mailatlas auth gmail [--client-id CLIENT_ID] [--client-secret CLIENT_SECRET] \
  [--email EMAIL] [--scope SCOPE] [--capability send|receive|send,receive] \
  [--token-file TOKEN_FILE] [--token-store TOKEN_STORE] [--timeout TIMEOUT] [--no-browser]
```

The default Gmail scope is `https://www.googleapis.com/auth/gmail.send`.

Use status and logout subcommands:

```bash
mailatlas auth status gmail
mailatlas auth logout gmail
```

## `mailatlas mcp`

```bash
mailatlas mcp [--root ROOT] [--transport stdio]
```

STDIO is the only supported MCP transport.

## Next step

- Use [CLI Overview](/docs/cli/overview/) for task-oriented examples.
- Use [Configuration Reference](/docs/reference/configuration/) for environment variables.
- Use [Troubleshooting](/docs/support/troubleshooting/) for common failure modes.
