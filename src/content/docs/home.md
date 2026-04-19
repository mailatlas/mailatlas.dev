---
title: MailAtlas Docs
description: Learn how to ingest, inspect, export, sync, and send email with MailAtlas using the CLI, Python API, MCP server, and configured providers.
slug: docs
---

MailAtlas is an open-source email infrastructure layer for developers building local email workflows, AI agents, retrieval systems, and data applications. These docs show how to ingest email from files or IMAP, inspect stored documents, export structured outputs, and send provider-backed email while preserving a local audit trail.

> MailAtlas is currently alpha. Expect CLI, schema, and packaging details to keep improving as the project matures.

## Start with your input

Choose the path that matches where the email lives now. Each path writes to the same local workspace model.

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/getting-started/quickstart/">
    <span class="docs-route-kicker">Files</span>
    <span>
      <span class="docs-route-title">Files</span>
      <p>Use the Quickstart when you already have individual <code>.eml</code> files on disk and want to verify ingest, inspect, and export behavior end to end.</p>
    </span>
    <span class="docs-route-meta">Quickstart</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/mbox-ingest/">
    <span class="docs-route-kicker">Archive</span>
    <span>
      <span class="docs-route-title">Archive</span>
      <p>Use <code>mbox</code> ingest when email is already exported as a mailbox archive and you want MailAtlas to create one stored document per message.</p>
    </span>
    <span class="docs-route-meta">Mbox</span>
  </a>
  <a class="docs-route-row" href="/docs/getting-started/manual-imap-sync/">
    <span class="docs-route-kicker">Mailbox</span>
    <span>
      <span class="docs-route-title">Mailbox</span>
      <p>Use Manual IMAP Sync when MailAtlas should connect to a live mailbox, fetch selected folders, and store messages in the same local workspace.</p>
    </span>
    <span class="docs-route-meta">IMAP</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/outbound-email/">
    <span class="docs-route-kicker">Outbound</span>
    <span>
      <span class="docs-route-title">Outbound email</span>
      <p>Use Outbound Email when your application needs to render, store, send, and audit messages through SMTP, Cloudflare, or Gmail.</p>
    </span>
    <span class="docs-route-meta">Send</span>
  </a>
</div>

## Recommended first path

Run one file-based ingest before connecting a live mailbox or building on the Python API. This confirms the install, creates a workspace, and shows the document model with the least setup.

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
      <p>Use the CLI for terminal workflows, scripts, inspection, exports, provider-backed sends, self-checks, and local MCP server startup.</p>
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
      <p>Use the MCP server when MCP-compatible clients should inspect local email data, prepare outbound drafts, or optionally send through an explicit runtime gate.</p>
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

## Core Concepts

MailAtlas has a small local data model. Learn these concepts before building on the CLI, Python API, MCP server, or provider integrations.

Inbound email follows this shape:

```text
.eml file, mbox archive, or IMAP message
        |
MailAtlas document
        |
raw message + cleaned text + HTML snapshot + assets + metadata
        |
CLI, Python API, MCP server, exports, retrieval, or review workflows
```

Outbound email follows the same local-first pattern:

```text
draft or send request
        |
rendered body + raw .eml snapshot + copied attachments
        |
outbound record + provider status
```

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/concepts/">
    <span class="docs-route-kicker">Overview</span>
    <span>
      <span class="docs-route-title">Core Concepts</span>
      <p>Learn how workspaces, documents, assets, parser metadata, exports, and outbound records fit together.</p>
    </span>
    <span class="docs-route-meta">model</span>
  </a>
  <a class="docs-route-row" href="/docs/concepts/workspace-model/">
    <span class="docs-route-kicker">Workspace</span>
    <span>
      <span class="docs-route-title">Workspace Model</span>
      <p>Understand the local workspace root: <code>store.db</code>, raw messages, HTML snapshots, assets, exports, IMAP sync state, and outbound records.</p>
    </span>
    <span class="docs-route-meta">workspace</span>
  </a>
  <a class="docs-route-row" href="/docs/concepts/document-schema/">
    <span class="docs-route-kicker">Document</span>
    <span>
      <span class="docs-route-title">Document Schema</span>
      <p>Review the normalized document fields, asset fields, parser metadata, source provenance, and path behavior used by the CLI and Python API.</p>
    </span>
    <span class="docs-route-meta">document</span>
  </a>
  <a class="docs-route-row" href="/docs/config/parser-cleaning/">
    <span class="docs-route-kicker">Cleaning</span>
    <span>
      <span class="docs-route-title">Parser Cleaning</span>
      <p>Tune how MailAtlas transforms noisy email bodies into cleaned text for retrieval, exports, analytics, review, and tests.</p>
    </span>
    <span class="docs-route-meta">cleaning</span>
  </a>
  <a class="docs-route-row" href="/docs/reference/export-formats/">
    <span class="docs-route-kicker">Export</span>
    <span>
      <span class="docs-route-title">Export Formats</span>
      <p>Choose between JSON, Markdown, HTML, and PDF outputs, and understand how exported files relate to stored documents and assets.</p>
    </span>
    <span class="docs-route-meta">export</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/outbound-email/">
    <span class="docs-route-kicker">Outbound</span>
    <span>
      <span class="docs-route-title">Outbound Email</span>
      <p>Render, dry-run, send, and audit outbound messages through configured providers.</p>
    </span>
    <span class="docs-route-meta">send</span>
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
    <p>The normalized MailAtlas record created from one inbound email message.</p>
  </div>
  <div>
    <strong>Asset</strong>
    <p>An inline image or regular file attachment extracted from a message and linked to a document.</p>
  </div>
  <div>
    <strong>Parser metadata</strong>
    <p>Structured notes that describe how a message was parsed, cleaned, and traced back to its source.</p>
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
