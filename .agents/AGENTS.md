# AGENTS.md — P-L Workspace Rules

## CSS 3D Transforms

When children use `rotateY`/`rotateX` with `backface-visibility: hidden`, the parent MUST have BOTH `perspective` AND `transform-style: preserve-3d`. Missing either causes the flip to render invisible. A `perspective`-only parent flattens the 3D context — never assume `perspective` alone is sufficient.

## CSS Transition + Class Swap Timing

When a class removal restores a `transition` (e.g. removes `transition: none`) and you immediately set the animated property value in the same synchronous block, the browser batches both mutations and the transition never fires. Always defer the property change with `requestAnimationFrame()` after the class removal so the browser commits one frame with the transition re-enabled at the old value.

## Agent skills

### Issue tracker

Local markdown (issues live as files under `.scratch/<feature>/` in this repo). See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles use their default strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (one `CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.
