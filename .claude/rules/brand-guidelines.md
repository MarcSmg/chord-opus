# Brand guidelines are the source of truth

`docs/ChordOpusBrandGuideLines.pdf` defines ChordOpus's design system: colors,
typography, iconography, imagery, and component specs (buttons, form
elements, cards, navigation, feedback).

When building or reviewing UI:

- Follow the brand guidelines document, not whatever an existing component
  happens to do. Existing components can drift from spec (e.g. `Button.tsx`
  previously had a gradient background and a hover-lift/shadow animation —
  neither is in the guidelines, both were removed).
- Keep components simple: use the flat colors, weights, and states the
  guidelines actually specify (primary / secondary / disabled for buttons,
  for example). Don't add gradients, lift-on-hover, drop shadows, or other
  decorative motion that isn't called out in the guidelines.
- If a token or utility already exists in `frontend/src/global.css`
  (the `@theme` block) for something the guidelines mention, use it instead
  of inventing a new color or size.
