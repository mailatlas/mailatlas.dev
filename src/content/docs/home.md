---
title: MailAtlas Docs
description: Learn how to give AI agents clean, structured access to email with MailAtlas using live mailboxes, archived email, the CLI, Python API, MCP server, and configured providers.
slug: docs
---

MailAtlas makes email accessible to AI agents. It imports email from live mailboxes or archives, turns complex messages into clean source-linked views, and gives agents a queryable email workspace for reading, exporting, and sending.

> MailAtlas is currently alpha. Expect CLI, schema, and packaging details to keep improving as the project matures.

## Choose how your agent gets email

Start with the source you already have. Live mailboxes, individual email files, and mailbox archives all write to the same email workspace.

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/getting-started/manual-imap-sync/">
    <span class="docs-route-kicker">Mailbox</span>
    <span>
      <span class="docs-route-title">Live mailbox</span>
      <p>Connect selected folders over IMAP so your agent can work from current mailbox data in the same email workspace.</p>
    </span>
    <span class="docs-route-meta">IMAP</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/gmail-receive/">
    <span class="docs-route-kicker">Gmail</span>
    <span>
      <span class="docs-route-title">Gmail mailbox</span>
      <p>Fetch Gmail messages with read-only OAuth and store them as clean, source-linked documents for your agent.</p>
    </span>
    <span class="docs-route-meta">Gmail API</span>
  </a>
  <a class="docs-route-row" href="/docs/getting-started/quickstart/">
    <span class="docs-route-kicker">Files</span>
    <span>
      <span class="docs-route-title">Email files</span>
      <p>Import individual <code>.eml</code> files when you want the fastest local check or already have messages exported to disk.</p>
    </span>
    <span class="docs-route-meta">Quickstart</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/mbox-ingest/">
    <span class="docs-route-kicker">Archive</span>
    <span>
      <span class="docs-route-title">mbox archive</span>
      <p>Import an exported mailbox archive and create one clean, source-linked document per message.</p>
    </span>
    <span class="docs-route-meta">Mbox</span>
  </a>
</div>

## Install

Install MailAtlas from PyPI, then choose the source you want to connect or import.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install mailatlas
```

For a quick local check, import one sample email file:

```bash
git clone https://github.com/mailatlas/sample-data.git
export MAILATLAS_HOME="$PWD/.mailatlas"
mailatlas ingest sample-data/fixtures/eml/atlas-market-map.eml
mailatlas list
```

## What MailAtlas handles for you

MailAtlas handles MIME structure, HTML, attachments, embedded images, metadata, and provenance so your agent can work with clean email views without losing the original source context.

## Use MailAtlas from your agent stack

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/cli/overview/">
    <span class="docs-route-kicker">CLI</span>
    <span>
      <span class="docs-route-title">CLI</span>
      <p>Use the CLI for local runs, scripts, inspection, exports, provider-backed sends, self-checks, and MCP server startup.</p>
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
      <p>Use MCP tools when agent clients should read email, inspect exports, prepare drafts, and optionally send through an explicit approval gate.</p>
    </span>
    <span class="docs-route-meta">MCP Server</span>
  </a>
</div>

## What your agent can do

<ul class="docs-choice-list">
  <li><code>receive</code><span>Fetch Gmail or IMAP messages from a live mailbox and store clean source-linked documents locally.</span></li>
  <li><code>ingest</code><span>Import <code>.eml</code> files or an <code>mbox</code> archive from disk.</span></li>
  <li><code>read</code><span>Use <code>mailatlas list</code> and <code>mailatlas get</code> to find, inspect, and query stored email.</span></li>
  <li><code>export</code><span>Write JSON, Markdown, HTML, or PDF views from stored messages while keeping assets and source links connected.</span></li>
  <li><code>send</code><span>Send through SMTP, Cloudflare, or Gmail and store sent messages in the same email workspace.</span></li>
</ul>

## Core Concepts

MailAtlas stores email in a workspace your agent can query. Each message keeps its clean text, HTML view, attachments, embedded images, metadata, exports, and source reference together, so the agent can read the clean version and still trace back to the original email when needed.

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/concepts/">
    <span class="docs-route-kicker">Overview</span>
    <span>
      <span class="docs-route-title">Core Concepts</span>
      <p>Learn how email workspaces, documents, assets, parser metadata, exports, and sent messages fit together.</p>
    </span>
    <span class="docs-route-meta">model</span>
  </a>
  <a class="docs-route-row" href="/docs/concepts/workspace-model/">
    <span class="docs-route-kicker">Workspace</span>
    <span>
      <span class="docs-route-title">Workspace Model</span>
      <p>Understand the email workspace: stored messages, HTML snapshots, assets, exports, receive state, sent messages, and SQLite lookup.</p>
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
      <p>Tune how MailAtlas turns complex email source into clean text and HTML views for agents, exports, review, and tests.</p>
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
      <p>Render and send messages through configured providers, then store sent email in the same workspace.</p>
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
    <strong>Email workspace</strong>
    <p>The local copy of received and sent email that your agent can query, inspect, and export.</p>
  </div>
  <div>
    <strong>Document</strong>
    <p>The clean, structured MailAtlas record created from one email message.</p>
  </div>
  <div>
    <strong>Source email</strong>
    <p>The original message MailAtlas keeps linked to cleaned text, HTML, assets, metadata, and exports.</p>
  </div>
  <div>
    <strong>Asset</strong>
    <p>An inline image or regular file attachment extracted from a message and linked to a document.</p>
  </div>
  <div>
    <strong>Provider</strong>
    <p>The mailbox or sending service MailAtlas connects to, such as IMAP, Gmail, SMTP, or Cloudflare.</p>
  </div>
  <div>
    <strong>Export</strong>
    <p>A derived JSON, Markdown, HTML, or PDF artifact written from a stored document.</p>
  </div>
  <div>
    <strong>Sent message</strong>
    <p>A message MailAtlas rendered and sent through a configured provider, stored in the same email workspace as received email.</p>
  </div>
</div>

## Next step

New users should start with [Installation](/docs/getting-started/installation/). Then use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) for a live mailbox or [Quickstart](/docs/getting-started/quickstart/) for sample email files. After that, use [Outbound Email](/docs/providers/outbound-email/), [Python API](/docs/python/overview/), or [MCP Server](/docs/mcp/overview/) depending on how your agent will use MailAtlas.
