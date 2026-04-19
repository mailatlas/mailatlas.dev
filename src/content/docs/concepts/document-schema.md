---
title: Document Schema
description: Reference the normalized MailAtlas document schema, including core fields, asset records, parser metadata, source provenance, and IMAP sync metadata.
slug: docs/concepts/document-schema
---

A MailAtlas document is the normalized record created from an inbound email message. Documents are stored in SQLite and linked to local files in the workspace root.

A document can come from:

- An `.eml` file.
- One message inside an `mbox` archive.
- A message fetched from an IMAP folder.

The schema is alpha. Field names and compatibility guarantees may evolve before a stable schema version is published.

Use this page when you are building against stored document output. Use Workspace Model when you need to know where linked files live on disk.

## Core document fields

| Field | Description |
| --- | --- |
| `id` | Stable MailAtlas document ID used by CLI, Python API, exports, and asset references. |
| `source_kind` | Input path that produced the document, such as `eml`, `mbox`, or `imap`. |
| `message_id` | Email `Message-ID` header when present. Used for dedupe when available. |
| `thread_id` | Thread identifier when MailAtlas can derive or store one. |
| `subject` | Email subject. |
| `sender_name` | Display name from the sender header when present. |
| `sender_email` | Sender email address when present. |
| `author` | Normalized author string used by downstream consumers. |
| `received_at` | Received timestamp when available. |
| `published_at` | Publication-like timestamp when MailAtlas derives one for downstream use. |
| `body_text` | Cleaned plain-text body. |
| `body_html_path` | Path to the normalized HTML snapshot when available. |
| `raw_path` | Path to the stored raw email bytes. |
| `content_hash` | Normalized hash used for dedupe when no usable `message_id` exists. |
| `metadata` | Parser notes, provenance, parser configuration, and source-specific details. |
| `created_at` | Timestamp when MailAtlas created the stored document record. |

## Asset fields

Assets are files extracted from the message and associated with a document.

| Field | Description |
| --- | --- |
| `id` | Asset ID. |
| `document_id` | ID of the document that owns the asset. |
| `ordinal` | Asset order within the document. |
| `kind` | `inline` for embedded HTML assets, or `attachment` for regular file attachments. |
| `mime_type` | MIME type when known. |
| `file_path` | Local path to the copied asset. |
| `cid` | Content ID for inline assets when present. |
| `sha256` | SHA-256 hash of the stored asset file when available. |

## Metadata fields

`metadata` carries parser notes and provenance so application code can inspect what happened during parsing and cleaning.

| Metadata path | Description |
| --- | --- |
| `provenance.is_forwarded` | Whether MailAtlas detected forwarded-message structure. |
| `provenance.forwarded_chain` | Forwarded-chain details when detected. |
| `cleaning.removed_forwarded_headers` | Whether forwarded headers were removed. |
| `cleaning.dropped_line_count` | Number of lines removed during cleaning. |
| `cleaning.stopped_at_footer` | Whether cleaning stopped at a detected footer. |
| `parser_config.*` | Parser configuration used for the run. |
| `source.kind` | Source kind, such as `eml`, `mbox`, or `imap`. |
| `source.host` | IMAP host for synced documents when present. |
| `source.folder` | IMAP folder for synced documents when present. |
| `source.uid` | IMAP UID for synced documents when present. |
| `source.uidvalidity` | IMAP UIDVALIDITY value for synced documents when present. |

## Example document

```json
{
  "id": "doc_123",
  "source_kind": "imap",
  "message_id": "<message@example.com>",
  "subject": "Daily market digest",
  "sender_name": "Example Sender",
  "sender_email": "sender@example.com",
  "body_text": "Cleaned message text...",
  "body_html_path": "html/doc_123.html",
  "raw_path": "raw/doc_123.eml",
  "content_hash": "<hash>",
  "metadata": {
    "source": {
      "kind": "imap",
      "host": "imap.example.com",
      "folder": "INBOX",
      "uid": "4812",
      "uidvalidity": "11"
    },
    "cleaning": {
      "dropped_line_count": 0,
      "stopped_at_footer": false
    },
    "provenance": {
      "is_forwarded": false
    }
  },
  "assets": [
    {
      "id": "asset_1",
      "document_id": "doc_123",
      "ordinal": 1,
      "kind": "inline",
      "mime_type": "image/svg+xml",
      "file_path": "assets/doc_123/001-route-heatmap.svg",
      "cid": "route-heatmap",
      "sha256": "<sha256>"
    }
  ],
  "created_at": "2026-04-18T15:05:00Z"
}
```

## Source-specific provenance

### `.eml`

For single-message files, `source_kind` is `eml`. Metadata records the source path or equivalent source reference when available.

### `mbox`

For mailbox archives, `source_kind` is `mbox`. Metadata identifies the mailbox file and message position or source reference when available.

### IMAP

For synced messages, `source_kind` is `imap`. `metadata.source.*` records the mailbox folder and UID details that produced the stored document.

## Path behavior

Paths such as `raw_path`, `body_html_path`, and `assets[].file_path` resolve inside the workspace root unless a specific export mode writes a separate bundle path.

## Next step

- Use [Workspace Model](/docs/concepts/workspace-model/) to understand where these files live.
- Use [Parser Cleaning](/docs/config/parser-cleaning/) to understand metadata created during parsing.
- Use [CLI Overview](/docs/cli/overview/) or [Python API](/docs/python/overview/) to retrieve documents.
