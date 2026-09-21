---
title: Glossary
description: Definitions for the MailAtlas terms developers see across the docs, including email workspace, document, asset, parser cleaning, providers, receive, send, and exports.
slug: docs/concepts/glossary
---

Use this page when a MailAtlas docs page mentions a term you want to decode.

## Core model

### Email workspace

The local copy of email MailAtlas creates for your agent. It contains clean documents, source email, HTML views, extracted files, exports, receive state, sent-message records, and SQLite lookup.

Use [Email Workspace](/docs/concepts/workspace-model/) for the storage layout.

### Document

The clean email record your agent reads. A document contains fields such as subject, sender, timestamps, `body_text`, source metadata, linked HTML, raw email, and extracted assets.

Use [Email Document Schema](/docs/concepts/document-schema/) for the field reference.

### `body_text`

The clean plain-text view of an email body. Agents usually read `body_text` first because it removes raw MIME structure and can strip repeated boilerplate, forwarded wrappers, footers, invisible characters, and noisy spacing.

Use [Clean Email Text](/docs/config/parser-cleaning/) for cleaning controls.

### Metadata

Extra information stored with a document. Metadata can describe where an email came from, which provider IDs produced it, how the body was cleaned, and what message structure MailAtlas detected.

### Provenance

The source and processing trail for a document. Provenance helps you trace a clean document back to the original file, Gmail message, IMAP folder, or parser result that produced it.

## Email inputs

### `.eml`

A single email message file on disk. Use `mailatlas ingest` when you already have one or more `.eml` files locally.

### `mbox`

A mailbox archive file on disk that can contain many messages. Use `mailatlas ingest` when you already have an `mbox` export.

### Gmail receive

The MailAtlas receive path for fetching Gmail messages with the Gmail API and storing them as clean documents in the email workspace.

Use [Read Gmail with MailAtlas](/docs/examples/gmail-receive/) for the setup flow.

### IMAP receive

The MailAtlas receive path for connecting to a live mailbox over IMAP and fetching selected folders into the email workspace.

Use [Read Email with IMAP](/docs/getting-started/manual-imap-receive/) for the setup flow.

## Stored files

### Asset

A file MailAtlas extracted from an email. Assets include embedded images used by HTML email and regular attachments such as PDFs, spreadsheets, calendar files, and images.

### Inline asset

An asset embedded in HTML email, often referenced by content ID. Logos, charts, and inline screenshots are common examples.

### Attachment

A regular file attached to an email and extracted into the email workspace.

### HTML view

The normalized HTML representation of an email body when the message contains HTML. It stays linked
to the document so agents and exports can use more than plain text when needed. The stored snapshot
is preserved source data and remains untrusted; default HTML export creates a separate sanitized
view.

### Raw email

The original email bytes stored by MailAtlas, usually as an `.eml` file. Raw email remains available when you need exact source inspection.

## Cleaning and exports

### Parser cleaning

The process MailAtlas uses to create `body_text`. Cleaning can remove or normalize forwarded headers, boilerplate, link-only lines, footers, invisible characters, and repeated whitespace.

### Export

A JSON, Markdown, HTML, or PDF output produced from a stored document and its linked files.

Use [Export Formats](/docs/reference/export-formats/) for format details.

### Markdown bundle

A Markdown export directory that contains `document.md` plus an `assets/` directory with copied files referenced by the Markdown.

### PDF export

A PDF rendered by local Chrome or Chromium from a sanitized copy of the stored HTML view when
available, or from generated HTML based on cleaned text.

## Sending

### Sent-message record

A local record created when MailAtlas drafts, dry-runs, queues, sends, or fails to send an email. It can include rendered bodies, copied attachments, recipients, provider status, errors, and retry metadata.

### Dry run

A send workflow that validates, renders, and stores a message without contacting an email provider.

### Provider

An email service MailAtlas uses for receive or send operations. Examples include Gmail, IMAP, SMTP, and Cloudflare Email Service.

### Provider credentials

Secrets used to authenticate with a provider, such as SMTP passwords, Cloudflare API tokens, or Gmail OAuth tokens.

### Idempotency key

A caller-provided key used to make retrying sends safer. If the same key already exists, MailAtlas returns the existing sent-message record instead of sending a second message.

## Agent interfaces

### CLI

The `mailatlas` command-line interface for ingesting, receiving, listing, reading, exporting, and sending email.

### Python API

The MailAtlas Python interface for embedding parsing, receive, document lookup, export, and send workflows in application code.

### MCP server

The optional Model Context Protocol server that exposes local MailAtlas tools to MCP-compatible AI clients over STDIO.
