/* --- CONFIGURATION & TRANSLATIONS --- */
const translations = {
    en: {
        nav_home: "Home", nav_mobiles: "Top Mobiles",
        nav_efficiency: "Order Efficiency", nav_feedback: "Feedback",
        hero_title: "Most Demanding Mobile in Pakistan Market",
        hero_desc: "Explore 100% PTA Approved devices with official warranty.", hero_btn: "Explore Collections",
        section_title: "Market Leaders & Best Sellers", compare_title: "Device Comparison", cart_title: "Your Cart",
        pta_approved: "PTA Approved", month: "/month", add_cart: "Add Cart", compare: "Compare",
        compare_label: "Compare Devices", btn_compare: "Compare Now", demanding: "Most Demanding",
        checkout: "Checkout", empty_cart: "Your cart is empty", total: "Total",
        checkout_title: "Shipping Details",
        order_success: "Order placed successfully!",
        order_failed: "Order failed. Please try again.",
        confirm_order: "Confirm Order",
        full_name: "Full Name",
        phone_number: "Phone Number",
        email_address: "Email Address",
        shipping_address: "Shipping Address",
        city: "City",
        order_summary: "Order Summary",
        // Efficiency Page
        efficiency_header: "Operational Transparency",
        efficiency_desc: "Real-time insights into our service quality and order processing efficiency.",
        label_fulfillment: "Avg. Fulfillment Time",
        label_success: "Order Success Rate",
        label_inventory: "Inventory Availability",
        chart_trend: "Order Fulfillment Trend (Last 7 Days)",
        chart_satisfaction: "Customer Satisfaction",
        // Feedback Page
        feedback_header: "Share Your Experience",
        feedback_desc: "Your feedback helps us improve our service efficiency."
    },
    ur: {
        nav_home: "ہوم", nav_mobiles: "مقبول موبائلز",
        nav_efficiency: "آرڈر کی کارکردگی", nav_feedback: "فیڈبیک",
        hero_title: "پاکستان میں سب سے زیادہ مقبول موبائل",
        hero_desc: "تصدیق شدہ پی ٹی اے منظور شدہ فونز کی بہترین ورائٹی حاصل کریں۔", hero_btn: "کلیکشن دیکھیں",
        section_title: "مارکیٹ کے بہترین فونز", compare_title: "موازنہ کریں", cart_title: "آپ کی ٹوکری",
        pta_approved: "پی ٹی اے منظور شدہ", month: "/ماہانہ", add_cart: "خریدیں", compare: "موازنہ",
        compare_label: "موازنہ کریں", btn_compare: "اب موازنہ کریں", demanding: "سب سے زیادہ مقبول",
        checkout: "ادائیگی کریں", empty_cart: "آپ کی ٹوکری خالی ہے", total: "کل قیمت",
        checkout_title: "شپنگ کی تفصیلات",
        order_success: "آرڈر کامیابی سے رکھا گیا!",
        order_failed: "آرڈر ناکام ہوگیا۔ براہ کرم دوبارہ کوشش کریں۔",
        confirm_order: "آرڈر کی تصدیق کریں",
        full_name: "پورا نام",
        phone_number: "فون نمبر",
        email_address: "ای میل پتہ",
        shipping_address: "شپنگ پتہ",
        city: "شہر",
        order_summary: "آرڈر کا خلاصہ",
        // Efficiency Page
        efficiency_header: "آپریشنل شفافیت",
        efficiency_desc: "ہماری سروس کے معیار اور آرڈر پروسیسنگ کی کارکردگی پر براہ راست بصیرت۔",
        label_fulfillment: "اوسط تکمیل کا وقت",
        label_success: "آرڈر کامیابی کی شرح",
        label_inventory: "انوینٹری کی دستیابی",
        chart_trend: "آرڈر کی تکمیل کا رجحان (گزشتہ 7 دن)",
        chart_satisfaction: "کسٹمر کا اطمینان",
        // Feedback Page
        feedback_header: "اپنا تجربہ شیئر کریں",
        feedback_desc: "آپ کی رائے ہمیں اپنی سروس کی کارکردگی کو بہتر بنانے میں مدد کرتی ہے۔"
    }
};

