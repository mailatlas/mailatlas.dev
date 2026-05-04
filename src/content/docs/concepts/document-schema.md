---
title: Email Document Schema
description: "Reference the stored MailAtlas email document: core fields, linked files, assets, parser metadata, source provenance, and provider metadata."
slug: docs/concepts/document-schema
---

A document is the clean email record your agent reads. It contains the message body, sender, subject, timestamps, source links, parser metadata, and extracted asset references.

Documents are stored in SQLite and linked to files in the [email workspace](/docs/concepts/workspace-model/). A document can come from an `.eml` file, one message inside an `mbox` archive, a Gmail message, or an IMAP message.

The schema is alpha. Field names and compatibility guarantees may evolve before a stable schema version is published.

## How to read a document

For most agent workflows, start with:

- `subject`
- `sender_email`
- `received_at`
- `body_text`
- `metadata.source`
- `assets`

Those fields give the agent the message content, who sent it, when it arrived, where it came from, and which files or embedded images belong with it.

The document has three groups of data:

- Core fields: subject, sender, body text, source kind, timestamps, and document IDs.
- Linked files: raw email, HTML view, and extracted assets in the email workspace.
- Metadata: source provenance, parser notes, cleaning details, and provider IDs.

JSON export returns this document shape. Markdown, HTML, and PDF exports are derived views created from the stored document and its linked files.

## Key objects

### Document

A document is one stored email message. It is the object returned by `mailatlas get`, the Python API, and JSON export.

Use the document when your agent needs to read the message body, inspect sender and timestamp fields, follow links to source files, or decide which attachments matter.

### Asset

An asset is a file MailAtlas extracted from the email. Assets include:

- Embedded images used by HTML email, such as logos, charts, and inline screenshots.
- Regular attachments, such as PDFs, spreadsheets, calendar files, and images.

Assets are stored as files in the email workspace and listed on the document as structured records. The asset record tells your agent what kind of file it is, where it lives, and whether it was embedded in HTML or attached as a normal file.

### Metadata

Metadata is extra information about where the email came from and how MailAtlas processed it. It is not the main message body.

Metadata answers questions such as:

- Did this email come from Gmail, IMAP, `.eml`, or `mbox`?
- Which Gmail message ID or IMAP UID produced it?
- Did MailAtlas detect a forwarded-message chain?
- Which cleaning options affected `body_text`?

### Cleaning

Cleaning is the process that creates `body_text`, the plain text your agent usually reads first. Email bodies often include forwarded headers, quoted wrappers, footers, invisible characters, repeated whitespace, and boilerplate. Cleaning records explain what MailAtlas changed while preserving the raw email and HTML view in the workspace.

## Core fields

| Field | Description |
| --- | --- |
| `id` | Stable MailAtlas document ID used by CLI, Python API, exports, and asset references. |
| `source_kind` | Input path that produced the document, such as `eml`, `mbox`, `gmail`, or `imap`. |
| `message_id` | Email `Message-ID` header when present. Used for dedupe when available. |
| `thread_id` | Thread identifier when MailAtlas can derive or store one. |
| `subject` | Email subject. |
| `sender_name` | Display name from the sender header when present. |
| `sender_email` | Sender email address when present. |
| `author` | Normalized author string for applications that need a single display value. |
| `received_at` | Received timestamp when available. |
| `published_at` | Publication-like timestamp when MailAtlas derives one from the message. |
| `body_text` | Cleaned plain-text body. |
| `body_html_path` | Path to the normalized HTML view when available. |
| `raw_path` | Path to the stored raw email bytes. |
| `content_hash` | Normalized hash used for dedupe when no usable `message_id` exists. |
| `metadata` | Source details, parser notes, cleaning details, and provenance. |
| `created_at` | Timestamp when MailAtlas created the stored document record. |

## Asset fields

An asset record describes one file extracted from the message. Use it when your agent needs to inspect attachments, preserve embedded images, or export a message with its files intact.

Example asset:

```json
{
  "id": "asset_1",
  "document_id": "doc_123",
  "ordinal": 1,
  "kind": "inline",
  "mime_type": "image/png",
  "file_path": "assets/doc_123/001-chart.png",
  "cid": "chart-1",
  "sha256": "<sha256>"
}
```

