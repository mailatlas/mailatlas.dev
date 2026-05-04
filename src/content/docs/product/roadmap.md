---
title: Roadmap
description: See the current MailAtlas roadmap, including parser quality, export structure, examples, MCP support, mailbox adapters, send providers, and packaging improvements.
slug: docs/product/roadmap
---

This roadmap describes current direction, not a delivery guarantee. Priorities may change as the project matures, user feedback arrives, and the API stabilizes.

MailAtlas is currently alpha. Expect the CLI, schema, docs, packaging, and examples to continue improving.

## Current focus

The current focus is making email access for AI agents reliable and easy to understand.

Work includes:

- Improving cleaning for common email layouts and newsletter HTML.
- Strengthening attachment and inline asset extraction across more real-world fixtures.
- Documenting Gmail and IMAP receive, receive status, foreground polling, and MCP receive gates.
- Supporting drafts, dry runs, SMTP sends, Cloudflare Email Service sends, Gmail sends, and sent-message records.
- Tightening docs and examples around quickstart, export behavior, integration paths, provider setup, and security guidance.
- Improving the reliability of `mailatlas doctor` and local setup checks.

## Near-term

Near-term work should improve integration quality and developer confidence.

Planned areas include:

- Better exported document structure for retrieval and indexing systems.
- Expanded CLI reference coverage for common tasks.
- Expanded Python API reference coverage.
- More MCP tool documentation for document reads, exports, drafts, sent-message reads, and gated live sends.
- More live receive guidance with Gmail and IMAP test mailbox examples.
- More fixture-backed examples that show stored HTML and asset extraction.
- A centralized configuration and environment-variable reference.
- A troubleshooting guide for install, PDF export, IMAP auth, Gmail auth, and provider sends.

## Later

Later work may include:

- Hosted mailbox receive beyond local foreground polling.
- Broader mailbox adapter coverage beyond IMAP.
- Additional send providers such as Resend, SendGrid, Postmark, or local `.eml` drop directories.
- Packaging and distribution paths that reduce local setup friction as release channels mature.
- Clear schema versioning and compatibility policy.
- More production-oriented guidance for embedding MailAtlas in services.

## How to follow progress

Use GitHub for current project activity, issues, examples, and release notes.

- [GitHub repository](https://github.com/mailatlas/mailatlas)
- [Issues](https://github.com/mailatlas/mailatlas/issues)
- [Pull requests](https://github.com/mailatlas/mailatlas/pulls)
- [Releases](https://github.com/mailatlas/mailatlas/releases)
- [Examples repository](https://github.com/mailatlas/examples)
- [Sample data repository](https://github.com/mailatlas/sample-data)
