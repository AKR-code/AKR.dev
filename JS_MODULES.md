# JavaScript Modules Architecture

## Overview
The original monolithic `script.js` has been refactored into 7 focused, single-responsibility modules for improved readability, maintainability, and testability.

## Module Structure

### 1. **theme.js** - Theme Management
Handles dark/light theme switching and persistence.

**Key Functions:**
- `applyStoredThemeEarly()` - Apply saved theme before page renders (prevents FOUC)
- `currentTheme()` - Get current theme ('dark' or 'light')
- `applyTheme(theme, themeToggle)` - Apply theme and persist to localStorage
- `toggleTheme(themeToggle)` - Toggle between dark and light
- `initThemeToggle()` - Initialize theme toggle checkbox listener

**Constants:**
- `THEME_STORAGE_KEY` - 'akr-theme' (localStorage key)

---

### 2. **partials.js** - HTML Partials Loading
Loads and injects shared HTML components (navigation, footers).

**Key Functions:**
- `fetchPartial(path)` - Fetch HTML file from server
- `loadPartials()` - Load all partials (nav, footer-top, footer-bottom)
- `injectFallbackMarkup()` - Use inline HTML when fetch fails

**Features:**
- Automatic fallback to inline markup if fetch is blocked (file:// protocol)
- Checks for existing elements to avoid duplication
- Handles multiple insertion positions

---

### 3. **video.js** - Video Source Management
Manages video source updates based on theme and viewport orientation.

**Key Functions:**
- `getVideoSource(isDark)` - Get appropriate video path for theme/orientation
- `updateVideoSource(videoElement, sourceElement)` - Update video source and play

**Features:**
- Detects phone vs desktop aspect ratio
- Switches between 4 video variants:
  - `hero-light-theme.mp4` (desktop, light)
  - `hero-light-theme-phone.mp4` (mobile, light)
  - `hero-dark-theme.mp4` (desktop, dark)
  - `hero-dark-theme-phone.mp4` (mobile, dark)

---

### 4. **footer.js** - Footer Positioning
Manages footer state and positioning based on scroll location.

**Key Functions:**
- `computeMetrics(hero)` - Cache layout measurements
- `updateFooterState(footerTop, footerBottom, statusText, statusIcons)` - Update footer positioning
- `handleHeroResize()` - Trigger reflow on resize
- `setupFooterListeners(hero)` - Setup scroll and resize event listeners

**Features:**
- RAF-throttled scroll handler (prevents layout thrashing)
- Debounced resize handler (200ms)
- Dynamic footer positioning (fixed → absolute)
- Status UI visibility toggling

---

### 5. **navigation.js** - Keyboard Navigation
Handles page navigation and keyboard shortcuts.

**Key Functions:**
- `getCurrentPage()` - Get current page filename
- `getCurrentPageIndex()` - Get current page index in PAGE_ORDER
- `navigateToPage(targetPage)` - Navigate with fade transition
- `goToPageIndex(pageIndex)` - Navigate by page index
- `setupKeyboardNavigation()` - Initialize keyboard listeners
- `setupLinkTransitions()` - Initialize link click handlers

**Keyboard Shortcuts:**
- Navigation:
  - `a` / `h` / `←` = Previous page
  - `d` / `l` / `→` = Next page
- Scrolling:
  - `w` / `k` / `↑` = Scroll up
  - `s` / `j` / `↓` = Scroll down
- Theme: `Ctrl+D` = Toggle dark mode

**Constants:**
- `PAGE_ORDER` - Array of pages in navigation sequence
- `PAGE_TRANSITION_TIME` - 170ms (must match CSS transition)

---

### 6. **carousel.js** - Carousel Component
Manages carousel/slider functionality with auto-play and touch support.

**Carousel Class Methods:**
- `init()` - Initialize carousel
- `createPagination()` - Create dot indicators
- `updateCarousel(animate)` - Update slide positions
- `updatePagination()` - Sync pagination with current slide
- `next()` / `prev()` / `goToSlide(index)` - Navigation
- `startAutoPlay(interval)` / `stopAutoPlay()` - Auto-play control
- `handleUserInteraction()` - Pause auto-play on interaction
- `initTouchEvents()` - Setup swipe gestures

**Features:**
- Auto-play with 3-second interval
- Keyboard navigation (arrow keys)
- Touch swipe support (50px threshold)
- Pagination dots
- User interaction pauses auto-play for 30 seconds

---

### 7. **main.js** - Application Initialization
Coordinates initialization of all modules on page load.

**Initialization Sequence:**
1. Apply stored theme early (FOUC prevention)
2. Load partials (nav, footers)
3. Initialize theme toggle
4. Setup footer listeners
5. Update footer state and video source
6. Add fade-in animation
7. Setup keyboard navigation
8. Setup link transitions

---

## Load Order

All modules must be loaded in this order (dependencies matter):

```html
<script src="assets/js/theme.js"></script>          <!-- No dependencies -->
<script src="assets/js/partials.js"></script>        <!-- No dependencies -->
<script src="assets/js/video.js"></script>           <!-- Depends on theme.js -->
<script src="assets/js/footer.js"></script>          <!-- Depends on theme.js, video.js -->
<script src="assets/js/navigation.js"></script>      <!-- Depends on theme.js -->
<script src="assets/js/carousel.js"></script>        <!-- No dependencies (standalone) -->
<script src="assets/js/main.js"></script>            <!-- Depends on all others -->
```

---

## Optimizations Made

### 1. **Code Organization**
- Separated concerns into focused modules
- Each module handles one responsibility
- Clear dependencies between modules

### 2. **Performance**
- RAF-throttled scroll handlers (prevents layout thrashing)
- Debounced resize handlers (200ms)
- Early theme application (prevents FOUC)
- Efficient DOM queries cached in variables
- Removed unnecessary re-computations

### 3. **Readability**
- Comprehensive JSDoc comments
- Constants clearly named in UPPER_CASE
- Function names are self-documenting
- Logical grouping of related functionality

### 4. **Maintainability**
- Easy to modify individual features
- Reduced cognitive load per file
- Clear entry points for debugging
- Simple to add new modules

---

## Global Functions & Constants

### Available Globally (for cross-module communication):

**Theme Module:**
- `THEME_STORAGE_KEY`
- `applyStoredThemeEarly()`
- `currentTheme()`
- `applyTheme(theme, themeToggle)`
- `toggleTheme(themeToggle)`
- `initThemeToggle()`

**Partials Module:**
- `fetchPartial(path)`
- `loadPartials()`
- `injectFallbackMarkup()`

**Video Module:**
- `getVideoSource(isDark)`
- `updateVideoSource(videoElement, sourceElement)`

**Footer Module:**
- `footerMetrics` (object)
- `updateFooterState(...)`
- `computeMetrics(hero)`
- `setupFooterListeners(hero)`

**Navigation Module:**
- `PAGE_ORDER`
- `getCurrentPage()`
- `getCurrentPageIndex()`
- `setupKeyboardNavigation()`
- `setupLinkTransitions()`

**Carousel Module:**
- `Carousel` (class)

---

## Adding New Features

To add a new feature:

1. Create a new module file: `assets/js/feature-name.js`
2. Implement functionality with clear JSDoc comments
3. Export functions/classes globally
4. Add script tag to HTML files in correct order
5. Call initialization functions from `main.js` if needed

---

## Debugging Tips

- Check browser console for module load errors
- Verify script load order in Network tab
- Use `console.log(THEME_STORAGE_KEY)` to test global scope
- Check `footerMetrics` to debug footer positioning
- Monitor RAF throttling with DevTools Performance tab

---

## Migration from Old Script

The old `script.js` can be safely removed. All functionality is preserved in the modular structure with the following improvements:

- Better code organization
- Improved performance with RAF throttling
- Enhanced readability with JSDoc
- Easier to test and debug
- Simpler to add new features
