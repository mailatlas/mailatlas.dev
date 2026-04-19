---
title: Troubleshooting
description: Fix common MailAtlas install, fixture, PDF export, IMAP, Gmail, SMTP, attachment, duplicate, and MCP configuration issues.
slug: docs/support/troubleshooting
---

Use this page when a command fails or output does not match the expected shape.

## Install errors

Confirm the active Python environment:

```bash
python --version
python -m pip show mailatlas
```

Python 3.12 is recommended. The package metadata currently allows Python 3.11 and newer.

## `mailatlas` command not found

Activate the virtual environment where you installed MailAtlas:

```bash
source .venv/bin/activate
python -m pip install mailatlas
```

If you installed with `uv tool install mailatlas`, confirm your tool bin directory is on `PATH`.

## Fixture path missing

The docs use the public sample data repository:

```bash
git clone https://github.com/mailatlas/sample-data.git
ls sample-data/fixtures/eml
ls sample-data/fixtures/mbox
```

If you are using your own message file, pass the path to that file instead.

## PDF export fails

PDF export requires Chrome or Chromium.

```bash
mailatlas doctor --require-pdf
```

If the browser is installed but not found:

```bash
export MAILATLAS_PDF_BROWSER="/path/to/chrome-or-chromium"
```

Use `mailatlas doctor --skip-pdf` when you do not need PDF export.

## IMAP authentication fails

Use either password auth or OAuth token auth.

For password auth:

```bash
export MAILATLAS_IMAP_PASSWORD=app-password
mailatlas sync --folder INBOX
```

For OAuth token auth:

```bash
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token
mailatlas sync --folder INBOX
```

MailAtlas consumes the access token but does not manage the OAuth login or refresh lifecycle.

## IMAP folder not found

Confirm the exact folder name with your provider. Some providers use localized folder names or nested folder paths.

## Gmail redirect issue

Use a Google OAuth desktop client for `mailatlas auth gmail`. If the browser flow is not usable in your environment, pass `--no-browser` and open the printed URL manually.

## Gmail receive says the token is missing receive scope

Authorize Gmail with the receive capability:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Use `--capability send,receive` only when the same local token should support both actions.

## Gmail receive reports `cursor_reset_required`

The stored Gmail history cursor is no longer valid. Run an explicit full sync:

```bash
mailatlas receive \
  --label INBOX \
  --limit 50 \
  --full-sync
```

Full sync may return duplicates if those messages are already stored. That is expected.

## Gmail From address issue

Use the authenticated Gmail address or a Gmail send-as alias configured in Gmail.

## SMTP connection failure

Check:

- `MAILATLAS_SMTP_HOST`
- `MAILATLAS_SMTP_PORT`
- `MAILATLAS_SMTP_USERNAME`
- `MAILATLAS_SMTP_PASSWORD`
- `MAILATLAS_SMTP_STARTTLS`
- `MAILATLAS_SMTP_SSL`

Use either STARTTLS or SSL, not both.

## Attachment missing

Confirm the attachment path exists and is readable from the current working directory:

```bash
ls -l report.pdf
```

MailAtlas fails instead of silently dropping missing attachments.

## Duplicate messages

MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash. A nonzero `duplicate_count` is expected if you ingest the same message twice or sync a mailbox that overlaps with existing documents.

## MCP send tool hidden

Live send is hidden by default. To expose the live send tool:

```bash
export MAILATLAS_MCP_ALLOW_SEND=1
mailatlas mcp --root .mailatlas
```

Set this variable only where the MCP client is allowed to send email. Draft and read tools remain available without the send gate.

## MCP receive tools hidden

Gmail receive tools are hidden by default. To expose them:

```bash
export MAILATLAS_MCP_ALLOW_RECEIVE=1
mailatlas mcp --root .mailatlas
```

Set this variable only where the MCP client is allowed to contact Gmail and write private email into the local workspace.

## Still stuck

Open an issue with:

- The command you ran.
- The sanitized JSON output or error text.
- Your operating system.
- Python version.
- MailAtlas version.
- Whether the workspace contains synthetic or real data.

Use the public issue tracker only with sanitized details: [https://github.com/mailatlas/mailatlas/issues](https://github.com/mailatlas/mailatlas/issues).
