// Application State
let currentUser = null;
let currentPage = 'emergency';
let selectedSeverity = 'high';
let selectedRole = 'dispatcher';

// Mock Data
const mockRequests = [
    {
        id: 'REQ-001',
        name: 'John Doe',
        phone: '+254 712 345 678',
        location: 'Kenyatta Avenue, Nairobi CBD',
        emergencyType: 'Cardiac Emergency',
        severity: 'critical',
        status: 'pending',
        timestamp: new Date(Date.now() - 300000),
        description: 'Patient experiencing chest pain and difficulty breathing'
    },
    {
        id: 'REQ-002',
        name: 'Jane Smith',
        phone: '+254 722 345 679',
        location: 'Westlands, Nairobi',
        emergencyType: 'Traffic Accident',
        severity: 'high',
        status: 'assigned',
        timestamp: new Date(Date.now() - 600000),
        assignedAmbulance: 'Alpha-1',
        estimatedArrival: new Date(Date.now() + 480000)
    },
    {
        id: 'REQ-003',
        name: 'Michael Johnson',
        phone: '+254 733 456 789',
        location: 'Karen, Nairobi',
        emergencyType: 'Respiratory Emergency',
        severity: 'medium',
        status: 'pending',
        timestamp: new Date(Date.now() - 900000)
    }
];

const mockAmbulances = [
    {
        id: 'AMB-001',
        callSign: 'Alpha-1',
        driver: 'Michael Wanjiku',
        status: 'dispatched',
        type: 'Advanced Life Support',
        location: 'Westlands, Nairobi'
    },
    {
        id: 'AMB-002',
        callSign: 'Bravo-2',
        driver: 'Sarah Kimani',
        status: 'available',
        type: 'Basic Life Support',
        location: 'CBD, Nairobi'
    },
    {
        id: 'AMB-003',
        callSign: 'Charlie-3',
        driver: 'David Ochieng',
        status: 'available',
        type: 'Critical Care',
        location: 'Kilimani, Nairobi'
    },
    {
        id: 'AMB-004',
        callSign: 'Delta-4',
        driver: 'Grace Muthoni',
        status: 'busy',
        type: 'Advanced Life Support',
        location: 'Kasarani, Nairobi'
    }
];

const mockHospitals = [
    {
        id: 'HOSP-001',
        name: 'Kenyatta National Hospital',
        address: 'Hospital Road, Nairobi',
        availableBeds: 15,
        totalBeds: 50,
        erStatus: 'open',
        specialties: ['Emergency', 'Trauma', 'Cardiology'],
        distance: 2.5
    },
    {
        id: 'HOSP-002',
        name: 'Nairobi Hospital',
        address: 'Argwings Kodhek Road',
        availableBeds: 8,
        totalBeds: 30,
        erStatus: 'busy',
        specialties: ['Emergency', 'Surgery', 'ICU'],
        distance: 3.2
    },
    {
        id: 'HOSP-003',
        name: 'Aga Khan Hospital',
        address: 'Third Parklands Avenue',
        availableBeds: 12,
        totalBeds: 25,
        erStatus: 'open',
        specialties: ['Emergency', 'Pediatric', 'Maternity'],
        distance: 4.1
    },
    {
        id: 'HOSP-004',
        name: 'MP Shah Hospital',
        address: 'Shivachi Road, Parklands',
        availableBeds: 0,
        totalBeds: 20,
        erStatus: 'busy',
        specialties: ['Emergency', 'Orthopedic'],
        distance: 3.8
    }
];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const loginModal = document.getElementById('loginModal');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const closeSuccess = document.getElementById('closeSuccess');
const emergencyForm = document.getElementById('emergencyForm');
const loginForm = document.getElementById('loginForm');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderDispatchRequests();
    renderFleetStatus();
    renderHospitals();
    updateStats();
});

function initializeApp() {
    // Check for saved user session
    const savedUser = localStorage.getItem('jamii_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    
    // Show initial page
    showPage('emergency');
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            updateActiveNav(link);
        });
    });

    // Login/Logout
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    logoutBtn.addEventListener('click', logout);

    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    closeSuccess.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Emergency Form
    emergencyForm.addEventListener('submit', handleEmergencySubmit);

    // Login Form
    loginForm.addEventListener('submit', handleLogin);

    // Severity Selection
    const severityButtons = document.querySelectorAll('.severity-btn');
    severityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            severityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSeverity = btn.getAttribute('data-severity');
        });
    });

    // Role Selection
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            roleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRole = btn.getAttribute('data-role');
        });
    });

    // Demo Credentials
    const demoItems = document.querySelectorAll('.demo-item');
    demoItems.forEach(item => {
        item.addEventListener('click', () => {
            const email = item.getAttribute('data-email');
            const role = item.getAttribute('data-role');
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = 'demo123';
            
            // Update role selection
            roleButtons.forEach(b => b.classList.remove('active'));
            const roleBtn = document.querySelector(`[data-role="${role}"]`);
            if (roleBtn) roleBtn.classList.add('active');
            selectedRole = role;
        });
    });

    // Get Current Location
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
    }

    // Filter Tabs
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');
            filterRequests(filter);
        });
    });

    // Driver Status Updates
    const statusButtons = document.querySelectorAll('#enRouteBtn, #arrivedBtn, #transportBtn');
    statusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateDriverStatus(btn.id);
        });
    });

    // Hospital Management
    setupHospitalControls();

    // Modal Click Outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
}

