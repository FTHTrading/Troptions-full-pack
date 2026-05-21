# Contributing to Troptions

## Branch Naming

- `feature/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`

## Commit Style

- Use conventional commit style where practical:
  - `feat:`
  - `fix:`
  - `chore:`
  - `docs:`
  - `test:`

## Pull Request Requirements

- Run tests before opening a PR.
- Ensure typecheck, lint, and build pass.
- Do not commit secrets, keys, or token files.
- Do not introduce hype claims without supporting evidence.
- Do not claim compliance outcomes without legal review.

## Local Validation Checklist

```bash
npm run typecheck
npm test
npm run lint
npm run build
```
