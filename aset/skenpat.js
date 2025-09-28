// Tab functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                document.getElementById('anggotaSearchInput').value = '';
                anggotaSearchFilter();
            });
        });

        // Anggota search logic
        function anggotaSearchFilter() {
            const input = document.getElementById('anggotaSearchInput').value.trim().toLowerCase();
            const activeTab = document.querySelector('.tab-content.active');
            const items = activeTab.querySelectorAll('.member-item');
            let found = 0;
            items.forEach(item => {
                item.classList.remove('highlight');
                if (input === "" || item.textContent.toLowerCase().includes(input)) {
                    item.style.display = "";
                    if (input && item.textContent.toLowerCase().includes(input)) {
                        item.classList.add('highlight');
                        found++;
                    }
                } else {
                    item.style.display = "none";
                }
            });
            const noResult = document.getElementById('anggotaNoResult');
            if (input && found === 0) {
                noResult.style.display = '';
            } else {
                noResult.style.display = 'none';
            }
        }
        document.getElementById('anggotaSearchInput').addEventListener('input', anggotaSearchFilter);
        document.getElementById('anggotaSearchBtn').addEventListener('click', anggotaSearchFilter);

        // Scroll to top functionality
        const scrollTopButton = document.querySelector('.scroll-top');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('active');
            } else {
                scrollTopButton.classList.remove('active');
            }
        });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Animate stats on scroll
        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;
        const animateStats = () => {
            const statsSection = document.querySelector('.stats-grid');
            if (!statsSection) return;
            const statsPosition = statsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (statsPosition < screenPosition && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = stat.innerText;
                    let count = 0;
                    const isPercentage = target.includes('%');
                    const isPlus = target.includes('+');
                    const isText = isNaN(parseInt(target));
                    if (isText) {
                        stat.style.opacity = '0';
                        setTimeout(() => {
                            stat.style.transition = 'opacity 1s ease';
                            stat.style.opacity = '1';
                        }, 300);
                        return;
                    }
                    const numValue = parseInt(target);
                    const increment = numValue / 700;
                    const updateCount = () => {
                        count += increment;
                        if (count < numValue) {
                            stat.innerText = Math.floor(count) + (isPlus ? '+' : '') + (isPercentage ? '%' : '');
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
            }
        };
        window.addEventListener('scroll', animateStats);
        window.addEventListener('load', animateStats);

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.padding = '0.5rem 0';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.padding = '';
                header.style.boxShadow = '';
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
