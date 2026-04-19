---
title: "Example: Gmail Receive"
description: Authorize Gmail receive access, run one bounded MailAtlas receive pass, inspect stored documents, and review local receive status.
slug: docs/examples/gmail-receive
---

This example shows the local Gmail receive path.

Use it when you want MailAtlas to fetch Gmail messages with a read-only OAuth token and store them as ordinary MailAtlas documents.

## Use a test workspace

Start with a separate workspace when testing against a real mailbox:

```bash
export MAILATLAS_HOME="$PWD/.mailatlas-gmail-test"
```

## Authorize read-only Gmail access

Create a Google OAuth desktop client with the Gmail API enabled, then run:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Check that the local token has receive capability:

```bash
mailatlas auth status gmail
```

The status output should include `receive` in `capabilities`. It should not print access tokens, refresh tokens, client secrets, or authorization codes.

## Run one receive pass

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 10
```

The command prints JSON with counts, document IDs, cursor data, and a run ID.

Expected statuses:

| Status | Meaning |
| --- | --- |
| `ok` | Receive completed. New documents may or may not have been ingested. |
| `duplicate` | All fetched messages already existed in the workspace. |
| `not_configured` | Gmail auth or required config is missing. |
| `cursor_reset_required` | Gmail rejected the stored history cursor. Run an explicit full sync. |
| `partial` | At least one fetched message failed, but some messages were ingested or skipped as duplicates. |
| `error` | Provider or storage work failed before useful progress. |

## Inspect stored email

```bash
mailatlas list
mailatlas get <document-id>
```

Received Gmail documents use the same local storage layout as file ingest and IMAP sync. Raw messages go under `raw/`; HTML and assets are stored when present.

## Inspect receive status

```bash
mailatlas receive status
```

Status output includes:

- configured receive accounts
- Gmail cursor state
- recent receive runs
- the most recent error when one exists

## Recover from a cursor reset

If Gmail reports that the stored history cursor is invalid, run an explicit full sync:

```bash
mailatlas receive \
  --provider gmail \
  --label INBOX \
  --limit 50 \
  --full-sync
```

Full sync may return duplicates if messages are already stored. That is expected.

## Cleanup

Remove local Gmail auth:

```bash
mailatlas auth logout gmail
```

Remove the test workspace when you no longer need it:

```bash
rm -rf "$MAILATLAS_HOME"
```

## Next step

- Use [Gmail Receive Watch](/docs/examples/gmail-receive-watch/) for foreground polling.
- Use [Gmail Provider](/docs/providers/gmail/) for token storage and capability details.
- Use [Security and Privacy](/docs/marketing/security-and-privacy/) before using a real mailbox workspace.
