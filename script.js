// ===== DATA =====
const menuData = {
  drinks: [
    { id: 'd1', name: 'Classic Latte', desc: 'Espresso with steamed milk', price: 4.50 },
    { id: 'd2', name: 'Cappuccino', desc: 'Espresso, steamed milk, foam', price: 4.75 },
    { id: 'd3', name: 'Flat White', desc: 'Double ristretto with microfoam', price: 5.00 },
    { id: 'd4', name: 'Mocha', desc: 'Espresso with chocolate & milk', price: 5.25 },
    { id: 'd5', name: 'Cold Brew', desc: 'Slow-steeped, smooth & bold', price: 4.50 },
    { id: 'd6', name: 'Chai Latte', desc: 'Spiced chai with steamed milk', price: 4.75 },
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', desc: 'Flaky, butter, golden', price: 3.50 },
    { id: 'p2', name: 'Blueberry Muffin', desc: 'Fresh blueberries, crumb top', price: 3.75 },
    { id: 'p3', name: 'Cinnamon Roll', desc: 'Iced, gooey, spiced', price: 4.25 },
    { id: 'p4', name: 'Chocolate Chip Cookie', desc: 'Chewy, dark chocolate', price: 2.75 },
    { id: 'p5', name: 'Banana Bread', desc: 'Moist, walnut-studded', price: 3.50 },
    { id: 'p6', name: 'Scone (Cheddar Herb)', desc: 'Savory, flaky, golden', price: 3.25 },
  ]
};

const galleryData = [
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', caption: 'Morning light at the counter' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', caption: 'Pour-over perfection' },
  { src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&q=80', caption: 'Cozy reading nook' },
  { src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80', caption: 'Freshly roasted beans' },
  { src: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&q=80', caption: 'Latte art in motion' },
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', caption: 'Our cozy patio' },
];

// ===== STATE =====
let cart = {};
let currentTab = 'drinks';

// ===== DOM REFS =====
const menuGrid = document.getElementById('menuGrid');
const orderItems = document.getElementById('orderItems');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const cartModalBody = document.getElementById('cartModalBody');
const cartModalTotal = document.getElementById('cartModalTotal');
const cartModalOverlay = document.getElementById('cartModalOverlay');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const cartBtn = document.getElementById('cartBtn');
const cartModalClose = document.getElementById('cartModalClose');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModalBtn = document.getElementById('checkoutModalBtn');
const contactForm = document.getElementById('contactForm');

// ===== RENDER MENU =====
function renderMenu(tab) {
  const items = menuData[tab] || [];
  menuGrid.innerHTML = items.map(item => `
    <div class="menu-card">
      <h4>${item.name}</h4>
      <p class="desc">${item.desc}</p>
      <div class="price-row">
        <span class="price">$${item.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" aria-label="Add ${item.name}">
          <i data-lucide="plus" style="width:18px;height:18px;"></i>
        </button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
  attachAddButtons(menuGrid);
}

// ===== RENDER ORDER ITEMS =====
function renderOrderItems() {
  const allItems = [...menuData.drinks, ...menuData.pastries];
  orderItems.innerHTML = allItems.map(item => `
    <div class="order-item-card">
      <h4>${item.name}</h4>
      <p class="desc">${item.desc}</p>
      <div class="price-row">
        <span class="price">$${item.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" aria-label="Add ${item.name}">
          <i data-lucide="plus" style="width:18px;height:18px;"></i>
        </button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
  attachAddButtons(orderItems);
}

// ===== ATTACH ADD BUTTONS =====
function attachAddButtons(container) {
  container.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart(id, name, price);
    });
  });
}

// ===== CART OPERATIONS =====
function addToCart(id, name, price) {
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { name, price, qty: 1 };
  }
  updateCartUI();
  // subtle feedback
  const badge = cartBadge;
  badge.style.transform = 'scale(1.3)';
  setTimeout(() => badge.style.transform = 'scale(1)', 200);
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) {
      delete cart[id];
    }
    updateCartUI();
  }
}

function getCartTotal() {
  let total = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
  });
  return total;
}

function getCartCount() {
  let count = 0;
  Object.values(cart).forEach(item => {
    count += item.qty;
  });
  return count;
}

function updateCartUI() {
  const count = getCartCount();
  cartBadge.textContent = count;

  // sidebar cart
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = entries.map(([id, item]) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
        <div class="cart-item-actions">
          <button data-id="${id}" class="cart-dec">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button data-id="${id}" class="cart-inc">+</button>
        </div>
      </div>
    `).join('');
    // attach events
    cartItems.querySelectorAll('.cart-dec').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
    cartItems.querySelectorAll('.cart-inc').forEach(btn => {
      const id = btn.dataset.id;
      const item = cart[id];
      if (item) addToCart(id, item.name, item.price);
    });
  }

  const total = getCartTotal();
  cartTotal.textContent = `$${total.toFixed(2)}`;

  // modal sync
  updateCartModal();
}

function updateCartModal() {
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartModalBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cartModalBody.innerHTML = entries.map(([id, item]) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name} × ${item.qty}</span>
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
    `).join('');
  }
  cartModalTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

// ===== RENDER GALLERY =====
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = galleryData.map(img => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${img.caption}" loading="lazy" />
      <div class="caption">${img.caption}</div>
    </div>
  `).join('');
}

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = themeToggle.querySelector('i');
  icon.setAttribute('data-lucide', saved === 'dark' ? 'sun' : 'moon');
  lucide.createIcons();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const icon = themeToggle.querySelector('i');
  icon.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
  lucide.createIcons();
}

// ===== NAVIGATION ACTIVE LINK =====
function updateActiveLink() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  let current = 'home';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      current = sec.id;
    }
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===== EVENT LISTENERS =====
// tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    renderMenu(currentTab);
  });
});

// hamburger
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// theme
themeToggle.addEventListener('click', toggleTheme);

// cart modal
cartBtn.addEventListener('click', () => {
  updateCartModal();
  cartModalOverlay.classList.add('open');
});

cartModalClose.addEventListener('click', () => {
  cartModalOverlay.classList.remove('open');
});

cartModalOverlay.addEventListener('click', (e) => {
  if (e.target === cartModalOverlay) {
    cartModalOverlay.classList.remove('open');
  }
});

// checkout
checkoutBtn.addEventListener('click', () => {
  if (getCartCount() === 0) return;
  updateCartModal();
  cartModalOverlay.classList.add('open');
});

checkoutModalBtn.addEventListener('click', () => {
  if (getCartCount() === 0) return;
  alert('Thank you! Your order has been placed. We’ll have it ready for pickup.');
  cart = {};
  updateCartUI();
  cartModalOverlay.classList.remove('open');
});

// contact form
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks for reaching out! We’ll get back to you within 24 hours.');
  contactForm.reset();
});

// scroll
window.addEventListener('scroll', updateActiveLink);

// ===== INIT =====
renderMenu('drinks');
renderOrderItems();
renderGallery();
initTheme();
updateCartUI();
updateActiveLink();

// close nav on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) navLinks.classList.remove('open');
});