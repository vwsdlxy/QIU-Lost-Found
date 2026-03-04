/* =====================================================
HOMEPAGE - LOGIN (Simplified for Static Deployment)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const LoginForm = document.getElementById("LoginForm");
    if (LoginForm) {
        LoginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const messageEl = document.getElementById("loginMessage");
            const emailError = document.getElementById("emailError");
            const passwordError = document.getElementById("passwordError");

            // Clear previous errors
            if (emailError) emailError.textContent = "";
            if (passwordError) passwordError.textContent = "";
            if (messageEl) messageEl.textContent = "";

            // --- Email Validation ---
            if (!email) {
                if (emailError) emailError.textContent = "Email is required";
                return;
            }

            const qiuEmailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;
            if (!qiuEmailPattern.test(email)) {
                if (emailError) emailError.textContent = "Please use your QIU email.";
                return;
            }

            // --- Password Validation ---
            if (!password) {
                if (passwordError) passwordError.textContent = "Password is required";
                return;
            }

            // --- Login Success ---
            console.log("Login successful for:", email);

            // Store user info in localStorage
            localStorage.setItem("loggedInEmail", email);
            const userName = email.split('@')[0].replace(/[._-]/g, ' ');
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", Date.now().toString());

            if (messageEl) {
                messageEl.textContent = "Login successful! Redirecting...";
                messageEl.style.color = "green";
            }

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        });
    }
});

/* =====================================================
NAV MENU OVERLAY
===================================================== */
function toggleMenu() {
    const overlay = document.getElementById('menuOverlay');
    const panel = document.getElementById('menuPanel');

    overlay.classList.toggle('active');
    panel.classList.toggle('active');

    if (panel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const panel = document.getElementById('menuPanel');
        if (panel && panel.classList.contains('active')) {
            toggleMenu();
        }
    }
});

/* =====================================================
MULTI-STEP FORM FOR REPORT PAGE
===================================================== */
let currentSection = 1;
const totalSections = 3;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reportForm')) {
        updateProgressBar();

        const phoneInput = document.getElementById('reportContactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
            phoneInput.addEventListener('blur', function() {
                validatePhoneField(this);
            });
        }

        const emailInput = document.getElementById('reportContactEmail');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }

        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const nextBtn = document.getElementById('nextToDetails');
                if (nextBtn) nextBtn.disabled = false;
            });
        });
    }

    // Load items on view page
    if (document.getElementById('itemsContainer')) {
        loadViewItems();
    }

    // Load recent items on dashboard
    if (document.getElementById('recentItemsList')) {
        const userEmail = localStorage.getItem("loggedInEmail");
        if (!userEmail) {
            window.location.href = "login.html";
            return;
        }
        loadRecentItems();

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }

    // Load my reports page
    if (document.getElementById('myReportsContainer')) {
        const userEmail = localStorage.getItem("loggedInEmail");
        if (!userEmail) {
            window.location.href = "login.html";
            return;
        }
        loadMyReports();
    }
});

/* =====================================================
FORM VALIDATION HELPERS
===================================================== */
function validateEmailField(input) {
    const qiuEmailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;
    const formGroup = input.closest('.form-group');
    let errorSpan = document.getElementById('emailError');

    if (input.value && !qiuEmailPattern.test(input.value)) {
        input.style.borderColor = '#dc3545';
        if (!errorSpan) {
            const error = document.createElement('span');
            error.id = 'emailError';
            error.className = 'field-error';
            error.style.color = '#dc3545';
            error.style.fontSize = '0.8rem';
            error.style.marginTop = '0.2rem';
            error.textContent = 'Please use your QIU email (xxxx@qiu.edu.my)';
            if (formGroup) formGroup.appendChild(error);
        }
        return false;
    } else {
        input.style.borderColor = '';
        if (errorSpan) errorSpan.remove();
        return true;
    }
}

