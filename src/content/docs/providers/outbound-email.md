---
title: Outbound Email
description: Send email through SMTP, Cloudflare Email Service, or Gmail API OAuth while keeping a local audit trail.
slug: docs/providers/outbound-email
---

MailAtlas can compose, render, store, and send outbound email through providers you configure at
runtime. Use this path when your application needs a local audit record for messages it sends, but
does not need MailAtlas to act as a hosted deliverability service.

Every outbound message gets a local record before provider delivery:

- a rendered raw `.eml` snapshot
- plain-text and HTML body files when present
- copied attachments
- recipient, BCC, provider, status, error, and retry metadata in SQLite
- provider response metadata without provider secrets or OAuth tokens

## Start with a dry run

Use `--dry-run` when you want to verify rendering, validation, attachments, and local storage
without contacting a provider:

```bash
mailatlas send \
  --dry-run \
  --from agent@example.com \
  --to user@example.com \
  --subject "Build complete" \
  --text "The build passed."
```

The command prints JSON with the outbound record ID and stores the rendered files under
`outbound/` in the MailAtlas root.

## Provider choice

Choose a provider with `--provider` or `MAILATLAS_SEND_PROVIDER`.

| Provider | Use it when | Credentials |
| --- | --- | --- |
| `smtp` | You already have an SMTP relay or local mail test server. | SMTP host, optional username and password. |
| `cloudflare` | You use Cloudflare Email Service for API-based sending. | Cloudflare account ID and API token. |
| `gmail` | You want to send from a personal Gmail address or Gmail send-as alias. | Gmail API OAuth token with the `gmail.send` scope. |

Provider credentials are read from flags, environment variables, Python config, or the Gmail token
store at runtime. MailAtlas does not write SMTP passwords, Cloudflare API tokens, Gmail access
tokens, or Gmail refresh tokens into `store.db`, raw snapshots, logs, or JSON send results.

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

Useful SMTP flags and variables:

- `MAILATLAS_SMTP_HOST`
- `MAILATLAS_SMTP_PORT`
- `MAILATLAS_SMTP_USERNAME`
- `MAILATLAS_SMTP_PASSWORD`
- `MAILATLAS_SMTP_STARTTLS`
- `MAILATLAS_SMTP_SSL`

For Gmail addresses, SMTP app passwords are a compatibility path. Prefer the Gmail provider when
you can use OAuth.

## Cloudflare Email Service

```bash
export MAILATLAS_SEND_PROVIDER=cloudflare
export MAILATLAS_CLOUDFLARE_ACCOUNT_ID=your-account-id
export MAILATLAS_CLOUDFLARE_API_TOKEN=your-api-token

mailatlas send \
  --from sender@example.com \
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

Use the Gmail provider for personal Gmail addresses:

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

MailAtlas requests only the `https://www.googleapis.com/auth/gmail.send` scope. See
[Gmail Provider](/docs/providers/gmail/) for the Google Cloud setup, token-store behavior, and
troubleshooting steps.

For backend applications, store Gmail refresh tokens in your own encrypted credential store and
pass short-lived access tokens to MailAtlas at send time. The local CLI keychain is for local
operator workflows, not multi-user backend credential storage.

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

MailAtlas validates sender and recipient fields, rejects CR/LF header injection, and fails if an
attachment path is missing.

## BCC behavior

BCC recipients are stored in SQLite for audit and are included in provider delivery. They are
omitted from local raw MIME snapshots.

SMTP sends BCC through the SMTP envelope. Cloudflare sends BCC through the provider payload. Gmail
API sends use a provider-only transient MIME payload that includes `Bcc` for delivery while keeping
the saved local raw snapshot Bcc-free.

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

If the same key already exists, MailAtlas returns the existing outbound record instead of sending a
second message.

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

See [Python API](/docs/python/overview/) for the full storage-backed example.
