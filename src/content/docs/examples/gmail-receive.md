---
title: "Read Gmail with MailAtlas"
description: Connect Gmail with OAuth, fetch messages from a label, and store them as clean MailAtlas documents your agent can inspect.
slug: docs/examples/gmail-receive
---

Use Gmail receive when your agent needs to read Gmail messages through OAuth and store them in the MailAtlas email workspace as clean, source-linked documents.

This page shows how to:

- Authorize read-only Gmail access.
- Fetch a bounded set of messages from a Gmail label.
- Store Gmail messages as MailAtlas documents.
- Inspect the fetched messages with `list` and `get`.

## Before you start

You need:

- MailAtlas installed.
- A Gmail account you can authorize.
- A terminal where you can run `mailatlas`.

Install keychain support if you have not already:

```bash
python -m pip install "mailatlas[keychain]"
```

## Set up Google OAuth

MailAtlas uses Google's OAuth flow to ask for read-only Gmail access. If you have not set up a Google app before, follow Google's Gmail API quickstart through the steps that create a Google Cloud project, enable the Gmail API, configure the OAuth consent screen, and create OAuth credentials:

- [Gmail API Python quickstart](https://developers.google.com/gmail/api/quickstart/python)
- [Create Google Workspace access credentials](https://developers.google.com/workspace/guides/create-credentials)
- [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)

When Google asks for the application type, choose `Desktop app`.

## Set Gmail credentials

After Google creates the credential, export the client ID and client secret:

```bash
export MAILATLAS_GMAIL_CLIENT_ID="..."
export MAILATLAS_GMAIL_CLIENT_SECRET="..."
```

## Set the email workspace

Use a separate workspace while testing with a real mailbox:

```bash
export MAILATLAS_HOME="$PWD/.mailatlas-gmail-test"
```

## Authorize read-only Gmail access

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Check that Gmail receive is configured:

```bash
mailatlas auth status gmail
```

`mailatlas auth status gmail` shows configured accounts and capabilities without displaying token material. The output should include `receive` in `capabilities`.

## Fetch Gmail messages

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 10
```

`--label INBOX` reads from Gmail's Inbox label. Change it to another Gmail label when needed.

The command prints JSON with counts, document IDs, cursor data, and a run ID. Common statuses:

| Status | Meaning |
| --- | --- |
| `ok` | Receive completed. New documents may or may not have been ingested. |
| `duplicate` | All fetched messages already existed in the workspace. |
| `not_configured` | Gmail auth or required config is missing. |

## Inspect stored email

```bash
mailatlas list
mailatlas get <document-id>
```

Gmail messages become MailAtlas documents. Your agent can read them the same way it reads imported `.eml` files.

## Inspect receive status

```bash
mailatlas receive status
```

Status output includes:

- configured receive accounts
- Gmail cursor state
- recent receive runs
- the most recent error when one exists

## Troubleshooting

### `cursor_reset_required`

If Gmail reports that the stored history cursor is invalid, run an explicit full sync:

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 50 \
  --full-sync
```

Full sync may return duplicates if messages are already stored. That is expected.

### `partial` or `error`

Use `mailatlas receive status` to inspect recent receive runs and the most recent error.

## Cleanup

Remove local Gmail auth:

```bash
mailatlas auth logout gmail
```

Remove the test workspace when you no longer need it. The workspace may contain real mailbox data.

```bash
rm -rf "$MAILATLAS_HOME"
```

## Next step

- Use [Gmail Receive Watch](/docs/examples/gmail-receive-watch/) to poll Gmail in the foreground.
- Use [Gmail Provider](/docs/providers/gmail/) to understand OAuth token storage and capabilities.
- Use [MCP Server](/docs/mcp/overview/) to expose email tools to an AI agent.
- Use [Export Formats](/docs/reference/export-formats/) to export fetched messages.
- Use [Security and Privacy](/docs/product/security-and-privacy/) before using a real mailbox workspace.
