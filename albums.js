// albums.js - Dynamically load albums from CMS data

// Fetch and parse album data
async function loadAlbums() {
    try {
        // Fetch the albums directory listing
        const albumFiles = ['london-exchange.json']; // You can expand this or fetch dynamically
        
        const albums = [];
        
        for (const file of albumFiles) {
            try {
                const response = await fetch(`/content/albums/${file}`);
                if (!response.ok) continue;
                
                const data = await response.json();
                
                if (data) {
                    // Count actual photos
                    const photoCount = data.photos ? data.photos.length : 0;
                    albums.push({
                        ...data,
                        count: photoCount,
                        slug: file.replace('.json', '')
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
