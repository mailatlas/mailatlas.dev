---
title: Install MailAtlas
description: Install MailAtlas and verify the CLI before connecting a mailbox, importing email files, using the Python API, or exposing MCP tools to an AI agent.
slug: docs/getting-started/installation
---

Install MailAtlas from PyPI to use the CLI, Python API, or MCP server locally.

This page shows the `pip`, `uv`, Homebrew, and source install paths. Start with `pip` unless you prefer one of the other tools.

> MailAtlas is currently alpha. Expect CLI, schema, and packaging details to keep improving.

## Requirements

- Python 3.12 is recommended.
- A local directory where MailAtlas can write an email workspace.
- Chrome or Chromium only if you want PDF export.
- Provider credentials only when you connect a live mailbox or send email.

MailAtlas does not require a hosted MailAtlas service. For live mailboxes or sending, it uses the provider credentials you configure for IMAP, Gmail OAuth, SMTP, Cloudflare, or Gmail sending.

## Install with pip

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install mailatlas
```

Verify the installation:

```bash
mailatlas doctor
```

`mailatlas doctor` verifies that MailAtlas can create a temporary workspace, ingest a sample message, read it back, and export JSON. PDF export is checked only when Chrome or Chromium is available.

## Optional extras

```bash
python -m pip install "mailatlas[mcp]"
python -m pip install "mailatlas[keychain]"
```

Use `mailatlas[mcp]` when you want to run the optional MCP server.

Use `mailatlas[keychain]` when you want the local Gmail OAuth helper to store token material in the operating system keychain.

The Python API ships in the base package.

## Set the email workspace directory

MailAtlas writes received messages, sent messages, exports, assets, and SQLite lookup data into a local email workspace. By default, the workspace is `.mailatlas` in the current directory.

```bash
export MAILATLAS_HOME="$PWD/.mailatlas"
```

You can also pass a root per command:

```bash
mailatlas --root .mailatlas list
```

Use `MAILATLAS_HOME` when you want several commands to share the same workspace. Use `--root` when you want a one-off command to point somewhere else.

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

- Use [Manual IMAP Sync](/docs/getting-started/manual-imap-sync/) when your agent should read a live mailbox.
- Use [Gmail Receive](/docs/examples/gmail-receive/) when your agent should read Gmail with OAuth.
- Use [Quickstart](/docs/getting-started/quickstart/) when you want to try local `.eml` files.
- Use [Python API](/docs/python/overview/) when you want to embed MailAtlas in an application or worker.
- Use [MCP Server](/docs/mcp/overview/) when you want to expose email tools to an AI agent.
- Use [Outbound Email](/docs/providers/outbound-email/) when your agent or application needs to send through a configured provider.