function validatePhoneField(input) {
    const digitsOnly = input.value.replace(/\D/g, '');
    const isValidMobile = digitsOnly.length >= 8 && digitsOnly.length <= 10 && digitsOnly.startsWith('1');
    const formGroup = input.closest('.form-group');
    let errorSpan = document.getElementById('phoneError');

    if (input.value && !isValidMobile) {
        input.style.borderColor = '#dc3545';
        if (!errorSpan) {
            const error = document.createElement('span');
            error.id = 'phoneError';
            error.className = 'field-error';
            error.style.color = '#dc3545';
            error.style.fontSize = '0.8rem';
            error.style.marginTop = '0.2rem';
            error.textContent = 'Please enter a valid Malaysian mobile number (8-10 digits after +60, starting with 1)';
            if (formGroup) formGroup.appendChild(error);
            else input.parentNode.parentNode.appendChild(error);
        }
        return false;
    } else {
        input.style.borderColor = '';
        if (errorSpan) errorSpan.remove();
        return true;
    }
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/.test(email);
}

function isValidPhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 8 && digitsOnly.length <= 10 && digitsOnly.startsWith('1');
}

/* =====================================================
MULTI-STEP FORM NAVIGATION
===================================================== */
function nextSection() {
    if (validateSection(currentSection)) {
        if (currentSection < totalSections) {
            document.getElementById(`section${currentSection}`).classList.remove('active');
            document.getElementById(`step${currentSection}`).classList.add('completed');
            document.getElementById(`step${currentSection}`).classList.remove('active');

            currentSection++;
            document.getElementById(`section${currentSection}`).classList.add('active');
            document.getElementById(`step${currentSection}`).classList.add('active');
            updateProgressBar();
        }
    }
}

function prevSection() {
    if (currentSection > 1) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        document.getElementById(`step${currentSection}`).classList.remove('active');
        document.getElementById(`step${currentSection}`).classList.remove('completed');

        currentSection--;
        document.getElementById(`section${currentSection}`).classList.add('active');
        document.getElementById(`step${currentSection}`).classList.add('active');
        updateProgressBar();
    }
}

function validateSection(section) {
    switch(section) {
        case 1:
            if (!document.querySelector('input[name="category"]:checked')) {
                alert('Please select a category (Lost or Found)');
                return false;
            }
            return true;
        case 2:
            const title = document.getElementById('reportTitle').value.trim();
            const description = document.getElementById('reportDescription').value.trim();
            const location = document.getElementById('reportLocation').value.trim();
            if (!title || !description || !location) {
                alert('Please fill in all details fields');
                return false;
            }
            return true;
        case 3:
            const email = document.getElementById('reportContactEmail').value.trim();
            const phone = document.getElementById('reportContactPhone').value.trim();
            const qiuEmailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;

            if (!email && !phone) {
                alert('Please provide at least one contact method');
                return false;
            }
            if (email && !qiuEmailPattern.test(email)) {
                alert('Please use your QIU email (xxxx@qiu.edu.my)');
                return false;
            }
            if (phone) {
                const digitsOnly = phone.replace(/\D/g, '');
                if (!(digitsOnly.length >= 8 && digitsOnly.length <= 10 && digitsOnly.startsWith('1'))) {
                    alert('Please enter a valid Malaysian mobile number (8-10 digits after +60, starting with 1)');
                    return false;
                }
            }
            return true;
        default:
            return true;
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${(currentSection / totalSections) * 100}%`;
    }
}

/* =====================================================
REPORT FORM SUBMISSION — SAVES TO LOCALSTORAGE
===================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (!reportForm) return;

    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateSection(3)) return;

        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        const phoneDigits = document.getElementById('reportContactPhone').value.replace(/\D/g, '');
        const fullPhoneNumber = phoneDigits ? `+60${phoneDigits}` : null;
        const userEmail = localStorage.getItem("loggedInEmail") || "";

        const newItem = {
            id: Date.now(),
            title: document.getElementById('reportTitle').value,
            description: document.getElementById('reportDescription').value,
            category: document.querySelector('input[name="category"]:checked').value,
            location: document.getElementById('reportLocation').value,
            contact_email: document.getElementById('reportContactEmail').value || userEmail || null,
            contact_phone: fullPhoneNumber,
            status: "Active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save to localStorage
        const items = JSON.parse(localStorage.getItem("items")) || [];
        items.push(newItem);
        localStorage.setItem("items", JSON.stringify(items));

        alert("Report submitted successfully!");
        window.location.href = "myreport.html";
    });
});

/* =====================================================
HELPER — ESCAPE HTML
===================================================== */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* =====================================================
VIEW PAGE — LOAD & DISPLAY ITEMS
===================================================== */
let selectedCategory = null;
let selectedStatus = null;

function toggleCategory(category) {
    selectedCategory = (selectedCategory === category) ? null : category;

    document.querySelectorAll('.filter-btn.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === selectedCategory);
    });

    loadViewItems();
}

function toggleStatus(status) {
    selectedStatus = (selectedStatus === status) ? null : status;

    document.querySelectorAll('.filter-btn.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-status') === selectedStatus);
    });

    loadViewItems();
}

function loadViewItems() {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Loading items...</p>
        </div>
    `;

    let items = JSON.parse(localStorage.getItem("items")) || [];

    if (selectedCategory) {
        items = items.filter(item => (item.category || '').toLowerCase() === selectedCategory);
    }

    if (selectedStatus) {
        items = items.filter(item => (item.status || 'active').toLowerCase() === selectedStatus);
    }

    displayViewItems(items);
}

function displayViewItems(items) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    if (!items || items.length === 0) {
        showNoItems(container);
        return;
    }

    container.innerHTML = '';
    items.forEach(item => {
        container.appendChild(createViewItemCard(item));
    });

    setTimeout(checkTruncation, 100);
}

function createViewItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const date = item.created_at ? new Date(item.created_at) : new Date(item.date);
    const formattedDateTime = date.toLocaleDateString('en-MY', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const description = item.description || 'No description provided';
    const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

    const statusDisplay = item.status || 'Active';
    const statusClass = statusDisplay.toLowerCase();
    const statusIcon = statusClass === 'active' ? 'fa-hourglass-half' : 'fa-check-circle';

    card.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">${escapeHtml(item.title)}</h3>
            <span class="category-badge ${item.category.toLowerCase()}">${item.category}</span>
        </div>
        <p class="item-description">${escapeHtml(shortDescription)}</p>
        <div class="item-details">
            <div class="detail-row">
                <i class="fa-solid fa-location-dot"></i>
                <span>${escapeHtml(item.location)}</span>
            </div>
            <div class="detail-row">
                <i class="fa-solid fa-calendar"></i>
                <span>${formattedDateTime}</span>
            </div>
            <div class="detail-row">
                <i class="fa-solid fa-circle-info"></i>
                <span>Status:
                    <span class="status-badge ${statusClass}">
                        <i class="fa-solid ${statusIcon}"></i>
                        ${statusDisplay}
                    </span>
                </span>
            </div>
        </div>
        <button onclick="showItemDetails(${item.id})" class="view-details-btn">
            <i class="fa-solid fa-eye"></i> View Details
        </button>
    `;

    return card;
}

function checkTruncation() {
    document.querySelectorAll('.item-description').forEach(desc => {
        if (desc.scrollHeight > desc.clientHeight) desc.classList.add('truncated');
    });
}

function showNoItems(container, message) {
    const filterDescription = (selectedCategory || selectedStatus) ? ' with selected filters' : '';
    container.innerHTML = `
        <div class="no-items">
            <i class="fa-solid fa-box-open"></i>
            <p>${message || `No items found${filterDescription}`}</p>
            <p class="sub-text">Try adjusting your filters or check back later</p>
        </div>
    `;
}

/* =====================================================
MODAL FUNCTIONS
===================================================== */
function showItemDetails(itemId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const item = items.find(i => i.id == itemId);

    if (item) {
        displayModalWithItem(item);
    } else {
        alert('Item not found');
    }
}

function displayModalWithItem(item) {
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    const createdDate = item.created_at ? new Date(item.created_at) : new Date(item.date);
    const updatedDate = item.updated_at ? new Date(item.updated_at) : new Date();

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedCreated = createdDate.toLocaleString('en-MY', dateOptions);
    const formattedUpdated = updatedDate.toLocaleString('en-MY', dateOptions);

    const statusDisplay = item.status || 'Active';
    const statusClass = statusDisplay.toLowerCase();
    const statusIcon = statusClass === 'active' ? 'fa-hourglass-half' : 'fa-check-circle';

    modalBody.innerHTML = `
        <div class="modal-item-details">
            <h2 class="modal-item-title">${escapeHtml(item.title)}</h2>

            <div class="modal-category-badge ${item.category.toLowerCase()}">
                ${item.category} Item
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-align-left"></i> Description</h3>
                <p>${escapeHtml(item.description || 'No description provided')}</p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-location-dot"></i> Location</h3>
                <p>${escapeHtml(item.location || 'Location not specified')}</p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-address-card"></i> Contact Information</h3>
                <div class="modal-contact-info">
                    ${item.contact_email ? `<div class="modal-contact-item"><i class="fa-solid fa-envelope"></i><span>${escapeHtml(item.contact_email)}</span></div>` : ''}
                    ${item.contact_phone ? `<div class="modal-contact-item"><i class="fa-solid fa-phone"></i><span>${escapeHtml(item.contact_phone)}</span></div>` : ''}
                    ${!item.contact_email && !item.contact_phone ? '<p>No contact information provided</p>' : ''}
                </div>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-circle-info"></i> Status</h3>
                <p>
                    <span class="modal-status-badge ${statusClass}">
                        <i class="fa-solid ${statusIcon}"></i>
                        ${statusDisplay}
                    </span>
                </p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-clock"></i> Timestamps</h3>
                <div class="modal-timestamp">
                    <div><i class="fa-solid fa-calendar-plus"></i> <strong>Created:</strong> ${formattedCreated}</div>
                    <div><i class="fa-solid fa-calendar-check"></i> <strong>Last Updated:</strong> ${formattedUpdated}</div>
                </div>
            </div>

            <div class="modal-actions">
                <button onclick="closeModal()" class="modal-btn modal-btn-primary">
                    <i class="fa-solid fa-check"></i> Got It
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('itemModal');
    if (modal && event.target === modal) closeModal();
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('itemModal');
        if (modal && modal.style.display === 'block') closeModal();
    }
});

