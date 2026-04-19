---
title: Workspace Model
description: Understand the MailAtlas workspace root, including raw messages, HTML snapshots, extracted assets, exports, outbound audit files, SQLite metadata, dedupe, and IMAP sync state.
slug: docs/concepts/workspace-model
---

MailAtlas stores email artifacts in one local workspace root. The default workspace root is `.mailatlas` in the current directory unless you set `MAILATLAS_HOME`, pass `--root`, or configure a project root.

Think of the workspace as the durable boundary between MailAtlas and your application. The CLI, Python API, MCP server, exports, and outbound send workflow all read from or write to this local root.

The built-in workspace uses:

- Files on disk for raw inbound messages, HTML snapshots, extracted assets, exports, and outbound audit artifacts.
- SQLite for metadata, lookup, dedupe, run history, IMAP sync cursors, and outbound send records.

This is the default local storage layout. Applications can copy the resulting files and metadata into their own storage systems when needed.

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
| `store.db` | SQLite index for document metadata, lookup, dedupe, run history, IMAP sync cursors, and outbound records. |
| `raw/` | Original inbound email bytes, usually stored as `.eml` files. |
| `html/` | Normalized HTML body snapshots with local asset references when an inbound message contains HTML. |
| `assets/` | Extracted inline images and regular file attachments from inbound messages. |
| `exports/` | Default destination for file-based outputs such as PDF exports when `--out` is omitted. |
| `outbound/raw/` | Rendered outbound `.eml` snapshots. |
| `outbound/text/` | Plain-text outbound body files. |
| `outbound/html/` | HTML outbound body files. |
| `outbound/attachments/` | Copied outbound attachments. |

## Why this layout exists

The workspace is designed to be inspectable:

- You can inspect every stage of the pipeline.
- Raw messages stay linked to parsed records.
- Assets stay next to the documents that reference them.
- SQLite is enough for document listing, lookup, dedupe, sync state, and send records.
- Exported files are ordinary artifacts that can be reviewed, copied, archived, or indexed elsewhere.

## What MailAtlas stores

MailAtlas can store raw email bytes, cleaned body text, normalized HTML, extracted inline files, extracted attachments, document metadata, parser notes, exported artifacts, IMAP sync cursor state, outbound records, copied outbound attachments, and BCC recipients in SQLite for audit.

MailAtlas omits BCC from local raw MIME snapshots while preserving BCC in SQLite for audit.

## Document lifecycle

### File ingest

1. MailAtlas reads an `.eml` file or `mbox` archive.
2. It parses each message.
3. It stores raw bytes in `raw/`.
4. It stores normalized HTML in `html/` when available.
5. It extracts inline images and attachments into `assets/`.
6. It writes document metadata to `store.db`.
7. It returns document references with IDs.

### Manual IMAP sync

1. MailAtlas connects to selected IMAP folders.
2. It fetches messages not already covered by cursor state when possible.
3. It runs the same parsing and storage path as file ingest.
4. It stores per-folder cursor state in SQLite.
5. It does not store mailbox passwords or OAuth access tokens.

### Export

1. You request an export with `mailatlas get <document-id> --format ...` or the Python API.
2. MailAtlas reads the stored document and local artifacts.
3. It writes or returns JSON, Markdown, HTML, or PDF depending on the format.
4. It writes to `--out` if provided.
5. For PDF without `--out`, it writes to `exports/<document-id>.pdf`.

### Outbound send

1. MailAtlas validates the outbound message fields.
2. It renders a raw `.eml` snapshot and body files.
3. It copies attachments into `outbound/attachments/`.
4. It stores an outbound record in SQLite.
5. It contacts the configured provider unless the message is a dry run.
6. It updates provider status, provider message ID, error details, timestamps, and retry metadata.

## Dedupe

MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash otherwise.

## Security note

Treat the workspace as sensitive source data. It can contain raw email, attachments, BCC recipients, outbound drafts, sent-message records, and exported files. Review workspace contents before committing, sharing, or uploading them.

## Next step

- Use [Document Schema](/docs/concepts/document-schema/) for the stored fields.
- Use [Security and Privacy](/docs/marketing/security-and-privacy/) for operational guidance.
- Use [CLI Overview](/docs/cli/overview/) to work with the workspace from a shell.
