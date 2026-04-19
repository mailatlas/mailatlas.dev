---
title: "Example: Ingest .eml Files"
description: Ingest one or more .eml files with MailAtlas, inspect the resulting document IDs, and export a stored message.
slug: docs/examples/eml-ingest
---

This example shows the shortest file-based ingest path for individual `.eml` messages.

Use this when you have exported messages on disk, synthetic fixtures for tests, a small set of messages to inspect manually, or parser changes you want to test against known inputs.

For a full walkthrough, use [Quickstart](/docs/getting-started/quickstart/).

## Before you start

```bash
python -m pip install mailatlas
export MAILATLAS_HOME="$PWD/.mailatlas"
```

If you need sample fixtures:

```bash
git clone https://github.com/mailatlas/sample-data.git
```

## Ingest one `.eml` file

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-market-map.eml
```

Expected output shape:

```json
{
  "status": "ok",
  "ingested_count": 1,
  "duplicate_count": 0,
  "document_refs": [
    {
      "id": "<document-id>",
      "subject": "<subject>",
      "source_kind": "eml",
      "created_at": "<timestamp>"
    }
  ]
}
```

## Ingest multiple `.eml` files

```bash
mailatlas ingest \
  sample-data/fixtures/eml/atlas-market-map.eml \
  sample-data/fixtures/eml/atlas-founder-forward.eml
```

MailAtlas stores each unique message as a document in the same workspace.

## Inspect and export

```bash
mailatlas list
mailatlas get <document-id>
mailatlas get <document-id> --format markdown --out ./eml-example-markdown
```

## What this example writes

MailAtlas can write raw email bytes to `raw/`, normalized HTML to `html/`, extracted inline images and attachments to `assets/`, metadata to `store.db`, and exports to the path passed with `--out`.
