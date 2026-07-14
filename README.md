# Solar System Explorer

An interactive 3D solar system built with React Three Fiber and Three.js — orbits, rotation, moons, rings, and atmospheres simulated from real astronomical data, with a switchable realistic/visual scale mode.

**Live demo:** https://iamsushilchhetri.github.io/solarsystem

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- [Vite](https://vite.dev/) for dev/build tooling
- [Tailwind CSS](https://tailwindcss.com/) for UI
- [Zustand](https://github.com/pmndrs/zustand) for state
- [GSAP](https://gsap.com/) for camera/UI animation

## Development

```bash
npm install
npm run dev      # start dev server
npm run lint     # run oxlint
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the app and publishes `dist/` to GitHub Pages. In the repo settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions** for this to take effect.

The Vite `base` in [`vite.config.ts`](vite.config.ts) is set to `/solarsystem/` to match the Pages subpath; all texture/asset URLs go through [`assetUrl`](src/utils/assetUrl.ts) so they resolve correctly under that base.
