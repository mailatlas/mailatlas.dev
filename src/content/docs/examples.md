---
title: Examples
description: Example workflows for MailAtlas file ingest, mbox archives, Gmail receive, IMAP receive, exports, outbound sends, Python usage, and MCP server setup.
slug: docs/examples
---

Use these examples when you want a task-focused path instead of a conceptual reference page.

## File and mailbox inputs

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/examples/eml-ingest/">
    <span class="docs-route-kicker">Files</span>
    <span>
      <span class="docs-route-title">Ingest <code>.eml</code> files</span>
      <p>Ingest one or more individual message files and export a stored message.</p>
    </span>
    <span class="docs-route-meta">eml</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/mbox-ingest/">
    <span class="docs-route-kicker">Archive</span>
    <span>
      <span class="docs-route-title">Ingest an <code>mbox</code> archive</span>
      <p>Parse a mailbox archive from disk and inspect the resulting documents.</p>
    </span>
    <span class="docs-route-meta">mbox</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/imap-sync/">
    <span class="docs-route-kicker">Mailbox</span>
    <span>
      <span class="docs-route-title">Receive IMAP folders</span>
      <p>Fetch selected live mailbox folders once or with foreground polling.</p>
    </span>
    <span class="docs-route-meta">imap</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/gmail-receive/">
    <span class="docs-route-kicker">Gmail</span>
    <span>
      <span class="docs-route-title">Receive Gmail messages</span>
      <p>Authorize a read-only Gmail token and fetch messages into the local workspace.</p>
    </span>
    <span class="docs-route-meta">receive</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/gmail-receive-watch/">
    <span class="docs-route-kicker">Polling</span>
    <span>
      <span class="docs-route-title">Watch Gmail receive</span>
      <p>Run foreground Gmail polling and inspect one JSON line per receive pass.</p>
    </span>
    <span class="docs-route-meta">watch</span>
  </a>
</div>

## Export and send examples

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/reference/export-formats/">
    <span class="docs-route-kicker">Export</span>
    <span>
      <span class="docs-route-title">Export formats</span>
      <p>Export stored documents as JSON, Markdown, HTML, or PDF.</p>
    </span>
    <span class="docs-route-meta">exports</span>
  </a>
  <a class="docs-route-row" href="/docs/providers/outbound-email/">
    <span class="docs-route-kicker">Send</span>
      <span>
        <span class="docs-route-title">SMTP and Cloudflare sends</span>
      <p>Use dry runs, provider credentials, attachments, idempotency keys, and sent-message records.</p>
      </span>
    <span class="docs-route-meta">send</span>
  </a>
  <a class="docs-route-row" href="/docs/examples/gmail-oauth-send/">
    <span class="docs-route-kicker">Gmail</span>
    <span>
      <span class="docs-route-title">Gmail OAuth send</span>
      <p>Authorize a local Gmail sender and send through the Gmail API.</p>
    </span>
    <span class="docs-route-meta">gmail</span>
  </a>
</div>

## Integration examples

<div class="docs-route-list">
  <a class="docs-route-row" href="/docs/python/overview/">
    <span class="docs-route-kicker">Python</span>
    <span>
      <span class="docs-route-title">Python parse-only and storage-backed workflows</span>
      <p>Use MailAtlas from application code, workers, notebooks, or tests.</p>
    </span>
    <span class="docs-route-meta">python</span>
  </a>
  <a class="docs-route-row" href="/docs/mcp/overview/">
    <span class="docs-route-kicker">MCP</span>
    <span>
      <span class="docs-route-title">Local MCP server</span>
      <p>Expose local MailAtlas tools to MCP-compatible clients over STDIO.</p>
    </span>
    <span class="docs-route-meta">mcp</span>
  </a>
</div>
