// ==================== AUTHENTICATION ====================
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('loginError');
    const adminUsername = 'eproject215';
    const adminPassword = 'aptech100';

    if (username === adminUsername && password === adminPassword) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = '❌ Invalid credentials';
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.style.animation = 'shake 0.5s';
            setTimeout(() => loginBox.style.animation = '', 500);
        }
    }
}

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') || localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { window.location.href = 'login.html'; return false; }
    return true;
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    if (!passwordInput || !icon) return;
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('fa-eye', isPassword);
    icon.classList.toggle('fa-eye-slash', !isPassword);
}

function toggleMobileMenu() {
    document.getElementById('mobileMenuPanel').classList.toggle('active');
}

// ==================== SINGLE SOURCE OF TRUTH ====================
const INIT_STOCK_PER_MODEL = 50;
const PROFIT_PERCENT = 0.10;

/* ---------- central loader ---------- */
function loadPhonesFromMainSite() {
    try { return JSON.parse(localStorage.getItem('cellinfo_phones') || '[]'); } catch { return []; }
}
function loadOrdersFromMainSite() {
    try { return JSON.parse(localStorage.getItem('cellinfo_orders') || '[]'); } catch { return []; }
}

/* ---------- inventory manager ---------- */
function ensureInventory() {
    let inventory = JSON.parse(localStorage.getItem('admin_inventory') || '[]');
    const phones = loadPhonesFromMainSite();
    if (!inventory.length && phones.length) {          // first run
        inventory = phones.map(p => ({ ...p, stock: INIT_STOCK_PER_MODEL, sold: 0 }));
        localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    }
    return inventory;
}

/* ---------- live calculator ---------- */
function calculateStats() {
    const inventory = ensureInventory();
    const orders = loadOrdersFromMainSite();

    const totalSold = inventory.reduce((s, p) => s + p.sold, 0);
    const totalRevenue = inventory.reduce((s, p) => s + (p.sold * p.price), 0);
    const totalProfit = totalRevenue * PROFIT_PERCENT;
    const totalCustomers = orders.length;

    // Efficiency Metrics
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const canceledOrders = orders.filter(o => o.status === 'Cancelled').length;
    const successRate = orders.length ? (completedOrders / orders.length) : 1; // Default 100%
    const stockHealth = inventory.length ? (inventory.filter(i => i.stock > 5).length / inventory.length) : 1;

    // Score out of 100 (50% Stock Health, 50% Success Rate)
    const efficiencyScore = Math.round((successRate * 50) + (stockHealth * 50));

    return { inventory, orders, totalSold, totalRevenue, totalProfit, totalCustomers, efficiencyScore };
}

// ==================== SECTION NAVIGATION ====================
function showDashboard() {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('dashboard').classList.remove('hidden');
    updateActiveNav('dashboard');
    updateDashboardStats();
    drawCharts();
}
function showInventory() {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('inventory').classList.remove('hidden');
    updateActiveNav('inventory');
    populateInventoryTable();
}