/* --- STATE VARIABLES --- */
let currentLang = 'en';
let currentFilter = 'all';
let cart = [];
let compareList = [];

/* --- FULL PHONE DATA (20 MODELS) --- */
const allPhones = [
    { id: 1, brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 435000, screen: '6.8" QHD+ AMOLED', battery: '5000 mAh', processor: 'Snapdragon 8 Gen 3', camera: '200MP Quad', ram: '12GB', storage: '512GB', isDemanding: true },
    { id: 2, brand: 'Apple', model: 'iPhone 15 Pro Max', price: 585000, screen: '6.7" OLED 120Hz', battery: '4441 mAh', processor: 'A17 Pro Chip', camera: '48MP Pro System', ram: '8GB', storage: '256GB', isDemanding: true },
    { id: 3, brand: 'Infinix', model: 'Note 40 Pro', price: 75000, screen: '6.78" AMOLED Curved', battery: '5000 mAh', processor: 'Helio G99 Ultimate', camera: '108MP OIS', ram: '12GB', storage: '256GB', isDemanding: true },
    { id: 4, brand: 'Tecno', model: 'Spark 20 Pro+', price: 56000, screen: '6.78" AMOLED', battery: '5000 mAh', processor: 'Helio G99 Ultimate', camera: '108MP Main', ram: '8GB', storage: '256GB', isDemanding: false },
    { id: 5, brand: 'Samsung', model: 'Galaxy A54 5G', price: 105000, screen: '6.4" S-AMOLED', battery: '5000 mAh', processor: 'Exynos 1380', camera: '50MP OIS', ram: '8GB', storage: '256GB', isDemanding: true },
    { id: 6, brand: 'Xiaomi', model: 'Redmi Note 13', price: 60000, screen: '6.67" AMOLED 120Hz', battery: '5000 mAh', processor: 'Snapdragon 685', camera: '108MP Triple', ram: '8GB', storage: '256GB', isDemanding: false },
    { id: 7, brand: 'Vivo', model: 'V29 5G', price: 159999, screen: '6.78" AMOLED 120Hz', battery: '4600 mAh', processor: 'Snapdragon 778G', camera: '50MP Aura Light', ram: '12GB', storage: '256GB', isDemanding: true },
    { id: 8, brand: 'Oppo', model: 'Reno 11 F', price: 80000, screen: '6.7" AMOLED', battery: '5000 mAh', processor: 'Dimensity 7050', camera: '64MP Main', ram: '8GB', storage: '256GB', isDemanding: false },
    { id: 9, brand: 'Apple', model: 'iPhone 13', price: 240000, screen: '6.1" OLED', battery: '3240 mAh', processor: 'A15 Bionic', camera: '12MP Dual', ram: '4GB', storage: '128GB', isDemanding: true },
    { id: 10, brand: 'Infinix', model: 'Zero 30 5G', price: 99999, screen: '6.78" Curved AMOLED', battery: '5000 mAh', processor: 'Dimensity 8020', camera: '108MP + 50MP Front', ram: '12GB', storage: '256GB', isDemanding: false },
    { id: 11, brand: 'Tecno', model: 'Camon 30', price: 110000, screen: '6.7" AMOLED', battery: '5000 mAh', processor: 'Helio G99', camera: '50MP OIS', ram: '12GB', storage: '512GB', isDemanding: true },
    { id: 12, brand: 'Samsung', model: 'Galaxy S23 FE', price: 185000, screen: '6.4" Dynamic AMOLED', battery: '4500 mAh', processor: 'Exynos 2200', camera: '50MP Triple', ram: '8GB', storage: '256GB', isDemanding: false },

    // BUDGET PHONES (IDs 13-20)
    { id: 13, brand: 'Xiaomi', model: 'Redmi 13C', price: 34999, screen: '6.74" 90Hz', battery: '5000 mAh', processor: 'Helio G85', camera: '50MP AI Triple', ram: '6GB', storage: '128GB', isDemanding: true },
    { id: 14, brand: 'Samsung', model: 'Galaxy A05s', price: 44500, screen: '6.7" FHD+', battery: '5000 mAh', processor: 'Snapdragon 680', camera: '50MP Triple', ram: '6GB', storage: '128GB', isDemanding: true },
    { id: 15, brand: 'Infinix', model: 'Hot 40i', price: 32999, screen: '6.56" 90Hz', battery: '5000 mAh', processor: 'Unisoc T606', camera: '50MP Dual', ram: '8GB', storage: '128GB', isDemanding: false },
    { id: 16, brand: 'Tecno', model: 'Spark 20', price: 39999, screen: '6.6" 90Hz', battery: '5000 mAh', processor: 'Helio G85', camera: '50MP Main', ram: '8GB', storage: '256GB', isDemanding: true },
    { id: 17, brand: 'Vivo', model: 'Y03', price: 28999, screen: '6.56" LCD', battery: '5000 mAh', processor: 'Helio G85', camera: '13MP Dual', ram: '4GB', storage: '64GB', isDemanding: false },
    { id: 18, brand: 'Realme', model: 'Note 50', price: 24999, screen: '6.74" 90Hz', battery: '5000 mAh', processor: 'Unisoc T612', camera: '13MP AI', ram: '4GB', storage: '64GB', isDemanding: true },
    { id: 19, brand: 'Oppo', model: 'A18', price: 36000, screen: '6.56" 90Hz', battery: '5000 mAh', processor: 'Helio G85', camera: '8MP Dual', ram: '4GB', storage: '128GB', isDemanding: false },
    { id: 20, brand: 'Sparx', model: 'Neo 7 Ultra', price: 27500, screen: '6.52" IPS', battery: '5000 mAh', processor: 'Octa Core', camera: '50MP Dual', ram: '6GB', storage: '128GB', isDemanding: false }
];

