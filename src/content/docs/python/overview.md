---
title: Python API
description: Embed MailAtlas in Python applications. Parse email without storage, use a storage-backed MailAtlas instance, receive Gmail or IMAP messages, export documents, and send email through configured providers.
slug: docs/python/overview
---

Use the Python API when you want MailAtlas inside an application, worker, notebook, test suite, or pipeline.

Use `parse_eml(...)` for parse-only experiments. Use `MailAtlas(...)` when you want storage-backed ingest, mailbox receive, document lookup, export, outbound drafts, and provider sends.

MailAtlas is currently alpha. Confirm exact method signatures against the installed version before depending on them in production.

## Main entry points

```python
from mailatlas import (
    MailAtlas,
    OutboundAttachment,
    OutboundMessage,
    ParserConfig,
    ReceiveConfig,
    SendConfig,
    parse_eml,
)
```

Use:

- `parse_eml(...)` when you want one normalized document in memory.
- `MailAtlas(...)` when you want a configured storage-backed object.
- `ParserConfig(...)` when you need to tune parser cleaning.
- `ReceiveConfig(...)` when you need a bounded Gmail or IMAP receive pass.
- `OutboundMessage(...)` and `SendConfig(...)` when you need outbound drafts, dry runs, or provider sends.

## Parse without storage

```python
from mailatlas import ParserConfig, parse_eml

document = parse_eml(
    "sample-data/fixtures/eml/atlas-founder-forward.eml",
    parser_config=ParserConfig(
        strip_boilerplate=True,
        stop_at_footer=True,
    ),
)

print(document.subject)
print(document.body_text)
```

Parse-only mode does not create the full workspace layout.

## Use storage-backed MailAtlas

```python
from mailatlas import MailAtlas, ParserConfig

atlas = MailAtlas(
    db_path=".mailatlas/store.db",
    workspace_path=".mailatlas",
    parser_config=ParserConfig(
        strip_boilerplate=True,
        stop_at_footer=True,
    ),
)
```

## Ingest `.eml` files

```python
refs = atlas.ingest_eml([
    "sample-data/fixtures/eml/atlas-market-map.eml",
    "sample-data/fixtures/eml/atlas-inline-chart.eml",
])

for ref in refs:
    print(ref.id, ref.subject)
```

## Ingest an `mbox` file

```python
refs = atlas.ingest_mbox("sample-data/fixtures/mbox/atlas-demo.mbox")
```

Use `ingest_mbox(...)` when you already have a mailbox archive on disk. Use `receive(...)` with `provider="imap"` when messages still live in a mailbox and MailAtlas should fetch them over IMAP.

## IMAP receive

```python
from mailatlas import ReceiveConfig

imap_result = atlas.receive(
    ReceiveConfig(
        provider="imap",
        imap_host="imap.example.com",
        imap_username="user@example.com",
        imap_access_token="oauth-access-token",
        imap_folders=("INBOX", "Newsletters"),
    )
)
```

Use `ReceiveConfig(provider="imap", ...)` when you want MailAtlas to connect to an IMAP mailbox over TLS, fetch folders incrementally, and store only non-secret cursor state in SQLite.

Treat MailAtlas as the OAuth consumer, not the OAuth client. Your application should obtain and refresh the access token, then pass it into `ReceiveConfig(provider="imap", imap_access_token=...)`.

## Gmail receive

```python
from mailatlas import MailAtlas, ReceiveConfig

atlas = MailAtlas()

result = atlas.receive(
    ReceiveConfig(
        gmail_access_token="ya29...",
        gmail_label="INBOX",
        limit=50,
    )
)

print(result.status)
print(result.document_ids)
```

Use `ReceiveConfig(...)` when you want MailAtlas to call the Gmail API, decode raw messages, and store them in the local workspace. Gmail receive is read-only: it does not mark Gmail messages read, archive them, delete them, or change labels.

Backend applications should store Gmail refresh tokens in their own encrypted credential store, refresh them outside MailAtlas, and pass short-lived access tokens through `ReceiveConfig(gmail_access_token=...)`.

Inspect receive state:

```python
status = atlas.receive_status()
accounts = atlas.list_receive_accounts()
runs = atlas.list_receive_runs(limit=10)
```

## Export documents

```python
pdf_path = atlas.export_document(
    refs[0].id,
    format="pdf",
)
```

Use `format="json"`, `format="markdown"`, `format="html"`, or `format="pdf"` depending on the output you need. `export_document(...)` returns a string. For file-writing exports, the string is the resolved output path.

## Outbound dry run

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

A dry run validates, renders, and stores the sent-message record without contacting a provider.

## Send through SMTP

```python
from mailatlas import MailAtlas, OutboundAttachment, OutboundMessage, SendConfig

atlas = MailAtlas()

result = atlas.send_email(
    OutboundMessage(
        from_email="agent@example.com",
        from_name="Build Agent",
        to=("user@example.com",),
        cc=("observer@example.com",),
        bcc=("audit@example.com",),
        subject="Report",
        text="Report attached.",
        attachments=(OutboundAttachment("report.pdf"),),
        idempotency_key="report-2026-04-18",
    ),
    SendConfig(
        provider="smtp",
        smtp_host="smtp.example.com",
        smtp_username="agent@example.com",
        smtp_password="app-password",
    ),
)
```

MailAtlas validates sender and recipient addresses, rejects header injection, copies attachments into the sent-message area, and omits BCC from local raw MIME snapshots while preserving BCC in SQLite for explicit detail views.

## Send through Gmail API

```python
from mailatlas import MailAtlas, OutboundMessage, SendConfig

atlas = MailAtlas()

result = atlas.send_email(
    OutboundMessage(
        from_email="user@gmail.com",
        to=("user@gmail.com",),
        subject="Gmail API test",
        text="Sent with Gmail API OAuth.",
    ),
    SendConfig(
        provider="gmail",
        gmail_access_token="ya29...",
    ),
)
```

Backend applications should store refresh tokens in their own encrypted credential store and pass fresh access tokens directly through `SendConfig`.

## What methods return

| Method | Returns |
| --- | --- |
| `parse_eml(...)` | One normalized document in memory. |
| `ingest_eml(...)` | Document refs with IDs you can store or export later. |
| `ingest_mbox(...)` | Document refs for messages ingested from the mailbox archive. |
| `receive(...)` | Gmail or IMAP receive counts, document IDs, cursor state, run ID, and provider details. |
| `receive_status(...)` | Local receive accounts, cursors, recent runs, and last error. |
| `list_receive_accounts(...)` | Configured local receive account records. |
| `list_receive_runs(...)` | Recent receive run records. |
| `export_document(...)` | Exported content or an output path string depending on the format and destination. |
| `draft_email(...)` | A stored local outbound draft and rendered `.eml` snapshot. |
| `send_email(...)` | A local outbound attempt, provider result unless dry run, and a `SendResult`. |
| `list_outbound(...)` | Sent-message and draft records. |
| `get_outbound(...)` | One sent-message or draft record. |

## Error handling

MailAtlas currently raises standard Python exceptions for many validation and local IO failures, including `ValueError` for configuration validation. Provider-specific and export-specific exception categories may become more formal as the API stabilizes.
