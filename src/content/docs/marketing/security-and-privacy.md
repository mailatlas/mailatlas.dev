---
title: Security and Privacy
description: Understand what MailAtlas stores, what it avoids storing, how provider credentials are handled, and how to operate local email workspaces safely.
slug: docs/marketing/security-and-privacy
---

MailAtlas stores data on the local filesystem and in SQLite by default. The core CLI commands and Python APIs operate on files you point at, IMAP folders you sync explicitly, and outbound messages you ask MailAtlas to draft or send.

MailAtlas does not require a hosted MailAtlas service for file ingest, manual IMAP sync, export, or outbound audit records.

Local storage still contains sensitive data. Treat a MailAtlas workspace as source email data, not as a scrubbed sharing format.

## What MailAtlas stores

MailAtlas can store:

- Raw inbound message bytes on disk.
- Normalized HTML and extracted assets on disk.
- Cleaned body text in stored document records.
- Document metadata and parser notes in SQLite.
- IMAP sync cursor state in SQLite when you use `sync`.
- Outbound raw `.eml` snapshots.
- Outbound body files.
- Copied outbound attachments.
- Provider status and provider response metadata.
- Recipient metadata, including BCC recipients in SQLite for audit.
- Exported artifacts wherever you tell MailAtlas to write them.

## What MailAtlas does not do by default

MailAtlas does not provide:

- Hosted storage.
- Hosted mailbox sync.
- Background mailbox sync as a managed service.
- Automatic publication of private inbox data.
- Autonomous background sending.
- Deliverability management.
- Encryption at rest for the workspace.

## Secrets not stored in the workspace

MailAtlas reads provider credentials at runtime. It does not write these secrets to `store.db`, raw snapshots, logs, or JSON send results:

| Secret type | Examples |
| --- | --- |
| IMAP password | `MAILATLAS_IMAP_PASSWORD` |
| IMAP OAuth access token | `MAILATLAS_IMAP_ACCESS_TOKEN` |
| SMTP password | `MAILATLAS_SMTP_PASSWORD` |
| Cloudflare API token | `MAILATLAS_CLOUDFLARE_API_TOKEN` |
| Gmail access token | `MAILATLAS_GMAIL_ACCESS_TOKEN` |
| Gmail refresh token | Token material from local Gmail OAuth helper |

For local Gmail CLI workflows, `mailatlas auth gmail` stores token material outside the workspace. With `mailatlas[keychain]` installed, it uses the operating system keychain by default. Without that extra, it uses a user config token file outside the workspace.

Backend applications should store OAuth refresh tokens in their own encrypted credential store and pass short-lived access tokens to MailAtlas at send time.

## Workspace sensitivity

A workspace can contain private email content, attachments, inline images, sender and recipient metadata, outbound drafts, sent-message audit records, BCC recipients, and exported PDFs or Markdown bundles.

Do not commit `.mailatlas/` to source control unless you intentionally created a synthetic fixture workspace.

Recommended `.gitignore` entry:

```text
.mailatlas/
```

## IMAP sync privacy

Manual IMAP sync stores cursor state, not mailbox credentials.

If you use OAuth for IMAP:

1. Obtain tokens in your own auth layer or secret source.
2. Pass the access token to MailAtlas at runtime.
3. Keep refresh tokens outside MailAtlas.
4. Rotate or revoke tokens using your provider's controls.

## Outbound email privacy

Outbound records are audit data. Treat them as sensitive.

They can include draft or sent body content, copied attachments, recipient lists, BCC recipients in SQLite, provider message IDs, provider error details, and idempotency keys.

MailAtlas omits BCC from local raw MIME snapshots. BCC recipients are still stored in SQLite for audit and included in provider delivery.

Review outbound drafts and dry runs before sending generated or agent-authored email.

## PDF export note

PDF export uses a local Chrome or Chromium process to render stored HTML. Set `MAILATLAS_PDF_BROWSER` if you need to override the browser executable path.

The resulting PDF may contain sensitive email content and assets. Review it before sharing.

## MCP security note

The MCP server exposes local workspace tools to MCP-compatible clients over STDIO.

Live sending is disabled by default. The live send tool is only exposed when `MAILATLAS_MCP_ALLOW_SEND=1` is set before the server starts.

Use the draft tool for reviewable generated messages, and enable live sends only in environments where the client is allowed to send email.

## Practical guidance

- Treat the workspace as sensitive source data.
- Keep real workspaces out of repositories.
- Use synthetic fixtures for demos, screenshots, and tests.
- Review exported JSON, HTML, Markdown, and PDF artifacts before sending them outside your machine or repository.
- Review outbound records before sharing logs or workspace snapshots.
- Pass credentials through runtime configuration such as environment variables, CLI flags, secret managers, or explicit Python config.
- Prefer Gmail API OAuth with the `gmail.send` scope over SMTP app passwords for personal Gmail sending.
- Revoke old app passwords or test credentials when they are no longer needed.

## Operational checklist

Before sharing a workspace or export, check:

- Does it contain raw email?
- Does it contain attachments?
- Does it contain outbound drafts or sent records?
- Does it contain BCC metadata?
- Does it contain exported PDFs or Markdown bundles?
- Does it contain provider error details or message IDs?
- Is it synthetic data or real user data?
