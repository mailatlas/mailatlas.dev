---
title: Export Formats
description: Export MailAtlas documents as JSON, Markdown bundles, HTML, or PDF and understand output destinations, asset behavior, and browser requirements.
slug: docs/reference/export-formats
---

MailAtlas can export a stored document as JSON, Markdown, HTML, or PDF.

Use `mailatlas get <document-id> --format ...` from the CLI, or `atlas.export_document(...)` from Python.

## Which format should I choose?

| Format | Use when |
| --- | --- |
| JSON | Another program needs normalized fields, metadata, provenance, and asset references. |
| Markdown | A person, notebook, retrieval index, or model prompt needs readable text with local asset references. |
| HTML | Layout, hierarchy, images, or visual inspection matter. |
| PDF | You need a portable review artifact or archive snapshot. |

## JSON

```bash
mailatlas get <document-id> \
  --format json \
  --out ./document.json
```

Use JSON when another program needs normalized fields, metadata, source provenance, and asset references.

If `--out` is omitted, JSON is printed to stdout.

## Markdown

```bash
mailatlas get <document-id> \
  --format markdown \
  --out ./document-markdown
```

When `--out` points to a directory, MailAtlas writes a Markdown bundle:

```text
document-markdown/
  document.md
  assets/
```

Use Markdown bundles for AI workflows, retrieval indexes, notebooks, reviews, and cases where readable text plus local asset references matter.

If `--out` is omitted, Markdown is printed to stdout with local asset references.

## HTML

```bash
mailatlas get <document-id> \
  --format html \
  --out ./document.html
```

Use HTML when layout, hierarchy, or visual structure matters. HTML exports can rewrite asset references for the output destination.

## PDF

```bash
mailatlas get <document-id> \
  --format pdf \
  --out ./document.pdf
```

PDF export uses local Chrome or Chromium.

If MailAtlas cannot find the browser:

```bash
export MAILATLAS_PDF_BROWSER="/path/to/chrome-or-chromium"
```

If `--out` is omitted, MailAtlas writes to `.mailatlas/exports/<document-id>.pdf`.

## Python export

```python
pdf_path = atlas.export_document(
    "<document-id>",
    format="pdf",
)
```

Supported formats are `json`, `markdown`, `html`, and `pdf`.

`export_document(...)` returns a string. When a file or bundle is written, the string is the output path.

## Security note

Exports can contain raw email content, attachments, inline images, BCC-related audit metadata, or rendered PDFs. Review exports before sharing them outside your machine or repository.

## Next step

- Use [Quickstart](/docs/getting-started/quickstart/) for an end-to-end export.
- Use [Document Schema](/docs/concepts/document-schema/) for the fields represented in JSON.
- Use [Workspace Model](/docs/concepts/workspace-model/) for where default PDF exports live.