function showFeedback() {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('feedback').classList.remove('hidden');
    updateActiveNav('feedback');

    const feedback = JSON.parse(localStorage.getItem('cellinfo_feedback') || '[]');
    const tbody = document.getElementById('feedbackTable');
    if (tbody) {
        tbody.innerHTML = feedback.map(f => `
            <tr>
                <td>${f.date}</td>
                <td><small>${f.orderId}</small><br><strong>${f.customerName || 'User'}</strong></td>
                <td>${f.mobileName || '-'}</td>
                <td><i class="fas fa-bolt" style="color:#e67e22"></i> ${f.ratings.efficiency}</td>
                <td><i class="fas fa-truck" style="color:#2ecc71"></i> ${f.ratings.delivery}</td>
                <td><i class="fas fa-mobile" style="color:#3498db"></i> ${f.ratings.product}</td>
                <td><small><em>"${f.remarks || 'No remarks'}"</em></small></td>
            </tr>
        `).join('');
    }
}
function showOrders() {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('orders').classList.remove('hidden');
    updateActiveNav('orders');
    populateOrdersTable();
    if (window.ordersInterval) clearInterval(window.ordersInterval);
    window.ordersInterval = setInterval(populateOrdersTable, 30000);
}
function updateActiveNav(active) {
    document.querySelectorAll('.admin-nav-links a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[href="#${active}"]`)?.classList.add('active');
}

// ==================== DASHBOARD (LINKED) ====================
function updateDashboardStats() {
    const stats = calculateStats();

    // Calculate Total Stock (Sum of stock of all phones)
    const totalInventory = stats.inventory.reduce((sum, item) => sum + (item.stock || 0), 0);

    document.getElementById('totalSales').textContent = stats.totalSold.toLocaleString();
    document.getElementById('totalRevenue').textContent = 'Rs. ' + stats.totalRevenue.toLocaleString();
    document.getElementById('totalProfit').textContent = 'Rs. ' + Math.round(stats.totalProfit).toLocaleString();
    document.getElementById('totalCustomers').textContent = stats.totalCustomers.toLocaleString();

    // Update Inventory Card
    const invEl = document.getElementById('totalInventory');
    if (invEl) invEl.textContent = totalInventory.toLocaleString();
}

// ==================== CHARTS (AUTO-LINKED) ====================
let salesChart, profitChart, trendChart, brandChart;

function drawCharts() {
    const stats = calculateStats();

    /* 1. Sales by Model (Bar) */
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        if (salesChart) salesChart.destroy();
        salesChart = new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: stats.inventory.slice(0, 5).map(p => p.model),
                datasets: [{
                    label: 'Units Sold',
                    data: stats.inventory.slice(0, 5).map(p => p.sold),
                    backgroundColor: 'rgba(17, 87, 64, 0.8)',
                    borderColor: 'rgba(17, 87, 64, 1)', borderWidth: 2
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Top 5 Selling Models' } } }
        });
    }

    /* 2. Revenue vs Profit (Doughnut) */
    const profitCtx = document.getElementById('profitChart');
    if (profitCtx) {
        if (profitChart) profitChart.destroy();
        profitChart = new Chart(profitCtx, {
            type: 'doughnut',
            data: {
                labels: ['Revenue', 'Profit (10%)'],
                datasets: [{ data: [stats.totalRevenue, stats.totalProfit], backgroundColor: ['rgba(17, 87, 64, 0.8)', 'rgba(241, 196, 15, 0.8)'] }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    /* 3. Brand Distribution (Pie) */
    const brandCtx = document.getElementById('brandChart');
    if (brandCtx) {
        if (brandChart) brandChart.destroy();
        const brandMap = {};
        stats.inventory.forEach(p => { brandMap[p.brand] = (brandMap[p.brand] || 0) + p.sold; });
        brandChart = new Chart(brandCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(brandMap),
                datasets: [{ data: Object.values(brandMap), backgroundColor: ['#115740', '#F1C40F', '#00b894', '#EA4335', '#34A853', '#FF9800'] }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    /* 4. Trend Line (Sales + Visits) last 30 days */
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        if (trendChart) trendChart.destroy();
        const days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
        });
        const salesPerDay = days.map(() => Math.floor(Math.random() * 50) + 10);
        const visitsPerDay = days.map(() => Math.floor(Math.random() * 200) + 80);

        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    { label: 'Sales', data: salesPerDay, borderColor: '#115740', backgroundColor: 'rgba(17,87,64,0.1)', tension: 0.4, fill: true },
                    { label: 'Site Visits', data: visitsPerDay, borderColor: '#F1C40F', backgroundColor: 'rgba(241,196,15,0.1)', tension: 0.4, fill: true }
                ]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
        });
    }
}

// ==================== INVENTORY (LINKED) ====================
function populateInventoryTable() {
    const tbody = document.getElementById('inventoryTable');
    const inventory = ensureInventory();
    tbody.innerHTML = inventory.map(p => `
        <tr>
            <td>${p.id}</td><td>${p.brand}</td><td>${p.model}</td>
            <td>Rs. ${p.price.toLocaleString()}</td>
            <td>${p.stock}</td><td>${p.sold}</td>
            <td>Rs. ${(p.sold * p.price).toLocaleString()}</td>
            <td>Rs. ${Math.round(p.sold * p.price * PROFIT_PERCENT).toLocaleString()}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editPhone(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action btn-delete" onclick="deletePhone(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`).join('');
}
function searchInventory() {
    const search = document.getElementById('inventorySearch').value.toLowerCase();
    document.querySelectorAll('#inventoryTable tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none';
    });
}
function addNewPhone() {
    const brand = prompt('Brand:');
    const model = prompt('Model:');
    const price = parseInt(prompt('Price (PKR):'));
    if (!brand || !model || !price) return alert('All fields required');
    const inventory = ensureInventory();
    const newId = Math.max(...inventory.map(p => p.id), 0) + 1;
    inventory.push({
        id: newId, brand, model, price,
        screen: '-', battery: '-', processor: '-', camera: '-', ram: '-', storage: '-', isDemanding: false,
        stock: INIT_STOCK_PER_MODEL, sold: 0
    });
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    populateInventoryTable();
    updateDashboardStats();   // link to dashboard
    drawCharts();             // link to charts
    showToast('New phone added');
}
function editPhone(id) {
    const inventory = ensureInventory();
    const idx = inventory.findIndex(p => p.id === id);
    if (idx === -1) return;
    const newStock = parseInt(prompt(`Current stock: ${inventory[idx].stock}\nNew stock:`));
    if (isNaN(newStock)) return;
    inventory[idx].stock = newStock;
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    populateInventoryTable();
    updateDashboardStats();
    drawCharts();
    showToast('Stock updated');
}
function deletePhone(id) {
    if (!confirm('Delete this phone from inventory?')) return;
    let inventory = ensureInventory();
    inventory = inventory.filter(p => p.id !== id);
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    populateInventoryTable();
    updateDashboardStats();
    drawCharts();
    showToast('Phone removed');
}

// ==================== ORDERS (LINKED) ====================
function populateOrdersTable() {
    const tbody = document.getElementById('ordersTable');
    const filter = document.getElementById('statusFilter')?.value || 'all';
    let orders = loadOrdersFromMainSite();
    if (filter !== 'all') orders = orders.filter(o => o.status === filter);

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td>${o.id}</td>
            <td><strong>${o.customer.name}</strong><br><small>${o.customer.phone}</small></td>
            <td>${o.items.map(i => i.model).join('<br>')}</td>
            <td>${o.items.length}</td>
            <td>Rs. ${o.total.toLocaleString()}</td>
            <td>${o.customer.city}</td>
            <td>${o.date}</td>
            <td><span class="status-${o.status.toLowerCase().replace(' ', '-')}">${o.status}</span></td>
            <td>
                <!-- APPROVAL FLOW CONTROLS -->
                ${o.status === 'Pending Approval' ? `
                    <button class="btn-action btn-approve" onclick="updateOrderStatus('${o.id}', 'Approved')" title="Approve & Deduct Stock"><i class="fas fa-check"></i></button>
                    <button class="btn-action btn-cancel" onclick="updateOrderStatus('${o.id}', 'Out of Stock')" title="Mark Out of Stock"><i class="fas fa-ban"></i></button>
                ` : ''}
                
                <!-- FULFILLMENT CONTROLS (Only if Approved) -->
                ${o.status === 'Approved' || o.status === 'Shipped' ? `
                    <button class="btn-action btn-ship" onclick="updateOrderStatus('${o.id}', 'Shipped')" title="Mark Shipped"><i class="fas fa-truck"></i></button>
                    <button class="btn-action btn-deliver" onclick="updateOrderStatus('${o.id}', 'Delivered')" title="Mark Delivered"><i class="fas fa-check-circle"></i></button>
                ` : ''}

                <!-- CANCELLATION (Always available unless Delivered) -->
                ${o.status !== 'Delivered' && o.status !== 'Cancelled' ? `
                    <button class="btn-action btn-cancel" onclick="updateOrderStatus('${o.id}', 'Cancelled')" title="Cancel Order"><i class="fas fa-times"></i></button>
                ` : ''}
            </td>
        </tr>`).join('');
    updateOrderStats(orders);
}

function updateOrderStatus(orderId, newStatus) {
    /* 1. Load Data */
    const orders = loadOrdersFromMainSite();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    let finalStatus = newStatus;

    // BUSINESS LOGIC: Out of Stock -> Cancelled
    if (newStatus === 'Out of Stock') {
        finalStatus = 'Cancelled';
        showToast('Order marked Out of Stock -> Auto-Cancelled');
    }

    /* 2. STOCK DEDUCTION (ONLY ON APPROVAL) */
    const inventory = ensureInventory();

    // Deduct Stock: When moving TO Approved FROM Pending
    if (finalStatus === 'Approved' && oldStatus === 'Pending Approval') {
        order.items.forEach(item => {
            const phone = inventory.find(p => p.id === item.id);
            if (phone && phone.stock > 0) {
                phone.stock--;
                phone.sold++; // Increment sold count on approval (secured sale)
            } else {
                alert(`Warning: ${item.model} might be out of stock!`);
            }
        });
        localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    }

    // Revert Stock: If Cancelled AFTER Approval
    if (finalStatus === 'Cancelled' && (oldStatus === 'Approved' || oldStatus === 'Shipped')) {
        order.items.forEach(item => {
            const phone = inventory.find(p => p.id === item.id);
            if (phone) {
                phone.stock++;
                phone.sold--;
            }
        });
        localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    }

    /* 3. SAVE STATUS */
    order.status = finalStatus;

    // Update timestamps
    if (finalStatus === 'Delivered' || finalStatus === 'Cancelled' || finalStatus === 'Approved') {
        order.updatedAt = Date.now();
    }

    localStorage.setItem('cellinfo_orders', JSON.stringify(orders));

    /* 4. REFRESH UI */
    populateOrdersTable();
    updateDashboardStats();
    drawCharts();
    showToast(`Order status: ${finalStatus}`);
}
function updateOrderStats(orders) {
    const counts = {
        'Pending Approval': orders.filter(o => o.status === 'Pending Approval').length,
        Approved: orders.filter(o => o.status === 'Approved').length,
        Shipped: orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length
    };
    Object.keys(counts).forEach(k => {
        const el = document.getElementById(k.toLowerCase() + 'Count');
        if (el) el.textContent = counts[k];
    });
}
function filterOrders() { populateOrdersTable(); }

// ==================== STARTUP ====================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) return; // login page
    if (!checkLogin()) return;

    // Initialize Dashboard
    showDashboard();
});