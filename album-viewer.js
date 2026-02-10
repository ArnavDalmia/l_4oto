// album-viewer.js - Display photos from a specific album

// Get album slug from URL parameter
function getAlbumSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('album');
}

// Load specific album data
async function loadAlbum(slug) {
    try {
        const response = await fetch(`/content/albums/${slug}.json`);
        if (!response.ok) {
            throw new Error('Album not found');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load album:', error);
        return null;
    }
}

// Render album header
function renderAlbumHeader(album) {
    document.getElementById('albumTitle').textContent = album.title || 'Untitled Album';
    
    const description = document.getElementById('albumDescription');
    if (album.description) {
        description.textContent = album.description;
        description.style.display = 'block';
    } else {
        description.style.display = 'none';
    }
    
    // Update page title
    document.title = `${album.title} - l_4oto`;
}

// Render photo gallery
function renderGallery(photos) {
    const container = document.getElementById('galleryContainer');
    
    if (!photos || !photos.length) {
        container.innerHTML = '<p style="color: #aaa; text-align: center;">No photos in this album yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openLightbox(index);
        
        const img = document.createElement('img');
        img.src = photo.image;
        img.alt = photo.alt || photo.caption || 'Photo';
        img.loading = 'lazy';
        
        item.appendChild(img);
        
        if (photo.caption) {
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = photo.caption;
            item.appendChild(caption);
        }
        
        container.appendChild(item);
    });
}

// Lightbox functionality
let currentPhotos = [];
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    
    const photo = currentPhotos[index];
    img.src = photo.image;
    img.alt = photo.alt || photo.caption || 'Photo';
    
    if (photo.caption) {
        caption.textContent = photo.caption;
        caption.style.display = 'block';
    } else {
        caption.style.display = 'none';
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevPhoto() {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    openLightbox(currentIndex);
}

function showNextPhoto() {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    openLightbox(currentIndex);
}

// Initialize page
async function initAlbumViewer() {
    const slug = getAlbumSlug();
    
    if (!slug) {
        document.getElementById('albumTitle').textContent = 'Album not found';
        document.getElementById('galleryContainer').innerHTML = '<p style="color: #aaa; text-align: center;">No album specified.</p>';
        return;
    }
    
    const album = await loadAlbum(slug);
    
    if (!album) {
        document.getElementById('albumTitle').textContent = 'Album not found';
        document.getElementById('galleryContainer').innerHTML = '<p style="color: #aaa; text-align: center;">Could not load album.</p>';
        return;
    }
    
    renderAlbumHeader(album);
    currentPhotos = album.photos || [];
    renderGallery(currentPhotos);
    
    // Setup lightbox controls
    document.getElementById('lightboxClose').onclick = closeLightbox;
    document.getElementById('lightboxPrev').onclick = showPrevPhoto;
    document.getElementById('lightboxNext').onclick = showNextPhoto;
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lightbox').classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevPhoto();
        if (e.key === 'ArrowRight') showNextPhoto();
    });
    
    // Close on background click
    document.getElementById('lightbox').onclick = (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    };
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlbumViewer);
} else {
    initAlbumViewer();
}
