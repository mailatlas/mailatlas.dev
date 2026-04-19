---
title: Gmail Provider
description: Send from Gmail with Gmail API OAuth instead of SMTP app passwords.
slug: docs/providers/gmail
---

Use the Gmail provider when you want to send from a personal Gmail address or a Gmail-configured
send-as alias. MailAtlas uses the Gmail API with OAuth and the
`https://www.googleapis.com/auth/gmail.send` scope.

This is the recommended Gmail path. SMTP app passwords still work through `--provider smtp`, but
they are a compatibility option for local testing, not the preferred integration.

## What you need

- a Google OAuth desktop client id
- a Google OAuth client secret if Google issued one for that client
- the Gmail address you want to send from

Create the OAuth client in Google Cloud Console:

1. Create or select a Google Cloud project.
2. Enable the Gmail API for that project.
3. Configure the OAuth consent screen. For a personal Gmail test, choose an external app and add
   your Gmail address as a test user while the app is in testing mode.
4. Open **APIs & Services** > **Credentials**.
5. Create an OAuth client ID with application type **Desktop app**.
6. Copy the client ID and client secret.

Then run:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com
```

MailAtlas opens a browser, asks Google for the `gmail.send` scope, receives the OAuth callback on
`127.0.0.1`, and stores the resulting token outside the MailAtlas workspace. It does not write Gmail
OAuth tokens to `store.db`, raw snapshots, logs, or JSON send results.

Check local status:

```bash
mailatlas auth status gmail
```

Remove local Gmail auth:

```bash
mailatlas auth logout gmail
```

## Send a test email

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail API test" \
  --text "Sent with Gmail API OAuth."
```

For a runnable example, see
[`mailatlas/examples/gmail-oauth-send`](https://github.com/mailatlas/examples/tree/main/gmail-oauth-send).

Use `--idempotency-key` when repeating tests so retries return the existing outbound record instead
of sending another message.

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail API test" \
  --text "Sent with Gmail API OAuth." \
  --idempotency-key gmail-api-test-1
```

## Token file

By default, MailAtlas stores Gmail OAuth tokens outside the workspace:

- macOS: `~/Library/Application Support/MailAtlas/gmail-token.json`
- Linux and other Unix-like systems: `~/.config/mailatlas/gmail-token.json`

For tests, use an explicit token path:

```bash
mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --token-file /tmp/mailatlas-gmail-token.json
```

Then send with the same token file:

```bash
mailatlas send \
  --provider gmail \
  --gmail-token-file /tmp/mailatlas-gmail-token.json \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail token-file test" \
  --text "Sent with a test token file."
```

## BCC behavior

MailAtlas keeps local outbound raw snapshots free of `Bcc` headers. Gmail API sends use a
provider-only transient MIME payload that includes `Bcc` for Gmail delivery while preserving the
Bcc-free local audit snapshot.

## Troubleshooting

- If auth fails before the browser opens, confirm `--client-id` is set.
- If Google rejects the redirect, use an OAuth desktop client and rerun `mailatlas auth gmail`.
- If send fails because of the From address, use the authenticated Gmail address or a Gmail
  send-as alias configured in Gmail.
- If you used SMTP app passwords for earlier tests, revoke those app passwords after you move to
  Gmail API OAuth.
