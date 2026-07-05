# Domain Model

## SplashPhysics
The physics engine responsible for the splash screen's falling objects (journal, camera, mahjong, etc.). It manages its own internal requestAnimationFrame loop, applies gravity and collision detection, and handles user drag-and-drop interactions. It updates DOM element transforms directly and communicates side effects (like playing sounds) back to the main app via injected callbacks, keeping its interface small and its implementation deep.

## AudioEngine
A unified interface for all Web Audio API synthesis in the application. It lazily initializes its audio context, encapsulates all oscillator and gain node logic, and manages the global mute state. The rest of the app triggers sounds via a single `play(effectName, options)` seam.
