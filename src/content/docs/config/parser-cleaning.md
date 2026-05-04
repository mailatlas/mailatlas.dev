---
title: Clean Email Text
description: Configure how MailAtlas creates body_text from email bodies while preserving raw email, HTML views, assets, and cleaning metadata.
slug: docs/config/parser-cleaning
---

MailAtlas creates `body_text`, the clean plain-text view your agent usually reads first. Cleaning controls decide how much MailAtlas removes or normalizes while keeping the raw email, HTML view, attachments, and embedded images available in the email workspace.

Use this page when you want to tune `body_text` for agents, retrieval, search, exports, review tools, or parser tests.

## What cleaning changes

Cleaning affects:

- `body_text`, the plain-text body stored on the document.
- `metadata.cleaning`, which records cleaning outcomes such as dropped lines.
- `metadata.parser_config`, which records the parser settings used for the run.

Cleaning does not change:

- `raw_path`, the stored original email bytes.
- `body_html_path`, the normalized HTML view.
- `assets`, the extracted embedded images and attachments.

That means you can tune the clean text your agent reads while keeping the source email and richer views available for inspection.

## Defaults

The CLI defaults enable all cleaning controls. Keep the defaults for most agent, search, and retrieval workflows.

Each CLI flag supports a matching `--no-...` form when you want to keep a specific kind of text in `body_text`.

## Controls

| Control | What it does |
| --- | --- |
| `strip_forwarded_headers` | Removes common forwarded-message header lines such as `From:`, `Sent:`, `To:`, and `Subject:` when MailAtlas has detected forwarded-message structure. The forwarded body remains in `body_text`; the repeated mail-client wrapper is removed. |
| `strip_boilerplate` | Removes common repeated template text from newsletters, transactional emails, and automated messages. Examples include unsubscribe prompts, social footer text, app-store badges converted to text, repeated legal disclaimers, "view in browser" lines, and template navigation labels. |
| `strip_link_only_lines` | Removes lines that contain only a URL. This is useful for tracking URLs and template links, but some emails use standalone links as the main action, such as invoice, reset-password, or calendar links. |
| `stop_at_footer` | Stops body extraction when MailAtlas reaches a detected footer or signature boundary. This can keep long legal footers and repeated signature blocks out of `body_text`. |
| `strip_invisible_chars` | Removes invisible Unicode characters that can interfere with matching, chunking, or display. |
| `normalize_whitespace` | Trims line whitespace and collapses repeated blank lines so `body_text` is easier to read, search, chunk, and compare. |

## Examples

Forwarded-message headers can be useful to humans but noisy for an agent reading the main message.

```text
Before:
From: Alice <alice@example.com>
Sent: Tuesday, April 14, 2026
To: Bob <bob@example.com>
Subject: Contract notes

Please review section 4.

After:
Please review section 4.
```

Link-only lines are often tracking or template links, but some are important actions. Disable `strip_link_only_lines` when the link itself is the useful content.

```text
Before:
View this invoice:
https://billing.example.com/invoices/123

After, with strip_link_only_lines:
View this invoice:
```

Boilerplate is repeated text around the message that rarely helps the agent understand the specific email.

```text
Before:
Your weekly product update

Usage increased 18% this week.

View this email in your browser
Download our app on the App Store
You are receiving this because you signed up for updates.
Unsubscribe | Privacy Policy | Terms

After, with strip_boilerplate:
Your weekly product update

Usage increased 18% this week.
```

Footer stopping removes text after a detected signature or footer boundary.

```text
Before:
Can you confirm the launch date?

Best,
Alice

This email and any attachments are confidential...

After, with stop_at_footer:
Can you confirm the launch date?
```

## CLI usage

Apply cleaning controls during file ingest:

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml \
  --strip-forwarded-headers \
  --strip-boilerplate \
  --stop-at-footer
```

Disable one default control for a run:

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml \
  --no-strip-boilerplate
```

Apply the same controls during mailbox receive:

```bash
mailatlas receive \
  --provider imap \
  --folder INBOX \
  --strip-boilerplate \
  --normalize-whitespace
```

The `receive` command accepts these parser-cleaning flags for Gmail and IMAP receive. Provider-specific options still control which mailbox messages are fetched.

## Python usage

Use `ParserConfig` with parse-only code:

```python
from mailatlas import ParserConfig, parse_eml

document = parse_eml(
    "sample-data/fixtures/eml/atlas-founder-forward.eml",
    parser_config=ParserConfig(
        strip_forwarded_headers=True,
        strip_boilerplate=True,
        stop_at_footer=True,
    ),
)
```

Use `ParserConfig` with a storage-backed instance:

```python
from mailatlas import MailAtlas, ParserConfig

atlas = MailAtlas(
    workspace_path=".mailatlas",
    db_path=".mailatlas/store.db",
    parser_config=ParserConfig(
        strip_boilerplate=True,
        normalize_whitespace=True,
    ),
)
```

## How to use the defaults

Use the defaults first. They are meant to produce clean `body_text` for agents, search, retrieval, summaries, and exports.

If the clean text is missing something important, rerun the same message with one control disabled and compare the result. For example, if a standalone invoice link disappeared, try `--no-strip-link-only-lines`. If a legal footer or forwarded header matters to your workflow, disable the specific control that removed it.

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml --no-strip-boilerplate
```

The raw email and HTML view remain in the workspace, so you can always inspect the original source even when `body_text` is aggressively cleaned.

## Metadata output

MailAtlas records cleaning notes on the document:

```json
{
  "cleaning": {
    "removed_forwarded_headers": true,
    "dropped_line_count": 4,
    "stopped_at_footer": false
  },
  "parser_config": {
    "strip_forwarded_headers": true,
    "strip_boilerplate": true,
    "strip_link_only_lines": true,
    "stop_at_footer": true,
    "strip_invisible_chars": true,
    "normalize_whitespace": true
  }
}
```

Use [Email Document Schema](/docs/concepts/document-schema/) for how this metadata appears on stored documents.

## Next step

- Use [Email Document Schema](/docs/concepts/document-schema/) to inspect cleaning metadata.
- Use [Quickstart](/docs/getting-started/quickstart/) to run cleaning against local files.
- Use [IMAP Receive](/docs/getting-started/manual-imap-sync/) to apply cleaning during mailbox receive.