/* =====================================================
DASHBOARD — RECENT ITEMS
===================================================== */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("loggedInEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        window.location.href = "login.html";
    }
}

function loadRecentItems() {
    const container = document.getElementById('recentItemsList');
    if (!container) return;

    const items = JSON.parse(localStorage.getItem("items")) || [];

    const recentItems = [...items]
        .sort((a, b) => {
            const da = a.created_at ? new Date(a.created_at) : new Date(a.date || 0);
            const db = b.created_at ? new Date(b.created_at) : new Date(b.date || 0);
            return db - da;
        })
        .slice(0, 4);

    displayRecentItems(recentItems);
}

function displayRecentItems(items) {
    const container = document.getElementById('recentItemsList');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="no-items-message">
                <i class="fa-solid fa-box-open"></i>
                <p>No recent items found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    items.forEach((item, index) => {
        const date = item.created_at ? new Date(item.created_at) : new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-MY', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const statusClass = (item.status || 'active').toLowerCase();
        const categoryClass = item.category.toLowerCase();
        const statusIcon = statusClass === 'active' ? 'fa-hourglass-half' : 'fa-check-circle';

        const itemCard = document.createElement('div');
        itemCard.className = `recent-item-card ${categoryClass}`;
        itemCard.style.setProperty('--item-index', index);

        itemCard.innerHTML = `
            <div class="item-icon ${categoryClass}">
                <i class="fa-solid ${categoryClass === 'lost' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
            </div>
            <div class="item-info">
                <h4>${escapeHtml(item.title)}</h4>
                <p>
                    <i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.location)}
                    <span class="item-status ${statusClass}">
                        <i class="fa-solid ${statusIcon}"></i>
                        ${item.status || 'Active'}
                    </span>
                </p>
                <p><i class="fa-solid fa-clock"></i> ${formattedDate}</p>
            </div>
            <a href="#" onclick="showItemDetails(${item.id}); return false;" class="view-link">
                View <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;

        container.appendChild(itemCard);
    });
}

/* =====================================================
MY REPORTS PAGE
===================================================== */
function loadMyReports() {
    const userEmail = localStorage.getItem("loggedInEmail");
    if (!userEmail) return;

    const items = JSON.parse(localStorage.getItem("items")) || [];

    const userReports = items.filter(item =>
        item.contact_email && item.contact_email.toLowerCase() === userEmail.toLowerCase()
    );

    updateReportCount(userReports.length);
    window.allUserReports = userReports;
    displayMyReports(userReports);
}

function updateReportCount(count) {
    const el = document.getElementById('reportCount');
    if (el) el.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
}

function displayMyReports(reports) {
    const container = document.getElementById('myReportsContainer');
    if (!container) return;

    if (!reports || reports.length === 0) {
        container.innerHTML = `
            <div class="no-items">
                <i class="fa-solid fa-box-open"></i>
                <p>You haven't reported any items yet</p>
                <p class="sub-text">Click "New Report" to get started</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    const sorted = [...reports].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at) : new Date(a.date || 0);
        const db = b.created_at ? new Date(b.created_at) : new Date(b.date || 0);
        return db - da;
    });

    sorted.forEach(report => container.appendChild(createMyReportCard(report)));
}

