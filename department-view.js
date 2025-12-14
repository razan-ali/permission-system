// Sample Data - In production, this would come from an API
let currentUser = {
    id: 'dept_001',
    name: 'Department Admin',
    role: 'department',
    department: 'shipping'
};

let permissionRequests = [
    {
        id: 'REQ-2024-001',
        visitorName: 'Ahmed Mohammed',
        idNumber: '2345678901',
        nationality: 'Saudi Arabia',
        company: 'Gulf Logistics Co.',
        department: 'shipping',
        purpose: 'Delivery coordination meeting',
        vehicleType: 'truck',
        plateNumber: 'ABC-1234',
        truckOperation: 'loading',
        submissionDate: '2024-01-15T09:30:00',
        status: 'pending_department',
        documents: {
            idDocument: 'path/to/id.jpg',
            driverLicense: 'path/to/license.jpg',
            safetyAttire: 'path/to/safety.jpg'
        },
        visitPeriod: {
            start: '2024-01-20',
            end: '2024-01-25'
        }
    },
    {
        id: 'REQ-2024-002',
        visitorName: 'Fatima Al-Zahrani',
        idNumber: '1234567890',
        nationality: 'Saudi Arabia',
        company: 'Tech Solutions',
        department: 'raw_material',
        purpose: 'Quality inspection',
        vehicleType: 'car',
        plateNumber: 'XYZ-5678',
        submissionDate: '2024-01-15T10:45:00',
        status: 'pending_department',
        documents: {
            idDocument: 'path/to/id2.jpg',
            vehicleRegistration: 'path/to/reg.jpg'
        },
        visitPeriod: {
            start: '2024-01-18',
            end: '2024-01-18'
        }
    },
    {
        id: 'REQ-2024-003',
        visitorName: 'John Smith',
        idNumber: '9876543210',
        nationality: 'United States',
        company: 'International Traders',
        department: 'shipping',
        purpose: 'Contract negotiation',
        vehicleType: 'none',
        submissionDate: '2024-01-14T14:20:00',
        status: 'pending_security',
        departmentApproval: {
            approvedBy: 'dept_001',
            approvedAt: '2024-01-15T08:00:00',
            remarks: 'Approved for meeting'
        },
        documents: {
            idDocument: 'path/to/id3.jpg'
        },
        visitPeriod: {
            start: '2024-01-16',
            end: '2024-01-16'
        }
    },
    {
        id: 'REQ-2024-004',
        visitorName: 'Sara Ahmed',
        idNumber: '5555555555',
        nationality: 'Egypt',
        company: 'Lab Equipment Inc.',
        department: 'lab',
        purpose: 'Equipment installation',
        vehicleType: 'truck',
        plateNumber: 'DEF-9999',
        truckOperation: 'unloading',
        submissionDate: '2024-01-13T11:00:00',
        status: 'approved',
        departmentApproval: {
            approvedBy: 'dept_002',
            approvedAt: '2024-01-14T09:00:00',
            remarks: 'Equipment needed urgently'
        },
        securityApproval: {
            approvedBy: 'sec_001',
            approvedAt: '2024-01-14T10:30:00',
            parkingSlotAvailable: true,
            remarks: 'Parking slot A-12 assigned'
        },
        documents: {
            idDocument: 'path/to/id4.jpg',
            driverLicense: 'path/to/license4.jpg',
            safetyAttire: 'path/to/safety4.jpg'
        },
        visitPeriod: {
            start: '2024-01-16',
            end: '2024-01-20'
        },
        entryExitLogs: [
            {
                entryTime: '2024-01-16T08:00:00',
                exitTime: '2024-01-16T17:00:00'
            }
        ]
    },
    {
        id: 'REQ-2024-005',
        visitorName: 'Mohammed Ali',
        idNumber: '7777777777',
        nationality: 'Saudi Arabia',
        company: 'Oil Transport Co.',
        department: 'bulk_oil',
        purpose: 'Oil delivery',
        vehicleType: 'truck',
        plateNumber: 'OIL-1111',
        truckOperation: 'both',
        submissionDate: '2024-01-12T13:30:00',
        status: 'rejected_department',
        rejection: {
            rejectedBy: 'dept_003',
            rejectedAt: '2024-01-13T09:00:00',
            reason: 'Incomplete safety documentation. Missing fire extinguisher certification.',
            rejectedByRole: 'department'
        },
        documents: {
            idDocument: 'path/to/id5.jpg',
            driverLicense: 'path/to/license5.jpg'
        },
        visitPeriod: {
            start: '2024-01-15',
            end: '2024-01-15'
        }
    },
    {
        id: 'REQ-2024-006',
        visitorName: 'Lisa Wang',
        idNumber: '3333333333',
        nationality: 'China',
        company: 'Quality Assurance Ltd.',
        department: 'coordinator',
        purpose: 'Annual audit',
        vehicleType: 'car',
        plateNumber: 'QA-2024',
        submissionDate: '2024-01-11T10:00:00',
        status: 'rejected_security',
        departmentApproval: {
            approvedBy: 'dept_004',
            approvedAt: '2024-01-12T08:30:00',
            remarks: 'Scheduled audit approved'
        },
        rejection: {
            rejectedBy: 'sec_002',
            rejectedAt: '2024-01-13T11:00:00',
            reason: 'Background check revealed security concerns. Please contact security office.',
            rejectedByRole: 'security'
        },
        documents: {
            idDocument: 'path/to/id6.jpg',
            vehicleRegistration: 'path/to/reg6.jpg'
        },
        visitPeriod: {
            start: '2024-01-20',
            end: '2024-01-22'
        }
    }
];

