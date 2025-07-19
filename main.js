// Importar serviços
import { DatabaseService } from './src/services/DatabaseService.js';
import { PaymentService } from './src/services/PaymentService.js';
import { CepService } from './src/services/CepService.js';
import './src/services/SmsService.js';
import './src/services/MapsService.js';

// Menu data
let menuItems = [];

// Cart functionality
let cart = [];

// Services
const databaseService = new DatabaseService();
const paymentService = new PaymentService();
const cepService = new CepService();
const smsService = new SmsService();
const mapsService = new MapsService();

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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  loadMenuItems();
  setupEventListeners();
  updateCartUI();
  initializeMap();
});

// Inicializar mapa
async function initializeMap() {
  try {
    await mapsService.initializeMap('map');
  } catch (error) {
    console.error('Erro ao inicializar mapa:', error);
  }
}

// Carregar itens do menu
async function loadMenuItems() {
  try {
    menuItems = await databaseService.getAllPizzas();
    renderMenu();
  } catch (error) {
    console.error('Erro ao carregar menu:', error);
    menuItems = [];
    renderMenu();
  }
}

// Render menu items
function renderMenu(filter = 'all') {
  menuGrid.innerHTML = '';
  
  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoria === filter);
  
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
    <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
    <div class="menu-item-content">
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
      <div class="menu-item-footer">
        <span class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
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
  if (!item) return;
  
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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  
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
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="cart-item-info">
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
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
    
    const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
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
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderMenu(filter);
    });
  });
  
  checkoutBtn.addEventListener('click', checkout);
  
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
  
  cartModal.classList.remove('active');
  createSimpleCheckoutModal();
}

// Criar modal de checkout simplificado
function createSimpleCheckoutModal() {
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
                <span>${item.quantity}x ${item.nome}</span>
                <span>R$ ${(item.preco * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-total">
            <strong>Total: R$ ${cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0).toFixed(2).replace('.', ',')}</strong>
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
            <label>CEP:</label>
            <input type="text" id="customer-cep" placeholder="00000-000" maxlength="9">
            <button type="button" onclick="searchCep()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Buscar Endereço
            </button>
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

// Buscar CEP
async function searchCep() {
  const cepInput = document.getElementById('customer-cep');
  const addressInput = document.getElementById('customer-address');
  const cep = cepInput.value.trim();

  if (!cep) {
    alert('Digite um CEP válido');
    return;
  }

  try {
    const result = await cepService.calculateDeliveryFee(cep);
    
    if (result.success) {
      const address = result.address;
      addressInput.value = `${address.logradouro}, ${address.bairro}, ${address.localidade} - ${address.uf}`;
      alert(`Taxa de entrega: R$ ${result.deliveryFee.toFixed(2)} - Tempo estimado: ${result.estimatedTime}`);
    } else {
      alert(result.error);
    }
  } catch (error) {
    alert('Erro ao buscar CEP');
  }
}

// Fechar modal de checkout
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.remove();
  }
}

// Finalizar pedido
async function finishOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;

  if (!name || !phone || !address) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const orderItems = cart.map(item => 
    `${item.quantity}x ${item.nome} - R$ ${(item.preco * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');
  
  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
  
  try {
    const pedidoData = {
      cliente_nome: name,
      cliente_telefone: phone,
      cliente_endereco: address,
      itens: cart.map(item => ({
        pizza_id: item.id,
        nome: item.nome,
        quantidade: item.quantity,
        preco_unitario: item.preco,
        subtotal: item.preco * item.quantity
      })),
      total: total,
      forma_pagamento: payment,
      status: 'pendente'
    };
    
    const result = await databaseService.savePedido(pedidoData);
    console.log('Pedido salvo:', result);
    
    if (result.success) {
      await smsService.sendOrderConfirmation(phone, {
        id: result.id,
        itens: cart,
        total: total
      });
    }
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
  }
  
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

  const whatsappNumber = '5511999999999';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
  
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

// Tornar funções globais
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.scrollToMenu = scrollToMenu;
window.closeCheckoutModal = closeCheckoutModal;
window.finishOrder = finishOrder;
window.searchCep = searchCep;