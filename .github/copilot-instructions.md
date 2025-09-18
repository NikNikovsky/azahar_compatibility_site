# Azahar Compatibility Site

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

**This is a static web application** - no build process, frameworks, or complex setup required.

### Quick Start & Validation
- Serve the application: `npx serve .`
- Open browser to: `http://localhost:3000` (or port shown by serve)
- **EXPECTED**: Site loads in ~2 seconds showing 1200+ Nintendo 3DS games
- **NEVER CANCEL**: Application starts immediately. Data loads in 2-3 seconds.
- **IMPORTANT**: Always close the server before modifying code files

### Core Validation Workflow
Always test these scenarios after making changes:
1. **Data Loading**: Site should show "Loading compatibility data..." then display games
2. **Search Functionality**: Type "Mario" in search box → should show ~40 Mario games
3. **Filtering**: Uncheck "Show Untested (99)" → game count should decrease significantly  
4. **Responsive Design**: Resize browser → layout should adapt to mobile/desktop
5. **Fallback**: If GitHub API fails, local JSON file should load automatically

### File Structure
```
├── index.html          # Main application (55 lines)
├── script.js           # JavaScript functionality (172 lines)  
├── styles.css          # Responsive CSS styling (197 lines)
├── compatibility_list.json  # Local backup data (~10K games, 204KB)
├── README.md          # Project documentation
└── LICENSE            # MIT License
```

## Development Workflow

### Server Management Protocol
- **Start Server**: `npx serve .` (typically serves on port 3000)
- **Stop Server**: Always use Ctrl+C or stop the bash session before code changes
- **CRITICAL**: Never modify code files while server is running
- **Restart Process**: Stop server → Make changes → Start server → Test

### Serving the Application
- **Primary**: `npx serve .` (starts in <1 second)
- **Alternative**: `python3 -m http.server 8000` or any static file server
- **NO BUILD REQUIRED**: Pure HTML/CSS/JS - edit and refresh
- **IMPORTANT**: Always close the server before modifying code files

### Testing Changes
1. Close the webserver if it's running
2. Make code changes to HTML/CSS/JS files
3. Start the webserver again with `npx serve .`
4. Refresh browser (Ctrl+F5 for hard refresh)
5. **ALWAYS TEST**: Run complete validation workflow above
6. Verify in browser console for JavaScript errors

### Code Architecture
- **No frameworks**: Pure vanilla JavaScript ES6+
- **Data Source**: Primary: GitHub API, Fallback: Local JSON
- **Search**: Real-time client-side filtering
- **Responsive**: CSS Grid + Flexbox + Media queries

## Validation Scenarios

### Functional Testing
**Search Testing**:
```
1. Search "Mario" → expect ~40 results
2. Search "Pokemon" → expect ~50 results  
3. Search by game ID "0004000000030800" → expect Mario Kart 7
```

**Filter Testing**:
```
1. All filters checked → ~1200 games
2. Uncheck "Untested" → ~546 games (tested only)
3. Only "Perfect/Great" → games with green badges only
```

**Error Handling**:
```
1. Disconnect internet → should fallback to local JSON
2. Corrupt local JSON → should show error message
```

### Performance Expectations
- **Server startup**: <1 second
- **Page load**: <1 second for HTML/CSS/JS
- **Data fetch**: 2-3 seconds (GitHub API or local fallback)
- **Search response**: Instant (client-side filtering)
- **Filter changes**: Instant

## Important Notes

### What This Application Does
- Displays Nintendo 3DS game compatibility for Azahar emulator
- Fetches live data from https://raw.githubusercontent.com/azahar-emu/compatibility-list/master/compatibility_list.json
- Provides search and filtering capabilities
- Shows compatibility ratings: Perfect (0), Great (1), Good (2), OK (3), Poor (4), Bad (5), Untested (99)

### What NOT to Do
- Do NOT add build tools (webpack, etc.) - this is intentionally simple
- Do NOT add frameworks (React, Vue, etc.) - uses vanilla JS  
- Do NOT modify the JSON structure - matches upstream format
- Do NOT remove fallback mechanisms - ensures reliability

### Common Issues & Solutions
- **Site won't load**: Check if running on HTTP server (not file://)
- **No games showing**: Check browser console, might be CORS or JSON error
- **Search not working**: Verify JavaScript not blocked, check console
- **Styling broken**: Hard refresh (Ctrl+F5) to clear CSS cache

### Performance Characteristics
- **File sizes**: HTML(4KB), CSS(4KB), JS(8KB), JSON(204KB)
- **Total bandwidth**: ~220KB on first load
- **Subsequent loads**: Cached (only JSON might refresh)
- **Memory usage**: Minimal (~10MB for 1200+ games in browser)

Always test the complete user journey: serve → load → search → filter → verify functionality.