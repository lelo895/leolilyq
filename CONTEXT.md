# Domain Model

## SplashPhysics
Physics engine for splash screen falling objects. Manage internal requestAnimationFrame loop, apply gravity + collision, handle drag-and-drop. Update DOM element transforms directly. Communicate side effects via injected callbacks. Small interface, deep implementation.

## AudioEngine
Unified interface for Web Audio API synthesis. Lazy init audio context. Encapsulate oscillator + gain node logic. Manage global mute. Trigger sounds via single `play(effectName, options)` seam.