| Field | Description |
| --- | --- |
| `id` | Asset ID. |
| `document_id` | ID of the document that owns the asset. |
| `ordinal` | Asset order within the document. |
| `kind` | `inline` for files embedded in HTML, or `attachment` for regular email attachments. |
| `mime_type` | MIME type when known. |
| `file_path` | Local path to the copied asset. |
| `cid` | Content ID used by HTML email to reference an inline asset when present. |
| `sha256` | SHA-256 hash of the stored asset file when available. |

## Source metadata

`metadata.source` records where the document came from. Use it when your agent needs to trace a document back to a file, Gmail message, or IMAP folder.

| Metadata path | Description |
| --- | --- |
| `source.kind` | Source kind, such as `eml`, `mbox`, `gmail`, or `imap`. |
| `source.path` | Source file path for file-based ingest when available. |
| `source.host` | IMAP host for received IMAP documents when present. |
| `source.folder` | IMAP folder for received IMAP documents when present. |
| `source.uid` | IMAP UID for received IMAP documents when present. |
| `source.uidvalidity` | IMAP UIDVALIDITY value for received IMAP documents when present. |
| `source.gmail_message_id` | Gmail message ID for Gmail documents when present. |
| `source.gmail_thread_id` | Gmail thread ID for Gmail documents when present. |
| `source.gmail_label_ids` | Gmail label IDs for Gmail documents when present. |
| `source.gmail_history_id` | Gmail history ID for Gmail documents when present. |
| `source.gmail_internal_date` | Gmail internal date for Gmail documents when present. |

## Cleaning metadata

Cleaning metadata records how MailAtlas shaped `body_text`. Use it when your agent or application needs to explain why the clean text differs from the raw email body.

| Metadata path | Description |
| --- | --- |
| `cleaning.removed_forwarded_headers` | Whether forwarded headers were removed. |
| `cleaning.dropped_line_count` | Number of lines removed during cleaning. |
| `cleaning.stopped_at_footer` | Whether cleaning stopped at a detected footer. |
| `parser_config.*` | Parser configuration used for the run. |

## Provenance metadata

Provenance metadata records message structure detected during parsing. Use it when forwarded-message structure or parser decisions matter to your workflow.

| Metadata path | Description |
| --- | --- |
| `provenance.is_forwarded` | Whether MailAtlas detected forwarded-message structure. |
| `provenance.forwarded_chain` | Forwarded-chain details when detected. |

## Example document

```json
{
  "id": "doc_123",
  "source_kind": "imap",
  "message_id": "<message@example.com>",
  "subject": "Daily market digest",
  "sender_email": "sender@example.com",
  "received_at": "2026-04-18T15:05:00Z",
  "body_text": "Cleaned message text...",
  "body_html_path": "html/doc_123.html",
  "raw_path": "raw/doc_123.eml",
  "metadata": {
    "source": {
      "kind": "imap",
      "folder": "INBOX",
      "uid": "4812"
    },
    "cleaning": {
      "dropped_line_count": 0
    }
  },
  "assets": [
    {
      "id": "asset_1",
      "kind": "inline",
      "mime_type": "image/png",
      "file_path": "assets/doc_123/001-chart.png"
    }
  ]
}
```

## Source-specific notes

### `.eml`

For single-message files, `source_kind` is `eml`. Metadata can record the source path or equivalent source reference.

### `mbox`

For mailbox archives, `source_kind` is `mbox`. Metadata can identify the mailbox file and message position or source reference.

### Gmail

For Gmail messages, `source_kind` is `gmail`. Metadata can include Gmail message ID, thread ID, label IDs, history ID, internal date, and receive account ID.

### IMAP

For IMAP messages, `source_kind` is `imap`. Metadata can include the mailbox host, folder, UID, and UIDVALIDITY value.

## Path behavior

Paths such as `raw_path`, `body_html_path`, and `assets[].file_path` resolve inside the email workspace:

```text
raw/doc_123.eml
html/doc_123.html
assets/doc_123/001-chart.png
```

Export commands can also write separate bundles outside the workspace when you pass `--out`.

## Next step

- Use [Email Workspace](/docs/concepts/workspace-model/) to understand where linked files live.
- Use [Parser Cleaning](/docs/config/parser-cleaning/) to understand metadata created during parsing.
- Use [Export Formats](/docs/reference/export-formats/) to understand JSON, Markdown, HTML, and PDF outputs.
