---
title: Install MailAtlas
description: Install MailAtlas with pip, uv, Homebrew, or from source. Verify the CLI with mailatlas doctor and configure the local workspace root.
slug: docs/getting-started/installation
---

Install MailAtlas before running the Quickstart, syncing an IMAP folder, exporting documents, or sending outbound email.

The recommended path is a Python virtual environment and PyPI. Use `uv`, Homebrew, or a source checkout only if those match your local workflow.

> MailAtlas is currently alpha. Expect CLI, schema, and packaging details to keep improving.

## Requirements

- Python 3.12 is recommended. The package metadata currently allows Python 3.11 and newer.
- A local directory where MailAtlas can create a workspace.
- Chrome or Chromium only if you want PDF export.
- Provider credentials only if you plan to receive from IMAP or send outbound email.

The core file-ingest path does not require a hosted MailAtlas service, an email provider account, or a cloud service.

## Install with pip

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install mailatlas
mailatlas doctor
```

`mailatlas doctor` creates a temporary store, ingests a synthetic message, and verifies basic storage and JSON export. If Chrome or Chromium is available, it also checks PDF export. If the browser is missing, the doctor command warns instead of failing unless PDF is explicitly required.

## Optional extras

Use extras only when you need them:

```bash
python -m pip install "mailatlas[mcp]"
python -m pip install "mailatlas[keychain]"
```

Use `mailatlas[mcp]` when you want to run the optional MCP server.

Use `mailatlas[keychain]` when you want the local Gmail OAuth helper to store token material in the operating system keychain.

The Python API ships in the base package.

## Configure a workspace root

MailAtlas stores data in one workspace root. By default, the root is `.mailatlas` in the current directory.

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
```

You can also pass a root per command:

```bash
mailatlas --root .mailatlas list
```

The workspace root contains local files and `store.db`. It can include raw email, HTML snapshots, extracted assets, exports, outbound records, and SQLite metadata.

## Optional PDF export setup

PDF export uses local Chrome or Chromium. Install a browser if you need PDF exports.

If the browser executable is not on the default path, set:

```bash
export MAILATLAS_PDF_BROWSER="/path/to/chrome-or-chromium"
```

## Install with uv

```bash
python3.12 -m pip install uv
uv tool install mailatlas
mailatlas doctor
```

## Install with Homebrew

```bash
brew tap mailatlas/mailatlas
brew install mailatlas
mailatlas doctor
```

If Homebrew resolves a different formula named `mailatlas`, use:

```bash
brew install mailatlas/mailatlas/mailatlas
```

## Install from source

Use a source checkout when you want shipped fixtures, examples, the demo API, or editable development.

```bash
git clone https://github.com/mailatlas/mailatlas.git
cd mailatlas
python3.12 -m venv .venv
source .venv/bin/activate
make bootstrap-python
mailatlas doctor
```

If you are changing the docs site too:

```bash
make bootstrap-docs
```

Run the local command list:

```bash
make help
```

## Next step

- Use [Quickstart](/docs/getting-started/quickstart/) if your email is already on disk as `.eml` files.
- Use [Mbox Ingest](/docs/examples/mbox-ingest/) if you have a mailbox archive on disk.
- Use [IMAP Sync](/docs/getting-started/manual-imap-sync/) if MailAtlas should connect to a live mailbox.
- Use [Outbound Email](/docs/providers/outbound-email/) if your application needs send records and provider delivery.
