---
title: "Example: Sync IMAP Folders"
description: Sync selected IMAP folders into a local MailAtlas workspace and inspect the stored documents.
slug: docs/examples/imap-sync
---

This example shows the manual IMAP sync path for a live mailbox.

Use this when MailAtlas should connect to a mailbox, fetch selected folders, and store messages locally. If you already have `.eml` files or an `mbox` archive on disk, use file ingest instead.

## Password auth

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_PASSWORD=app-password

mailatlas sync --folder INBOX
```

## OAuth token auth

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token

mailatlas sync --folder INBOX
```

MailAtlas consumes the access token at runtime but does not manage IMAP OAuth login, refresh, or token storage.

## Inspect results

```bash
mailatlas list
mailatlas get <document-id>
```

Synced documents use `source_kind: "imap"` and include IMAP folder and UID provenance when available.

## Next step

- Use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) for the complete guide.
- Use [Workspace Model](/docs/concepts/workspace-model/) to understand cursor state.
- Use [Security and Privacy](/docs/marketing/security-and-privacy/) before sharing a workspace.
