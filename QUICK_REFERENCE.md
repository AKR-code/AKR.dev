# Quick Reference Guide

## File Organization

### New Modular Structure
```
assets/js/
├── theme.js          - Dark/light theme management
├── partials.js       - Load navigation and footer components
├── video.js          - Handle hero video source switching
├── footer.js         - Footer positioning and scroll logic
├── navigation.js     - Keyboard shortcuts and page navigation
├── carousel.js       - Carousel/slider functionality
└── main.js           - Application initialization
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `←` / `a` / `h` | Go to previous page |
| `→` / `d` / `l` | Go to next page |
| `↑` / `w` / `k` | Scroll up |
| `↓` / `s` / `j` | Scroll down |
| `Ctrl+D` | Toggle dark mode |
| Click theme checkbox | Toggle dark mode |

## Module Dependencies

```
theme.js          ← Base module (no deps)
partials.js       ← Base module (no deps)
video.js          ← Requires: theme.js
footer.js         ← Requires: theme.js, video.js
navigation.js     ← Requires: theme.js
carousel.js       ← Standalone
main.js           ← Requires: all above
```

## Function Quick Reference

### Theme Management
```javascript
applyStoredThemeEarly()      // Apply theme before render
currentTheme()               // Get 'dark' or 'light'
toggleTheme(themeToggle)     // Toggle theme
applyTheme(theme, toggle)    // Apply & persist theme
initThemeToggle()            // Initialize toggle listener
```

### Partials Loading
```javascript
loadPartials()               // Load nav & footer HTML
injectFallbackMarkup()       // Use inline HTML fallback
```

### Video Management
```javascript
getVideoSource(isDark)       // Get video path for theme
updateVideoSource(video, source) // Update & play video
```

### Footer Logic
```javascript
computeMetrics(hero)         // Cache layout measurements
updateFooterState(...)       // Position footer on scroll
setupFooterListeners(hero)   // Setup scroll/resize listeners
```

### Navigation
```javascript
setupKeyboardNavigation()    // Enable keyboard shortcuts
setupLinkTransitions()       // Enable fade transitions
getCurrentPageIndex()        // Get current page number
navigateToPage(target)       // Navigate with fade effect
```

### Carousel
```javascript
new Carousel()               // Initialize carousel
// Methods: next(), prev(), goToSlide(index), 
//          startAutoPlay(), stopAutoPlay()
```

## CSS Class Dependencies

**DO NOT CHANGE** these class names without updating JS:

| Element | Class | Used In |
|---------|-------|---------|
| Root | `theme-dark` | theme.js |
| Body | `show`, `fade` | navigation.js, main.js |
| Video | `#hero-vid` | video.js |
| Video Source | `#video-source` | video.js |
| Footer | `#footer-top`, `#footer-bottom` | footer.js |
| Status | `.status-text`, `.status-icons` | footer.js |
| Carousel | `#carousel-track`, `.carousel-slide`, etc | carousel.js |

## HTML ID Dependencies

**DO NOT CHANGE** these element IDs without updating JS:

```
#hero                       - Hero section
#hero-content              - Hero content
#hero-vid                  - Hero video
#video-source              - Video source element
#nav-placeholder           - Navigation placeholder
#ribbon                    - Navigation element
#footer-top                - Top footer
#footer-bottom             - Bottom footer
#footer-status             - Footer status area
#theme-toggle              - Theme checkbox
#carousel-track            - Carousel container
#carousel-prev/next        - Carousel buttons
#carousel-pagination       - Pagination dots
```

## Storage Keys

| Key | Module | Purpose |
|-----|--------|---------|
| `akr-theme` | theme.js | Persist theme preference |

## Page Order for Navigation

```javascript
PAGE_ORDER = ['index.html', 'projects.html', 'library.html', 'events.html']
```

Used for keyboard navigation with arrow keys.

## Common Tasks

### Adding a New Page
1. Create new HTML file
2. Add to `PAGE_ORDER` in navigation.js
3. Include all 7 script tags at the end
4. Use same structure as existing pages

### Changing Animation Timing
- Page transitions: `PAGE_TRANSITION_TIME` in navigation.js (must match CSS)
- Carousel transitions: 600ms in carousel.js (hardcoded, check CSS)
- Resize debounce: 200ms in footer.js

### Disabling Auto-Play Carousel
- In carousel.js `init()`: Comment out `this.startAutoPlay(3000)`
- Or modify `startAutoPlay()` condition

### Changing Video Sources
- Update video paths in video.js `getVideoSource()`
- Ensure all 4 variants exist (desktop/mobile, light/dark)

## Performance Notes

- **Scroll**: RAF-throttled (60fps max)
- **Resize**: 200ms debounce
- **Carousel**: 3000ms auto-play interval
- **Footer Resume**: 30000ms (30 seconds)

## Browser Compatibility

Uses modern JavaScript features:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Template literals
- Arrow functions
- const/let

Requires ES6+ capable browser. Add transpilation if IE11 support needed.
