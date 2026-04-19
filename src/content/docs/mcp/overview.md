---
title: MCP Server
description: Run the optional MailAtlas MCP server over STDIO so compatible local AI tools can inspect documents, export artifacts, create outbound drafts, and optionally receive mailbox messages or send email through explicit runtime gates.
slug: docs/mcp/overview
---

MailAtlas ships an optional MCP server for local AI tools that need to inspect email records, export documents, review outbound records, prepare outbound messages, or run explicitly enabled mailbox receive passes.

The MCP server runs against the same MailAtlas workspace root as the CLI and Python API. It does not create a hosted service.

STDIO is the only supported MCP transport in MailAtlas right now.

## Install the MCP extra

```bash
python -m pip install "mailatlas[mcp]"
```

## Run the server

```bash
mailatlas mcp --root .mailatlas
```

Use the same workspace root that you use with the CLI:

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
mailatlas mcp --root "$MAILATLAS_HOME"
```

## Client configuration example

Use this pattern for local MCP clients that launch tools over STDIO:

```json
{
  "mcpServers": {
    "mailatlas": {
      "command": "mailatlas",
      "args": ["mcp", "--root", ".mailatlas"]
    }
  }
}
```

Adapt the configuration format to your MCP client.

## Tools

### Read tools

- `mailatlas_list_documents`
- `mailatlas_get_document`
- `mailatlas_export_document`
- `mailatlas_list_outbound`
- `mailatlas_get_outbound`

Use these tools when an MCP client needs to inspect local MailAtlas state without sending email.

### Draft tool

- `mailatlas_draft_email`

Use this tool when an MCP client should compose and store a reviewable outbound draft without contacting a provider.

### Send tool

- `mailatlas_send_email`

This tool is hidden by default and only appears when live sending is explicitly enabled before server startup.

### Receive tools

MailAtlas also exposes mailbox receive tools when receive support is explicitly enabled in the runtime environment. Keep receive access local and credential-scoped.

- `mailatlas_receive`
- `mailatlas_receive_status`

`mailatlas_receive` contacts a configured mailbox provider and stores private email in the local workspace. It is hidden by default.

## Live send gate

Live sends are disabled by default. This lets MCP clients draft and inspect email without contacting an outbound provider.

To expose the live send tool:

```bash
export MAILATLAS_MCP_ALLOW_SEND=1
mailatlas mcp --root .mailatlas
```

Set this variable only in environments where the client is allowed to send email.

## Receive gate

Mailbox receive is disabled by default. This keeps MCP read tools local to the workspace unless you explicitly authorize the server to contact a provider.

To expose receive tools:

```bash
export MAILATLAS_MCP_ALLOW_RECEIVE=1
mailatlas mcp --root .mailatlas
```

To run one receive pass before `mailatlas_list_documents`:

```bash
export MAILATLAS_MCP_ALLOW_RECEIVE=1
export MAILATLAS_MCP_RECEIVE_ON_READ=1
mailatlas mcp --root .mailatlas
```

Use receive-on-read only when the client should be allowed to contact a mailbox provider during read operations. It can be slower than ordinary reads and writes new private email into the workspace.

`MAILATLAS_MCP_RECEIVE_BACKGROUND=1` starts a local background receive loop with the MCP server process. Keep it off unless the MCP process lifecycle is the intended receive lifecycle.

## Provider configuration

The MCP send tool uses the same provider configuration as `mailatlas send`.

SMTP:

- `MAILATLAS_SMTP_HOST`
- `MAILATLAS_SMTP_USERNAME`
- `MAILATLAS_SMTP_PASSWORD`

Cloudflare:

- `MAILATLAS_CLOUDFLARE_ACCOUNT_ID`
- `MAILATLAS_CLOUDFLARE_API_TOKEN`

Gmail send:

- `MAILATLAS_GMAIL_ACCESS_TOKEN`
- A token created with `mailatlas auth gmail`

Gmail receive:

- `MAILATLAS_GMAIL_ACCESS_TOKEN`
- A token created with `mailatlas auth gmail --capability receive`
- `MAILATLAS_GMAIL_RECEIVE_LABEL`
- `MAILATLAS_GMAIL_RECEIVE_QUERY`
- `MAILATLAS_GMAIL_RECEIVE_LIMIT`

IMAP receive:

- `MAILATLAS_IMAP_HOST`
- `MAILATLAS_IMAP_PORT`
- `MAILATLAS_IMAP_USERNAME`
- `MAILATLAS_IMAP_PASSWORD`
- `MAILATLAS_IMAP_ACCESS_TOKEN`

Provider secrets and Gmail tokens are consumed at runtime. MailAtlas does not write them to `store.db`, raw snapshots, logs, or JSON receive/send results.

## Gmail with MCP

For local Gmail testing:

```bash
python -m pip install "mailatlas[keychain]"
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability send,receive

mailatlas mcp --root .mailatlas
```

Backend MCP hosts should store provider credentials in their own secret store and pass short-lived Gmail access tokens to the tool.

## BCC behavior

Default outbound list views do not include BCC recipients. `mailatlas_get_outbound` accepts `include_bcc=true` when an MCP client needs explicit audit details.

Raw outbound MIME snapshots remain Bcc-free.

## Safety guidance

- Keep the MCP server local unless a future transport is explicitly designed for remote use.
- Do not enable `MAILATLAS_MCP_ALLOW_SEND=1` in environments where the client should only draft or inspect.
- Do not enable `MAILATLAS_MCP_ALLOW_RECEIVE=1` unless the client is allowed to contact Gmail and store private email locally.
- Leave `MAILATLAS_MCP_RECEIVE_ON_READ` and `MAILATLAS_MCP_RECEIVE_BACKGROUND` unset unless those side effects are expected.
- Use dry runs and drafts for generated or agent-authored content before enabling live sends.
- Treat the workspace root as sensitive data.
