---
title: Glossary
description: Definitions for MailAtlas concepts, including .eml, mbox, IMAP sync, workspace root, document, asset, export, outbound record, provider, and parser cleaning.
slug: docs/concepts/glossary
---

## `.eml`

A single email message file on disk. Use `mailatlas ingest` when you already have one or more `.eml` files locally.

## `mbox`

A mailbox file on disk that can contain many messages. Use `mailatlas ingest` when you already have an `mbox` archive locally. An `mbox` file is not the same thing as IMAP sync.

## Manual IMAP sync

The MailAtlas workflow for connecting to a live mailbox over IMAP and fetching selected folders into the local workspace. Use `mailatlas sync` for this path.

## Workspace root

The local directory that holds raw email, normalized HTML, extracted assets, exports, outbound records, and `store.db`.

## `store.db`

The SQLite database inside the workspace root. It stores document metadata, lookup data, dedupe information, IMAP sync cursors, run history, and outbound records.

## Document

The normalized MailAtlas record created from one email message. A document is stored in SQLite and linked to files in the workspace root.

## Asset

A file extracted from a message, such as an inline image or a regular attachment.

## Inline asset

An asset embedded in an HTML email, often referenced by content ID.

## Attachment

A regular file attached to an email and extracted into the workspace.

## Export

A derived JSON, Markdown, HTML, or PDF artifact produced from a stored document.

## Markdown bundle

A directory export that contains `document.md` plus an `assets/` directory with copied assets referenced by the Markdown file.

## PDF export

A PDF artifact rendered with local Chrome or Chromium from stored HTML when available, or generated HTML based on cleaned text.

## Parser cleaning

Configurable transformations that remove or normalize noisy email body content, such as boilerplate, forwarded headers, footers, link-only lines, invisible characters, and whitespace.

## Provenance

Metadata that explains where a document came from and how it was processed, including source type, IMAP folder and UID when available, forwarded-chain information, and parser notes.

## Source kind

The input type that produced a document, such as `eml`, `mbox`, or `imap`.

## Outbound record

A local audit record created when MailAtlas drafts, dry-runs, queues, sends, or fails to send an outbound message.

## Dry run

An outbound workflow that validates, renders, and stores a message without contacting an email provider.

## Provider

An outbound delivery backend configured at runtime, such as SMTP, Cloudflare Email Service, or Gmail API.

## Provider credentials

Secrets used to authenticate with an outbound provider, such as SMTP passwords, Cloudflare API tokens, or Gmail OAuth tokens. MailAtlas reads these at runtime and does not write them to `store.db`, raw snapshots, logs, or JSON send results.

## Idempotency key

A caller-provided key used to make retrying outbound sends safer. If the same key already exists, MailAtlas returns the existing outbound record instead of sending a second message.

## MCP server

The optional Model Context Protocol server that exposes local MailAtlas tools to MCP-compatible clients over STDIO.

## Send gate

The explicit runtime configuration required before the MCP server exposes live outbound sending. Draft tools remain available without the live send gate.
