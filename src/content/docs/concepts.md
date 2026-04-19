---
title: Core Concepts
description: Understand MailAtlas workspaces, documents, assets, parser metadata, exports, and outbound records.
slug: docs/concepts
---

MailAtlas stores email as local artifacts plus structured metadata. The core model is intentionally small: a workspace contains documents, documents link to source artifacts and assets, parser metadata explains how content was cleaned, and outbound records capture messages your application prepares or sends.

Use this page to understand how the pieces fit together before reading the workspace, schema, parser, export, or provider references.

## Concept map

Inbound email:

```text
source message
  |-- .eml file
  |-- mbox message
  `-- IMAP message
        |
document row in store.db
        |
linked artifacts
  |-- raw message
  |-- cleaned text
  |-- normalized HTML
  |-- inline assets
  |-- attachments
  `-- exports
```

Outbound email:

```text
send request
        |
rendered message artifacts
        |
outbound record in store.db
        |
provider response
```

## Workspace

A workspace is the local root directory where MailAtlas writes files and metadata. It contains `store.db`, raw messages, HTML snapshots, extracted assets, exports, IMAP sync state, and outbound records.

Start here if you want to know where MailAtlas stores data on disk.

[Workspace Model](/docs/concepts/workspace-model/)

## Document

A document is the normalized record for one inbound email message. It stores fields such as subject, sender, timestamps, source kind, cleaned body text, raw path, HTML path, content hash, and metadata.

Start here if you want to build against MailAtlas output.

[Document Schema](/docs/concepts/document-schema/)

## Asset

An asset is a file extracted from a message. Assets include inline images referenced by HTML and regular file attachments.

Start here if you need to preserve attachments, render HTML accurately, or build export bundles.

[Document Schema](/docs/concepts/document-schema/)

## Provenance

Provenance tells you where a document came from and how MailAtlas processed it. For IMAP messages, provenance can include host, folder, UID, and UIDVALIDITY. For parser output, metadata can include cleaning settings, forwarded-message detection, and dropped-line counts.

Start here if you need auditability or repeatable parsing.

- [Document Schema](/docs/concepts/document-schema/)
- [Parser Cleaning](/docs/config/parser-cleaning/)

## Export

An export is a derived artifact created from a stored document. MailAtlas can return or write JSON, Markdown, HTML, and PDF outputs.

Start here if another system needs files instead of direct API access.

[Export Formats](/docs/reference/export-formats/)

## Outbound record

An outbound record is created when MailAtlas drafts, dry-runs, queues, sends, or fails to send a message. It links rendered bodies, raw `.eml` snapshots, copied attachments, provider status, timestamps, and retry metadata.

Start here if your application sends email and needs a local audit trail.

[Outbound Email](/docs/providers/outbound-email/)

## Related pages

- [Workspace Model](/docs/concepts/workspace-model/)
- [Document Schema](/docs/concepts/document-schema/)
- [Parser Cleaning](/docs/config/parser-cleaning/)
- [Export Formats](/docs/reference/export-formats/)
- [Outbound Email](/docs/providers/outbound-email/)
- [Security and Privacy](/docs/marketing/security-and-privacy/)