/* --- INITIALIZATION --- */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById('skeleton-container').classList.add('hidden');
        document.getElementById('phoneGrid').classList.remove('hidden');
        const sortedPhones = [...allPhones].sort((a, b) => b.isDemanding - a.isDemanding);
        renderPhones(sortedPhones);
    }, 1000);
});

/* --- CORE RENDER FUNCTION --- */
function renderPhones(phones) {
    const grid = document.getElementById('phoneGrid');
    grid.innerHTML = '';
    const langData = translations[currentLang];

    if (phones.length === 0) {
        grid.innerHTML = `<h3 style="color:white; text-align:center; grid-column:1/-1;">No phones found matching your criteria.</h3>`;
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    phones.forEach((phone) => {
        const formattedPrice = phone.price.toLocaleString('en-PK');
        const installment = Math.round(phone.price / 12).toLocaleString('en-PK');
        const isComparing = compareList.includes(phone.id) ? 'active' : '';

        let badgeHTML = `<div class="pta-badge"><i class="fas fa-check-circle"></i> ${langData.pta_approved}</div>`;
        if (phone.isDemanding) {
            badgeHTML += `<div class="demanding-badge">${langData.demanding}</div>`;
        }

        const card = document.createElement('div');
        card.className = 'phone-card';
        card.innerHTML = `
            ${badgeHTML}
            <div class="phone-img-placeholder">
            <img 
  src="a.jpg"
  alt="description"
  style="
  position: fixed;
  top: 45px;
  right: 20px;
  width: 200px;
  height: 180px;
  left: 78px;
  "
>

       
            </div>

            <div class="phone-header">
                <div style="flex:1">
                    <h3 class="model-name">${phone.model}</h3>
                </div>
                <div style="text-align:right">
                    <div class="price">Rs. ${formattedPrice}</div>
                    <span class="installment">Or Rs. ${installment}${langData.month}</span>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-item"><i class="fas fa-microchip"></i> ${phone.processor}</div>
                <div class="feature-item"><i class="fas fa-battery-full"></i> ${phone.battery}</div>
                <div class="feature-item"><i class="fas fa-camera"></i> ${phone.camera}</div>
                <div class="feature-item"><i class="fas fa-expand"></i> ${phone.screen}</div>
            </div>

            <div class="card-actions">
                <button class="btn-action btn-cart" onclick="addToCart(${phone.id})">
                    <i class="fas fa-cart-plus"></i> ${langData.add_cart}
                </button>
                <button class="btn-action btn-compare ${isComparing}" id="btn-compare-${phone.id}" onclick="toggleCompare(${phone.id})">
                    <i class="fas fa-balance-scale"></i> ${langData.compare}
                </button>
                <button onclick="openGmailPopup('${phone.model}', '${formattedPrice}')" class="btn-action btn-email">
                    <i class="fas fa-envelope"></i>
                </button>
            </div>
        `;

        grid.appendChild(card);
        observer.observe(card);
    });
}

/* --- FILTERS & SEARCH --- */

const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.volume = 0.4;
    clickSound.play().catch(e => console.log('Audio play prevented', e));
}

