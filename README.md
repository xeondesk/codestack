# CodeStack VS Code extensions

Monorepo for the CodeStack VS Code extensions and their shared library.

## Structure

```
apps/
  codestack-web/      CodeStack VS Code Browser integration (extension + ports webview)
  codestack-remote/   CodeStack Classic Remote SSH extension
  preview/         Static preview of the ports webview, deployed to Vercel
packages/
  codestack-shared/   Shared extension runtime and the ports webview Svelte app
```

Dependencies are managed with Bun workspaces and a single root `bun.lock`.

## Setup

```bash
bun install
```

## Build

```bash
bun run compile:codestack-shared   # compile the shared package
bun run build:codestack-web        # package the web extension
bun run build:codestack-remote     # package the remote extension
bun run build:preview           # build the static webview preview
```

Development watches:

```bash
bun workspace codestack-shared run watch
bun workspace codestack-web run watch
bun workspace codestack-remote-ssh run watch
bun run dev:preview             # rebuild the preview on change
bun workspace @codestack/portsview-preview run serve
```

## Vercel

`vercel.json` builds `apps/preview` and serves `apps/preview/public`. The preview
mounts the real ports webview Svelte app from `packages/codestack-shared/portsview`
against mock port data, so it can be deployed as a normal static site.
