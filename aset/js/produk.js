// Products-specific JavaScript functions
function initProducts() {
    // Add to cart animation
    const buyButtons = document.querySelectorAll('.showcase-btn');
    
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.href.includes('whatsapp.com')) {
                e.preventDefault();
                
                // Add animation
                this.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fab fa-whatsapp"></i> Beli Sekarang';
                    this.style.background = '#25D366';
                }, 2000);
            }
        });
    });
    
    // Product image zoom on hover
    const productImages = document.querySelectorAll('.showcase-image img');
    
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.product-showcase')) {
        initProducts();
    }
});