function filterPhones(criteria) {
    playClickSound();
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const activeBtn = buttons.find(b => {
        if (criteria === 'all') return b.innerText.includes('All');
        if (criteria === 'demanding') return b.innerText.includes('Demanding');
        return b.innerText.includes(criteria);
    });
    if (activeBtn) activeBtn.classList.add('active');

    currentFilter = criteria;
    let filtered = [];
    if (criteria === 'all') filtered = allPhones;
    else if (criteria === 'demanding') filtered = allPhones.filter(p => p.isDemanding);
    else filtered = allPhones.filter(p => p.brand === criteria);
    renderPhones(filtered);
}

function searchPhone() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPhones.filter(phone =>
        phone.model.toLowerCase().includes(input) ||
        phone.brand.toLowerCase().includes(input)
    );
    renderPhones(filtered);
}

function filterByPrice(range) {
    playClickSound();
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

    let filtered = [];
    if (range === 'all') {
        filtered = allPhones;
    } else if (range === 'low') {
        filtered = allPhones.filter(phone => phone.price < 50000);
    } else if (range === 'medium') {
        filtered = allPhones.filter(phone => phone.price >= 50000 && phone.price <= 100000);
    } else if (range === 'high') {
        filtered = allPhones.filter(phone => phone.price > 100000);
    }
    renderPhones(filtered);
}

/* --- CART SYSTEM --- */
function addToCart(id) {
    const phone = allPhones.find(p => p.id === id);
    cart.push(phone);
    updateCartCount();
    showToast(`${phone.model} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCart();
}

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    badge.innerText = cart.length;
    badge.style.transform = "scale(1.5)";
    setTimeout(() => badge.style.transform = "scale(1)", 200);
}

// FIXED CART FUNCTION
function openCart(event) {
    if (event) event.preventDefault();

    console.log('🛒 Opening cart... items:', cart.length); // Debug log

    const list = document.getElementById('cart-items-list');
    const totalSpan = document.getElementById('cart-total');
    const modalBody = document.querySelector('#cart-modal .modal-body');

    if (!list || !totalSpan || !modalBody) {
        console.error('❌ Cart elements not found!');
        return;
    }

    // Clear previous content
    list.innerHTML = '';
    let total = 0;

    // Remove any existing checkout button
    const existingBtn = modalBody.querySelector('.checkout-btn');
    if (existingBtn) existingBtn.remove();

    if (cart.length === 0) {
        list.innerHTML = `<li class="empty-msg">${translations[currentLang].empty_cart}</li>`;
        document.getElementById('cart-total').textContent = '0';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <li style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-mobile-alt"></i>
                        <span>${item.model}</span>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <span>Rs. ${item.price.toLocaleString()}</span>
                        <button class="btn-remove" onclick="removeFromCart(${index})" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>`;
        });

        document.getElementById('cart-total').textContent = total.toLocaleString();

        // Add checkout button at bottom
        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'btn checkout-btn';
        checkoutBtn.style.cssText = 'width: 100%; margin-top: 20px;';
        checkoutBtn.innerHTML = `<i class="fas fa-credit-card"></i> ${translations[currentLang].checkout}`;
        checkoutBtn.onclick = openCheckout;
        modalBody.appendChild(checkoutBtn);
    }

    // Show modal
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'block';
        console.log('✅ Cart modal displayed');
    }
}

