# MailAtlas Docs

This repository contains the public website and documentation for MailAtlas.

- Website: https://mailatlas.dev
- Core package: https://github.com/mailatlas/mailatlas
- Examples: https://github.com/mailatlas/examples
- Sample data: https://github.com/mailatlas/sample-data
- Support policy: https://github.com/mailatlas/mailatlas/blob/main/SUPPORT.md
- Security policy: https://github.com/mailatlas/mailatlas/security/policy

## Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## Screenshots

Use `scripts/chrome_capture.sh` when you need a local headless Chrome screenshot of a docs page:

```bash
scripts/chrome_capture.sh /tmp/mailatlas-home.png http://localhost:4321
```

## Deploy

Production deploys are handled by GitHub Actions and Cloudflare Pages.

Required repository configuration:

- variable: `CLOUDFLARE_ACCOUNT_ID`
- secret: `CLOUDFLARE_API_TOKEN`

The Cloudflare Pages project name is `mailatlas`, and the canonical domain is
`https://mailatlas.dev`.
