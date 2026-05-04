---
title: Core Concepts
description: Understand the email workspace, documents, assets, exports, provenance, and provider records MailAtlas creates for AI agents.
slug: docs/concepts
---

MailAtlas turns email into documents inside an email workspace. Your agent reads the clean document, while MailAtlas keeps the source email, HTML, attachments, embedded images, metadata, and provenance linked behind it.

This model exists because raw email source is hard for AI agents to use directly. A message can contain MIME parts, alternative bodies, forwarded chains, embedded images, attachments, provider IDs, and transport headers. MailAtlas gives agents a cleaner way to read the message while preserving the structure and source material that matter later.

## The model

```text
Mailbox or email files
  -> MailAtlas receive or ingest
  -> Email workspace
  -> Documents, assets, exports, and source metadata
  -> CLI, Python API, or MCP tools
```

The email workspace is the copy of received and sent email that MailAtlas creates for your agent. It is queryable through the CLI, Python API, and MCP tools, and it keeps ordinary files on disk linked to SQLite records for lookup, dedupe, receive state, and send state.

## What your agent reads

A document is the clean record for one email message. It includes the subject, sender, timestamps, clean body text, source kind, metadata, and links to the raw message, HTML view, and extracted files.

Documents give agents the useful reading surface first: clean body text, message metadata, source links, HTML, and extracted files. The original source remains available for provenance and review.

## What MailAtlas keeps linked

MailAtlas keeps the useful parts of a message together:

- Source email: the original `.eml`, `mbox` message, Gmail message, or IMAP message.
- Clean body: the text view your agent can read without parsing raw MIME.
- HTML view: the normalized HTML representation when the message has HTML content.
- Assets: embedded images and attachments extracted from the message.
- Metadata: sender, timestamps, provider IDs, parser notes, and cleaning details.
- Provenance: where the message came from and how MailAtlas processed it.
- Exports: JSON, Markdown, HTML, or PDF outputs created from the stored document.

That is the core product shape: clean access for the agent, with the original structure and source context still attached.

## How email enters the workspace

MailAtlas can create documents from:

- Live IMAP folders.
- Gmail messages fetched with read-only OAuth.
- Individual `.eml` files.
- `mbox` mailbox archives.

All of these inputs write to the same email workspace. Once the email is stored, your agent can use the same read, inspect, export, and send workflows regardless of where the message came from.

## How sent email fits

When MailAtlas sends email through a configured provider, it stores the sent message in the same email workspace. That gives your agent one place to inspect received email, generated drafts, sent messages, provider status, attachments, and retry metadata.

## Where to go next

- Use [Workspace Model](/docs/concepts/workspace-model/) to understand the files and SQLite records MailAtlas writes.
- Use [Document Schema](/docs/concepts/document-schema/) when you are building against stored document fields.
- Use [Parser Cleaning](/docs/config/parser-cleaning/) to tune how message bodies are cleaned.
- Use [Export Formats](/docs/reference/export-formats/) to choose JSON, Markdown, HTML, or PDF output.
- Use [Security and Privacy](/docs/product/security-and-privacy/) to understand what workspace data can contain.