function updateActiveNav(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function handleEmergencySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(emergencyForm);
    const requestData = {
        id: 'REQ-' + Date.now().toString().slice(-6),
        name: document.getElementById('patientName').value,
        phone: document.getElementById('contactPhone').value,
        location: document.getElementById('emergencyLocation').value,
        emergencyType: document.getElementById('emergencyType').value,
        severity: selectedSeverity,
        description: document.getElementById('additionalDetails').value,
        timestamp: new Date(),
        status: 'pending'
    };

    // Simulate form submission
    const submitBtn = emergencyForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> REQUESTING AMBULANCE...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Add to mock requests
        mockRequests.unshift(requestData);
        
        // Show success modal
        document.getElementById('requestId').textContent = requestData.id;
        successModal.classList.add('active');
        
        // Reset form
        emergencyForm.reset();
        selectedSeverity = 'high';
        document.querySelectorAll('.severity-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-severity') === 'high') {
                btn.classList.add('active');
            }
        });
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update dispatch dashboard if visible
        if (currentPage === 'dispatch') {
            renderDispatchRequests();
            updateStats();
        }
    }, 2000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Mock authentication
    const users = {
        'dispatcher@jamii.com': { name: 'Emergency Dispatcher', role: 'dispatcher' },
        'driver@jamii.com': { name: 'Ambulance Driver', role: 'driver' },
        'hospital@jamii.com': { name: 'Hospital Administrator', role: 'hospital' },
        'analytics@jamii.com': { name: 'Analytics Manager', role: 'analytics' }
    };
    
    if (users[email] && password === 'demo123') {
        currentUser = {
            id: Date.now().toString(),
            email: email,
            name: users[email].name,
            role: users[email].role
        };
        
        localStorage.setItem('jamii_user', JSON.stringify(currentUser));
        updateUserInterface();
        loginModal.classList.remove('active');
        
        // Navigate to appropriate page based on role
        const rolePages = {
            'dispatcher': 'dispatch',
            'driver': 'driver',
            'hospital': 'hospital',
            'analytics': 'analytics'
        };
        
        if (rolePages[currentUser.role]) {
            showPage(rolePages[currentUser.role]);
            updateActiveNav(document.querySelector(`[data-page="${rolePages[currentUser.role]}"]`));
        }
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('jamii_user');
    updateUserInterface();
    showPage('emergency');
    updateActiveNav(document.querySelector('[data-page="emergency"]'));
}

