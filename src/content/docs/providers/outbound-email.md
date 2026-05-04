---
title: Outbound Email
description: Compose, render, store, and send email with MailAtlas. Use dry runs, SMTP, Cloudflare Email Service, or Gmail API OAuth while keeping sent messages in the email workspace.
slug: docs/providers/outbound-email
---

MailAtlas can compose, render, store, and send email through providers you configure. Use this workflow when your application or agent needs sent messages to live in the same email workspace as received messages.

Send uses the same workspace model as receive and ingest: MailAtlas writes inspectable artifacts first, then contacts the provider unless the message is a dry run.

For deliverability operations such as reputation, suppression lists, campaign analytics, bounce processing, or provider account management, use the email provider or deliverability platform that MailAtlas sends through.

Every sent or drafted message gets a local record before provider delivery. That record can include:

- A rendered raw `.eml` snapshot.
- Plain-text body files.
- HTML body files.
- Copied attachments.
- Recipient metadata.
- BCC recipient metadata in SQLite.
- Provider name.
- Status.
- Error details.
- Retry metadata.
- Provider response metadata.

Configure provider credentials through environment variables, CLI flags, Python config, or the Gmail auth helper. MailAtlas uses those credentials for the send command that needs them.

## Start with a dry run

Use `--dry-run` to verify rendering, validation, attachments, and local storage without contacting a provider:

```bash
mailatlas send \
  --dry-run \
  --from agent@example.com \
  --to user@example.com \
  --subject "Build complete" \
  --text "The build passed."
```

The command prints JSON with the sent-message record ID and stores rendered files under `outbound/` in the email workspace.

Use dry runs when testing message rendering, generated content, attachments, headers, review workflows, or provider setup.

## Provider choice

Choose a provider with `--provider` or `MAILATLAS_SEND_PROVIDER`.

| Provider | Use it when | Credentials |
| --- | --- | --- |
| `smtp` | You already have an SMTP relay or local mail test server. | SMTP host, optional username and password. |
| `cloudflare` | You use Cloudflare Email Service for API-based sending. | Cloudflare account ID and API token. |
| `gmail` | You want to send from a personal Gmail address or Gmail send-as alias. | Gmail API OAuth token with the `gmail.send` scope. |

## SMTP

```bash
export MAILATLAS_SEND_PROVIDER=smtp
export MAILATLAS_SMTP_HOST=smtp.example.com
export MAILATLAS_SMTP_USERNAME=agent@example.com
export MAILATLAS_SMTP_PASSWORD=app-password

mailatlas send \
  --from agent@example.com \
  --to user@example.com \
  --subject "SMTP test" \
  --text "Sent through SMTP."
```

Useful SMTP variables:

- `MAILATLAS_SMTP_HOST`
- `MAILATLAS_SMTP_PORT`
- `MAILATLAS_SMTP_USERNAME`
- `MAILATLAS_SMTP_PASSWORD`
- `MAILATLAS_SMTP_STARTTLS`
- `MAILATLAS_SMTP_SSL`

For Gmail addresses, SMTP app passwords are a compatibility path. Prefer the Gmail provider when OAuth is available.

## Cloudflare Email Service

```bash
export MAILATLAS_SEND_PROVIDER=cloudflare
export MAILATLAS_CLOUDFLARE_ACCOUNT_ID=your-account-id
export MAILATLAS_CLOUDFLARE_API_TOKEN=your-api-token

mailatlas send \
  --from agent@example.com \
  --to user@example.com \
  --subject "Cloudflare test" \
  --text "Sent through Cloudflare Email Service."
```

Useful Cloudflare variables:

- `MAILATLAS_CLOUDFLARE_ACCOUNT_ID`
- `MAILATLAS_CLOUDFLARE_API_TOKEN`
- `MAILATLAS_CLOUDFLARE_API_BASE`

Use the Cloudflare API base override only for tests or provider-compatible gateways.

## Gmail API OAuth

Use the Gmail provider for personal Gmail addresses and Gmail-configured send-as aliases:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com

mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "Gmail API test" \
  --text "Sent with Gmail API OAuth."
```

MailAtlas requests only the `https://www.googleapis.com/auth/gmail.send` scope by default.

For backend applications, store Gmail refresh tokens in your own encrypted credential store and pass short-lived access tokens to MailAtlas at send time.

## Attachments and headers

```bash
mailatlas send \
  --from agent@example.com \
  --to user@example.com \
  --subject "Report" \
  --text-file report-summary.txt \
  --attach report.pdf \
  --header "X-Campaign-ID: weekly"
```

MailAtlas validates sender and recipient fields, rejects CR/LF header injection, and fails if an attachment path is missing.

## BCC behavior

BCC recipients are included in provider delivery and stored in SQLite for explicit detail views. They are omitted from local raw MIME snapshots.

Provider behavior:

- SMTP sends BCC through the SMTP envelope.
- Cloudflare sends BCC through the provider payload.
- Gmail API sends use a provider-only transient MIME payload that includes BCC for delivery while keeping the saved local raw snapshot Bcc-free.

Default list views omit BCC recipients. Use explicit detail views when BCC visibility is required.

## Idempotency

Use an idempotency key when retrying a send command from scripts:

```bash
mailatlas send \
  --provider gmail \
  --from user@gmail.com \
  --to user@gmail.com \
  --subject "Retry-safe test" \
  --text "This command can be retried." \
  --idempotency-key gmail-api-test-1
```

If the same key already exists, MailAtlas returns the existing sent-message record instead of sending a second message.

## Status lifecycle

| Status | Meaning |
| --- | --- |
| `draft` | Message was rendered and stored as a local draft. |
| `dry_run` | Message was rendered and stored without contacting a provider. |
| `sending` | Message is in the process of being sent. |
| `sent` | Provider accepted the send request. |
| `queued` | Provider accepted or queued the message but final delivery is not known. |
| `error` | Provider send or validation failed. |

## Python API

```python
from mailatlas import MailAtlas, OutboundMessage, SendConfig

atlas = MailAtlas()

result = atlas.send_email(
    OutboundMessage(
        from_email="agent@example.com",
        to=("user@example.com",),
        subject="Build complete",
        text="The build passed.",
        idempotency_key="build-123",
    ),
    SendConfig(provider="smtp", dry_run=True),
)
```

## Troubleshooting

### Dry run succeeds but send fails

Check provider configuration and credentials. A dry run validates local rendering but does not verify provider authentication.

### Attachment fails

Confirm the attachment path exists and is readable from the current working directory.

### Gmail From address fails

Use the authenticated Gmail address or a Gmail send-as alias configured in Gmail.

### Duplicate send avoided

If you reuse an idempotency key, MailAtlas returns the existing sent-message record instead of sending again. Use a new key only when you intentionally want a new send.
