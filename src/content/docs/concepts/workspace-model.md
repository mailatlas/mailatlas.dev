---
title: Email Workspace
description: "Understand the MailAtlas email workspace: documents, source email, HTML views, assets, exports, receive state, sent-message records, and SQLite lookup."
slug: docs/concepts/workspace-model
---

The email workspace is the copy of email MailAtlas creates for your agent. It contains clean documents, source email, HTML views, extracted files, exports, receive state, and sent-message records.

Read this page when you want to inspect stored files, back up a workspace, debug receive state, or understand what your agent can query.

By default, MailAtlas writes the workspace to `.mailatlas` in the current directory. You can choose a different workspace with `MAILATLAS_HOME`, `--root`, or project config.

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
mailatlas list
mailatlas --root ./other-mailatlas list
```

## How the workspace works

The CLI, Python API, and MCP server all read from and write to the same workspace.

The workspace has three layers:

- Files: source email, HTML views, extracted assets, exports, and sent-message artifacts.
- SQLite: document lookup, metadata, dedupe, receive cursors, receive runs, and sent-message records.
- Interfaces: CLI commands, Python APIs, and MCP tools that read the same stored email.

This gives your agent a queryable email workspace without losing the source files and rendered artifacts needed for inspection or export.

## What MailAtlas stores

MailAtlas stores related email data together:

- Message content: raw email bytes, clean body text, and normalized HTML.
- Message structure: document metadata, parser notes, cleaning details, and source provenance.
- Assets: embedded images and regular attachments.
- Provider metadata: Gmail IDs, IMAP folder and UID details, provider message IDs, and provider status.
- Receive state: accounts, cursors, run history, and errors from mailbox receive.
- Sent-message state: drafts, dry runs, rendered bodies, copied attachments, recipients, status, errors, and retry metadata.
- Exports: JSON, Markdown, HTML, or PDF outputs created from stored documents.

BCC recipients are included in provider delivery and stored in SQLite for explicit detail views. They are omitted from local raw MIME snapshots.

## What each workflow adds

| Workflow | What gets added to the workspace |
| --- | --- |
| File ingest | Documents, source email, HTML views, assets, metadata, and dedupe state. |
| IMAP receive | The same document artifacts as file ingest, plus IMAP account and folder cursor state. |
| Gmail receive | The same document artifacts as file ingest, plus Gmail message metadata and receive cursor state. |
| Export | JSON, Markdown, HTML, or PDF outputs derived from stored documents. |
| Send | Sent-message records, rendered bodies, copied attachments, provider status, errors, and retry metadata. |

## Directory layout

```text
.mailatlas/
  store.db
  raw/
  html/
  assets/
  exports/
  outbound/
    raw/
    text/
    html/
    attachments/
```

| Path | Purpose |
| --- | --- |
| `store.db` | SQLite index for document metadata, lookup, dedupe, receive state, run history, and sent-message records. |
| `raw/` | Original received email bytes, usually stored as `.eml` files. |
| `html/` | Normalized HTML views with local asset references when a message contains HTML. |
| `assets/` | Extracted embedded images and regular file attachments. |
| `exports/` | Default destination for file-based outputs such as PDF exports when `--out` is omitted. |
| `outbound/raw/` | Rendered sent-message `.eml` snapshots. |
| `outbound/text/` | Plain-text sent-message body files. |
| `outbound/html/` | HTML sent-message body files. |
| `outbound/attachments/` | Copied sent-message attachments. |

The `outbound/` directory name is the on-disk layout for sent-message artifacts.

## Inspect a workspace

Use the CLI for normal inspection:

```bash
mailatlas list
mailatlas get <document-id>
mailatlas get <document-id> --format markdown --out ./message-export
```

Use shell tools when you want to inspect the files directly:

```bash
find .mailatlas -maxdepth 2 -type f
sqlite3 .mailatlas/store.db ".tables"
```

Inspecting `store.db` directly is useful for debugging. Use the CLI, Python API, or MCP tools for application workflows instead of editing SQLite rows by hand.

## Dedupe

MailAtlas deduplicates received messages by `message_id` when present. If a message does not have a usable `message_id`, MailAtlas falls back to a normalized content hash.

## Back up or move a workspace

The workspace is ordinary local files plus SQLite. To keep a workspace intact, copy the whole directory instead of copying `store.db` alone.

Use the same workspace when you want future receive runs to continue from existing Gmail or IMAP cursor state.

## Security note

Do not commit `.mailatlas/` unless you intentionally created a synthetic fixture workspace. It can contain private email, attachments, embedded images, sent messages, BCC recipients, provider metadata, and exports.

Recommended `.gitignore` entry:

```text
.mailatlas/
```

## Next step

- Use [Document Schema](/docs/concepts/document-schema/) for stored document fields.
- Use [Security and Privacy](/docs/product/security-and-privacy/) for workspace and credential guidance.
- Use [CLI Overview](/docs/cli/overview/) to work with the workspace from a shell.
