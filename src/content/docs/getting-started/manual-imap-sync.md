---
title: Read Email with IMAP
description: Connect a live IMAP mailbox, fetch selected folders, and store clean email documents in a MailAtlas workspace for your agent.
slug: docs/getting-started/manual-imap-sync
---

Use IMAP when your agent needs to read email from a live mailbox that supports IMAP. MailAtlas fetches selected folders, cleans each message, and stores it in the email workspace so your agent can query, inspect, and export the email.

If you already have `.eml` files or an `mbox` archive on disk, use [file ingest](/docs/getting-started/quickstart/) instead.

## Before you start

You need:

- MailAtlas installed.
- A mailbox provider with IMAP enabled.
- The IMAP host and mailbox username.
- Either an app password or an OAuth access token.

`INBOX` is the default folder. You can add other folders when you run the receive command.

## Provider setup

IMAP setup depends on the mailbox provider.

For Gmail, confirm whether your account can use IMAP with an app password or whether it needs OAuth. Google has separate docs for [app passwords](https://support.google.com/mail/answer/185833) and [IMAP access for Google Workspace accounts](https://support.google.com/a/answer/12103).

For Microsoft 365 or Outlook.com, OAuth is usually the right path. Microsoft documents [OAuth for IMAP, POP, and SMTP](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth).

For a custom mail server, use the host, port, username, password, and folder names from your provider or mail administrator.

## Set the email workspace

Choose where MailAtlas should store the received email documents and IMAP cursor state:

```bash
export MAILATLAS_HOME=.mailatlas-imap
```

Use the same `MAILATLAS_HOME` for later receives if you want MailAtlas to continue from the previous IMAP cursor.

## Set IMAP credentials

Set the mailbox host and username:

```bash
export MAILATLAS_IMAP_HOST=imap.example.com
export MAILATLAS_IMAP_USERNAME=user@example.com
```

Use password auth when your provider allows IMAP passwords or app passwords:

```bash
export MAILATLAS_IMAP_PASSWORD=app-password
```

Use OAuth token auth when your provider or application stack already obtains an IMAP access token:

```bash
export MAILATLAS_IMAP_ACCESS_TOKEN=oauth-access-token
```

Set either `MAILATLAS_IMAP_PASSWORD` or `MAILATLAS_IMAP_ACCESS_TOKEN`, not both.

MailAtlas can authenticate to IMAP with XOAUTH2, but it does not create or refresh IMAP OAuth tokens for you. Your application, tool, or token broker gets the access token and passes it to MailAtlas.

## Fetch messages once

Fetch a small batch from `INBOX`:

```bash
mailatlas receive --provider imap --folder INBOX --limit 10
```

Fetch multiple folders:

```bash
mailatlas receive \
  --provider imap \
  --folder INBOX \
  --folder Newsletters \
  --limit 25
```

The command prints a JSON summary:

```json
{
  "status": "ok",
  "provider": "imap",
  "fetched_count": 12,
  "ingested_count": 11,
  "duplicate_count": 1,
  "document_ids": ["<document-id>"]
}
```

Use `document_ids[]` with `mailatlas get`.

## Inspect received email

```bash
mailatlas list
mailatlas get <document-id>
mailatlas get <document-id> --format markdown --out ./received-message
```

IMAP messages become MailAtlas documents. Each document keeps the clean body, HTML view, attachments, embedded images, metadata, exports, and source reference together in the email workspace.

For IMAP-received documents, `source_kind` is `imap` and `metadata.source.*` records the mailbox folder and UID that produced the stored document.

## Keep folders current

Run foreground polling when you want MailAtlas to keep checking a folder:

```bash
mailatlas receive watch \
  --provider imap \
  --folder INBOX \
  --interval 60
```

`watch` runs one receive pass immediately, sleeps for the interval, then repeats until you stop it. Use `--max-runs` when a script needs a bounded polling loop.

## How reruns work

MailAtlas stores IMAP cursor state in the email workspace. When you receive from the same workspace again, MailAtlas fetches newer messages when the provider cursor is still valid.

If you use a different `MAILATLAS_HOME` or `--root`, MailAtlas starts a fresh receive history.

If the provider reports changed `UIDVALIDITY`, MailAtlas starts from the beginning of the folder for that cursor because the previous IMAP UIDs can no longer be treated as stable. Existing messages are still deduplicated when possible.

## Clean the received messages

`receive --provider imap` accepts the same message-cleaning flags as file ingest, including:

- `--strip-forwarded-headers`
- `--strip-boilerplate`
- `--strip-link-only-lines`
- `--stop-at-footer`
- `--strip-invisible-chars`
- `--normalize-whitespace`

Use [Parser Cleaning](/docs/config/parser-cleaning/) for behavior and tradeoffs.

## IMAP versus mbox

Use `mailatlas receive --provider imap` when messages are still in a live mailbox and MailAtlas should fetch them over IMAP.

Use `mailatlas ingest path/to/archive.mbox` when you already have a mailbox export on disk.

An `mbox` file is not an IMAP folder. It is a local archive file.

## Troubleshooting

### Authentication fails

Check that only one credential mode is active. Use either password auth or OAuth token auth.

For password auth, confirm your provider allows IMAP app passwords. Gmail and Google Workspace accounts may require OAuth or app-password setup depending on account type and administrator policy.

For OAuth, confirm the access token is valid, not expired, and authorized for IMAP access. Microsoft 365 and Outlook.com use the `https://outlook.office.com/IMAP.AccessAsUser.All` scope for delegated IMAP access.

### IMAP is disabled

Some providers disable IMAP by default or restrict it for managed accounts. Check the provider's mailbox settings or administrator console before changing MailAtlas configuration.

### Folder not found

Confirm the exact folder name with your provider. Some providers use localized names, nested folder paths, or labels that do not match what you see in the web UI.

### Receive returns duplicates

Duplicates can occur when messages already exist in the workspace. MailAtlas deduplicates by `message_id` when present and falls back to a normalized content hash.

### Later runs do not fetch expected messages

Confirm you are using the same `MAILATLAS_HOME` or `--root` as the earlier receive run. IMAP cursor state is stored in the email workspace.

## Next step

- Use [Gmail Receive](/docs/examples/gmail-receive/) if you want MailAtlas to read Gmail through the Gmail API instead of IMAP.
- Use [CLI Overview](/docs/cli/overview/) for the rest of the command surface.
- Use [Document Schema](/docs/concepts/document-schema/) to inspect stored fields.
- Use [Workspace Model](/docs/concepts/workspace-model/) to understand local cursor state.
- Use [Security and Privacy](/docs/product/security-and-privacy/) for storage and sharing guidance.
