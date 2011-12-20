This was an experiment for use in creating 2D parallax scrolling games with WebGL to perform progressive enhancement on top.

This will be updated once I pull the latest version from my latest project.

So far it includes

- Render management for 2D parallax views
- Post-processing via WebGL (currently disabled due to performance issues)
- event-based scene and entity management
- a basic particle system built on top of this

The library is actually written into several components intentionally, there is

- Shared, handy functions for eventing and that sort of thing
- Render, the rendering functions used for determining what to draw - this is done in a technique agnostic manner to facillitate in progressive enhancement
- Scene, entity and logic management - this indirectly consumes Render (theoretically Render can be plugged in other ways)
- Resources, resource management - currently loading from urls, probably will end up facilitating dependency packing + updates with local storage
- Components, built on top of Scene and Render, currently containing particles, although they may end up losing their dependency on Scene
- Driver, using all the things to help bootstrap a game, this is what I use to run my games, but the other bits can be used independently