/* --- COMPARISON LOGIC --- */
function toggleCompare(id) {
    const btn = document.getElementById(`btn-compare-${id}`);

    if (compareList.includes(id)) {
        compareList = compareList.filter(item => item !== id);
        btn.classList.remove('active');
        showToast("Removed from comparison");
    } else {
        if (compareList.length >= 3) {
            alert("You can only compare up to 3 devices.");
            return;
        }
        compareList.push(id);
        btn.classList.add('active');
        showToast("Added to comparison");
    }
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    const thumbs = document.getElementById('compare-thumbs');
    const count = document.getElementById('compare-count-num');
    count.innerText = compareList.length;
    thumbs.innerHTML = '';

    if (compareList.length > 0) {
        bar.classList.add('visible');
        compareList.forEach(id => {
            const phone = allPhones.find(p => p.id === id);
            thumbs.innerHTML += `<div class="compare-thumb" title="${phone.model}"><i class="fas fa-mobile-alt"></i></div>`;
        });
    } else {
        bar.classList.remove('visible');
    }
}

function clearComparison() {
    compareList = [];
    document.querySelectorAll('.btn-compare').forEach(btn => btn.classList.remove('active'));
    updateCompareBar();
}

function showComparisonModal() {
    const container = document.getElementById('comparison-table-container');
    const modal = document.getElementById('compare-modal');
    if (compareList.length < 2) {
        alert("Please select at least 2 devices to compare.");
        return;
    }
    const phonesToCompare = allPhones.filter(p => compareList.includes(p.id));

    let html = `<table class="comp-table"><tbody>`;
    html += `<tr><th>Device</th>`;
    phonesToCompare.forEach(p => html += `<td style="text-align:center;"><i class="fas fa-mobile-alt comp-img"></i><strong>${p.model}</strong></td>`);
    html += `</tr>`;

    html += `<tr><th>Price</th>`;
    phonesToCompare.forEach(p => html += `<td><strong style="color:var(--primary)">Rs. ${p.price.toLocaleString()}</strong></td>`);
    html += `</tr>`;

    const specs = [
        { label: 'Processor', key: 'processor' },
        { label: 'RAM/Storage', key: 'ram', extra: 'storage' },
        { label: 'Screen', key: 'screen' },
        { label: 'Camera', key: 'camera' },
        { label: 'Battery', key: 'battery' }
    ];

    specs.forEach(spec => {
        html += `<tr><th>${spec.label}</th>`;
        phonesToCompare.forEach(p => {
            let val = p[spec.key];
            if (spec.extra) val += ` / ${p[spec.extra]}`;
            html += `<td>${val}</td>`;
        });
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
    modal.style.display = 'block';
}

/* --- UTILITIES --- */
function openGmailPopup(model, price) {
    const emailTo = "eproject215@gmail.com";
    const subject = `Query regarding ${model}`;
    const body = `Hello,\n\nI am interested in the ${model} (Price: Rs. ${price}).\n\nPlease assist me with the following query:\n\n`;

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const width = 800;
    const height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(url, 'GmailCompose', `width=${width},height=${height},top=${top},left=${left}`);
}

function toggleLanguage() {
    const toggle = document.getElementById('lang-toggle');
    currentLang = toggle.checked ? 'ur' : 'en';

    if (currentLang === 'ur') document.body.classList.add('urdu-mode');
    else document.body.classList.remove('urdu-mode');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
    });

    renderPhones(allPhones);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

window.onclick = e => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
};

// ==================== ADMIN & CHECKOUT SYSTEMS ====================

function shareDataWithAdmin() {
    try {
        localStorage.setItem('cellinfo_phones', JSON.stringify(allPhones));
        const salesStats = {
            totalSales: 1247,
            totalRevenue: 8500000,
            totalInventory: 2456,
            totalCustomers: 892,
            topSelling: allPhones.slice(0, 5).map(phone => ({
                ...phone,
                sold: Math.floor(Math.random() * 200) + 10,
                stock: Math.floor(Math.random() * 100) + 20,
                revenue: 0,
                profit: 0
            }))
        };
        salesStats.topSelling.forEach(phone => {
            phone.revenue = phone.sold * phone.price;
            phone.profit = phone.revenue * 0.2;
        });
        localStorage.setItem('cellinfo_stats', JSON.stringify(salesStats));
        console.log('✅ Data shared with admin portal');
    } catch (e) {
        console.warn('⚠️ Could not share data with admin:', e);
    }
}

function openAdmin(event) {
    event.preventDefault();
    const adminUrl = 'E.Project_admin/login.html';
    try {
        const newTab = window.open(adminUrl, '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
            alert('⚠️ Popup blocked! Click OK to open Admin Panel in this tab.');
            window.location.href = adminUrl;
        }
    } catch (e) {
        window.location.href = adminUrl;
    }
}

