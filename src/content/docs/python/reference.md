---
title: API Reference
description: Reference MailAtlas Python classes and functions including parse_eml, MailAtlas, ParserConfig, ReceiveConfig, OutboundMessage, OutboundAttachment, SendConfig, ReceiveResult, and SendResult.
slug: docs/python/reference
---

This is a compact reference for the public Python entry points currently exposed by MailAtlas. The API is alpha; confirm signatures against the installed package before depending on them in long-lived application code.

## `parse_eml`

```python
parse_eml(path: str | Path, parser_config: ParserConfig | None = None) -> NormalizedDocument
```

Parses one `.eml` file and returns a normalized document in memory. It does not create the full workspace layout.

## `MailAtlas`

```python
MailAtlas(
    db_path: str | Path = ".mailatlas/store.db",
    workspace_path: str | Path = ".mailatlas",
    parser_config: ParserConfig | None = None,
)
```

Creates a storage-backed MailAtlas object.

Common methods:

- `parse_eml(path, parser_config=None)`
- `ingest_eml(paths, parser_config=None)`
- `ingest_mbox(path, parser_config=None)`
- `receive(config)`
- `receive_status(account_id=None)`
- `list_receive_accounts()`
- `list_receive_runs(account_id=None, limit=20)`
- `get_document(document_id)`
- `list_documents(query=None)`
- `export_document(document_id, format="json", out_path=None)`
- `draft_email(message)`
- `send_email(message, config)`
- `list_outbound(query=None)`
- `get_outbound(outbound_id)`

## `ParserConfig`

```python
ParserConfig(
    strip_forwarded_headers=True,
    strip_boilerplate=True,
    strip_link_only_lines=True,
    stop_at_footer=True,
    strip_invisible_chars=True,
    normalize_whitespace=True,
)
```

Controls parser cleaning for file ingest, mailbox receive, and parse-only calls.

## `ReceiveConfig`

```python
ReceiveConfig(
    provider: str = "gmail",
    account_id: str | None = None,
    gmail_access_token: str | None = None,
    gmail_api_base: str | None = None,
    gmail_user_id: str = "me",
    gmail_label: str = "INBOX",
    gmail_query: str | None = None,
    gmail_include_spam_trash: bool = False,
    token_store: str | None = None,
    token_file: str | None = None,
    limit: int = 50,
    full_sync: bool = False,
    imap_host: str | None = None,
    imap_port: int = 993,
    imap_username: str | None = None,
    imap_auth: str | None = None,
    imap_password: str | None = None,
    imap_access_token: str | None = None,
    imap_folders: tuple[str, ...] = ("INBOX",),
    parser_config: ParserConfig = ParserConfig(),
)
```

Use `ReceiveConfig` with `atlas.receive(...)` for one bounded Gmail or IMAP receive pass. `limit` must be between `1` and `500`.

## `ReceiveResult`

```python
ReceiveResult(
    status: str,
    provider: str,
    account_id: str,
    fetched_count: int,
    ingested_count: int,
    duplicate_count: int,
    error_count: int,
    document_ids: tuple[str, ...],
    cursor: dict[str, object],
    run_id: str,
    error: str | None = None,
    details: dict[str, object] = {},
)
```

Returned by `atlas.receive(...)`. `details` is included when the provider exposes structured run details, such as IMAP per-folder results.

## `ReceiveAccount`, `ReceiveCursor`, and `ReceiveRun`

These dataclasses represent local receive status records from `list_receive_accounts(...)`, stored cursor state, and `list_receive_runs(...)`.

## `OutboundAttachment`

```python
OutboundAttachment(
    path: str | Path,
    filename: str | None = None,
    mime_type: str | None = None,
)
```

Describes one outbound attachment.

## `OutboundMessage`

```python
OutboundMessage(
    from_email: str,
    to: tuple[str, ...],
    subject: str,
    text: str | None = None,
    html: str | None = None,
    from_name: str | None = None,
    cc: tuple[str, ...] = (),
    bcc: tuple[str, ...] = (),
    reply_to: tuple[str, ...] = (),
    in_reply_to: str | None = None,
    references: tuple[str, ...] = (),
    headers: dict[str, str] = {},
    attachments: tuple[OutboundAttachment, ...] = (),
    source_document_id: str | None = None,
    idempotency_key: str | None = None,
)
```

Describes an outbound draft, dry run, or provider send.

## `SendConfig`

```python
SendConfig(
    provider: str,
    dry_run: bool = False,
    smtp_host: str | None = None,
    smtp_port: int = 587,
    smtp_username: str | None = None,
    smtp_password: str | None = None,
    smtp_starttls: bool = True,
    smtp_ssl: bool = False,
    cloudflare_account_id: str | None = None,
    cloudflare_api_token: str | None = None,
    cloudflare_api_base: str | None = None,
    gmail_access_token: str | None = None,
    gmail_api_base: str | None = None,
    gmail_user_id: str = "me",
)
```

Supported providers are `smtp`, `cloudflare`, and `gmail`.

## `SendResult`

```python
SendResult(
    id: str,
    status: str,
    provider: str,
    provider_message_id: str | None = None,
    error: str | None = None,
)
```

Returned by `draft_email(...)` and `send_email(...)`.

## Next step

- Use [Python API](/docs/python/overview/) for task-based examples.
- Use [Outbound Email](/docs/providers/outbound-email/) for provider behavior.
- Use [Document Schema](/docs/concepts/document-schema/) for stored document fields.