function createMyReportCard(report) {
    const card = document.createElement('div');
    card.className = `myreport-card ${report.category.toLowerCase()}`;
    card.setAttribute('data-category', report.category.toLowerCase());
    card.setAttribute('data-status', (report.status || 'active').toLowerCase());
    card.setAttribute('data-id', report.id);

    const reportDate = report.created_at ? new Date(report.created_at) : new Date(report.date || Date.now());
    const formattedDate = reportDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = reportDate.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });

    const description = report.description || 'No description provided';
    const shortDescription = description.length > 80 ? description.substring(0, 80) + '...' : description;

    const statusDisplay = report.status || 'Active';
    const statusClass = statusDisplay.toLowerCase();
    const statusIcon = statusClass === 'active' ? 'fa-hourglass-half' : 'fa-check-circle';

    card.innerHTML = `
        <div class="myreport-header">
            <div class="myreport-type-badge ${report.category.toLowerCase()}">
                <i class="fa-solid ${report.category.toLowerCase() === 'lost' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
                ${report.category}
            </div>
            <div class="myreport-status ${statusClass}">
                <i class="fa-solid ${statusIcon}"></i>
                ${statusDisplay}
            </div>
        </div>

        <h3 class="myreport-title">${escapeHtml(report.title)}</h3>
        <p class="myreport-description">${escapeHtml(shortDescription)}</p>

        <div class="myreport-meta">
            <div class="meta-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${escapeHtml(report.location || 'Location not specified')}</span>
            </div>
            <div class="meta-item">
                <i class="fa-solid fa-calendar"></i>
                <span>${formattedDate} at ${formattedTime}</span>
            </div>
        </div>

        <div class="myreport-actions">
            <button onclick="showMyReportDetails(${report.id})" class="action-btn view-btn">
                <i class="fa-solid fa-eye"></i> View Details
            </button>
            ${statusClass === 'active' ?
                `<button onclick="markAsClaimedFromMyReports(${report.id})" class="action-btn claim-btn">
                    <i class="fa-solid fa-check-circle"></i> Mark Claimed
                </button>` :
                `<button class="action-btn claimed-btn" disabled>
                    <i class="fa-solid fa-check-circle"></i> Claimed
                </button>`
            }
            <button onclick="deleteReportFromMyReports(${report.id})" class="action-btn delete-btn">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

function filterMyReports(filterType) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const tabId = `tab${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
    const tabEl = document.getElementById(tabId);
    if (tabEl) tabEl.classList.add('active');

    if (!window.allUserReports) return;

    let filtered = window.allUserReports;

    switch(filterType) {
        case 'lost':    filtered = filtered.filter(r => r.category.toLowerCase() === 'lost'); break;
        case 'found':   filtered = filtered.filter(r => r.category.toLowerCase() === 'found'); break;
        case 'active':  filtered = filtered.filter(r => (r.status || 'active').toLowerCase() === 'active'); break;
        case 'claimed': filtered = filtered.filter(r => (r.status || 'active').toLowerCase() === 'claimed'); break;
    }

    displayMyReports(filtered);
}

