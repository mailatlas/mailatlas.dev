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

Use HTML when layout, hierarchy, or visual structure matters. Default HTML exports embed known
allowlisted local raster inline images as data URLs instead of linking back to the workspace.

MailAtlas treats stored email HTML as untrusted. The raw HTML snapshot stays in the email workspace
for source fidelity, but the default HTML export is rebuilt as inert, presentation-oriented HTML.
The export:

- removes executable elements and unsupported markup, event handlers, forms, and unsafe URL schemes;
- removes automatically loaded remote subresources and unsafe CSS;
- omits source-provided `data:` images, SVG, and unsupported or spoofed assets;
- embeds only known allowlisted local raster inline images recorded for that document; and
- may preserve ordinary `http`, `https`, and `mailto` links.

Those links are not fetched during export, but following one can contact an external site. HTML
sanitization does not make the message trustworthy or non-sensitive: misleading text, phishing
links, and private email content can remain.

## PDF

```bash
mailatlas get <document-id> \
  --format pdf \
  --out ./document.pdf
```

PDF export uses local Chrome or Chromium to render a separately sanitized copy of the stored HTML.
MailAtlas embeds only known allowlisted local raster inline images, applies a restrictive content
security policy, disables JavaScript, keeps the browser sandbox enabled, and runs Chrome with an
isolated temporary profile plus outbound host and proxy denial. A failed render does not replace
an existing destination PDF.

These controls reduce the attack surface; they are not a claim that Chrome is invulnerable. Keep
Chrome or Chromium current, continue to treat the source message as untrusted, and review the PDF
before sharing it. Preserved links can still contact external sites when someone follows them from
the finished PDF.

This inert transformation applies only to default HTML export and PDF rendering. JSON, Markdown,
raw snapshots, extracted attachments, and other assets remain source data. Markdown consumers may
render embedded raw HTML differently, so treat those outputs as untrusted too.

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

Exports can contain private email content, attachments, inline images, BCC-related audit metadata,
links, or rendered PDFs. Sanitizing HTML and PDF rendering behavior does not remove sensitive or
misleading content. Review exports before sharing them outside your machine or repository.

## Next step

- Use [Quickstart](/docs/getting-started/quickstart/) for an end-to-end export.
- Use [Document Schema](/docs/concepts/document-schema/) for the fields represented in JSON.
- Use [Workspace Model](/docs/concepts/workspace-model/) for where default PDF exports live.
