---
title: Parser Cleaning
description: Configure MailAtlas parser cleaning for forwarded headers, boilerplate, link-only lines, footers, invisible characters, and whitespace normalization.
slug: docs/config/parser-cleaning
---

Email bodies often contain forwarded-message wrappers, signatures, tracking links, legal footers, invisible characters, repeated whitespace, and newsletter boilerplate. MailAtlas exposes parser cleaning controls so you can tune output for the workflow that will consume it.

Use stricter cleaning when the output will feed retrieval chunks, model prompts, or analytics. Use lighter cleaning when you need forensic review or want to preserve the message as closely as possible.

Cleaning affects `body_text` and parser metadata. It does not remove the stored raw message from the workspace.

The current CLI defaults enable all parser-cleaning controls. Each flag supports a matching `--no-...` form when you want to disable one control for a run.

## Available controls

| Control | Use it when | Tradeoff |
| --- | --- | --- |
| `strip_forwarded_headers` | You want to remove common forwarded-message headers from cleaned text. | May remove context that matters for forensic review. |
| `strip_boilerplate` | You want cleaner outputs from newsletters, templates, or automated emails. | May remove content that looks repetitive but is meaningful in some messages. |
| `strip_link_only_lines` | You want to remove lines that contain only links or tracking URLs. | May remove important standalone links. |
| `stop_at_footer` | You want to stop body extraction at a detected footer or signature boundary. | May truncate content if the footer detector is too aggressive. |
| `strip_invisible_chars` | You want to remove invisible Unicode characters that can interfere with matching or chunking. | Usually safe, but preserve raw messages for exact review. |
| `normalize_whitespace` | You want predictable spacing for search, export, or retrieval. | May change visual spacing from the original message. |

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

Apply the same controls during IMAP receive:

```bash
mailatlas receive \
  --provider imap \
  --folder INBOX \
  --strip-boilerplate \
  --normalize-whitespace
```

## Python usage

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

## Choosing cleaning settings

### Retrieval or RAG

Use more cleaning. Strip boilerplate, strip link-only lines, stop at footers when reliable, and normalize whitespace. This reduces repeated content and usually produces cleaner chunks.

### Archival or legal review

Use lighter cleaning. Preserve forwarded headers, avoid footer stopping unless reviewed, and keep raw messages linked to the stored document.

### Parser development

Run the same fixture with different cleaning options and compare stored metadata and exports.

```bash
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml
mailatlas ingest sample-data/fixtures/eml/atlas-founder-forward.eml --no-strip-boilerplate
```

## Metadata

MailAtlas records parser notes in `metadata`, including:

- `cleaning.removed_forwarded_headers`
- `cleaning.dropped_line_count`
- `cleaning.stopped_at_footer`
- `parser_config.*`
- `provenance.is_forwarded`
- `provenance.forwarded_chain`

## Why it matters

Cleaning choices affect downstream behavior. Search indexes, retrieval systems, agents, audits, and exports can all need different representations. MailAtlas keeps raw artifacts linked so you can tune cleaned outputs without losing the original message.

## Next step

- Use [Document Schema](/docs/concepts/document-schema/) to inspect cleaning metadata.
- Use [Quickstart](/docs/getting-started/quickstart/) to run cleaning against local files.
- Use [IMAP Receive](/docs/getting-started/manual-imap-sync/) to apply cleaning during mailbox receive.