function updateUserInterface() {
    if (currentUser) {
        userInfo.querySelector('.user-name').textContent = currentUser.name;
        userInfo.querySelector('.user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        userInfo.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        userInfo.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        const locationInput = document.getElementById('emergencyLocation');
        const btn = document.getElementById('getCurrentLocation');
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        btn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                locationInput.value = `${lat}, ${lng}`;
                
                btn.innerHTML = '<i class="fas fa-crosshairs"></i> Current Location';
                btn.disabled = false;
            },
            (error) => {
                alert('Unable to get your location. Please enter manually.');
                btn.innerHTML = '<i class="fas fa-crosshairs"></i> Current Location';
                btn.disabled = false;
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function renderDispatchRequests() {
    const requestsList = document.getElementById('requestsList');
    if (!requestsList) return;
    
    requestsList.innerHTML = '';
    
    mockRequests.forEach(request => {
        const requestElement = createRequestElement(request);
        requestsList.appendChild(requestElement);
    });
}

function createRequestElement(request) {
    const div = document.createElement('div');
    div.className = 'request-item';
    div.setAttribute('data-id', request.id);
    
    const timeAgo = getTimeAgo(request.timestamp);
    const assignedAmbulance = mockAmbulances.find(amb => amb.id === request.assignedAmbulance);
    
    div.innerHTML = `
        <div class="request-header">
            <div class="request-info">
                <div class="request-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="request-details">
                    <h3>${request.name}</h3>
                    <p>${request.emergencyType}</p>
                    <small>ID: ${request.id}</small>
                </div>
            </div>
            <div class="request-badges">
                <span class="severity-badge ${request.severity}">${request.severity.toUpperCase()}</span>
                <span class="status-badge ${request.status}">${request.status.toUpperCase()}</span>
            </div>
        </div>
        
        <div class="request-meta">
            <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${request.location}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-phone"></i>
                <span>${request.phone}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${timeAgo}</span>
            </div>
        </div>
        
        ${request.status === 'pending' ? `
            <div class="ambulance-assignment">
                <h4>Available Ambulances:</h4>
                <div class="ambulance-options">
                    ${mockAmbulances.filter(amb => amb.status === 'available').map(amb => `
                        <button class="btn btn-success btn-sm" onclick="assignAmbulance('${request.id}', '${amb.id}')">
                            <i class="fas fa-truck-medical"></i>
                            ${amb.callSign} - ${amb.type}
                        </button>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${assignedAmbulance ? `
            <div class="ambulance-assignment">
                <div class="assignment-info">
                    <strong>Assigned: ${assignedAmbulance.callSign}</strong> - Driver: ${assignedAmbulance.driver}
                    ${request.estimatedArrival ? `<br><small>ETA: ${new Date(request.estimatedArrival).toLocaleTimeString()}</small>` : ''}
                </div>
            </div>
        ` : ''}
    `;
    
    return div;
}

function renderFleetStatus() {
    const fleetList = document.getElementById('fleetList');
    if (!fleetList) return;
    
    fleetList.innerHTML = '';
    
    mockAmbulances.forEach(ambulance => {
        const fleetElement = createFleetElement(ambulance);
        fleetList.appendChild(fleetElement);
    });
}

function createFleetElement(ambulance) {
    const div = document.createElement('div');
    div.className = 'fleet-item';
    
    div.innerHTML = `
        <div class="fleet-header">
            <div class="fleet-info">
                <div class="fleet-icon">
                    <i class="fas fa-truck-medical"></i>
                </div>
                <div class="fleet-details">
                    <h4>${ambulance.callSign}</h4>
                    <p>${ambulance.driver}</p>
                </div>
            </div>
            <span class="fleet-status ${ambulance.status}">${ambulance.status.toUpperCase()}</span>
        </div>
        
        <div class="fleet-meta">
            <span>Type: ${ambulance.type}</span>
            <span>Location: ${ambulance.location}</span>
        </div>
        
        ${ambulance.status === 'available' ? `
            <button class="btn btn-success btn-sm" style="width: 100%; margin-top: 0.5rem;">
                Ready for Assignment
            </button>
        ` : ambulance.status === 'dispatched' ? `
            <div style="background: #eff6ff; padding: 0.5rem; border-radius: 6px; margin-top: 0.5rem; text-align: center;">
                <small style="color: #1e40af;">En Route to Emergency</small>
            </div>
        ` : ''}
    `;
    
    return div;
}

function renderHospitals() {
    const hospitalsGrid = document.getElementById('hospitalsGrid');
    if (!hospitalsGrid) return;
    
    hospitalsGrid.innerHTML = '';
    
    mockHospitals.forEach(hospital => {
        const hospitalElement = createHospitalElement(hospital);
        hospitalsGrid.appendChild(hospitalElement);
    });
}

function createHospitalElement(hospital) {
    const div = document.createElement('div');
    div.className = 'hospital-card';
    div.setAttribute('data-id', hospital.id);
    
    const capacityPercentage = Math.round((hospital.availableBeds / hospital.totalBeds) * 100);
    
    div.innerHTML = `
        <div class="hospital-header">
            <div class="hospital-info">
                <div class="hospital-icon">
                    <i class="fas fa-hospital"></i>
                </div>
                <div class="hospital-details">
                    <h3>${hospital.name}</h3>
                    <p>${hospital.address}</p>
                    <small>Distance: ${hospital.distance} km</small>
                </div>
            </div>
            <span class="er-status ${hospital.erStatus}">ER ${hospital.erStatus.toUpperCase()}</span>
        </div>
        
        <div class="hospital-metrics">
            <div class="metric">
                <span class="metric-value" style="color: #2563eb;">${hospital.availableBeds}</span>
                <span class="metric-label">Available</span>
            </div>
            <div class="metric">
                <span class="metric-value" style="color: #6b7280;">${hospital.totalBeds}</span>
                <span class="metric-label">Total Beds</span>
            </div>
            <div class="metric">
                <span class="metric-value" style="color: ${capacityPercentage > 50 ? '#059669' : capacityPercentage > 20 ? '#d97706' : '#dc2626'};">${capacityPercentage}%</span>
                <span class="metric-label">Capacity</span>
            </div>
            <div class="metric">
                <span class="metric-value" style="color: #7c3aed;">${hospital.specialties.length}</span>
                <span class="metric-label">Specialties</span>
            </div>
        </div>
        
        <div class="bed-management">
            <span style="font-weight: 600; color: #374151;">Bed Management:</span>
            <div class="bed-controls">
                <button class="btn btn-danger btn-sm" onclick="updateBedCount('${hospital.id}', -1)" ${hospital.availableBeds === 0 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span class="bed-count">${hospital.availableBeds} beds</span>
                <button class="btn btn-success btn-sm" onclick="updateBedCount('${hospital.id}', 1)" ${hospital.availableBeds === hospital.totalBeds ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            ${hospital.availableBeds === 0 ? `
                <span style="color: #dc2626; font-weight: 600; font-size: 0.9rem;">
                    <i class="fas fa-exclamation-triangle"></i> FULL CAPACITY
                </span>
            ` : ''}
        </div>
        
        <div class="specialties">
            ${hospital.specialties.map(specialty => `
                <span class="specialty-tag">${specialty}</span>
            `).join('')}
        </div>
    `;
    
    return div;
}

function assignAmbulance(requestId, ambulanceId) {
    // Update request status
    const request = mockRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'assigned';
        request.assignedAmbulance = ambulanceId;
        request.estimatedArrival = new Date(Date.now() + 480000); // 8 minutes
    }
    
    // Update ambulance status
    const ambulance = mockAmbulances.find(a => a.id === ambulanceId);
    if (ambulance) {
        ambulance.status = 'dispatched';
    }
    
    // Re-render
    renderDispatchRequests();
    renderFleetStatus();
    updateStats();
    
    // Show notification
    showNotification(`Ambulance ${ambulance.callSign} assigned to ${request.name}`, 'success');
}

function updateBedCount(hospitalId, change) {
    const hospital = mockHospitals.find(h => h.id === hospitalId);
    if (hospital) {
        const newCount = hospital.availableBeds + change;
        if (newCount >= 0 && newCount <= hospital.totalBeds) {
            hospital.availableBeds = newCount;
            renderHospitals();
            updateStats();
        }
    }
}

function filterRequests(filter) {
    const requests = document.querySelectorAll('.request-item');
    requests.forEach(request => {
        const status = request.querySelector('.status-badge').textContent.toLowerCase();
        if (filter === 'all' || status === filter) {
            request.style.display = 'block';
        } else {
            request.style.display = 'none';
        }
    });
}

function updateDriverStatus(buttonId) {
    const statusMap = {
        'enRouteBtn': 'En Route to Patient',
        'arrivedBtn': 'Arrived on Scene',
        'transportBtn': 'Transporting Patient'
    };
    
    const status = statusMap[buttonId];
    if (status) {
        showNotification(`Status updated: ${status}`, 'success');
        
        // Update UI to show next status button
        const buttons = document.querySelectorAll('#enRouteBtn, #arrivedBtn, #transportBtn');
        buttons.forEach(btn => btn.style.display = 'none');
        
        if (buttonId === 'enRouteBtn') {
            document.getElementById('arrivedBtn').style.display = 'inline-flex';
        } else if (buttonId === 'arrivedBtn') {
            document.getElementById('transportBtn').style.display = 'inline-flex';
        }
    }
}

function setupHospitalControls() {
    // ER Status buttons
    const statusButtons = document.querySelectorAll('.status-buttons .btn');
    statusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.textContent.toLowerCase();
            showNotification(`ER Status updated to: ${status}`, 'info');
        });
    });
}

function updateStats() {
    // Update dispatch stats
    const pendingCount = document.getElementById('pendingCount');
    const assignedCount = document.getElementById('assignedCount');
    const availableCount = document.getElementById('availableCount');
    
    if (pendingCount) {
        pendingCount.textContent = mockRequests.filter(r => r.status === 'pending').length;
    }
    if (assignedCount) {
        assignedCount.textContent = mockRequests.filter(r => r.status === 'assigned').length;
    }
    if (availableCount) {
        availableCount.textContent = mockAmbulances.filter(a => a.status === 'available').length;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Track Ambulance Function
document.getElementById('trackAmbulance')?.addEventListener('click', () => {
    showNotification('Ambulance tracking feature coming soon!', 'info');
    successModal.classList.remove('active');
});

// Export functionality
document.addEventListener('click', (e) => {
    if (e.target.textContent?.includes('Export Report')) {
        showNotification('Report export feature coming soon!', 'info');
    }
});