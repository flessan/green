// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        mobileMenuToggle.querySelector('i').classList.add('fa-bars');
    });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        // Close other open FAQs
        document.querySelectorAll('.faq-answer').forEach(item => {
            if (item !== answer) {
                item.style.maxHeight = null;
                item.classList.remove('active');
            }
        });
        document.querySelectorAll('.faq-question i').forEach(i => {
            if (i !== icon) i.style.transform = 'rotate(0deg)';
        });

        // Toggle current
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            answer.classList.remove('active');
            icon.style.transform = 'rotate(0deg)';
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            answer.classList.add('active');
            icon.style.transform = 'rotate(180deg)';
        }
    });
});

// Carbon Calculator Logic
const carbonForm = document.getElementById('carbonForm');
const resultValue = document.getElementById('resultValue');
let carbonChart = null;

carbonForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const transport = parseFloat(document.getElementById('transport').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const diet = parseFloat(document.getElementById('diet').value) || 0;

    // Simplified calculation logic
    // Transport: 0.2kg per km, Electricity: 0.5kg per kWh (monthly converted to daily), Diet factor
    const dailyTransport = transport * 0.2;
    const dailyElectricity = (electricity * 0.5) / 30;
    const dailyDiet = diet;

    const total = dailyTransport + dailyElectricity + dailyDiet;

    // Animate result number
    animateValue(resultValue, 0, total, 1000);

    // Update Chart
    updateChart(dailyTransport, dailyElectricity, dailyDiet);
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2) + " kg CO₂";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateChart(trans, elec, diet) {
    const ctx = document.getElementById('carbonChart').getContext('2d');

    if (carbonChart) {
        carbonChart.destroy();
    }

    carbonChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Transportasi', 'Listrik', 'Makanan'],
            datasets: [{
                data: [trans, elec, diet],
                backgroundColor: [
                    '#FACC15', // Yellow
                    '#38BDF8', // Blue
                    '#F87171'  // Red
                ],
                borderWidth: 3,
                borderColor: '#14532D'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Quicksand', size: 12 },
                        color: '#14532D'
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

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
window.toggleMemberDetails = function (memberId) {
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
    if (loading) loading.style.display = 'block';
    grid.innerHTML = '';

    // Fetch CSV data
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            // Hide loading indicator
            if (loading) loading.style.display = 'none';

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
        error: function (error) {
            if (loading) loading.style.display = 'none';
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
    const loading = document.querySelector('.loading-members');
    if (loading) loading.style.display = 'none';

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
        if (noResult) noResult.style.display = 'block';
        if (viewMoreBtn) viewMoreBtn.classList.add('hidden');
        return;
    }

    if (noResult) noResult.style.display = 'none';

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
    if (typeof AOS !== 'undefined') AOS.refresh();

    // Show/hide view more button
    if (viewMoreBtn) {
        if (isSearching || (currentPage * membersPerPage) >= filteredMembers.length) {
            viewMoreBtn.classList.add('hidden');
        } else {
            viewMoreBtn.classList.remove('hidden');
        }
    }
}

// View More Button Logic
const viewMoreBtn = document.getElementById('viewMoreBtn');
if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', function () {
        currentPage++;
        displayMembers();
    });
}

// Search Filter
const searchInput = document.getElementById('anggotaSearchInput');
const searchBtn = document.getElementById('anggotaSearchBtn');

function filterMembers() {
    const query = searchInput.value.toLowerCase().trim();
    isSearching = query.length > 0;

    if (isSearching) {
        filteredMembers = allMembers.filter(member =>
            (member['Nama'] && member['Nama'].toLowerCase().includes(query)) ||
            (member['Kelas'] && member['Kelas'].toLowerCase().includes(query)) ||
            (member['Divisi'] && member['Divisi'].toLowerCase().includes(query))
        );
    } else {
        filteredMembers = [...allMembers];
    }

    currentPage = 1;
    displayMembers();
}

if (searchBtn) searchBtn.addEventListener('click', filterMembers);
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterMembers();
        else filterMembers(); // Realtime search
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', loadAllMembers);