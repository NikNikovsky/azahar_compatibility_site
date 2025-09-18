class CompatibilityList {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.searchTerm = '';
        this.filters = {
            playable: true,
            partial: true,
            unplayable: true
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
        const filterPlayable = document.getElementById('filterPlayable');
        const filterPartial = document.getElementById('filterPartial');
        const filterUnplayable = document.getElementById('filterUnplayable');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        filterPlayable.addEventListener('change', (e) => {
            this.filters.playable = e.target.checked;
            this.applyFilters();
        });
        
        filterPartial.addEventListener('change', (e) => {
            this.filters.partial = e.target.checked;
            this.applyFilters();
        });
        
        filterUnplayable.addEventListener('change', (e) => {
            this.filters.unplayable = e.target.checked;
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
            const matchesCompatibility = 
                (this.filters.playable && compatibility >= 99) ||
                (this.filters.partial && compatibility >= 50 && compatibility < 99) ||
                (this.filters.unplayable && compatibility < 50);
            
            return matchesSearch && matchesCompatibility;
        });
        
        this.renderGames();
    }
    
    getCompatibilityClass(compatibility) {
        if (compatibility >= 99) return 'playable';
        if (compatibility >= 50) return 'partial';
        return 'unplayable';
    }
    
    getCompatibilityText(compatibility) {
        if (compatibility >= 99) return 'Playable';
        if (compatibility >= 50) return 'Partial';
        return 'Unplayable';
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
            
            return `
                <div class="game-item">
                    <div class="game-info">
                        <h3>${this.escapeHtml(game.title)}</h3>
                        <div class="game-id">ID: ${gameId}</div>
                    </div>
                    <div class="compatibility-badge compatibility-${compatibilityClass}">
                        ${compatibilityText} (${game.compatibility}%)
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