document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('nav ul');
    
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenuToggle.classList.toggle('open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.flexDirection = 'column';
            navLinks.style.backgroundColor = 'white';
            navLinks.style.padding = '1.5rem';
            navLinks.style.boxShadow = 'var(--shadow-md)';
            navLinks.style.borderRadius = '0 0 var(--radius-lg) var(--radius-lg)';
            navLinks.style.zIndex = '1000';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target) && window.innerWidth <= 768 && navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
            mobileMenuToggle.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'static';
            navLinks.style.flexDirection = 'row';
            navLinks.style.backgroundColor = 'transparent';
            navLinks.style.padding = '0';
            navLinks.style.boxShadow = 'none';
            navLinks.style.borderRadius = '0';
            navLinks.style.zIndex = 'auto';
        } else if (navLinks.style.display === 'flex' && !mobileMenuToggle.classList.contains('open')) {
            navLinks.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                    mobileMenuToggle.classList.remove('open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // FAB (Floating Action Button) for Social Sharing
    const fabMain = document.getElementById('fabMain');
    const fabOptions = document.getElementById('fabOptions');

    fabMain.addEventListener('click', () => {
        const isExpanded = fabMain.classList.toggle('active');
        fabMain.setAttribute('aria-expanded', isExpanded);
        fabOptions.classList.toggle('active');
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved dark mode preference or OS preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update chart colors if chart exists
        if (window.carbonChart) {
            window.carbonChart.options.plugins.legend.labels.color = isDark ? '#F5F5F5' : '#212121';
            window.carbonChart.update();
        }
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.toggle('active');
            
            // Close other items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.parentElement.classList.remove('active');
                }
            });
            
            // Update ARIA attributes
            question.setAttribute('aria-expanded', isActive);
        });
    });

    // Carbon Calculator
    const carbonForm = document.getElementById('carbonForm');
    const resultContainer = document.getElementById('resultContainer');
    const resultValue = document.getElementById('resultValue');
    const resultText = document.getElementById('resultText');

    carbonForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transport = parseFloat(document.getElementById('transport').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const diet = parseFloat(document.getElementById('diet').value) || 0;
        const consumption = parseFloat(document.getElementById('consumption').value) || 0;
        
        const transportCO2 = transport * 0.21;
        const electricityCO2 = (electricity / 30) * 0.5;
        const dietCO2 = diet;
        const consumptionCO2 = consumption * 0.5;
        
        const totalCO2 = transportCO2 + electricityCO2 + dietCO2 + consumptionCO2;
        
        resultValue.textContent = `${totalCO2.toFixed(2)} kg CO₂/hari`;
        
        let impactText = '';
        if (totalCO2 < 5) {
            impactText = 'Jejak karbon Anda RENDAH. Teruskan gaya hidup ramah lingkungan!';
        } else if (totalCO2 < 10) {
            impactText = 'Jejak karbon Anda SEDANG. Ada ruang untuk perbaikan.';
        } else {
            impactText = 'Jejak karbon Anda TINGGI. Segera kurangi emisi karbon Anda!';
        }
        resultText.textContent = impactText;
        
        resultContainer.classList.add('show');
        
        const ctx = document.getElementById('carbonChart').getContext('2d');
        
        if (window.carbonChart) {
            window.carbonChart.destroy();
        }
        
        window.carbonChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Transportasi', 'Listrik', 'Makanan', 'Konsumsi'],
                datasets: [{
                    data: [transportCO2, electricityCO2, dietCO2, consumptionCO2],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: {
                            color: document.body.classList.contains('dark-mode') ? '#F5F5F5' : '#212121'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.toFixed(2)} kg CO₂`;
                            }
                        }
                    }
                }
            }
        });
        
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Daily Tips Rotation
    const dailyTips = [
        "Bawa botol minum sendiri untuk mengurangi penggunaan botol plastik sekali pakai!",
        "Gunakan tas belanja kain saat berbelanja untuk mengurangi penggunaan plastik.",
        "Matikan lampu dan peralatan elektronik saat tidak digunakan untuk hemat energi.",
        "Pisahkan sampah organik dan anorganik di rumah untuk memudahkan daur ulang.",
        "Tanam tanaman di rumah untuk meningkatkan kualitas udara dan keindahan."
    ];
    let currentTipIndex = 0;

    function updateDailyTip() {
        currentTipIndex = (currentTipIndex + 1) % dailyTips.length;
        document.getElementById('dailyTipContent').textContent = dailyTips[currentTipIndex];
        document.getElementById('tipCounter').textContent = '24';
    }
    // Update tip every 24 hours (for demo, every 10 seconds)
    setInterval(updateDailyTip, 10000); 

    // CSV URL
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSVjlUDiSO3obszont2H4MXDXwhj6mQCbIGjC5Skwhlmq_zjq-_qyky2oFcdT7d56z-4-lAZgC2Mk0J/pub?output=csv';

    // Global variables for member data and pagination
    let allMembers = [];
    let filteredMembers = [];
    let currentPage = 1;
    const membersPerPage = 6;
    let isSearching = false;

    // Function to create member card from CSV data
    function createMemberCard(memberData, index) {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index % 12) * 100);
        
        // Extract data from CSV
        const timestamp = memberData['Timestamp'] || '';
        const nama = memberData['Nama'] || '';
        const kelas = memberData['Kelas'] || '';
        const divisi = memberData['Divisi'] || '';
        const keyakinan = memberData['Seberapa yakin kamu akan aktif di Green Generation?'] || '';
        const tantangan = memberData['Apa tantangan yang menurut kamu bisa bikin kamu malas/mundur dari GG?'] || '';
        const alasan = memberData['Apa alasan kamu bergabung di Green Generation?'] || '';
        const waktu = memberData['Kalau ada kegiatan sekolah lain, bagaimana caramu membagi waktu agar tetap aktif di GG?'] || '';
        const ide = memberData['Apa ide atau program lingkungan yang pengen banget kamu lakukan bersama GG?'] || '';
        const janji = memberData['Tulis satu janji sederhana kamu untuk aktif berpartisipasi yang akan kamu lakukan bersama GG.'] || '';
        const alasanYakin = memberData['Apa alasan kamu yakin bisa aktif di Green Generation?'] || '';
        const kendala = memberData['Kalau kamu punya kendala, ide, atau kritik tentang kegiatan GG, apakah kamu bersedia menyampaikannya secara terbuka di grup (atau langsung ke pengurus)?'] || '';
        const saran = memberData['Apakah kamu punya saran atau ide untuk membuat Green Generation lebih seru, aktif, dan bermanfaat ke depannya?'] || '';
        
        // Generate a unique ID for this member card
        const memberId = `member-${index}`;
        
        card.innerHTML = `
            <div class="member-header">
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="member-name">${nama}</div>
                <div class="member-class">${kelas}</div>
                <div class="member-division">${divisi}</div>
            </div>
            <div class="member-preview">
                <div class="member-preview-item">
                    <i class="fas fa-heart"></i>
                    <div>
                        <h4>Keyakinan Aktif</h4>
                        <p>${keyakinan}</p>
                    </div>
                </div>
                <div class="member-preview-item">
                    <i class="fas fa-lightbulb"></i>
                    <div>
                        <h4>Alasan Bergabung</h4>
                        <p>${alasan.length > 80 ? alasan.substring(0, 80) + '...' : alasan}</p>
                    </div>
                </div>
            </div>
            <div class="member-details" id="${memberId}">
                <div class="member-info">
                    <h4><i class="fas fa-heart"></i> Tingkat Keyakinan Aktif</h4>
                    <p>${keyakinan}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-exclamation-triangle"></i> Tantangan yang Dihadapi</h4>
                    <p>${tantangan}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-question-circle"></i> Alasan Bergabung</h4>
                    <p>${alasan}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-clock"></i> Pembagian Waktu</h4>
                    <p>${waktu}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-lightbulb"></i> Ide Program</h4>
                    <p>${ide}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-handshake"></i> Janji Partisipasi</h4>
                    <p>${janji}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-check-circle"></i> Alasan Yakin Aktif</h4>
                    <p>${alasanYakin}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-comments"></i> Kendala dan Kritik</h4>
                    <p>${kendala}</p>
                </div>
                <div class="member-info">
                    <h4><i class="fas fa-star"></i> Saran untuk GG</h4>
                    <p>${saran}</p>
                </div>
            </div>
            <div class="member-footer">
                Bergabung pada: ${timestamp}
            </div>
            <button class="member-toggle-btn" id="toggle-${memberId}" onclick="toggleMemberDetails('${memberId}')">
                <span>Lihat Selengkapnya</span>
                <i class="fas fa-chevron-down"></i>
            </button>
        `;
        
        return card;
    }

    // Function to toggle member details
    window.toggleMemberDetails = function(memberId) {
        const details = document.getElementById(memberId);
        const toggleBtn = document.getElementById(`toggle-${memberId}`);
        
        if (details.classList.contains('expanded')) {
            details.classList.remove('expanded');
            toggleBtn.classList.remove('expanded');
            toggleBtn.querySelector('span').textContent = 'Lihat Selengkapnya';
            toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            details.classList.add('expanded');
            toggleBtn.classList.add('expanded');
            toggleBtn.querySelector('span').textContent = 'Tampilkan Lebih Sedikit';
            toggleBtn.setAttribute('aria-expanded', 'true');
            
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                const cardTop = toggleBtn.getBoundingClientRect().top + window.pageYOffset;
                const cardHeight = toggleBtn.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (cardTop + cardHeight > windowHeight + window.pageYOffset) {
                    window.scrollTo({
                        top: cardTop - windowHeight + cardHeight + 20,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // Function to load and display CSV data
    function loadAllMembers() {
        const grid = document.getElementById('membersGrid');
        const loading = document.getElementById('loadingMembers');
        
        // Show loading indicator
        loading.style.display = 'block';
        grid.innerHTML = '';
        
        // Fetch CSV data
        Papa.parse(csvUrl, {
            download: true,
            header: true,
            complete: function(results) {
                // Hide loading indicator
                loading.style.display = 'none';
                
                // Check if data is valid
                if (!results.data || results.data.length === 0) {
                    grid.innerHTML = '<div class="no-search-result"><i class="fas fa-exclamation-triangle"></i><p>Tidak ada data anggota yang tersedia.</p></div>';
                    return;
                }
                
                // Store all data
                allMembers = results.data.filter(row => row['Nama'] && row['Nama'].trim() !== '');
                filteredMembers = [...allMembers];
                
                // Check if filtered members exist
                if (filteredMembers.length === 0) {
                    grid.innerHTML = '<div class="no-search-result"><i class="fas fa-exclamation-triangle"></i><p>Tidak ada data anggota yang valid.</p></div>';
                    return;
                }
                
                // Display first page
                currentPage = 1;
                displayMembers();
            },
            error: function(error) {
                loading.style.display = 'none';
                grid.innerHTML = '<div class="no-search-result"><i class="fas fa-exclamation-triangle"></i><p>Gagal memuat data. Silakan coba lagi nanti.</p></div>';
                console.error('Error parsing CSV:', error);
            }
        });
    }

    // Function to display members with pagination
    function displayMembers() {
        const grid = document.getElementById('membersGrid');
        const noResult = document.getElementById('anggotaNoResult');
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        
        // Clear grid but keep loading state if it's the first load
        if (currentPage === 1) {
            grid.innerHTML = '';
        } else {
            // Remove loading indicator if it exists
            const existingLoading = grid.querySelector('.loading');
            if (existingLoading) {
                existingLoading.remove();
            }
        }
        
        // If no members
        if (filteredMembers.length === 0) {
            noResult.style.display = 'block';
            viewMoreBtn.classList.add('hidden');
            return;
        }
        
        noResult.style.display = 'none';
        
        // Calculate start and end index
        const startIndex = (currentPage - 1) * membersPerPage;
        const endIndex = isSearching ? filteredMembers.length : startIndex + membersPerPage;
        const membersToShow = isSearching ? filteredMembers : filteredMembers.slice(startIndex, endIndex);
        
        // Create member cards
        membersToShow.forEach((member, index) => {
            const card = createMemberCard(member, startIndex + index);
            grid.appendChild(card);
        });
        
        // Refresh AOS for new elements
        AOS.refresh();
        
        // Show/hide view more button
        if (isSearching || endIndex >= filteredMembers.length) {
            viewMoreBtn.classList.add('hidden');
        } else {
            viewMoreBtn.classList.remove('hidden');
        }
    }

    // Search functionality
    const searchInput = document.getElementById('anggotaSearchInput');
    const searchBtn = document.getElementById('anggotaSearchBtn');
    const noResult = document.getElementById('anggotaNoResult');
    let searchTimeout;

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Reset to all members
            isSearching = false;
            filteredMembers = [...allMembers];
            currentPage = 1;
        } else {
            // Filter members
            isSearching = true;
            filteredMembers = allMembers.filter(member => {
                // Check all fields for search term
                const searchableText = Object.values(member).join(' ').toLowerCase();
                return searchableText.includes(searchTerm);
            });
        }
        
        displayMembers();
    }
    
    // Debounce search input
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // View more button functionality
    document.getElementById('viewMoreBtn').addEventListener('click', function() {
        currentPage++;
        displayMembers();
    });

    // Progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progressBar').style.width = scrolled + '%';
    });

    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimelineItems() {
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight * 0.8) {
                item.classList.add('show');
            }
        });
    }
    
    window.addEventListener('scroll', checkTimelineItems);
    checkTimelineItems(); // Check on load

    // Load all members on page load
    loadAllMembers();
});