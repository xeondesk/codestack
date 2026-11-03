# CodeStack VS Code extensions

Monorepo for the CodeStack VS Code extensions and their shared library.

## Structure

```
apps/
  codestack-web/      CodeStack VS Code Browser integration (extension + ports webview)
  codestack-remote/   CodeStack Classic Remote SSH extension
  preview/            Static preview of the ports webview, deployed to Vercel
packages/
  codestack-shared/      Shared extension runtime and the ports webview Svelte app
  codestack-protocol/    gRPC/Protobuf protocol definitions (@codestack/codestack-protocol)
  typescript-grpc/       Generated gRPC client (@codestack/supervisor-api-grpc)
```

Dependencies are managed with Bun workspaces and a single root `bun.lock`.

## Build order

Packages are built in dependency order:

1. `packages/typescript-grpc` (`@codestack/supervisor-api-grpc`) — generated gRPC client
2. `packages/codestack-protocol` (`@codestack/codestack-protocol`) — protocol definitions
3. `packages/codestack-shared` (`codestack-shared`) — shared runtime + Svelte webview
4. `apps/codestack-web` — browser extension
5. `apps/codestack-remote` — remote SSH extension
6. `apps/preview` — static webview preview

## Setup

```bash
bun install
```

## Build

```bash
bun run build                        # full monorepo build (turbo, dependency-ordered)
bun run compile                      # compile shared packages
bun run build:codestack-web          # package the web extension
bun run build:codestack-remote       # package the remote extension
bun run build:preview                # build the static webview preview
```

## Lint & Format

```bash
bun run lint                         # lint all packages
bun run lint:fix                     # lint and auto-fix
bun run format                       # check formatting (prettier)
bun run format:write                 # apply formatting (prettier)
```

## Test

```bash
bun run test                         # run tests across all packages
```

## Clean

```bash
bun run clean                        # remove all build outputs
```

## Development watches

```bash
bun run --filter=codestack-shared watch
bun run --filter=codestack-web watch
bun run --filter=codestack-remote-ssh watch
bun run dev:preview                  # rebuild the preview on change
```

## Vercel

`vercel.json` builds `apps/preview` and serves `apps/preview/public`. The preview
mounts the real ports webview Svelte app from `packages/codestack-shared/portsview`
against mock port data, so it can be deployed as a normal static site.

## Tooling

- **Package manager:** Bun workspaces (single `bun.lock`)
- **Task runner:** Turbo (`turbo.json`) for cached, dependency-ordered builds
- **TypeScript:** Root `tsconfig.json` with project references
- **Linting:** Shared root `.eslintrc.json` (extends `@typescript-eslint/recommended`)
- **Formatting:** Prettier (`.prettierrc`)
