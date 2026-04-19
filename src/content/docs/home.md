---
title: MailAtlas Docs
description: Choose the right path for file ingest, IMAP sync, outbound email, Python integration, MCP tools, and stored document details.
slug: docs
---

MailAtlas is a local email layer for software. Use the docs by starting with where the email
lives, then move into the command, API, provider, or storage reference you need.

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/getting-started/quickstart/">
    <span class="docs-route-kicker">Files</span>
    <span>
      <span class="docs-route-title">Ingest <code>.eml</code> files</span>
      <p>Install the CLI, ingest saved message files, inspect stored documents, and export JSON.</p>
    </span>
    <span class="docs-route-meta">quickstart</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/mbox-ingest/">
    <span class="docs-route-kicker">Archive</span>
    <span>
      <span class="docs-route-title">Ingest an <code>mbox</code> mailbox file</span>
      <p>Normalize a mailbox export while preserving source references and attachment paths.</p>
    </span>
    <span class="docs-route-meta">mbox</span>
  </a>
  <a class="docs-route-row" href="/docs/getting-started/manual-imap-sync/">
    <span class="docs-route-kicker">Mailbox</span>
    <span>
      <span class="docs-route-title">Sync selected IMAP folders</span>
      <p>Connect to a live mailbox, fetch chosen folders, and rerun sync with stored cursors.</p>
    </span>
    <span class="docs-route-meta">sync</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/outbound-email/">
    <span class="docs-route-kicker">Outbound</span>
    <span>
      <span class="docs-route-title">Send and audit outbound email</span>
      <p>Choose SMTP, Cloudflare, or Gmail while keeping local send records and rendered snapshots.</p>
    </span>
    <span class="docs-route-meta">send</span>
  </a>
</div>

## Shortest proof

Run one ingest before connecting a mailbox or building on the Python API.

<div class="docs-command-panel">
  <span class="docs-label">recommended path</span>
  <pre><code>python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install mailatlas
export MAILATLAS_HOME="$PWD/.mailatlas"
mailatlas ingest path/to/message.eml
mailatlas list</code></pre>
</div>

## Choose the interface

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/cli/overview/">
    <span class="docs-route-kicker">CLI</span>
    <span>
      <span class="docs-route-title">Command reference</span>
      <p>Use <code>ingest</code>, <code>sync</code>, <code>list</code>, <code>get</code>, export options, and outbound commands from a shell.</p>
    </span>
    <span class="docs-route-meta">terminal</span>
  </a>
  <a class="docs-route-row" href="/docs/python/overview/">
    <span class="docs-route-kicker">Python</span>
    <span>
      <span class="docs-route-title">Embed MailAtlas in application code</span>
      <p>Call parse-only functions or use the storage-backed API from your own Python process.</p>
    </span>
    <span class="docs-route-meta">library</span>
  </a>
  <a class="docs-route-row" href="/docs/mcp/overview/">
    <span class="docs-route-kicker">MCP</span>
    <span>
      <span class="docs-route-title">Expose local email to MCP clients</span>
      <p>Let a client inspect documents, outbound records, drafts, and sends that require an explicit gate.</p>
    </span>
    <span class="docs-route-meta">AI tools</span>
  </a>
</div>

## Choose the command

<ul class="docs-choice-list">
  <li><code>ingest</code><span>Use when you already have <code>.eml</code> files or an <code>mbox</code> mailbox file on disk.</span></li>
  <li><code>sync</code><span>Use when MailAtlas should fetch selected folders from a live mailbox.</span></li>
  <li><code>send</code><span>Use when MailAtlas should render a local outbound audit record and send through a configured provider.</span></li>
</ul>

An `mbox` file is a mailbox file on disk. It is not IMAP sync. If the messages still live in a
mailbox and you want MailAtlas to fetch them directly, use `sync`.

## Reference maps

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/concepts/workspace-model/">
    <span class="docs-route-kicker">Storage</span>
    <span>
      <span class="docs-route-title">Workspace model</span>
      <p>See where raw email, HTML snapshots, extracted assets, exports, outbound records, and SQLite metadata live.</p>
    </span>
    <span class="docs-route-meta">root</span>
  </a>
  <a class="docs-route-row" href="/docs/concepts/document-schema/">
    <span class="docs-route-kicker">Schema</span>
    <span>
      <span class="docs-route-title">Stored document schema</span>
      <p>Review normalized fields, source references, attachment metadata, and export paths.</p>
    </span>
    <span class="docs-route-meta">document</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/gmail/">
    <span class="docs-route-kicker">Provider</span>
    <span>
      <span class="docs-route-title">Gmail OAuth setup</span>
      <p>Send from Gmail with the Gmail API and the narrow <code>gmail.send</code> OAuth scope.</p>
    </span>
    <span class="docs-route-meta">Gmail</span>
  </a>
  <a class="docs-route-row" href="/docs/marketing/why-not-connectors/">
    <span class="docs-route-kicker">Fit</span>
    <span>
      <span class="docs-route-title">When to use MailAtlas</span>
      <p>Compare MailAtlas with hosted inboxes, managed connectors, and deliverability products.</p>
    </span>
    <span class="docs-route-meta">decision</span>
  </a>
</div>

## Terms

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
    <strong>root</strong>
    <p>The directory that holds raw email, HTML snapshots, extracted assets, exports, outbound records, and the SQLite index.</p>
  </div>
  <div>
    <strong>document</strong>
    <p>The normalized MailAtlas record you can inspect, search, and export later.</p>
  </div>
  <div>
    <strong>export</strong>
    <p>A derived JSON, Markdown, HTML, or PDF artifact written from a stored document.</p>
  </div>
  <div>
    <strong>outbound record</strong>
    <p>A local audit row plus rendered files for a draft, dry run, sent message, queued message, or failed send.</p>
  </div>
</div>
