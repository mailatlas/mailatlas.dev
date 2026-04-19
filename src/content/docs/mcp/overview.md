---
title: MCP Server
description: Expose MailAtlas documents, outbound audit records, drafts, and gated sends to MCP clients.
slug: docs/mcp/overview
---

MailAtlas ships an optional MCP server for local AI tools that need to inspect email records or
prepare outbound messages. It runs against the same MailAtlas root as the CLI.

Install the optional MCP extra:

```bash
python -m pip install "mailatlas[mcp]"
```

Run the server over the STDIO transport:

```bash
mailatlas mcp --root .mailatlas
```

STDIO is the only supported MCP transport in MailAtlas right now.

## Tools

Read tools:

- `mailatlas_list_documents`
- `mailatlas_get_document`
- `mailatlas_export_document`
- `mailatlas_list_outbound`
- `mailatlas_get_outbound`

Draft tool:

- `mailatlas_draft_email`

Send tool:

- `mailatlas_send_email`

## Send gate

Live sends are disabled by default. The server exposes `mailatlas_draft_email` so an MCP client can
compose and store a reviewable draft without contacting a provider.

To expose the live send tool, set:

```bash
export MAILATLAS_MCP_ALLOW_SEND=1
mailatlas mcp --root .mailatlas
```

Use the same provider configuration as `mailatlas send`:

- SMTP: `MAILATLAS_SMTP_HOST`, `MAILATLAS_SMTP_USERNAME`, `MAILATLAS_SMTP_PASSWORD`
- Cloudflare: `MAILATLAS_CLOUDFLARE_ACCOUNT_ID`, `MAILATLAS_CLOUDFLARE_API_TOKEN`
- Gmail: `MAILATLAS_GMAIL_ACCESS_TOKEN` or a token created with `mailatlas auth gmail`

Provider secrets and Gmail tokens are consumed at runtime. MailAtlas does not write them to
`store.db`, raw snapshots, logs, or JSON send results.

## BCC

Default outbound list views do not include BCC recipients. `mailatlas_get_outbound` accepts
`include_bcc=true` when an MCP client needs explicit audit details.

Raw outbound MIME snapshots remain Bcc-free.
