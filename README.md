# Azahar Compatibility Site

A web application that displays the Nintendo 3DS game compatibility database for the Azahar emulator. This site provides an easy-to-use interface for searching and filtering games based on their compatibility status.

## Features

- **Live Data**: Fetches the latest compatibility data directly from the [official azahar-emu repository](https://github.com/azahar-emu/compatibility-list)
- **Search Functionality**: Search games by title or game ID
- **Compatibility Filtering**: Filter games by compatibility status:
   - 0: Perfect – Game works flawlessly
   - 1: Playable – Game works with minor issues
   - 2: Runs – Game runs but with noticeable issues
   - 3: Loads – Game loads but is not playable
   - 4: Boots – Game boots but does not load properly
   - 5: Broken – Game does not work
   - 99: Untested – Game has not been tested yet
- **Clean Interface**: Modern, responsive design that works on desktop and mobile
- **Real-time Results**: Shows the number of games found based on current filters

## Usage

Simply open `index.html` in a web browser or serve it through a web server. The site will automatically:

1. Fetch the latest compatibility data from GitHub
2. Display all 1200+ games in the database
3. Allow you to search and filter the results

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks required)
- **Data Source**: https://raw.githubusercontent.com/azahar-emu/compatibility-list/master/compatibility_list.json
- **Fallback**: Includes local JSON file as backup when GitHub is not accessible
- **Search**: Real-time filtering by game title and ID
- **Responsive**: Mobile-friendly design

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling for the interface
- `script.js` - JavaScript functionality for data fetching and filtering
- `compatibility_list.json` - Local backup of compatibility data
