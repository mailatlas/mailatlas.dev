---
title: When to Use MailAtlas
description: Decide whether MailAtlas is the right tool for your email workflow. Compare local email I/O with hosted inbox connectors, generic MIME parsers, background sync services, and deliverability platforms.
slug: docs/product/why-not-connectors
---

MailAtlas is useful when you need email to become local, inspectable software state. It parses and stores inbound email, exports documents, and keeps local audit records for outbound email sent through providers you configure.

It is not a hosted inbox product, managed connector platform, full mail client, or deliverability service.

## Use MailAtlas when

Use MailAtlas when you need one or more of these capabilities:

- Ingest stored `.eml` files.
- Ingest `mbox` mailbox archives.
- Receive selected IMAP folders into a local workspace.
- Preserve raw messages, cleaned text, HTML snapshots, inline images, attachments, and metadata together.
- Export JSON, Markdown, HTML, or PDF for downstream systems.
- Build retrieval, analytics, archival, or agent workflows over email.
- Create outbound drafts and dry runs.
- Send outbound email through SMTP, Cloudflare, or Gmail while keeping local audit records.
- Avoid hosted storage for the email processing layer.

## Use a different tool when

Use a different tool when you need:

- A hosted webmail client.
- A managed inbox connector with background sync and hosted storage.
- A search product that answers questions directly inside chat without managing ingestion.
- A low-level MIME parser only.
- A deliverability platform with suppression lists, reputation management, campaign metrics, and bounce handling.
- A managed mail server.

## Comparison table

| Need | Better fit | Why |
| --- | --- | --- |
| Parse local `.eml` or `mbox` files and keep inspectable outputs | MailAtlas | It stores raw input, cleaned text, HTML, assets, exports, and metadata in one local workspace. |
| Ask quick questions over a connected inbox without managing ingestion | Hosted inbox connector | The connector handles sync, hosted storage, indexing, and user-facing search. |
| Decode MIME parts inside a small script | Generic MIME parser | You may not need a workspace, dedupe, exports, or provenance. |
| Send product or marketing campaigns | Deliverability platform | You need bounce handling, suppression lists, templates, analytics, and reputation tooling. |
| Build an agent workflow that reads and sends email with audit records | MailAtlas | It supports local inbound records and outbound send records through configured providers. |
| Keep mailbox receive running as a hosted service | Hosted connector or custom worker | MailAtlas provides local foreground polling, not a hosted background service. |

## What MailAtlas adds on top of parsing

MailAtlas adds:

- Configurable cleaning for noisy email bodies.
- Normalized HTML snapshots.
- Extracted inline-image and attachment references.
- A default filesystem plus SQLite workspace.
- Stable document IDs.
- Dedupe behavior.
- Repeatable exports.
- IMAP receive state.
- Outbound MIME snapshots, body files, copied attachments, provider status, BCC audit metadata, and retry keys.

## Decision checklist

Choose MailAtlas if most of these are true:

- You want local control over email artifacts.
- You need repeatable parsing and exports.
- You care about provenance.
- You want to inspect raw, cleaned, structured, and visual representations.
- You are comfortable configuring credentials at runtime.
- You do not need MailAtlas to host storage or run continuous background sync.

Choose a different tool if most of these are true:

- You want a managed service to host and sync email.
- You only need low-level MIME access.
- You need an end-user inbox UI.
- You need deliverability operations rather than local audit records.

## Next step

- Use [Installation](/docs/getting-started/installation/) to set up the CLI.
- Use [Quickstart](/docs/getting-started/quickstart/) for local `.eml` files.
- Use [IMAP Receive](/docs/getting-started/manual-imap-sync/) for live mailbox folders.
- Use [Outbound Email](/docs/providers/outbound-email/) for send and audit workflows.
