---
title: React components & hooks
description: Component structure, hooks patterns, async effects, state
globs: ['src/**/*.tsx', 'src/**/hooks/**']
always_apply: false
---

# React

## Components

- Function components, named export, props destructured in the signature.
- Props interface declared right above the component: `interface XxxProps`.
- Static config (labels, filter lists, status maps) lives at module level,
  outside the component.
- Pages orchestrate (hooks + navigation + dialogs); components stay
  presentational and receive data + `on_*` callbacks.
- Split a component when it passes ~200 lines or owns unrelated state.

## Hooks

- A data hook returns an object: `{ data, loading, error, reload }`.
- Async effects guard against stale updates:

  ```ts
  useEffect(() => {
    let active = true
    load().then((data) => {
      if (active) set_data(data)
    })
    return () => {
      active = false
    }
  }, [deps])
  ```

- Re-fetch by bumping a `reload_key` state, exposed via a `useCallback`.
- Callbacks returned from hooks are wrapped in `useCallback`.
- Never silence `react-hooks/exhaustive-deps`; fix the deps instead.

## State

- Local `useState` first; Context only for app-wide state (e.g. auth).
- No global state library.
