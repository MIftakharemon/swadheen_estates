# Motion spec

| Pattern          | Timing    | Easing                    | Notes                                                       |
| ---------------- | --------- | ------------------------- | ----------------------------------------------------------- |
| Page/reveal      | 450–550ms | cubic-bezier(.22,1,.36,1) | opacity + 16–18px y offset, once only                       |
| Card image hover | 700ms     | ease-out                  | scale 1.035; never changes layout                           |
| Button press     | 150ms     | ease-out                  | scale .98; preserve width while pending                     |
| Filter layout    | 350ms     | spring/damped             | Framer Motion layout; keep previous results visible         |
| Sheet open       | 450ms     | spring, damping 28        | bottom-sheet on mobile instead of modal                     |
| Hotspot pulse    | 2.4s      | ease-out                  | ring communicates interactive point; no colour-only meaning |
| Skeleton shimmer | 1.8s      | ease-in-out               | transform-only; static under reduced motion                 |

All motion is gated by the browser `prefers-reduced-motion` media query in `globals.css`. Motion never blocks form submission, navigation or access to content.
