import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://mailatlas.dev",
  integrations: [
    starlight({
      title: "MailAtlas",
      description: "Open-source local email I/O for AI agents, data apps, retrieval systems, and Python workflows.",
      customCss: ["./src/styles/custom.css"],
      components: {
        ThemeProvider: "./src/components/DocsThemeProvider.astro",
        ThemeSelect: "./src/components/EmptyThemeSelect.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mailatlas/mailatlas",
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            {
              label: "Overview",
              link: "/docs/",
            },
            "docs/getting-started/installation",
            "docs/getting-started/quickstart",
            "docs/getting-started/manual-imap-sync",
            {
              label: "When to Use MailAtlas",
              link: "/docs/marketing/why-not-connectors/",
            },
          ],
        },
        {
          label: "Core Concepts",
          items: [
            "docs/concepts/workspace-model",
            "docs/concepts/document-schema",
            "docs/config/parser-cleaning",
            "docs/concepts/glossary",
          ],
        },
        {
          label: "Reference",
          items: [
            "docs/reference/configuration",
            "docs/reference/export-formats",
          ],
        },
        {
          label: "CLI",
          items: [
            "docs/cli/overview",
            "docs/cli/commands",
          ],
        },
        {
          label: "Python",
          items: [
            "docs/python/overview",
            "docs/python/reference",
          ],
        },
        {
          label: "MCP",
          items: [
            "docs/mcp/overview",
          ],
        },
        {
          label: "Providers",
          items: [
            "docs/providers/outbound-email",
            "docs/providers/gmail",
          ],
        },
        {
          label: "Examples",
          items: [
            {
              label: "Examples Index",
              link: "/docs/examples/",
            },
            "docs/examples/eml-ingest",
            "docs/examples/mbox-ingest",
            "docs/examples/imap-sync",
            "docs/examples/gmail-oauth-send",
          ],
        },
        {
          label: "Product",
          items: [
            {
              label: "Product Vision",
              link: "/docs/marketing/product-vision/",
            },
            "docs/marketing/security-and-privacy",
            "docs/marketing/roadmap",
          ],
        },
        {
          label: "Support",
          items: [
            "docs/support/troubleshooting",
          ],
        },
      ],
    }),
  ],
});
