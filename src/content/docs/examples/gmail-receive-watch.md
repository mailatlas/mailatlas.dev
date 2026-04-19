---
title: "Example: Gmail Receive Watch"
description: Run MailAtlas Gmail receive as a foreground polling process, inspect JSON-line run output, and stop safely.
slug: docs/examples/gmail-receive-watch
---

This example shows foreground Gmail receive polling.

Use `mailatlas receive watch` when you want a local workspace to stay current while a shell, process supervisor, launchd job, systemd user service, or MCP server process is running.

MailAtlas does not install a hidden daemon. Watch mode is a foreground process.

## Prepare Gmail receive auth

Authorize receive access first:

```bash
python -m pip install "mailatlas[keychain]"

mailatlas auth gmail \
  --client-id "$MAILATLAS_GMAIL_CLIENT_ID" \
  --client-secret "$MAILATLAS_GMAIL_CLIENT_SECRET" \
  --email user@gmail.com \
  --capability receive
```

Use `--capability send,receive` only when the same local token should also support Gmail sends.

## Run two test passes

Use `--max-runs` while testing:

```bash
mailatlas receive watch \
  --provider gmail \
  --label INBOX \
  --interval 60 \
  --max-runs 2
```

The command prints one compact JSON object per run:

```json
{"status":"ok","provider":"gmail","account_id":"gmail:user@gmail.com:INBOX","fetched_count":3,"ingested_count":2,"duplicate_count":1,"error_count":0,"document_ids":["..."],"cursor":{"history_id":"123456"},"run_id":"...","error":null}
```

## Run continuously

Omit `--max-runs` for a foreground loop:

```bash
mailatlas receive watch \
  --provider gmail \
  --label INBOX \
  --interval 60
```

Stop it with `Ctrl-C` or with the process manager that started it.

## Use a query

```bash
mailatlas receive watch \
  --query 'newer_than:7d' \
  --interval 120
```

Queries are useful when a label is too broad. Keep the query stable for a receive account so cursor and run history remain easy to interpret.

## Inspect state after watch mode

```bash
mailatlas receive status
mailatlas list
```

Use `receive status` to see recent run counts and errors. Use `list` to inspect documents created by watch mode.

## Operational notes

- Watch mode runs one receive pass immediately on startup.
- `--interval` must be a positive integer.
- `--max-runs` is useful for tests and scheduled jobs.
- Provider errors use bounded backoff before the next pass.
- Receive is read-only and does not mutate the Gmail mailbox.
- Treat the workspace as private email data.

## Next step

- Use [Gmail Receive](/docs/examples/gmail-receive/) for one-shot receive.
- Use [MCP Server](/docs/mcp/overview/) if an MCP client should trigger receive behind an explicit gate.
- Use [Configuration Reference](/docs/reference/configuration/) for receive environment variables.