function showMyReportDetails(itemId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const item = items.find(i => i.id == itemId);

    if (item) {
        displayMyReportModal(item);
    } else {
        alert('Report not found');
    }
}

function displayMyReportModal(item) {
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    const createdDate = item.created_at ? new Date(item.created_at) : new Date(item.date || Date.now());
    const updatedDate = item.updated_at ? new Date(item.updated_at) : new Date();

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedCreated = createdDate.toLocaleString('en-MY', dateOptions);
    const formattedUpdated = updatedDate.toLocaleString('en-MY', dateOptions);

    const statusDisplay = item.status || 'Active';
    const statusClass = statusDisplay.toLowerCase();
    const statusIcon = statusClass === 'active' ? 'fa-hourglass-half' : 'fa-check-circle';

    modalBody.innerHTML = `
        <div class="modal-item-details">
            <h2 class="modal-item-title">${escapeHtml(item.title)}</h2>

            <div class="modal-category-badge ${item.category.toLowerCase()}">
                <i class="fa-solid ${item.category.toLowerCase() === 'lost' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
                ${item.category} Item
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-align-left"></i> Description</h3>
                <p>${escapeHtml(item.description || 'No description provided')}</p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-location-dot"></i> Location</h3>
                <p>${escapeHtml(item.location || 'Location not specified')}</p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-address-card"></i> Your Contact Information</h3>
                <div class="modal-contact-info">
                    ${item.contact_email ? `<div class="modal-contact-item"><i class="fa-solid fa-envelope"></i><span>${escapeHtml(item.contact_email)}</span></div>` : ''}
                    ${item.contact_phone ? `<div class="modal-contact-item"><i class="fa-solid fa-phone"></i><span>${escapeHtml(item.contact_phone)}</span></div>` : ''}
                    ${!item.contact_email && !item.contact_phone ? '<p>No contact information provided</p>' : ''}
                </div>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-circle-info"></i> Status</h3>
                <p>
                    <span class="modal-status-badge ${statusClass}">
                        <i class="fa-solid ${statusIcon}"></i>
                        ${statusDisplay}
                    </span>
                </p>
            </div>

            <div class="modal-detail-group">
                <h3><i class="fa-solid fa-clock"></i> Timestamps</h3>
                <div class="modal-timestamp">
                    <div><i class="fa-solid fa-calendar-plus"></i> <strong>Created:</strong> ${formattedCreated}</div>
                    <div><i class="fa-solid fa-calendar-check"></i> <strong>Last Updated:</strong> ${formattedUpdated}</div>
                </div>
            </div>

            <div class="modal-actions">
                <button onclick="closeModal()" class="modal-btn modal-btn-primary">
                    <i class="fa-solid fa-check"></i> Got It
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function markAsClaimedFromMyReports(itemId) {
    if (!confirm('Are you sure you want to mark this item as claimed?')) return;

    let items = JSON.parse(localStorage.getItem("items")) || [];
    const index = items.findIndex(i => i.id == itemId);

    if (index !== -1) {
        items[index].status = 'Claimed';
        items[index].updated_at = new Date().toISOString();
        localStorage.setItem("items", JSON.stringify(items));
        alert('Item marked as claimed successfully!');
        loadMyReports();
    }
}

function markAsClaimedFromModal(itemId) {
    markAsClaimedFromMyReports(itemId);
    closeModal();
}

function deleteReportFromMyReports(itemId) {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;

    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter(item => item.id != itemId);
    localStorage.setItem("items", JSON.stringify(items));

    const card = document.querySelector(`.myreport-card[data-id="${itemId}"]`);
    if (card) card.remove();

    alert('Report deleted successfully!');
    loadMyReports();
}

function deleteReportFromModal(itemId) {
    deleteReportFromMyReports(itemId);
    closeModal();
}