function openCheckout() {
    if (cart.length === 0) {
        showToast(translations[currentLang].empty_cart || 'Cart is empty!');
        return;
    }

    // Populate order summary
    const orderItems = document.getElementById('orderItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (orderItems && checkoutTotal) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <span>${item.model}</span>
                <span>Rs. ${item.price.toLocaleString()}</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        checkoutTotal.textContent = total.toLocaleString();
    }

    // Show modal with 3D effect
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
        // Add animation class for entrance
        checkoutModal.querySelector('.checkout-content-3d').style.animation = 'slideInUp 0.5s ease';
    }
}

function submitOrder(event) {
    event.preventDefault();

    const order = {
        id: 'ORD' + Date.now(),
        customer: {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value,
            city: document.getElementById('customerCity').value
        },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'Pending Approval',
        date: new Date().toLocaleString('en-PK'),
        timestamp: Date.now(),
        updatedAt: Date.now()
    };

    try {
        const existingOrders = JSON.parse(localStorage.getItem('cellinfo_orders') || '[]');
        existingOrders.unshift(order);
        localStorage.setItem('cellinfo_orders', JSON.stringify(existingOrders));
        showToast(translations[currentLang].order_success || 'Order placed successfully!');
    } catch (e) {
        showToast(translations[currentLang].order_failed || 'Order failed. Please try again.');
        return;
    }

    cart = [];
    updateCartCount();
    closeModal('checkout-modal');
    closeModal('cart-modal');
    document.getElementById('checkoutForm').reset();

    setTimeout(() => {
        alert(`${translations[currentLang].order_success}\n\nOrder ID: ${order.id}\n\nThank you, ${order.customer.name}!`);
    }, 500);
}

// ==================== PAGE LOAD SETUP ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(shareDataWithAdmin, 1000);

    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
        adminBtn.onclick = openAdmin;
    }

    // Add shake animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});

// ==================== STRICT FEEDBACK SYSTEM ====================
let verifiedFeedbackOrder = null;

function verifyOrderForFeedback() {
    const orderId = document.getElementById('orderId').value.trim();
    if (!orderId) return showToast('Please enter Order ID');

    const orders = JSON.parse(localStorage.getItem('cellinfo_orders') || '[]');
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        showToast('❌ Order not found!');
        return;
    }

    if (order.status !== 'Delivered') {
        showToast('⚠️ Feedback only allowed for DELIVERED orders.');
        return;
    }

    // Success - Show Form
    verifiedFeedbackOrder = order;
    document.getElementById('lookupSection').style.display = 'none';
    document.getElementById('ratingSection').style.display = 'block';

    document.getElementById('displayCustomer').textContent = order.customer.name;
    document.getElementById('displayPhone').textContent = order.items.map(i => i.model).join(', ');
}

function submitFeedback(event) {
    event.preventDefault();

    if (!verifiedFeedbackOrder) return;

    const efficiency = document.getElementById('efficiencyResult').value;
    const delivery = document.getElementById('deliveryResult').value;
    const product = document.getElementById('productResult').value;

    if (!efficiency || !delivery || !product) {
        showToast("Please rate all criteria!");
        return;
    }

    const feedback = {
        id: 'FB' + Date.now(),
        orderId: verifiedFeedbackOrder.id,
        customerName: verifiedFeedbackOrder.customer.name, // Linked Data
        mobileName: verifiedFeedbackOrder.items[0]?.model || 'Mixed',
        ratings: {
            efficiency: parseInt(efficiency),
            delivery: parseInt(delivery),
            product: parseInt(product)
        },
        remarks: document.getElementById('feedbackRemarks').value.trim() || 'No remarks',
        timestamp: Date.now(),
        date: new Date().toLocaleString()
    };

    const allFeedback = JSON.parse(localStorage.getItem('cellinfo_feedback') || '[]');
    allFeedback.unshift(feedback);
    localStorage.setItem('cellinfo_feedback', JSON.stringify(allFeedback));

    showToast("Thank you! Feedback linked to your order.");
    setTimeout(() => window.location.href = 'index.html', 2000);
}