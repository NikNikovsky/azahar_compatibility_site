class CompatibilityList {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.searchTerm = '';
        this.filters = {
            perfect: true,
            playable: true,
            unplayable: true,
            untested: true
        };
        
        this.init();
    }
    
    async init() {
        await this.loadCompatibilityData();
        this.setupEventListeners();
        this.renderGames();
    }
    
    async loadCompatibilityData() {
        const loadingMessage = document.getElementById('loadingMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        try {
            // Try to fetch from the official azahar compatibility list repository first
            let response;
            try {
                response = await fetch('https://raw.githubusercontent.com/azahar-emu/compatibility-list/master/compatibility_list.json');
                if (!response.ok) {
                    throw new Error(`GitHub fetch failed: ${response.status}`);
                }
            } catch (githubError) {
                console.log('GitHub fetch failed, trying local fallback:', githubError.message);
                // Fallback to local file if GitHub is not accessible
                response = await fetch('./compatibility_list.json');
                if (!response.ok) {
                    throw new Error(`Local fetch failed: ${response.status}`);
                }
            }
            
            this.games = await response.json();
            loadingMessage.style.display = 'none';
            this.filteredGames = [...this.games];
        } catch (error) {
            console.error('Failed to fetch compatibility data:', error);
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterPerfect = document.getElementById('filterPerfect');
        const filterPlayable = document.getElementById('filterPlayable');
        const filterUnplayable = document.getElementById('filterUnplayable');
        const filterUntested = document.getElementById('filterUntested');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        filterPerfect.addEventListener('change', (e) => {
            this.filters.perfect = e.target.checked;
            this.applyFilters();
        });
        
        filterPlayable.addEventListener('change', (e) => {
            this.filters.playable = e.target.checked;
            this.applyFilters();
        });
        
        filterUnplayable.addEventListener('change', (e) => {
            this.filters.unplayable = e.target.checked;
            this.applyFilters();
        });
        
        filterUntested.addEventListener('change', (e) => {
            this.filters.untested = e.target.checked;
            this.applyFilters();
        });
    }
    
    applyFilters() {
        this.filteredGames = this.games.filter(game => {
            // Search filter
            const matchesSearch = !this.searchTerm || 
                game.title.toLowerCase().includes(this.searchTerm) ||
                (game.releases && game.releases.some(release => 
                    release.id.toLowerCase().includes(this.searchTerm)
                ));
            
            // Compatibility filter
            const compatibility = game.compatibility;
            const compatibilityClass = this.getCompatibilityClass(compatibility);
            const matchesCompatibility = 
                (this.filters.perfect && compatibilityClass === 'perfect') ||
                (this.filters.playable && compatibilityClass === 'playable') ||
                (this.filters.unplayable && compatibilityClass === 'unplayable') ||
                (this.filters.untested && compatibilityClass === 'untested');
            
            return matchesSearch && matchesCompatibility;
        });
        
        this.renderGames();
    }
    
    getCompatibilityClass(compatibility) {
        if (compatibility === 99) return 'untested';
        if (compatibility <= 1) return 'perfect';
        if (compatibility <= 3) return 'playable';
        return 'unplayable';
    }
    
    getCompatibilityText(compatibility) {
        if (compatibility === 99) return 'Untested';
        if (compatibility === 0) return 'Perfect';
        if (compatibility === 1) return 'Great';
        if (compatibility === 2) return 'Good';
        if (compatibility === 3) return 'OK';
        if (compatibility === 4) return 'Poor';
        if (compatibility === 5) return 'Bad';
        return 'Unknown';
    }
    
    renderGames() {
        const gameList = document.getElementById('gameList');
        const gameCount = document.getElementById('gameCount');
        
        gameCount.textContent = this.filteredGames.length;
        
        if (this.filteredGames.length === 0) {
            gameList.innerHTML = `
                <div class="no-results">
                    <h3>No games found</h3>
                    <p>Try adjusting your search term or filter settings.</p>
                </div>
            `;
            return;
        }
        
        gameList.innerHTML = this.filteredGames.map(game => {
            const compatibilityClass = this.getCompatibilityClass(game.compatibility);
            const compatibilityText = this.getCompatibilityText(game.compatibility);
            const gameId = game.releases && game.releases.length > 0 ? game.releases[0].id : 'N/A';
            const githubSearchUrl = `https://github.com/azahar-emu/azahar/issues?q=is%3Aissue+${encodeURIComponent(game.title)}`;
            
            return `
                <div class="game-item compatibility-${compatibilityClass}">
                    <div class="game-info">
                        <h3>${this.escapeHtml(game.title)}</h3>
                        <div class="game-id">ID: ${gameId}</div>
                    </div>
                    <div class="game-actions">
                        <a href="${githubSearchUrl}" target="_blank" rel="noopener noreferrer" class="github-link" title="Search for issues about this game">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                        </a>
                        <div class="compatibility-badge compatibility-${compatibilityClass}">
                            ${compatibilityText} (${game.compatibility})
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the compatibility list when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CompatibilityList();
});