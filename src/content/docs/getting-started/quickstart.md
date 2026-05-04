---
title: "Quickstart: Import Email Files"
description: Import sample .eml files, inspect the clean email record MailAtlas creates, and export the message as Markdown or JSON.
slug: docs/getting-started/quickstart
---

Use this quickstart to import sample `.eml` files, inspect the clean email record MailAtlas creates, and export the message as Markdown or JSON.

This page uses MailAtlas sample data. To use your own email, replace the sample path with a local `.eml` file. If you want MailAtlas to connect to a live mailbox, use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) instead.

By the end, you will have:

- A local email workspace.
- Imported sample messages.
- A document ID you can query.
- Markdown and JSON exports.

## Before you start

You need:

- Python 3.12.
- A working MailAtlas installation.
- Git, to clone the sample data repository.

Run this first if you have not verified the installation:

```bash
mailatlas doctor
```

## 1. Set the email workspace

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
```

MailAtlas writes imported messages, cleaned views, assets, exports, and lookup data into this workspace.

## 2. Get sample email

Clone the public sample data repository:

```bash
git clone https://github.com/mailatlas/sample-data.git
```

## 3. Import and inspect a message

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-market-map.eml
mailatlas list
```

The ingest output includes a `document_refs` array. Copy one returned `id`; the examples below use `<document-id>`.

```json
{
  "status": "ok",
  "ingested_count": 1,
  "duplicate_count": 0,
  "document_refs": [
    {
      "id": "<document-id>",
      "subject": "Regional freight signals tighten in the Midwest",
      "source_kind": "eml",
      "created_at": "<timestamp>"
    }
  ]
}
```

Inspect the clean email record:

```bash
mailatlas get <document-id>
```

A document includes clean body text, source metadata, asset references, and paths back to the stored email files. The full schema is covered in [Document Schema](/docs/concepts/document-schema/).

```json
{
  "id": "<document-id>",
  "source_kind": "eml",
  "subject": "Regional freight signals tighten in the Midwest",
  "sender_email": "sender@example.com",
  "body_text": "<cleaned text>",
  "body_html_path": "html/<document-id>.html",
  "raw_path": "raw/<document-id>.eml",
  "assets": [
    {
      "kind": "inline",
      "file_path": "assets/<document-id>/001-route-heatmap.svg"
    }
  ]
}
```

## 4. Export Markdown

```bash
mailatlas get <document-id> \
  --format markdown \
  --out ./message-markdown
```

Markdown is a useful first export for AI agents, search indexes, notebooks, and review workflows. The export writes a directory bundle:

- `document.md`
- `assets/` with copied inline images and attachments referenced by the Markdown

## 5. Export JSON

```bash
mailatlas get <document-id> \
  --format json \
  --out ./message.json
```

Use JSON when another program needs normalized fields, metadata, and asset references.

## Other exports

MailAtlas can also export HTML and PDF:

```bash
mailatlas get <document-id> --format html --out ./message.html
mailatlas get <document-id> --format pdf --out ./message.pdf
```

PDF export requires Chrome or Chromium. If MailAtlas cannot find the browser, set `MAILATLAS_PDF_BROWSER`.

## Optional: inspect stored files

```bash
find "$MAILATLAS_HOME" -maxdepth 3 -type f | sort
```

You should see stored email files, HTML snapshots when present, extracted assets, exports, and `store.db`.

## Troubleshooting

### `No such file or directory`

Confirm the sample path exists:

```bash
ls sample-data/fixtures/eml
```

If you are using your own message, pass the path to that `.eml` file instead.

### `duplicate_count` is greater than zero

MailAtlas deduplicates messages. Duplicate records are expected if you ingest the same message more than once.

## Reset the quickstart workspace

```bash
rm -rf "$MAILATLAS_HOME"
```

Only delete a workspace when you are sure it does not contain real mailbox data or sent email you need to keep.

## Next step

- Use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) to connect a live mailbox.
- Use [Python API](/docs/python/overview/) to use MailAtlas from an application or worker.
- Use [MCP Server](/docs/mcp/overview/) to expose email tools to an AI agent.
- Use [Document Schema](/docs/concepts/document-schema/) to understand stored fields.
- Use [Outbound Email](/docs/providers/outbound-email/) to send through a configured provider.
