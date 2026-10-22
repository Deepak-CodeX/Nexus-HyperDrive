# NEXUS HYPERDRIVE — 2035 Autonomous Electric Hypercar Study

A luxury automotive digital experience showcasing the **NEXUS HYPERDRIVE**, an autonomous concept hypercar engineered for extreme ground-effect adhesion, solid-state quantum propulsion, and distributed neural intelligence.

Built with **React**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **React Three Drei (@react-three/drei)**, and **Vite**.

---

## 1. Cinematic Scroll Experience (6 Scenes)

The application coordinates real-time WebGL rendering with a scroll-driven timeline using frame-rate-independent exponential damping:

1. **Scene 01 — Overview / Awaken (`p: 0.00`)**:
   - Elevated front 3/4 hero composition with generous negative space.
   - Animated laser headlight boot sequence with cold boot flickering.
   - Overview concept study metadata and primary exploration call to action.

2. **Scene 02 — Sculpted Form (`p: 0.20`)**:
   - Side profile framing highlighting the 1.23m roofline, 4.53m monocoque silhouette, and 22″ directional turbine rims.
   - High-gloss clearcoat metallic body paint with realistic environment reflections.

3. **Scene 03 — Aerodynamics & Laminar Wind Architecture (`p: 0.40`)**:
   - Rear 3/4 elevated perspective.
   - Real-time active carbon aerofoil articulating attack angle with velocity.
   - Interactive laminar airflow streamline visualization.

4. **Scene 04 — Solid-State Quantum Core (`p: 0.60`)**:
   - Close-up technical inspection of the central underbody quantum power unit.
   - Dual counter-rotating electromagnetic stabilization rings and dynamic cyan plasma reactor glow.

5. **Scene 05 — Distributed AI Neural Mesh (`p: 0.80`)**:
   - Close-up wheel stance and front quarter angle.
   - 10 distributed optical lidar and sensor nodes with real-time laser interconnects across the chassis.

6. **Scene 06 — Bespoke Interactive Showcase (`p: 1.00`)**:
   - 360° interactive inspection studio with free orbit controls.
   - Live real-time exterior paint configurator.
   - Direct camera viewpoint presets (`Front 3/4`, `Side Profile`, `Rear Aerofoil`, `Underbody Core`, `Top Canopy`).
   - Technical specifications grid and bespoke allocation commission inquiry.

---

## 2. Interactive Features & Controls

- **Single-Source Navigation**: Header navigation buttons (`01 OVERVIEW` to `06 SHOWCASE`) with active state tracking, smooth deterministic scrolling, and direct anchor support.
- **Real-Time Paint Configurator**: Switch between bespoke automotive finishes:
  - *Obsidian Graphite* (`#0c131a`, Metallic 0.94, Roughness 0.16)
  - *Hyper Cyan* (`#00b4d8`, Metallic 0.96, Roughness 0.14)
  - *Liquid Titanium* (`#cbd7e2`, Metallic 0.98, Roughness 0.12)
  - *Stealth Carbon* (`#12151a`, Metallic 0.80, Roughness 0.32)
- **Camera Viewpoint Presets**: Dedicated buttons to instantly inspect Front, Profile, Rear Wing, Quantum Core, or Top Canopy.
- **Holographic Telemetry Diagnostics Modal**: Detailed component diagnostic breakdowns with interactive 3D focus reticle highlighting the exact vehicle subsystem.
- **Bespoke Commission Allocation Modal**: Functional client reservation flow with form validation and confirmation.
- **Acoustic Synthesizer Toggle**: Procedural Web Audio API synthesizer for futuristic interface audio feedback without external audio files.
- **Accessibility & Reduced Motion**: Automatically respects `prefers-reduced-motion` media queries and falls back to deterministic instant transitions.

---

## 3. Technical Architecture & Performance

- **Single-Source Frame Loop (`src/components/Scene.jsx`)**: The global scroll and animation state (`scrollStore.update(delta)`) is updated strictly once per animation frame. Child components (`CinemaCamera`, `ProceduralHypercar`, `EnvironmentStudio`) read state inside their own `useFrame` callbacks, eliminating redundant React re-renders.
- **Frame-Rate-Independent Damping**: Damping relies on continuous exponential decay (`factor = 1 - Math.exp(-speed * delta)`), guaranteeing identical smooth animation on 60Hz, 120Hz, and 144Hz displays.
- **Draco Geometry Compression**: Production 3D asset is compressed with Google Draco (1.68 MB) and decoded client-side using bundled local WebAssembly decoders in `/public/draco/`.
- **Automotive Studio Lighting Rig**: Drei `<Environment>` softbox rig combined with contact shadows (`<ContactShadows>`) and real-time floor reflections (`<MeshReflectorMaterial>`).
- **Resilient Procedural Fallback**: If WebGL loading or network asset retrieval fails, an automatic procedural hypercar mesh seamlessly renders in place.

---

## 4. Asset Provenance & Licensing

- **3D Vehicle Geometry**: Base vehicle geometry adapted from [Sport Car Free by vicent091036](https://sketchfab.com/3d-models/sport-car-free-7b3b6a22ea6c4d7e8e50b4ec98ee52da) under [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
- **Modifications**: Geometry optimized and re-topologized; legacy badges concealed; custom PBR materials created (clearcoat metallic paint, forged alloy turbine rims, polarized glass, dark carbon fiber); augmented with active aerodynamic swan-neck wing, illuminated front splitter, underbody quantum power core, laminar airflow streamlines, and optical neural sensor nodes.
- **Draco Decoders**: Standard Google Draco 1.5.7 WebAssembly runtime bundled locally in `public/draco/`.

*All vehicle performance specifications (1,600 kW, 0–100 km/h in 1.74s, 440 km/h top speed, 0.18 Cd) are fictional concept parameters engineered for the NEXUS HYPERDRIVE design study.*

---

## 5. Development & Production Commands

```bash
# Install dependencies
npm install

# Run static analysis
npm run lint

# Start development server
npm run dev

# Compile production bundle
npm run build

# Preview production build
npm run preview
```