let selectedRequestId = null;
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDashboardMetrics();
    updateTodayActivity();
    renderCharts();
    renderPendingTable();
    renderApprovedTable();
    renderRejectedTable();

    // Set current user
    document.getElementById('currentUser').textContent = currentUser.name;
}

// Tab Switching
function switchTab(tabName) {
    // Remove active class from all tabs and content
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    event.target.closest('.tab-btn').classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Update Dashboard Metrics
function updateDashboardMetrics() {
    const pending = permissionRequests.filter(r => r.status === 'pending_department').length;
    const security = permissionRequests.filter(r => r.status === 'pending_security').length;
    const approved = permissionRequests.filter(r => r.status === 'approved').length;
    const rejected = permissionRequests.filter(r =>
        r.status === 'rejected_department' || r.status === 'rejected_security'
    ).length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('securityCount').textContent = security;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
    document.getElementById('pendingBadge').textContent = pending;
}

// Update Today's Activity
function updateTodayActivity() {
    const today = new Date().toISOString().split('T')[0];

    let trucksToday = 0;
    let carsToday = 0;
    let entriesTotal = 0;
    let exitsTotal = 0;

    permissionRequests.forEach(request => {
        if (request.entryExitLogs) {
            request.entryExitLogs.forEach(log => {
                const logDate = log.entryTime.split('T')[0];
                if (logDate === today) {
                    entriesTotal++;
                    if (request.vehicleType === 'truck') trucksToday++;
                    if (request.vehicleType === 'car') carsToday++;
                }
                if (log.exitTime) {
                    const exitDate = log.exitTime.split('T')[0];
                    if (exitDate === today) exitsTotal++;
                }
            });
        }
    });

    document.getElementById('trucksToday').textContent = trucksToday;
    document.getElementById('carsToday').textContent = carsToday;
    document.getElementById('entriesTotal').textContent = entriesTotal;
    document.getElementById('exitsTotal').textContent = exitsTotal;
}

// Render Charts
function renderCharts() {
    renderDepartmentChart();
    renderStatusChart();
}

function renderDepartmentChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');

    // Count requests by department
    const deptCounts = {};
    permissionRequests.forEach(request => {
        deptCounts[request.department] = (deptCounts[request.department] || 0) + 1;
    });

    const deptLabels = Object.keys(deptCounts).map(dept =>
        dept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    const deptData = Object.values(deptCounts);

    if (charts.department) charts.department.destroy();

    charts.department = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: deptLabels,
            datasets: [{
                label: 'Requests',
                data: deptData,
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');

    // Count by status
    const statusCounts = {
        'Pending Department': permissionRequests.filter(r => r.status === 'pending_department').length,
        'Pending Security': permissionRequests.filter(r => r.status === 'pending_security').length,
        'Approved': permissionRequests.filter(r => r.status === 'approved').length,
        'Rejected': permissionRequests.filter(r =>
            r.status === 'rejected_department' || r.status === 'rejected_security'
        ).length
    };

    if (charts.status) charts.status.destroy();

    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render Tables
function renderPendingTable() {
    const tbody = document.getElementById('pendingTableBody');
    const pendingRequests = permissionRequests.filter(r => r.status === 'pending_department');

    if (pendingRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No pending requests</td></tr>';
        return;
    }

    tbody.innerHTML = pendingRequests.map(request => `
        <tr>
            <td><strong>${request.id}</strong></td>
            <td>${request.visitorName}</td>
            <td>${formatDepartment(request.department)}</td>
            <td>${request.purpose}</td>
            <td>${formatVehicleType(request.vehicleType)}</td>
            <td>${formatDate(request.submissionDate)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewRequestDetail('${request.id}')">
                    <i class="fas fa-eye"></i> Review
                </button>
            </td>
        </tr>
    `).join('');
}

function renderApprovedTable() {
    const tbody = document.getElementById('approvedTableBody');
    const approvedRequests = permissionRequests.filter(r => r.status === 'approved');

    if (approvedRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No approved permissions</td></tr>';
        return;
    }

    tbody.innerHTML = approvedRequests.map(request => `
        <tr>
            <td><strong>${request.id}</strong></td>
            <td>${request.visitorName}</td>
            <td>${formatDepartment(request.department)}</td>
            <td>${formatVehicleType(request.vehicleType)}</td>
            <td>${request.plateNumber || 'N/A'}</td>
            <td>${formatDateRange(request.visitPeriod)}</td>
            <td>${request.entryExitLogs ? request.entryExitLogs.length : 0}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewApprovedDetail('${request.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function renderRejectedTable() {
    const tbody = document.getElementById('rejectedTableBody');
    const rejectedRequests = permissionRequests.filter(r =>
        r.status === 'rejected_department' || r.status === 'rejected_security'
    );

    if (rejectedRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No rejected requests</td></tr>';
        return;
    }

    tbody.innerHTML = rejectedRequests.map(request => `
        <tr>
            <td><strong>${request.id}</strong></td>
            <td>${request.visitorName}</td>
            <td>${formatDepartment(request.department)}</td>
            <td>${formatVehicleType(request.vehicleType)}</td>
            <td>${formatDate(request.submissionDate)}</td>
            <td><span class="status-badge rejected">${request.rejection.rejectedByRole}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewRejectedDetail('${request.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// View Request Detail
function viewRequestDetail(requestId) {
    selectedRequestId = requestId;
    const request = permissionRequests.find(r => r.id === requestId);
    if (!request) return;

    const content = document.getElementById('requestDetailContent');
    content.innerHTML = `
        <div class="detail-grid">
            <div class="detail-section">
                <h3>Visitor Information</h3>
                <div class="detail-item">
                    <label>Full Name</label>
                    <p>${request.visitorName}</p>
                </div>
                <div class="detail-item">
                    <label>ID/Iqama Number</label>
                    <p>${request.idNumber}</p>
                </div>
                <div class="detail-item">
                    <label>Nationality</label>
                    <p>${request.nationality}</p>
                </div>
                <div class="detail-item">
                    <label>Company</label>
                    <p>${request.company}</p>
                </div>
            </div>

            <div class="detail-section">
                <h3>Visit Details</h3>
                <div class="detail-item">
                    <label>Department</label>
                    <p>${formatDepartment(request.department)}</p>
                </div>
                <div class="detail-item">
                    <label>Purpose</label>
                    <p>${request.purpose}</p>
                </div>
                <div class="detail-item">
                    <label>Visit Period</label>
                    <p>${formatDateRange(request.visitPeriod)}</p>
                </div>
                <div class="detail-item">
                    <label>Submission Date</label>
                    <p>${formatDateTime(request.submissionDate)}</p>
                </div>
            </div>
        </div>

        ${request.vehicleType !== 'none' ? `
        <div class="detail-section">
            <h3>Vehicle Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Vehicle Type</label>
                    <p>${formatVehicleType(request.vehicleType)}</p>
                </div>
                <div class="detail-item">
                    <label>Plate Number</label>
                    <p>${request.plateNumber}</p>
                </div>
                ${request.truckOperation ? `
                <div class="detail-item">
                    <label>Truck Operation</label>
                    <p>${request.truckOperation.charAt(0).toUpperCase() + request.truckOperation.slice(1)}</p>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        <div class="detail-section">
            <h3>Documents</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>ID/Iqama Document</label>
                    <a href="#" class="document-link" onclick="event.preventDefault(); viewDocument('${request.documents.idDocument}')">
                        <i class="fas fa-file-image"></i> View Document
                    </a>
                </div>
                ${request.documents.driverLicense ? `
                <div class="detail-item">
                    <label>Driver's License</label>
                    <a href="#" class="document-link" onclick="event.preventDefault(); viewDocument('${request.documents.driverLicense}')">
                        <i class="fas fa-file-image"></i> View Document
                    </a>
                </div>
                ` : ''}
                ${request.documents.safetyAttire ? `
                <div class="detail-item">
                    <label>Safety Attire Photo</label>
                    <a href="#" class="document-link" onclick="event.preventDefault(); viewDocument('${request.documents.safetyAttire}')">
                        <i class="fas fa-file-image"></i> View Document
                    </a>
                </div>
                ` : ''}
                ${request.documents.vehicleRegistration ? `
                <div class="detail-item">
                    <label>Vehicle Registration</label>
                    <a href="#" class="document-link" onclick="event.preventDefault(); viewDocument('${request.documents.vehicleRegistration}')">
                        <i class="fas fa-file-image"></i> View Document
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    openModal('requestDetailModal');
}

// View Approved Permission Detail
function viewApprovedDetail(requestId) {
    selectedRequestId = requestId;
    const request = permissionRequests.find(r => r.id === requestId);
    if (!request) return;

    const content = document.getElementById('approvedDetailContent');
    content.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>Fully Approved Permission</strong>
                <p style="margin: 0;">This visitor permission has been approved by both department and security.</p>
            </div>
        </div>

        <div class="detail-grid">
            <div class="detail-section">
                <h3>Visitor Information</h3>
                <div class="detail-item">
                    <label>Full Name</label>
                    <p>${request.visitorName}</p>
                </div>
                <div class="detail-item">
                    <label>ID/Iqama Number</label>
                    <p>${request.idNumber}</p>
                </div>
                <div class="detail-item">
                    <label>Nationality</label>
                    <p>${request.nationality}</p>
                </div>
                <div class="detail-item">
                    <label>Company</label>
                    <p>${request.company}</p>
                </div>
            </div>

            <div class="detail-section">
                <h3>Visit Details</h3>
                <div class="detail-item">
                    <label>Department</label>
                    <p>${formatDepartment(request.department)}</p>
                </div>
                <div class="detail-item">
                    <label>Purpose</label>
                    <p>${request.purpose}</p>
                </div>
                <div class="detail-item">
                    <label>Visit Period</label>
                    <p>${formatDateRange(request.visitPeriod)}</p>
                </div>
            </div>
        </div>

        ${request.vehicleType !== 'none' ? `
        <div class="detail-section">
            <h3>Vehicle Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Vehicle Type</label>
                    <p>${formatVehicleType(request.vehicleType)}</p>
                </div>
                <div class="detail-item">
                    <label>Plate Number</label>
                    <p>${request.plateNumber}</p>
                </div>
                ${request.truckOperation ? `
                <div class="detail-item">
                    <label>Truck Operation</label>
                    <p>${request.truckOperation.charAt(0).toUpperCase() + request.truckOperation.slice(1)}</p>
                </div>
                ` : ''}
                ${request.securityApproval && request.securityApproval.parkingSlotAvailable ? `
                <div class="detail-item">
                    <label>Parking</label>
                    <p><span class="status-badge approved">Available</span></p>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        <div class="detail-section">
            <h3>Approval History</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Department Approval</label>
                    <p>${formatDateTime(request.departmentApproval.approvedAt)}</p>
                    ${request.departmentApproval.remarks ? `<small style="color: var(--text-muted);">${request.departmentApproval.remarks}</small>` : ''}
                </div>
                <div class="detail-item">
                    <label>Security Approval</label>
                    <p>${formatDateTime(request.securityApproval.approvedAt)}</p>
                    ${request.securityApproval.remarks ? `<small style="color: var(--text-muted);">${request.securityApproval.remarks}</small>` : ''}
                </div>
            </div>
        </div>

        ${request.entryExitLogs && request.entryExitLogs.length > 0 ? `
        <div class="detail-section">
            <h3>Entry/Exit Logs</h3>
            <table class="logs-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Duration</th>
                        <th>Delivery Note</th>
                    </tr>
                </thead>
                <tbody>
                    ${request.entryExitLogs.map((log, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${formatDateTime(log.entryTime)}</td>
                            <td>${log.exitTime ? formatDateTime(log.exitTime) : '<span class="status-badge pending">On Site</span>'}</td>
                            <td>${log.exitTime ? calculateDuration(log.entryTime, log.exitTime) : '-'}</td>
                            <td>${log.deliveryNote ? '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Uploaded' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
    `;

    // Show upload delivery button if truck has exited
    const uploadBtn = document.getElementById('uploadDeliveryBtn');
    if (request.vehicleType === 'truck' &&
        request.entryExitLogs &&
        request.entryExitLogs.some(log => log.exitTime && !log.deliveryNote)) {
        uploadBtn.style.display = 'inline-flex';
    } else {
        uploadBtn.style.display = 'none';
    }

    openModal('approvedDetailModal');
}

// View Rejected Request Detail
function viewRejectedDetail(requestId) {
    selectedRequestId = requestId;
    const request = permissionRequests.find(r => r.id === requestId);
    if (!request) return;

    const content = document.getElementById('rejectedDetailContent');
    content.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong>Request Rejected</strong>
                <p style="margin: 0;">This request was rejected by ${request.rejection.rejectedByRole}.</p>
            </div>
        </div>

        <div class="detail-section">
            <h3>Rejection Details</h3>
            <div class="detail-item">
                <label>Rejected By</label>
                <p><span class="status-badge rejected">${request.rejection.rejectedByRole}</span></p>
            </div>
            <div class="detail-item">
                <label>Rejection Date</label>
                <p>${formatDateTime(request.rejection.rejectedAt)}</p>
            </div>
            <div class="detail-item">
                <label>Reason</label>
                <p>${request.rejection.reason}</p>
            </div>
        </div>

        <div class="detail-grid">
            <div class="detail-section">
                <h3>Visitor Information</h3>
                <div class="detail-item">
                    <label>Full Name</label>
                    <p>${request.visitorName}</p>
                </div>
                <div class="detail-item">
                    <label>ID/Iqama Number</label>
                    <p>${request.idNumber}</p>
                </div>
                <div class="detail-item">
                    <label>Nationality</label>
                    <p>${request.nationality}</p>
                </div>
                <div class="detail-item">
                    <label>Company</label>
                    <p>${request.company}</p>
                </div>
            </div>

            <div class="detail-section">
                <h3>Visit Details</h3>
                <div class="detail-item">
                    <label>Department</label>
                    <p>${formatDepartment(request.department)}</p>
                </div>
                <div class="detail-item">
                    <label>Purpose</label>
                    <p>${request.purpose}</p>
                </div>
                <div class="detail-item">
                    <label>Vehicle Type</label>
                    <p>${formatVehicleType(request.vehicleType)}</p>
                </div>
                <div class="detail-item">
                    <label>Submission Date</label>
                    <p>${formatDateTime(request.submissionDate)}</p>
                </div>
            </div>
        </div>

        ${request.departmentApproval ? `
        <div class="detail-section">
            <h3>Department Approval</h3>
            <div class="detail-item">
                <label>Approved At</label>
                <p>${formatDateTime(request.departmentApproval.approvedAt)}</p>
            </div>
            ${request.departmentApproval.remarks ? `
            <div class="detail-item">
                <label>Remarks</label>
                <p>${request.departmentApproval.remarks}</p>
            </div>
            ` : ''}
        </div>
        ` : ''}
    `;

    openModal('rejectedDetailModal');
}

// Approve Request
function approveRequest() {
    const request = permissionRequests.find(r => r.id === selectedRequestId);
    if (!request) return;

    const remarks = document.getElementById('approvalRemarks').value.trim();

    // Update request status
    request.status = 'pending_security';
    request.departmentApproval = {
        approvedBy: currentUser.id,
        approvedAt: new Date().toISOString(),
        remarks: remarks || null
    };

    // Update UI
    updateDashboardMetrics();
    renderPendingTable();
    renderApprovedTable();
    renderCharts();

    closeModal('requestDetailModal');
    showToast('Request approved and forwarded to security', 'success');
}

// Reject Request
function rejectRequest() {
    openModal('rejectionModal');
}

function confirmRejection() {
    const reason = document.getElementById('rejectionReason').value.trim();

    if (!reason) {
        showToast('Please provide a reason for rejection', 'error');
        return;
    }

    const request = permissionRequests.find(r => r.id === selectedRequestId);
    if (!request) return;

    // Update request status
    request.status = 'rejected_department';
    request.rejection = {
        rejectedBy: currentUser.id,
        rejectedAt: new Date().toISOString(),
        reason: reason,
        rejectedByRole: 'department'
    };

    // Update UI
    updateDashboardMetrics();
    renderPendingTable();
    renderRejectedTable();
    renderCharts();

    closeModal('rejectionModal');
    closeModal('requestDetailModal');
    showToast('Request rejected', 'error');

    // Clear rejection reason
    document.getElementById('rejectionReason').value = '';
}

// Upload Delivery Note
function showUploadDeliveryNote() {
    openModal('uploadDeliveryModal');
}

function previewDeliveryNote() {
    const file = document.getElementById('deliveryNoteFile').files[0];
    const preview = document.getElementById('deliveryPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (file.type.startsWith('image/')) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Delivery Note Preview">`;
            } else {
                preview.innerHTML = `<p><i class="fas fa-file-pdf"></i> ${file.name}</p>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

function confirmUploadDelivery() {
    const file = document.getElementById('deliveryNoteFile').files[0];

    if (!file) {
        showToast('Please select a file to upload', 'error');
        return;
    }

    const request = permissionRequests.find(r => r.id === selectedRequestId);
    if (!request) return;

    // Find the latest log without delivery note
    const log = request.entryExitLogs.find(l => l.exitTime && !l.deliveryNote);
    if (log) {
        log.deliveryNote = 'path/to/delivery-note.pdf'; // In production, upload to server
    }

    // Update UI
    viewApprovedDetail(selectedRequestId);

    closeModal('uploadDeliveryModal');
    showToast('Delivery note uploaded successfully', 'success');

    // Clear file input
    document.getElementById('deliveryNoteFile').value = '';
    document.getElementById('deliveryPreview').innerHTML = '';
}

// Download Permit
function downloadPermit() {
    showToast('Downloading permit...', 'success');
    // In production, this would generate and download a PDF
}

// View Document
function viewDocument(path) {
    showToast('Opening document...', 'success');
    // In production, this would open the document in a new tab or modal
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Table Filter
function filterTable(tableType) {
    const searchId = tableType + 'Search';
    const tableBodyId = tableType + 'TableBody';

    const searchValue = document.getElementById(searchId).value.toLowerCase();
    const rows = document.getElementById(tableBodyId).getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    }
}

// Table Sort
function sortTable(tableType, columnIndex) {
    const tableBodyId = tableType + 'TableBody';
    const tbody = document.getElementById(tableBodyId);
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return aText.localeCompare(bText);
    });

    rows.forEach(row => tbody.appendChild(row));
}

// Format Functions
function formatDepartment(dept) {
    return dept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatVehicleType(type) {
    if (type === 'none') return 'No Vehicle';
    const icons = {
        truck: '<i class="fas fa-truck"></i>',
        car: '<i class="fas fa-car"></i>'
    };
    return `<span class="vehicle-badge">${icons[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateRange(period) {
    const start = formatDate(period.start);
    const end = formatDate(period.end);
    return start === end ? start : `${start} - ${end}`;
}

function calculateDuration(entryTime, exitTime) {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diff = exit - entry;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html'; // In production, redirect to login page
        }, 1000);
    }
}
