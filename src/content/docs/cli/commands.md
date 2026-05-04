---
title: Command Reference
description: Reference the current MailAtlas CLI commands and commonly used flags for ingest, receive, list, get, send, doctor, auth, and MCP server workflows.
slug: docs/cli/commands
---

This page summarizes the current command surface from the MailAtlas CLI. Use `mailatlas --help` and `mailatlas <command> --help` as the source of truth for the installed version.

## Top-level usage

```bash
mailatlas [--root ROOT] <command> ...
```

The top-level `--root` flag selects the email workspace directory. If it is omitted, MailAtlas checks `MAILATLAS_HOME`, project config, then falls back to `./.mailatlas`.

## Commands

| Command | Purpose |
| --- | --- |
| `ingest` | Ingest one or more email sources from disk. |
| `get` | Read or export a stored document. |
| `list` | List stored documents. |
| `receive` | Receive Gmail or IMAP messages into the local workspace. |
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

## `mailatlas receive`

```bash
mailatlas receive [--root ROOT] [--provider gmail|imap] [--account-id ACCOUNT_ID] \
  [--label LABEL] [--query QUERY] [--limit LIMIT] [--full-sync] \
  [--include-spam-trash | --no-include-spam-trash] \
  [--gmail-access-token TOKEN] [--gmail-api-base URL] [--gmail-user-id USER_ID] \
  [--token-file TOKEN_FILE] [--token-store TOKEN_STORE] \
  [--host HOST] [--port PORT] [--username USERNAME] \
  [--password PASSWORD | --access-token ACCESS_TOKEN] [--folder FOLDER]
```

Use `receive` for one bounded live-mailbox fetch pass into the local workspace. Supported providers are `gmail` and `imap`.

Common receive flags:

- `--label`: Gmail label to receive from. Defaults to `INBOX`.
- `--query`: Optional Gmail search query.
- `--limit`: Maximum messages to fetch in one pass. Defaults to `50`.
- `--full-sync`: Ignore the incremental cursor and run an explicit full sync.
- `--include-spam-trash`: Include Gmail spam and trash in list calls.
- `--account-id`: Stable local account ID when you do not want MailAtlas to derive one from Gmail profile data.

Gmail receive token flags:

- `--gmail-access-token`: One-off short-lived Gmail API access token.
- `--token-file`: Explicit local Gmail OAuth token file path.
- `--token-store`: `auto`, `keychain`, `file`, or a token file path.
- `--gmail-api-base`: Gmail API base override for tests.
- `--gmail-user-id`: Gmail API user ID. Defaults to `me`.

IMAP receive flags:

- `--host`: IMAP hostname. Defaults to `MAILATLAS_IMAP_HOST`.
- `--port`: IMAP TLS port. Defaults to `MAILATLAS_IMAP_PORT` or `993`.
- `--username`: IMAP username. Defaults to `MAILATLAS_IMAP_USERNAME`.
- `--password`: IMAP password. Defaults to `MAILATLAS_IMAP_PASSWORD`.
- `--access-token`: IMAP OAuth access token. Defaults to `MAILATLAS_IMAP_ACCESS_TOKEN`.
- `--folder`: IMAP folder to receive. Repeat for multiple folders. Defaults to `INBOX`.

The command prints JSON with `status`, `provider`, `account_id`, fetch counts, `document_ids`, cursor data, `run_id`, and provider-specific details when available.

## `mailatlas receive watch`

```bash
mailatlas receive watch [--root ROOT] [receive flags] [--interval SECONDS] [--max-runs N]
```

Use `receive watch` for a foreground polling process. It runs one receive pass immediately, sleeps, then repeats until interrupted or until `--max-runs` is reached.

The command prints one compact JSON line per run.

## `mailatlas receive status`

```bash
mailatlas receive status [--root ROOT] [--account-id ACCOUNT_ID]
```

Use `receive status` to inspect local receive accounts, cursors, recent runs, and the most recent error.

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

Use `--capability receive` to request `https://www.googleapis.com/auth/gmail.readonly`. Use `--capability send,receive` when one local token should support both Gmail send and Gmail receive.

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

Mailbox receive tools are exposed only when `MAILATLAS_MCP_ALLOW_RECEIVE=1` is set before server startup.

## Next step

- Use [CLI Overview](/docs/cli/overview/) for task-oriented examples.
- Use [Configuration Reference](/docs/reference/configuration/) for environment variables.
- Use [Troubleshooting](/docs/support/troubleshooting/) for common failure modes.
