// albums.js - Dynamically load albums from CMS data

// Parse frontmatter from markdown files
function parseFrontmatter(text) {
    const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const frontmatter = {};
    const lines = match[1].split('\n');
    let currentKey = null;
    let inList = false;
    let listItems = [];
    
    lines.forEach(line => {
        // Handle list items
        if (line.trim().startsWith('- ')) {
            if (line.includes(':')) {
                // New object in list
                if (listItems.length && Object.keys(listItems[listItems.length - 1]).length) {
                    // Current object is complete, start new one
                }
                const [key, value] = line.substring(2).split(':').map(s => s.trim());
                if (!listItems.length || Object.keys(listItems[listItems.length - 1]).length > 0) {
                    listItems.push({});
                }
                listItems[listItems.length - 1][key] = value;
            } else {
                // Simple list item
                listItems.push(line.substring(2).trim());
            }
            inList = true;
        } else if (line.includes(':') && !line.startsWith(' ')) {
            // Save previous list if exists
            if (inList && currentKey && listItems.length) {
                frontmatter[currentKey] = listItems;
                listItems = [];
                inList = false;
            }
            
            // Parse key-value pair
            const colonIndex = line.indexOf(':');
            currentKey = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            
            if (value) {
                // Parse value - handle numbers and strings
                if (!isNaN(value) && value !== '') {
                    frontmatter[currentKey] = Number(value);
                } else {
                    frontmatter[currentKey] = value;
                }
            } else {
                // Empty value means list might follow
                inList = true;
                listItems = [];
            }
        } else if (line.trim().startsWith('image:') || line.trim().startsWith('caption:') || line.trim().startsWith('alt:')) {
            // Nested list properties
            const [key, value] = line.trim().split(':').map(s => s.trim());
            if (!listItems.length) listItems.push({});
            listItems[listItems.length - 1][key] = value;
        }
    });
    
    // Save final list if exists
    if (inList && currentKey && listItems.length) {
        frontmatter[currentKey] = listItems;
    }
    
    return frontmatter;
}

// Fetch and parse album data
async function loadAlbums() {
    try {
        // Fetch the albums directory listing
        const albumFiles = ['london-exchange.md']; // You can expand this or fetch dynamically
        
        const albums = [];
        
        for (const file of albumFiles) {
            try {
                const response = await fetch(`/content/albums/${file}`);
                if (!response.ok) continue;
                
                const text = await response.text();
                const data = parseFrontmatter(text);
                
                if (data) {
                    // Count actual photos
                    const photoCount = data.photos ? data.photos.length : 0;
                    albums.push({
                        ...data,
                        count: photoCount,
                        slug: file.replace('.md', '')
                    });
                }
            } catch (err) {
                console.warn(`Failed to load album ${file}:`, err);
            }
        }
        
        // Sort by order
        albums.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        return albums;
    } catch (error) {
        console.error('Failed to load albums:', error);
        return [];
    }
}

// Render albums to the page
function renderAlbums(albums) {
    const container = document.querySelector('.albums-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    if (!albums.length) {
        container.innerHTML = '<p style="color: #aaa; text-align: center; grid-column: 1/-1;">No albums yet. Create one in the admin panel!</p>';
        return;
    }
    
    albums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.onclick = () => openAlbum(album.slug);
        
        card.innerHTML = `
            <div class="album-image">
                <img src="${album.cover || '/assets/placeholder.jpg'}" alt="${album.title}">
                <div class="album-overlay">
                    <h3 class="album-title">${album.title}</h3>
                    <p class="album-count">${album.count} Photo${album.count !== 1 ? 's' : ''}</p>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Open album detail page
function openAlbum(slug) {
    window.location.href = `album.html?album=${slug}`;
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const albums = await loadAlbums();
        renderAlbums(albums);
    });
} else {
    loadAlbums().then(renderAlbums);
}
