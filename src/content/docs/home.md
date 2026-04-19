---
title: MailAtlas Docs
description: Start using MailAtlas. Learn how to ingest .eml files and mbox archives, manually sync IMAP folders, export documents, use the CLI and Python API, configure outbound providers, and understand the local workspace.
slug: docs
---

MailAtlas is an open-source local email I/O layer for AI agents, data apps, retrieval systems, and Python workflows. These docs show you how to bring email in from files or IMAP, inspect stored documents, export structured outputs, and send outbound email through configured providers while keeping a local audit trail.

> MailAtlas is currently alpha. Expect CLI, schema, and packaging details to keep improving as the project matures.

## Start with your input

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/getting-started/quickstart/">
    <span class="docs-route-kicker">Files</span>
    <span>
      <span class="docs-route-title"><code>.eml</code> files</span>
      <p>Use the Quickstart when you already have individual message files on disk and want to verify the full ingest, inspect, and export flow.</p>
    </span>
    <span class="docs-route-meta">Quickstart</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/mbox-ingest/">
    <span class="docs-route-kicker">Archive</span>
    <span>
      <span class="docs-route-title"><code>mbox</code> archives</span>
      <p>Use Mbox Ingest when your email is already exported as a mailbox file and you want to preserve per-message source references and attachment paths.</p>
    </span>
    <span class="docs-route-meta">Mbox Ingest</span>
  </a>
  <a class="docs-route-row" href="/docs/getting-started/manual-imap-sync/">
    <span class="docs-route-kicker">Mailbox</span>
    <span>
      <span class="docs-route-title">Live mailbox folders</span>
      <p>Use Manual IMAP Sync when MailAtlas should connect to a live mailbox, fetch selected folders, and store messages in the same local workspace.</p>
    </span>
    <span class="docs-route-meta">Manual IMAP Sync</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/outbound-email/">
    <span class="docs-route-kicker">Outbound</span>
    <span>
      <span class="docs-route-title">Outbound email</span>
      <p>Use Outbound Email when your application needs to compose, render, store, and send messages through SMTP, Cloudflare, or Gmail while keeping a local outbound record.</p>
    </span>
    <span class="docs-route-meta">Outbound Email</span>
  </a>
</div>

## Recommended first path

Run one file-based ingest before connecting a live mailbox or building on the Python API. It is the fastest way to confirm the install, see the workspace layout, and understand the stored document model.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install mailatlas
export MAILATLAS_HOME="$PWD/.mailatlas"

mailatlas ingest path/to/message.eml
mailatlas list
```

If you want sample data:

```bash
git clone https://github.com/mailatlas/sample-data.git
mailatlas ingest sample-data/fixtures/eml/atlas-market-map.eml
mailatlas list
```

## Choose your interface

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/cli/overview/">
    <span class="docs-route-kicker">CLI</span>
    <span>
      <span class="docs-route-title">CLI</span>
      <p>Use the CLI for terminal workflows, scripts, inspection, exports, provider-based sends, self-checks, and local MCP server startup.</p>
    </span>
    <span class="docs-route-meta">CLI Overview</span>
  </a>
  <a class="docs-route-row" href="/docs/python/overview/">
    <span class="docs-route-kicker">Python</span>
    <span>
      <span class="docs-route-title">Python API</span>
      <p>Use the Python API when you want to embed MailAtlas in an application, worker, notebook, test suite, or pipeline.</p>
    </span>
    <span class="docs-route-meta">Python API</span>
  </a>
  <a class="docs-route-row" href="/docs/mcp/overview/">
    <span class="docs-route-kicker">MCP</span>
    <span>
      <span class="docs-route-title">MCP server</span>
      <p>Use the MCP server when you want MCP-compatible clients to inspect local email data, prepare outbound drafts, and optionally send through an explicit runtime gate.</p>
    </span>
    <span class="docs-route-meta">MCP Server</span>
  </a>
</div>

## Choose your workflow

<ul class="docs-choice-list">
  <li><code>ingest</code><span>Use <code>mailatlas ingest</code> when you already have <code>.eml</code> files or an <code>mbox</code> mailbox file on disk.</span></li>
  <li><code>sync</code><span>Use <code>mailatlas sync</code> when MailAtlas should fetch selected folders from a live mailbox over IMAP.</span></li>
  <li><code>get</code><span>Use <code>mailatlas list</code> to find documents, then <code>mailatlas get</code> to inspect or export one document as JSON, Markdown, HTML, or PDF.</span></li>
  <li><code>send</code><span>Use <code>mailatlas send</code> when MailAtlas should render a local outbound audit record and send through a configured provider.</span></li>
</ul>

## Core references

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/concepts/workspace-model/">
    <span class="docs-route-kicker">Storage</span>
    <span>
      <span class="docs-route-title">Workspace Model</span>
      <p>Explains where raw email, HTML snapshots, extracted assets, exports, outbound records, and SQLite metadata live.</p>
    </span>
    <span class="docs-route-meta">workspace</span>
  </a>
  <a class="docs-route-row" href="/docs/concepts/document-schema/">
    <span class="docs-route-kicker">Schema</span>
    <span>
      <span class="docs-route-title">Document Schema</span>
      <p>Describes normalized fields, source references, attachment metadata, parser notes, and IMAP provenance.</p>
    </span>
    <span class="docs-route-meta">document</span>
  </a>
  <a class="docs-route-row" href="/docs/config/parser-cleaning/">
    <span class="docs-route-kicker">Parsing</span>
    <span>
      <span class="docs-route-title">Parser Cleaning</span>
      <p>Explains configurable cleaning controls and how parser notes make transformations inspectable.</p>
    </span>
    <span class="docs-route-meta">cleaning</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/gmail/">
    <span class="docs-route-kicker">Provider</span>
    <span>
      <span class="docs-route-title">Gmail Provider</span>
      <p>Covers Gmail API OAuth setup, token-store behavior, and Gmail-specific send behavior.</p>
    </span>
    <span class="docs-route-meta">gmail</span>
  </a>
  <a class="docs-route-row" href="/docs/marketing/security-and-privacy/">
    <span class="docs-route-kicker">Security</span>
    <span>
      <span class="docs-route-title">Security and Privacy</span>
      <p>Explains what MailAtlas stores, what it avoids storing, and how to treat local workspaces and outbound records.</p>
    </span>
    <span class="docs-route-meta">privacy</span>
  </a>
</div>

## Common terms

<div class="docs-term-list">
  <div>
    <strong><code>.eml</code></strong>
    <p>A single email message file on disk.</p>
  </div>
  <div>
    <strong><code>mbox</code></strong>
    <p>A mailbox file on disk that can contain many messages.</p>
  </div>
  <div>
    <strong>Workspace root</strong>
    <p>The local directory that holds raw email, HTML snapshots, extracted assets, exports, outbound records, and SQLite metadata.</p>
  </div>
  <div>
    <strong>Document</strong>
    <p>The normalized MailAtlas record you can inspect, search, and export.</p>
  </div>
  <div>
    <strong>Export</strong>
    <p>A derived JSON, Markdown, HTML, or PDF artifact written from a stored document.</p>
  </div>
  <div>
    <strong>Outbound record</strong>
    <p>A local audit row plus rendered files for a draft, dry run, queued message, sent message, or failed send.</p>
  </div>
</div>

## Next step

New users should start with [Installation](/docs/getting-started/installation/), then [Quickstart](/docs/getting-started/quickstart/). After that, move to [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/), [Outbound Email](/docs/providers/outbound-email/), or the [Python API](/docs/python/overview/) depending on how you plan to use MailAtlas.
