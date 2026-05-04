---
title: Configuration Reference
description: Configure the MailAtlas email workspace, PDF browser discovery, mailbox receive, send providers, Gmail token storage, and MCP gates.
slug: docs/reference/configuration
---

This page collects the configuration surfaces used by the CLI, Python API, and MCP server.

Configure provider credentials through environment variables, CLI flags, Python config, or the Gmail auth helper. MailAtlas uses those credentials for the receive or send command that needs them.

## Email workspace resolution

MailAtlas stores email documents, assets, exports, receive state, and sent-message records in one email workspace.

Resolution order:

1. `--root`
2. `MAILATLAS_HOME`
3. Project config from `.mailatlas.toml` or `pyproject.toml`
4. Fallback `.mailatlas`

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
mailatlas list
mailatlas --root ./other-mailatlas list
```

## Project config

MailAtlas can read a local `.mailatlas.toml` file:

```toml
root = ".mailatlas"
```

It can also read `pyproject.toml`:

```toml
[tool.mailatlas]
root = ".mailatlas"
```

## PDF export

PDF export uses local Chrome or Chromium. If MailAtlas cannot find the browser on the default path, set:

```bash
export MAILATLAS_PDF_BROWSER="/path/to/chrome-or-chromium"
```

## IMAP receive variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_IMAP_HOST` | IMAP hostname. |
| `MAILATLAS_IMAP_PORT` | IMAP TLS port. Defaults to `993`. |
| `MAILATLAS_IMAP_USERNAME` | Mailbox username. |
| `MAILATLAS_IMAP_PASSWORD` | Password or app password for password auth. |
| `MAILATLAS_IMAP_ACCESS_TOKEN` | OAuth access token for XOAUTH2 auth. |

Use either password auth or OAuth token auth, not both.

IMAP credentials are used to open the mailbox connection for the receive command. MailAtlas stores receive cursor state in the workspace so later runs can continue from the same mailbox.

## SMTP variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_SEND_PROVIDER` | Set to `smtp` to use SMTP by default. |
| `MAILATLAS_SMTP_HOST` | SMTP hostname. |
| `MAILATLAS_SMTP_PORT` | SMTP port. Defaults to `587`. |
| `MAILATLAS_SMTP_USERNAME` | SMTP username. |
| `MAILATLAS_SMTP_PASSWORD` | SMTP password or app password. |
| `MAILATLAS_SMTP_STARTTLS` | Enable or disable STARTTLS. |
| `MAILATLAS_SMTP_SSL` | Enable or disable SMTP over SSL. |

## Cloudflare variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_SEND_PROVIDER` | Set to `cloudflare` to use Cloudflare by default. |
| `MAILATLAS_CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID. |
| `MAILATLAS_CLOUDFLARE_API_TOKEN` | Cloudflare API token. |
| `MAILATLAS_CLOUDFLARE_API_BASE` | Optional API base override for tests or compatible gateways. |

## Gmail send variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_SEND_PROVIDER` | Set to `gmail` to use Gmail by default. |
| `MAILATLAS_GMAIL_ACCESS_TOKEN` | Short-lived Gmail API access token. |
| `MAILATLAS_GMAIL_API_BASE` | Optional Gmail API base override. |
| `MAILATLAS_GMAIL_USER_ID` | Gmail API user ID. Defaults to `me`. |
| `MAILATLAS_GMAIL_TOKEN_FILE` | Explicit local token file path. |
| `MAILATLAS_GMAIL_TOKEN_STORE` | Gmail token store: `auto`, `keychain`, `file`, or a token file path. |
| `MAILATLAS_GMAIL_CLIENT_ID` | OAuth client ID for `mailatlas auth gmail`. |
| `MAILATLAS_GMAIL_CLIENT_SECRET` | OAuth client secret for `mailatlas auth gmail`. |

## Gmail receive variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_RECEIVE_PROVIDER` | Receive provider. Supported values are `gmail` and `imap`. |
| `MAILATLAS_GMAIL_ACCESS_TOKEN` | Short-lived Gmail API access token. |
| `MAILATLAS_GMAIL_API_BASE` | Optional Gmail API base override. |
| `MAILATLAS_GMAIL_USER_ID` | Gmail API user ID. Defaults to `me`. |
| `MAILATLAS_GMAIL_RECEIVE_LABEL` | Gmail label for receive. Defaults to `INBOX`. |
| `MAILATLAS_GMAIL_RECEIVE_QUERY` | Optional Gmail search query. |
| `MAILATLAS_GMAIL_RECEIVE_LIMIT` | Maximum messages to fetch in one pass. Defaults to `50`. |
| `MAILATLAS_GMAIL_INCLUDE_SPAM_TRASH` | Include Gmail spam and trash in receive list calls. |
| `MAILATLAS_GMAIL_TOKEN_FILE` | Explicit local token file path. |
| `MAILATLAS_GMAIL_TOKEN_STORE` | Gmail token store: `auto`, `keychain`, `file`, or a token file path. |
| `MAILATLAS_GMAIL_CLIENT_ID` | OAuth client ID for `mailatlas auth gmail`. |
| `MAILATLAS_GMAIL_CLIENT_SECRET` | OAuth client secret for `mailatlas auth gmail`. |

Local CLI workflows can use `mailatlas auth gmail --capability receive`. Backend applications should store refresh tokens in their own encrypted credential store and pass short-lived access tokens to MailAtlas.

## Background receive variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_RECEIVE_INTERVAL_SECONDS` | Polling interval for `mailatlas receive watch`. Defaults to `60`. |
| `MAILATLAS_RECEIVE_MAX_RUNS` | Optional max run count for watch mode. |

## MCP variables

| Variable | Purpose |
| --- | --- |
| `MAILATLAS_MCP_ALLOW_SEND` | Set to `1` to expose the live send tool. |
| `MAILATLAS_MCP_ALLOW_RECEIVE` | Set to `1` to expose mailbox receive tools. |
| `MAILATLAS_MCP_RECEIVE_ON_READ` | Set to `1` to run one receive pass before document list reads. |
| `MAILATLAS_MCP_RECEIVE_BACKGROUND` | Set to `1` to start a background receive loop with the MCP server process. |
| `MAILATLAS_MCP_AUTO_RECEIVE` | Convenience alias for receive-on-read. Prefer the explicit receive variables above. |

The MCP server starts with read/export/draft tools. Set the send or receive gates only for clients that are allowed to contact providers.

## Next step

- Use [CLI Overview](/docs/cli/overview/) for commands that consume these values.
- Use [Security and Privacy](/docs/product/security-and-privacy/) for handling workspaces and credentials.
- Use [Troubleshooting](/docs/support/troubleshooting/) for common setup failures.
