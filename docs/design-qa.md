# Design QA checklist

## Responsive

- [ ] 360px: no horizontal scroll; touch targets at least 44px; enquiry action remains reachable.
- [ ] 768px: catalogue switches to two columns; gallery preserves fixed aspect ratios.
- [ ] 1280px: 12-column container remains within 1280px; detail enquiry card is sticky without obscuring content.
- [ ] 4K: readable line lengths and no stretched hero assets.

## Accessibility

- [ ] Keyboard focus is visible on every interactive element.
- [ ] Image alt text describes the property, not the filename.
- [ ] Status is represented by text/icon as well as colour.
- [ ] Forms expose labels, required state and role=alert errors.
- [ ] Reduced-motion mode removes non-essential animation.
- [ ] Contrast target: Lighthouse accessibility 95+; main pairs documented in the design brief.

## Media and 3D

- [ ] Every image sits in a fixed aspect-ratio frame with focal-point object position.
- [ ] Poster and skeleton render before 3D/map code loads.
- [ ] Slow network never creates a blank widget or layout jump.
- [ ] No WebGL path keeps the property poster and a clear retry/poster action.

## Manual review routes

`/`, `/properties`, `/properties/the-grove-3a`, `/request`, `/design-system`, `/dev/skeletons`, `/login`, `/admin` after login.
