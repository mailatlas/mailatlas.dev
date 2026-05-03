---
title: IMAP Receive
description: Receive selected IMAP folders into a local MailAtlas workspace. Configure password or OAuth token authentication, run one-shot receive, run foreground polling, inspect results, and understand incremental cursor behavior.
slug: docs/getting-started/manual-imap-sync
---

Use IMAP receive when messages are still in a live mailbox and you want MailAtlas to fetch selected folders into a local workspace.

If you already have `.eml` files or an `mbox` file on disk, use file ingest instead.

The canonical live-mailbox command is `mailatlas receive`. Use `--provider imap` for IMAP. Run `mailatlas receive watch --provider imap` when you want a foreground polling process, or run one bounded pass when you want a manual backfill or script step. MailAtlas stores per-folder IMAP cursors in SQLite so later runs can continue incrementally when possible.

## Before you start

You need:

- A working MailAtlas install.
- An IMAP host.
- A mailbox username.
- One credential type: password or OAuth access token.
- One or more folder names to receive. `INBOX` is the default.
- A workspace root where MailAtlas can store documents and cursor state.

MailAtlas does not persist mailbox passwords or OAuth access tokens in the workspace.

## Choose an auth mode

### Password auth

Use password auth when your provider allows IMAP passwords or app passwords.

```bash
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_PASSWORD=app-password
```

### OAuth token auth

Use OAuth token auth when your provider or application stack already uses OAuth.

```bash
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token
```

MailAtlas is OAuth-compatible, but it is not your IMAP OAuth client. The intended setup is:

1. Your application, tool, or token broker obtains an access token.
2. You pass the access token to MailAtlas at runtime.
3. MailAtlas uses XOAUTH2 to authenticate the IMAP session.
4. Your application remains responsible for login UX, consent, token refresh, and secure token storage.

## Keep folders current

Run foreground polling for the default folder:

```bash
mailatlas receive watch --provider imap
```

Run foreground polling for specific folders:

```bash
mailatlas receive watch \
  --provider imap \
  --folder INBOX \
  --folder Newsletters \
  --interval 60
```

`watch` runs one receive pass immediately, sleeps for the interval, then repeats until you stop it. Use `--max-runs` when a script needs a bounded polling loop.

## Run one bounded pass

Receive the default folder once:

```bash
mailatlas receive --provider imap
```

Receive specific folders once:

```bash
mailatlas receive \
  --provider imap \
  --folder INBOX \
  --folder Newsletters
```

Command-line credential overrides are available for local tests or controlled scripts:

```bash
mailatlas receive --provider imap --folder INBOX --password "$MAILATLAS_IMAP_PASSWORD"
mailatlas receive --provider imap --folder INBOX --access-token "$MAILATLAS_IMAP_ACCESS_TOKEN"
```

## Read the receive summary

`receive --provider imap` prints one JSON object summarizing the run, local receive account, cursor, and folder details:

```json
{
  "status": "ok",
  "provider": "imap",
  "account_id": "imap:user@example.com:imap.example.com:INBOX",
  "fetched_count": 12,
  "ingested_count": 11,
  "duplicate_count": 1,
  "error_count": 0,
  "document_ids": ["<document-id>"],
  "cursor": {
    "host": "imap.example.com",
    "port": 993,
    "username": "user@example.com",
    "folders": [
      {
        "folder": "INBOX",
        "status": "ok",
        "uidvalidity": "11",
        "last_uid": 4812,
        "error": null
      }
    ]
  },
  "run_id": "<run-id>",
  "error": null,
  "details": {
    "status": "ok",
    "folder_count": 1,
    "folders": [
      {
        "folder": "INBOX",
        "status": "ok",
        "fetched_count": 12,
        "ingested_count": 11,
        "duplicate_count": 1,
        "document_refs": [
          {
            "id": "<document-id>",
            "subject": "Daily market digest",
            "source_kind": "imap",
            "created_at": "<timestamp>"
          }
        ],
        "error": null
      }
    ]
  }
}
```

Use `document_ids[]` with `mailatlas get`.

## Inspect received documents

```bash
mailatlas list
mailatlas get <document-id>
mailatlas get <document-id> --format markdown --out ./received-message
```

For IMAP-received documents, `source_kind` is `imap` and `metadata.source.*` records the mailbox folder and UID that produced the stored document.

## Incremental reruns

When you receive from the same workspace root, MailAtlas uses stored IMAP cursor state to fetch only newer messages when possible.

If you point the command at a different workspace root, MailAtlas starts a fresh receive history.

When a provider reports changed `UIDVALIDITY`, MailAtlas starts from the beginning of the folder for that cursor because previous UIDs can no longer be treated as stable.

## Parser cleaning during IMAP receive

`receive --provider imap` accepts the same parser-cleaning flags as file ingest, including:

- `--strip-forwarded-headers`
- `--strip-boilerplate`
- `--strip-link-only-lines`
- `--stop-at-footer`
- `--strip-invisible-chars`
- `--normalize-whitespace`

Use [Parser Cleaning](/docs/config/parser-cleaning/) for behavior and tradeoffs.

## IMAP Receive Versus Mbox Ingest

Use `mailatlas receive --provider imap` when messages are still in a live mailbox and MailAtlas should fetch them over IMAP.

Use `mailatlas ingest path/to/archive.mbox` when you already have a mailbox export on disk.

An `mbox` file is not an IMAP folder. It is a local file format.

## Troubleshooting

### Authentication fails

Check that only one credential mode is active. Use either password auth or OAuth token auth.

For password auth, confirm your provider allows IMAP app passwords.

For OAuth, confirm the access token is valid, not expired, and authorized for IMAP access.

### Folder not found

Confirm the exact folder name with your provider. Some providers use localized or nested folder names.

### Receive returns duplicates

Duplicates can occur when messages already exist in the workspace. MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash.

### Later runs do not fetch expected messages

Confirm you are using the same `MAILATLAS_HOME` or `--root` as the earlier receive run. IMAP cursor state is stored per workspace.

## Next step

- Use [CLI Overview](/docs/cli/overview/) for the rest of the command surface.
- Use [Document Schema](/docs/concepts/document-schema/) to inspect stored fields.
- Use [Workspace Model](/docs/concepts/workspace-model/) to understand local cursor state.
- Use [Security and Privacy](/docs/product/security-and-privacy/) for storage and sharing guidance.
