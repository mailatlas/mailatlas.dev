---
title: "Example: Gmail OAuth Send"
description: Authorize Gmail API OAuth locally, send a test message with MailAtlas, and keep a local outbound audit record.
slug: docs/examples/gmail-oauth-send
---

This example shows the local Gmail API send path.

Use it when you want MailAtlas to send from a personal Gmail address or Gmail-configured send-as alias with the `gmail.send` OAuth scope.

## Authorize Gmail locally

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com
```

Check status:

```bash
mailatlas auth status gmail
```

## Send a dry run first

```bash
mailatlas send \
  --provider gmail \
  --dry-run \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail dry run" \
  --text "Rendered locally without contacting Gmail."
```

## Send through Gmail API

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "MailAtlas Gmail API test" \
  --text "Sent with Gmail API OAuth." \
  --idempotency-key gmail-api-test-1
```

The idempotency key makes retries return the existing outbound record instead of sending a duplicate message.

## Cleanup

```bash
mailatlas auth logout gmail
```

## Next step

- Use [Gmail Provider](/docs/providers/gmail/) for token storage details.
- Use [Outbound Email](/docs/providers/outbound-email/) for provider behavior and BCC handling.
