// Universal Portfolio Touch/Click Interactions
// Handles overlay activation for project cards on all devices and resolutions

document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    let activeItem = null;

    // Function to check if device has hover capability
    function hasHoverCapability() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    // Function to show overlay
    function showOverlay(item) {
        // Hide any currently active overlay
        if (activeItem && activeItem !== item) {
            activeItem.classList.remove('show-overlay');
        }
        
        // Show this item's overlay
        item.classList.add('show-overlay');
        activeItem = item;
    }

    // Function to hide overlay
    function hideOverlay(item) {
        if (item) {
            item.classList.remove('show-overlay');
            if (activeItem === item) {
                activeItem = null;
            }
        }
    }

    projectItems.forEach(item => {
        // Handle both touch and click events for universal compatibility
        item.addEventListener('click', function(e) {
            // If this item already has overlay visible, allow normal link behavior
            if (item.classList.contains('show-overlay')) {
                // Check if the click was on the project link
                const projectLink = item.querySelector('.project-link');
                if (e.target === projectLink || projectLink.contains(e.target)) {
                    return true; // Allow navigation
                }
            }
            
            // Prevent default to show overlay first
            e.preventDefault();
            e.stopPropagation();
            
            showOverlay(item);
        });

        // Handle touch events specifically for touch devices
        item.addEventListener('touchstart', function(e) {
            // If this item already has overlay visible, allow normal behavior
            if (item.classList.contains('show-overlay')) {
                return;
            }
            
            // Prevent default to avoid hover states and double-tap issues
            e.preventDefault();
            
            showOverlay(item);
        });

        // Handle project link clicks
        const projectLink = item.querySelector('.project-link');
        if (projectLink) {
            projectLink.addEventListener('click', function(e) {
                // Always allow navigation when clicking the project link
                // The overlay should already be visible at this point
                return true;
            });
        }
    });

    // Hide overlay when clicking/touching outside
    document.addEventListener('click', function(e) {
        const clickedElement = e.target;
        const clickedProjectItem = clickedElement.closest('.project-item');
        
        // If we didn't click a project item, hide any active overlay
        if (!clickedProjectItem && activeItem) {
            hideOverlay(activeItem);
        }
    });

    // Handle touch events for hiding overlay
    document.addEventListener('touchstart', function(e) {
        const touchedElement = e.target;
        const touchedProjectItem = touchedElement.closest('.project-item');
        
        // If we didn't touch a project item, hide any active overlay
        if (!touchedProjectItem && activeItem) {
            hideOverlay(activeItem);
        }
    });

    // Handle escape key to hide overlay
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeItem) {
            hideOverlay(activeItem);
        }
    });

    // Handle window resize to ensure compatibility
    window.addEventListener('resize', function() {
        // Reset any active overlays on resize to prevent layout issues
        if (activeItem) {
            hideOverlay(activeItem);
        }
    });
});
