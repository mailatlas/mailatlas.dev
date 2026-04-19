---
title: "Quickstart: Ingest and Export Email Files"
description: Run your first MailAtlas file ingest. Create a local workspace, ingest sample .eml files, inspect a document, and export JSON, Markdown, HTML, or PDF.
slug: docs/getting-started/quickstart
---

This guide walks through the file-based MailAtlas workflow: create a local workspace, ingest `.eml` files, list stored documents, inspect one document, and export it.

Use this page when your input already exists as files on disk. If you want MailAtlas to connect to a live mailbox, use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) instead.

By the end, you will have:

- A local MailAtlas workspace.
- One or more stored email documents.
- Raw message files, cleaned text, HTML snapshots, and extracted assets when present.
- A JSON export.
- A Markdown bundle suitable for downstream AI or retrieval workflows.
- Optional HTML or PDF exports.

## Before you start

You need:

- Python 3.12 recommended, or another supported Python version from the package metadata.
- A working MailAtlas install.
- A local `.eml` file, or the MailAtlas sample data repository.
- Chrome or Chromium only if you plan to export PDF.

Run this first if you have not verified the install:

```bash
mailatlas doctor
```

## 1. Create a workspace root

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
```

Check that the variable is set:

```bash
echo "$MAILATLAS_HOME"
```

## 2. Get sample email fixtures

If you already have your own `.eml` files, skip this step.

```bash
git clone https://github.com/mailatlas/sample-data.git
```

The public sample-data repository includes the fixtures used below.

## 3. Ingest `.eml` files

Ingest one message:

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-market-map.eml
```

Or ingest several messages:

```bash
mailatlas ingest \
  sample-data/fixtures/eml/atlas-market-map.eml \
  sample-data/fixtures/eml/atlas-founder-forward.eml \
  sample-data/fixtures/eml/atlas-inline-chart.eml
```

Expected output shape:

```json
{
  "status": "ok",
  "ingested_count": 3,
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

Copy one returned `id`. You will use it as `<document-id>`.

## 4. List stored documents

```bash
mailatlas list
```

Use this command whenever you need to find document IDs in the current workspace.

## 5. Inspect one stored document

```bash
mailatlas get <document-id>
```

A stored document includes fields such as:

```json
{
  "id": "<document-id>",
  "source_kind": "eml",
  "subject": "Port dwell times normalize after weather disruptions",
  "sender_email": "sender@example.com",
  "body_text": "<cleaned text>",
  "body_html_path": "html/<document-id>.html",
  "raw_path": "raw/<document-id>.eml",
  "metadata": {
    "cleaning": {
      "dropped_line_count": 0
    },
    "provenance": {
      "is_forwarded": false
    }
  },
  "assets": [
    {
      "kind": "inline",
      "file_path": "assets/<document-id>/001-route-heatmap.svg"
    }
  ]
}
```

When MailAtlas extracts a regular file attachment, the same `assets` array uses `"kind": "attachment"` and stores the file under `assets/<document-id>/...`.

## 6. Export JSON

```bash
mailatlas get <document-id> \
  --format json \
  --out ./message.json
```

Use JSON when another program needs normalized fields, metadata, and asset references.

## 7. Export a Markdown bundle

```bash
mailatlas get <document-id> \
  --format markdown \
  --out ./message-markdown
```

This writes a directory bundle that contains:

- `document.md`
- `assets/` with copied inline images and attachments referenced from the Markdown

Use Markdown when an AI workflow, search index, notebook, or review process needs readable text with local asset references.

## 8. Export HTML

```bash
mailatlas get <document-id> \
  --format html \
  --out ./message.html
```

Use HTML when layout or visual structure matters.

## 9. Export PDF

PDF export requires Chrome or Chromium:

```bash
mailatlas get <document-id> \
  --format pdf \
  --out ./message.pdf
```

If MailAtlas cannot find the browser:

```bash
export MAILATLAS_PDF_BROWSER="/path/to/chrome-or-chromium"
```

If you omit `--out` for PDF, MailAtlas writes the PDF to `.mailatlas/exports/<document-id>.pdf`.

## 10. Review the workspace

```bash
find "$MAILATLAS_HOME" -maxdepth 3 -type f | sort
```

During ingest, MailAtlas writes:

- Raw email bytes to `raw/`.
- HTML snapshots to `html/` when the message has HTML.
- Extracted inline images and attachments to `assets/`.
- Metadata and indexes to `store.db`.

Exports go where you tell MailAtlas to write them with `--out`.

## Troubleshooting

### `No such file or directory`

Confirm the fixture path exists:

```bash
ls sample-data/fixtures/eml
```

If you are using your own message, pass the path to that `.eml` file instead.

### `duplicate_count` is greater than zero

MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash. Duplicate records are expected if you ingest the same message more than once.

### PDF export fails

Install Chrome or Chromium, then set `MAILATLAS_PDF_BROWSER` if needed.

## Reset the quickstart workspace

```bash
rm -rf "$MAILATLAS_HOME"
```

Only delete a workspace when you are sure it does not contain real mail or outbound audit records you need to keep.

## Next step

- Use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) to fetch selected folders from a live mailbox.
- Use [Document Schema](/docs/concepts/document-schema/) to understand stored fields.
- Use [Workspace Model](/docs/concepts/workspace-model/) to understand local files and SQLite metadata.
- Use [CLI Overview](/docs/cli/overview/) for the full command surface.
