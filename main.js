// Menu data
const menuItems = [
  {
    id: 1,
    name: "Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco e azeite",
    price: 35.90,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    category: "tradicional"
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Molho de tomate, mussarela e pepperoni",
    price: 42.90,
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
    category: "tradicional"
  },
  {
    id: 3,
    name: "Quatro Queijos",
    description: "Mussarela, gorgonzola, parmesão e provolone",
    price: 45.90,
    image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg",
    category: "especial"
  },
  {
    id: 4,
    name: "Portuguesa",
    description: "Presunto, ovos, cebola, azeitona e ervilha",
    price: 39.90,
    image: "https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg",
    category: "tradicional"
  },
  {
    id: 5,
    name: "Frango com Catupiry",
    description: "Frango desfiado, catupiry e milho",
    price: 41.90,
    image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
    category: "especial"
  },
  {
    id: 6,
    name: "Calabresa",
    description: "Calabresa, cebola e azeitona",
    price: 37.90,
    image: "https://images.pexels.com/photos/1552635/pexels-photo-1552635.jpeg",
    category: "tradicional"
  },
  {
    id: 7,
    name: "Vegetariana",
    description: "Abobrinha, berinjela, pimentão, tomate e rúcula",
    price: 38.90,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    category: "especial"
  },
  {
    id: 8,
    name: "Chocolate",
    description: "Chocolate ao leite e granulado",
    price: 32.90,
    image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg",
    category: "doce"
  },
  {
    id: 9,
    name: "Banana com Canela",
    description: "Banana, canela, açúcar e leite condensado",
    price: 29.90,
    image: "https://images.pexels.com/photos/4109943/pexels-photo-4109943.jpeg",
    category: "doce"
  }
];

// Cart functionality
let cart = [];

// DOM elements
const menuGrid = document.getElementById('menu-grid');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Checkout modal instance
let checkoutModal = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  renderMenu();
  setupEventListeners();
  updateCartUI();
});

// Render menu items
function renderMenu(filter = 'all') {
  menuGrid.innerHTML = '';
  
  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);
  
  filteredItems.forEach(item => {
    const menuItemElement = createMenuItemElement(item);
    menuGrid.appendChild(menuItemElement);
  });
}

// Create menu item element
function createMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item';
  div.innerHTML = `
    <img src="${item.image}" alt="${item.name}" loading="lazy">
    <div class="menu-item-content">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-item-footer">
        <span class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          <i class="fas fa-plus"></i>
          Adicionar
        </button>
      </div>
    </div>
  `;
  return div;
}

// Add item to cart
function addToCart(itemId) {
  const item = menuItems.find(item => item.id === itemId);
  const existingItem = cart.find(cartItem => cartItem.id === itemId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  
  updateCartUI();
  showCartAnimation();
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cart.find(cartItem => cartItem.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartUI();
    }
  }
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  
  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Seu carrinho está vazio</p>
      </div>
    `;
    cartTotal.textContent = '0,00';
    checkoutBtn.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
    checkoutBtn.style.display = 'flex';
  }
}

// Show cart animation
function showCartAnimation() {
  cartIcon.style.transform = 'scale(1.2)';
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1)';
  }, 200);
}

// Setup event listeners
function setupEventListeners() {
  // Cart modal
  cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
  });
  
  closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
  });
  
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
    }
  });
  
  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Filter menu
      const filter = btn.getAttribute('data-filter');
      renderMenu(filter);
    });
  });
  
  // Checkout
  checkoutBtn.addEventListener('click', checkout);
  
  // Smooth scrolling for navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Checkout function
function checkout() {
  if (cart.length === 0) return;
  
  // Fechar modal do carrinho
  cartModal.classList.remove('active');
  
  // Criar modal de checkout simplificado
  createSimpleCheckoutModal();
}

// Criar modal de checkout simplificado
function createSimpleCheckoutModal() {
  // Remover modal existente se houver
  const existingModal = document.getElementById('checkout-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-modal active';
  modal.innerHTML = `
    <div class="checkout-content">
      <div class="checkout-header">
        <h3>Finalizar Pedido</h3>
        <button class="close-checkout" onclick="closeCheckoutModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="checkout-body">
        <div class="order-summary">
          <h4>Resumo do Pedido</h4>
          <div class="order-items">
            ${cart.map(item => `
              <div class="order-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-total">
            <strong>Total: R$ ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>
        
        <div class="customer-form">
          <h4>Seus Dados</h4>
          <div class="form-group">
            <label>Nome Completo:</label>
            <input type="text" id="customer-name" placeholder="Digite seu nome" required>
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input type="tel" id="customer-phone" placeholder="(11) 99999-9999" required>
          </div>
          <div class="form-group">
            <label>Endereço:</label>
            <textarea id="customer-address" placeholder="Rua, número, bairro, cidade" required></textarea>
          </div>
        </div>
        
        <div class="payment-methods">
          <h4>Forma de Pagamento</h4>
          <div class="payment-options">
            <label class="payment-option">
              <input type="radio" name="payment" value="pix" checked>
              <span>💳 PIX</span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="money">
              <span>💵 Dinheiro</span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="card">
              <span>💳 Cartão</span>
            </label>
          </div>
        </div>
        
        <button class="finish-order-btn" onclick="finishOrder()">
          <i class="fab fa-whatsapp"></i>
          Enviar Pedido via WhatsApp
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// Fechar modal de checkout
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.remove();
  }
}

// Finalizar pedido
function finishOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;

  if (!name || !phone || !address) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Criar mensagem para WhatsApp
  const orderItems = cart.map(item => 
    `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const paymentMethods = {
    'pix': 'PIX',
    'money': 'Dinheiro',
    'card': 'Cartão'
  };

  const message = `🍕 *NOVO PEDIDO - Pizzaria Bella Vista*

👤 *Cliente:* ${name}
📱 *Telefone:* ${phone}
📍 *Endereço:* ${address}

🛒 *Itens do Pedido:*
${orderItems}

💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*
💳 *Pagamento:* ${paymentMethods[payment]}

⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}`;

  // Abrir WhatsApp
  const whatsappNumber = '5511999999999'; // Substitua pelo número real
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
  
  // Limpar carrinho
  cart = [];
  updateCartUI();
  closeCheckoutModal();
  
  alert('Pedido enviado! Você será redirecionado para o WhatsApp.');
}

// Scroll to menu function
function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.background = '#fff';
    header.style.backdropFilter = 'none';
  }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Tornar funções globais para acesso nos event handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.scrollToMenu = scrollToMenu;
window.closeCheckoutModal = closeCheckoutModal;
window.finishOrder = finishOrder;