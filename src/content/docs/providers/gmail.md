---
title: Gmail Provider
description: Configure MailAtlas to receive Gmail messages and send through the Gmail API with OAuth. Create a Google OAuth desktop client, choose capabilities, use local token storage, receive or send test messages, and troubleshoot common errors.
slug: docs/providers/gmail
---

Use the Gmail provider when you want MailAtlas to receive messages from a Gmail mailbox or send from a personal Gmail address or Gmail-configured send-as alias.

MailAtlas uses the Gmail API with OAuth. `mailatlas auth gmail` is send-focused by default for compatibility, but you can request receive or combined send/receive capabilities explicitly.

This is the recommended Gmail path. Gmail SMTP app passwords can still work through `--provider smtp` for outbound mail, but they are a compatibility option for local testing, not the preferred Gmail integration.

## Choose your Gmail workflow

### Local CLI workflow

Use `mailatlas auth gmail` when a local operator wants to authorize Gmail once and reuse that local token for CLI receive or send commands.

With `mailatlas[keychain]` installed, MailAtlas stores token material in the operating system keychain by default. Without the keychain extra, it falls back to a user config token file outside the MailAtlas workspace.

### Backend application workflow

Backend applications should not rely on the local CLI token store. Store Gmail refresh tokens in your own encrypted credential store, refresh them in your backend, and pass short-lived access tokens to MailAtlas at receive or send time with `gmail_access_token` or `MAILATLAS_GMAIL_ACCESS_TOKEN`.

## What you need

You need:

- A Google Cloud project.
- Gmail API enabled for that project.
- A Google OAuth desktop client ID.
- A Google OAuth client secret if Google issued one for that client.
- The Gmail address you want to receive from or send from.

## Create the OAuth client

In Google Cloud Console:

1. Create or select a Google Cloud project.
2. Enable the Gmail API for that project.
3. Configure the OAuth consent screen.
4. For a personal Gmail test, choose an external app and add your Gmail address as a test user while the app is in testing mode.
5. Open APIs & Services, then Credentials.
6. Create an OAuth client ID with application type Desktop app.
7. Copy the client ID and client secret.

## Authorize the local CLI

Send-only auth is the default:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com
```

MailAtlas opens a browser unless `--no-browser` is passed, asks Google for the `gmail.send` scope by default, receives the OAuth callback on `127.0.0.1`, and stores the resulting token outside the MailAtlas workspace.

Receive-only auth asks for the read-only Gmail scope:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Use one token for both local receive and send:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability send,receive
```

Capability scopes:

| Capability | Gmail scope |
| --- | --- |
| `send` | `https://www.googleapis.com/auth/gmail.send` |
| `receive` | `https://www.googleapis.com/auth/gmail.readonly` |

MailAtlas does not write Gmail OAuth tokens to `store.db`, raw snapshots, logs, or JSON receive/send results.

Check local status:

```bash
mailatlas auth status gmail
```

Remove local Gmail auth:

```bash
mailatlas auth logout gmail
```

## Receive Gmail messages

Run one bounded receive pass:

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 50
```

Receive uses the Gmail API, decodes raw messages into RFC 2822 bytes, and stores them as regular MailAtlas documents under the local workspace. Provider metadata records Gmail message ID, thread ID, label IDs, history ID, internal date, and local receive account ID.

Receive is read-only. MailAtlas does not mark Gmail messages read, archive them, delete them, or change labels.

Use a Gmail search query when label-only receive is not precise enough:

```bash
mailatlas receive \
  --query 'newer_than:7d' \
  --limit 25
```

Run foreground polling:

```bash
mailatlas receive watch \
  --provider gmail \
  --label INBOX \
  --interval 60
```

Inspect local receive state:

```bash
mailatlas receive status
```

The status output includes configured receive accounts, cursor state, recent runs, and the last error.

## Send a test email

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail API test" \
  --text "Sent with Gmail API OAuth."
```

Use `--idempotency-key` when repeating tests so retries return the existing outbound record instead of sending another message:

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail API test" \
  --text "Sent with Gmail API OAuth." \
  --idempotency-key gmail-api-test-1
```

## Token storage

For local CLI usage, prefer the operating system keychain:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --token-store keychain
```

`--token-store auto` is the default. It uses keychain storage when the optional dependency is available, then falls back to a token file.

Without keychain storage, MailAtlas stores Gmail OAuth tokens outside the workspace:

| Platform | Default token file |
| --- | --- |
| macOS | `~/Library/Application Support/MailAtlas/gmail-token.json` |
| Linux and other Unix-like systems | `~/.config/mailatlas/gmail-token.json` |

Force file storage:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --token-store file
```

Use an explicit token path for tests:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --token-file /tmp/mailatlas-gmail-token.json
```

Then send with that token file:

```bash
mailatlas send \
  --provider gmail \
  --gmail-token-file /tmp/mailatlas-gmail-token.json \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail token-file test" \
  --text "Sent with a test token file."
```

Receive with that token file:

```bash
mailatlas receive \
  --token-file /tmp/mailatlas-gmail-token.json \
  --label INBOX \
  --limit 10
```

`--token-file` and `--gmail-token-file` always use the explicit file path. This keeps throwaway local tests easy to inspect and delete.

`MAILATLAS_GMAIL_TOKEN_FILE` also selects a file store when no token store is passed explicitly.

## Backend applications

Backend applications should:

1. Store Gmail refresh tokens in their own encrypted credential store.
2. Refresh tokens in the backend.
3. Pass a short-lived access token to MailAtlas.
4. Avoid relying on the local CLI token store.

Python example:

```python
from mailatlas import MailAtlas, OutboundMessage, ReceiveConfig, SendConfig

atlas = MailAtlas()

receive_result = atlas.receive(
    ReceiveConfig(
        gmail_access_token="ya29...",
        gmail_label="INBOX",
        limit=50,
    )
)

result = atlas.send_email(
    OutboundMessage(
        from_email="user@gmail.com",
        to=("recipient@example.com",),
        subject="Gmail API test",
        text="Sent with a backend-managed access token.",
    ),
    SendConfig(
        provider="gmail",
        gmail_access_token="ya29...",
    ),
)
```

## BCC behavior

MailAtlas keeps local outbound raw snapshots free of `Bcc` headers.

Gmail API sends use a provider-only transient MIME payload that includes BCC for Gmail delivery while preserving the Bcc-free local audit snapshot.

## Troubleshooting

### Auth fails before the browser opens

Confirm `--client-id` is set or `MAILATLAS_GMAIL_CLIENT_ID` is exported.

### Google rejects the redirect

Use an OAuth desktop client and rerun `mailatlas auth gmail`.

### `--token-store keychain` fails before auth starts

Install `mailatlas[keychain]` or use `--token-store file` for a local test.

### Send fails because of the From address

Use the authenticated Gmail address or a Gmail send-as alias configured in Gmail.

### Receive fails because the token is send-only

Run `mailatlas auth gmail --capability receive` or `mailatlas auth gmail --capability send,receive`, then try `mailatlas receive` again.

### Receive reports `cursor_reset_required`

Gmail no longer accepts the stored history cursor. Run an explicit full sync:

```bash
mailatlas receive --label INBOX --limit 50 --full-sync
```

### You previously used SMTP app passwords

After moving to Gmail API OAuth, revoke old app passwords that are no longer needed.
