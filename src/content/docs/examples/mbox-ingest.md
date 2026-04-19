---
title: "Example: Ingest an mbox Archive"
description: Use MailAtlas to ingest an mbox mailbox archive from disk, preserve per-message provenance, and inspect the resulting stored documents.
slug: docs/examples/mbox-ingest
---

Use this example when you already have a mailbox archive on disk.

An `mbox` file is a local mailbox file that can contain many messages. It is often created by an export tool or another local mail program.

An `mbox` file is not the same thing as IMAP sync. Use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) when MailAtlas should connect to a live mailbox and fetch selected folders.

## Before you start

```bash
python -m pip install mailatlas
export MAILATLAS_HOME="$PWD/.mailatlas"
```

If you need sample fixtures:

```bash
git clone https://github.com/mailatlas/sample-data.git
```

## Ingest the archive

```bash
mailatlas ingest sample-data/fixtures/mbox/atlas-demo.mbox
```

MailAtlas iterates over each message in the archive, parses it, preserves source metadata, extracts assets, deduplicates records, and writes the results into the local filesystem plus SQLite workspace.

Expected output shape:

```json
{
  "status": "ok",
  "ingested_count": 5,
  "duplicate_count": 0,
  "document_refs": [
    {
      "id": "<document-id>",
      "subject": "<subject>",
      "source_kind": "mbox",
      "created_at": "<timestamp>"
    }
  ]
}
```

## Inspect and export

```bash
mailatlas list
mailatlas get <document-id>
mailatlas get <document-id> --format json --out ./mbox-message.json
```

## Duplicate behavior

If the same message appears more than once, MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash otherwise.

A nonzero `duplicate_count` is expected when an archive overlaps with messages already stored in the workspace.

## When to use this example

Use `mbox` ingest when you have a mailbox export, want repeatable local parsing, want to build a retrieval corpus from an archive, and do not need MailAtlas to connect to a live mailbox.

Use manual IMAP sync instead when messages still live in a mailbox and should be fetched over IMAP.
