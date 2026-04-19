---
title: "Example: Sync IMAP Folders"
description: Receive selected IMAP folders into a local MailAtlas workspace and inspect the stored documents.
slug: docs/examples/imap-sync
---

This example shows the IMAP receive path for a live mailbox.

Use this when MailAtlas should connect to a mailbox, fetch selected folders, and store messages locally. If you already have `.eml` files or an `mbox` archive on disk, use file ingest instead.

## Password auth

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_PASSWORD=app-password

mailatlas receive --provider imap --folder INBOX
```

## OAuth token auth

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token

mailatlas receive --provider imap --folder INBOX
```

MailAtlas consumes the access token at runtime but does not manage IMAP OAuth login, refresh, or token storage.

## Foreground polling

```bash
mailatlas receive watch --provider imap --folder INBOX --interval 60
```

Use `watch` when you want the local workspace to stay current while the process is running.

## Inspect results

```bash
mailatlas list
mailatlas get <document-id>
```

Received IMAP documents use `source_kind: "imap"` and include IMAP folder and UID provenance when available.

## Next step

- Use [IMAP Sync](/docs/getting-started/manual-imap-sync/) for the complete guide.
- Use [Workspace Model](/docs/concepts/workspace-model/) to understand cursor state.
- Use [Security and Privacy](/docs/marketing/security-and-privacy/) before sharing a workspace.
