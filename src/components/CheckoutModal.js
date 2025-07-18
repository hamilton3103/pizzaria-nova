import { CepService } from '../services/CepService.js';
import { PaymentService } from '../services/PaymentService.js';
import { SmsService } from '../services/SmsService.js';
import { MapsService } from '../services/MapsService.js';

export class CheckoutModal {
  constructor() {
    this.cepService = new CepService();
    this.paymentService = new PaymentService();
    this.smsService = new SmsService();
    this.mapsService = new MapsService();
    this.currentStep = 1;
    this.customerData = {};
    this.deliveryData = {};
    this.paymentData = {};
  }

  // Criar modal de checkout
  createModal() {
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'checkout-modal';
    modal.innerHTML = `
      <div class="checkout-content">
        <div class="checkout-header">
          <h3>Finalizar Pedido</h3>
          <button class="close-checkout" id="close-checkout">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="checkout-steps">
          <div class="step active" data-step="1">
            <span class="step-number">1</span>
            <span class="step-label">Dados</span>
          </div>
          <div class="step" data-step="2">
            <span class="step-number">2</span>
            <span class="step-label">Entrega</span>
          </div>
          <div class="step" data-step="3">
            <span class="step-number">3</span>
            <span class="step-label">Pagamento</span>
          </div>
        </div>

        <div class="checkout-body" id="checkout-body">
          ${this.getStepContent(1)}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupEventListeners();
    return modal;
  }

  // Obter conteúdo de cada etapa
  getStepContent(step) {
    switch (step) {
      case 1:
        return this.getCustomerDataStep();
      case 2:
        return this.getDeliveryStep();
      case 3:
        return this.getPaymentStep();
      default:
        return '';
    }
  }

  // Etapa 1: Dados do cliente
  getCustomerDataStep() {
    return `
      <div class="step-content">
        <h4>Seus Dados</h4>
        <form id="customer-form">
          <div class="form-group">
            <label for="customer-name">Nome Completo *</label>
            <input type="text" id="customer-name" required>
          </div>
          
          <div class="form-group">
            <label for="customer-phone">Telefone *</label>
            <input type="tel" id="customer-phone" placeholder="(11) 99999-9999" required>
          </div>
          
          <div class="form-group">
            <label for="customer-email">E-mail</label>
            <input type="email" id="customer-email">
          </div>
          
          <div class="form-group">
            <label for="customer-cpf">CPF (para nota fiscal)</label>
            <input type="text" id="customer-cpf" placeholder="000.000.000-00">
          </div>
          
          <button type="button" class="next-step-btn" onclick="checkoutModal.nextStep()">
            Continuar <i class="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>
    `;
  }

  // Etapa 2: Dados de entrega
  getDeliveryStep() {
    return `
      <div class="step-content">
        <h4>Endereço de Entrega</h4>
        <form id="delivery-form">
          <div class="form-group">
            <label for="delivery-cep">CEP *</label>
            <div class="input-group">
              <input type="text" id="delivery-cep" placeholder="00000-000" required>
              <button type="button" class="search-cep-btn" onclick="checkoutModal.searchCep()">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="delivery-street">Rua *</label>
            <input type="text" id="delivery-street" required readonly>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="delivery-number">Número *</label>
              <input type="text" id="delivery-number" required>
            </div>
            <div class="form-group">
              <label for="delivery-complement">Complemento</label>
              <input type="text" id="delivery-complement">
            </div>
          </div>
          
          <div class="form-group">
            <label for="delivery-neighborhood">Bairro *</label>
            <input type="text" id="delivery-neighborhood" required readonly>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="delivery-city">Cidade *</label>
              <input type="text" id="delivery-city" required readonly>
            </div>
            <div class="form-group">
              <label for="delivery-state">Estado *</label>
              <input type="text" id="delivery-state" required readonly>
            </div>
          </div>
          
          <div class="delivery-info" id="delivery-info" style="display: none;">
            <div class="info-card">
              <h5><i class="fas fa-truck"></i> Informações de Entrega</h5>
              <p><strong>Taxa de entrega:</strong> R$ <span id="delivery-fee">0,00</span></p>
              <p><strong>Tempo estimado:</strong> <span id="delivery-time">-</span></p>
              <p><strong>Distância:</strong> <span id="delivery-distance">-</span></p>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="prev-step-btn" onclick="checkoutModal.prevStep()">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
            <button type="button" class="next-step-btn" onclick="checkoutModal.nextStep()">
              Continuar <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  // Etapa 3: Pagamento
  getPaymentStep() {
    return `
      <div class="step-content">
        <h4>Forma de Pagamento</h4>
        
        <div class="order-summary">
          <h5>Resumo do Pedido</h5>
          <div id="order-items"></div>
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>R$ <span id="subtotal">0,00</span></span>
          </div>
          <div class="summary-line">
            <span>Taxa de entrega:</span>
            <span>R$ <span id="final-delivery-fee">0,00</span></span>
          </div>
          <div class="summary-line total">
            <span><strong>Total:</strong></span>
            <span><strong>R$ <span id="final-total">0,00</span></strong></span>
          </div>
        </div>
        
        <div class="payment-methods">
          <div class="payment-option">
            <input type="radio" id="payment-pix" name="payment-method" value="pix" checked>
            <label for="payment-pix">
              <i class="fas fa-qrcode"></i>
              <div>
                <strong>PIX</strong>
                <small>Pagamento instantâneo</small>
              </div>
            </label>
          </div>
          
          <div class="payment-option">
            <input type="radio" id="payment-card" name="payment-method" value="card">
            <label for="payment-card">
              <i class="fas fa-credit-card"></i>
              <div>
                <strong>Cartão de Crédito</strong>
                <small>Parcelamento disponível</small>
              </div>
            </label>
          </div>
          
          <div class="payment-option">
            <input type="radio" id="payment-money" name="payment-method" value="money">
            <label for="payment-money">
              <i class="fas fa-money-bill-wave"></i>
              <div>
                <strong>Dinheiro</strong>
                <small>Pagamento na entrega</small>
              </div>
            </label>
          </div>
        </div>
        
        <div class="payment-details" id="payment-details"></div>
        
        <div class="form-actions">
          <button type="button" class="prev-step-btn" onclick="checkoutModal.prevStep()">
            <i class="fas fa-arrow-left"></i> Voltar
          </button>
          <button type="button" class="finish-order-btn" onclick="checkoutModal.finishOrder()">
            <i class="fas fa-check"></i> Finalizar Pedido
          </button>
        </div>
      </div>
    `;
  }

  // Configurar event listeners
  setupEventListeners() {
    // Fechar modal
    document.getElementById('close-checkout').addEventListener('click', () => {
      this.closeModal();
    });

    // Máscara para telefone
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', this.formatPhone);
    }

    // Máscara para CPF
    const cpfInput = document.getElementById('customer-cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', this.formatCpf);
    }

    // Máscara para CEP
    const cepInput = document.getElementById('delivery-cep');
    if (cepInput) {
      cepInput.addEventListener('input', this.formatCep);
    }

    // Mudança de método de pagamento
    document.addEventListener('change', (e) => {
      if (e.target.name === 'payment-method') {
        this.updatePaymentDetails(e.target.value);
      }
    });
  }

  // Próxima etapa
  async nextStep() {
    if (await this.validateCurrentStep()) {
      this.currentStep++;
      this.updateStepDisplay();
    }
  }

  // Etapa anterior
  prevStep() {
    this.currentStep--;
    this.updateStepDisplay();
  }

  // Atualizar exibição da etapa
  updateStepDisplay() {
    // Atualizar indicadores de etapa
    document.querySelectorAll('.step').forEach(step => {
      const stepNumber = parseInt(step.dataset.step);
      step.classList.toggle('active', stepNumber === this.currentStep);
      step.classList.toggle('completed', stepNumber < this.currentStep);
    });

    // Atualizar conteúdo
    document.getElementById('checkout-body').innerHTML = this.getStepContent(this.currentStep);
    this.setupEventListeners();

    // Preencher dados salvos
    this.fillSavedData();
  }

  // Validar etapa atual
  async validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.validateCustomerData();
      case 2:
        return await this.validateDeliveryData();
      case 3:
        return this.validatePaymentData();
      default:
        return true;
    }
  }

  // Validar dados do cliente
  validateCustomerData() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();

    if (!name) {
      this.showError('Nome é obrigatório');
      return false;
    }

    if (!phone) {
      this.showError('Telefone é obrigatório');
      return false;
    }

    const phoneValidation = this.smsService.validatePhoneNumber(phone);
    if (!phoneValidation.valid) {
      this.showError(phoneValidation.error);
      return false;
    }

    // Salvar dados
    this.customerData = {
      name: name,
      phone: phoneValidation.formatted,
      email: document.getElementById('customer-email').value.trim(),
      cpf: document.getElementById('customer-cpf').value.trim()
    };

    return true;
  }

  // Validar dados de entrega
  async validateDeliveryData() {
    const cep = document.getElementById('delivery-cep').value.trim();
    const street = document.getElementById('delivery-street').value.trim();
    const number = document.getElementById('delivery-number').value.trim();
    const neighborhood = document.getElementById('delivery-neighborhood').value.trim();

    if (!cep || !street || !number || !neighborhood) {
      this.showError('Todos os campos obrigatórios devem ser preenchidos');
      return false;
    }

    // Validar área de entrega
    const deliveryValidation = await this.cepService.validateDeliveryArea(cep);
    if (!deliveryValidation.success || !deliveryValidation.delivers) {
      this.showError(deliveryValidation.message || 'Não entregamos nesta região');
      return false;
    }

    // Salvar dados
    this.deliveryData = {
      cep: cep,
      street: street,
      number: number,
      complement: document.getElementById('delivery-complement').value.trim(),
      neighborhood: neighborhood,
      city: document.getElementById('delivery-city').value.trim(),
      state: document.getElementById('delivery-state').value.trim(),
      fee: parseFloat(document.getElementById('delivery-fee').textContent),
      time: document.getElementById('delivery-time').textContent,
      distance: document.getElementById('delivery-distance').textContent
    };

    return true;
  }

  // Buscar CEP
  async searchCep() {
    const cepInput = document.getElementById('delivery-cep');
    const cep = cepInput.value.trim();

    if (!cep) {
      this.showError('Digite um CEP válido');
      return;
    }

    try {
      this.showLoading('Buscando endereço...');

      const result = await this.cepService.calculateDeliveryFee(cep);

      if (result.success) {
        // Preencher campos
        document.getElementById('delivery-street').value = result.address.logradouro;
        document.getElementById('delivery-neighborhood').value = result.address.bairro;
        document.getElementById('delivery-city').value = result.address.localidade;
        document.getElementById('delivery-state').value = result.address.uf;

        // Mostrar informações de entrega
        document.getElementById('delivery-fee').textContent = result.deliveryFee.toFixed(2);
        document.getElementById('delivery-time').textContent = result.estimatedTime;
        
        // Simular cálculo de distância
        const distanceResult = await this.mapsService.simulateDistanceCalculation(cep);
        if (distanceResult.success) {
          document.getElementById('delivery-distance').textContent = distanceResult.distance;
        }

        document.getElementById('delivery-info').style.display = 'block';
        this.hideLoading();
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError('Erro ao buscar CEP');
    }
  }

  // Finalizar pedido
  async finishOrder() {
    try {
      this.showLoading('Processando pedido...');

      // Criar pedido
      const orderData = this.buildOrderData();
      
      // Simular salvamento no banco
      const orderId = await this.saveOrder(orderData);
      
      // Processar pagamento se necessário
      if (orderData.paymentMethod === 'pix') {
        const pixResult = await this.paymentService.simulatePixPayment(orderData);
        if (pixResult.success) {
          this.showPixPayment(pixResult, orderId);
        }
      } else if (orderData.paymentMethod === 'card') {
        // Implementar pagamento com cartão
        this.showError('Pagamento com cartão em desenvolvimento');
        return;
      }

      // Enviar SMS de confirmação
      await this.smsService.sendOrderConfirmation(
        this.customerData.phone,
        { ...orderData, id: orderId }
      );

      // Limpar carrinho
      if (window.cart) {
        window.cart = [];
        window.updateCartUI();
      }

      this.hideLoading();
      
      if (orderData.paymentMethod !== 'pix') {
        this.showSuccess(`Pedido #${orderId} realizado com sucesso!`);
        setTimeout(() => this.closeModal(), 3000);
      }

    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      this.showError('Erro ao processar pedido. Tente novamente.');
    }
  }

  // Construir dados do pedido
  buildOrderData() {
    const cart = window.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = this.deliveryData.fee || 0;
    const total = subtotal + deliveryFee;

    return {
      customer: this.customerData,
      delivery: this.deliveryData,
      items: cart,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
      createdAt: new Date()
    };
  }

  // Salvar pedido (simulado)
  async saveOrder(orderData) {
    // Simular salvamento no banco
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = Date.now();
        console.log('Pedido salvo:', { id: orderId, ...orderData });
        resolve(orderId);
      }, 1000);
    });
  }

  // Mostrar pagamento PIX
  showPixPayment(pixData, orderId) {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = `
      <div class="pix-payment">
        <h5><i class="fas fa-qrcode"></i> Pagamento PIX</h5>
        <p>Escaneie o QR Code ou copie o código PIX:</p>
        
        <div class="qr-code">
          <img src="data:image/svg+xml;base64,${btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="white"/>
              <text x="100" y="100" text-anchor="middle" fill="black">QR CODE PIX</text>
            </svg>
          `)}" alt="QR Code PIX">
        </div>
        
        <div class="pix-code">
          <input type="text" value="${pixData.qr_code}" readonly>
          <button onclick="navigator.clipboard.writeText('${pixData.qr_code}')">
            <i class="fas fa-copy"></i> Copiar
          </button>
        </div>
        
        <div class="pix-info">
          <p><strong>Pedido:</strong> #${orderId}</p>
          <p><strong>Valor:</strong> R$ ${this.buildOrderData().total.toFixed(2)}</p>
          <p><small>Após o pagamento, seu pedido será confirmado automaticamente.</small></p>
        </div>
      </div>
    `;
  }

  // Utilitários de formatação
  formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      e.target.value = value;
    }
  }

  formatCpf(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    }
  }

  formatCep(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      e.target.value = value;
    }
  }

  // Utilitários de UI
  showError(message) {
    // Implementar toast de erro
    console.error(message);
    alert(message); // Temporário
  }

  showSuccess(message) {
    // Implementar toast de sucesso
    console.log(message);
    alert(message); // Temporário
  }

  showLoading(message) {
    // Implementar loading
    console.log('Loading:', message);
  }

  hideLoading() {
    // Esconder loading
    console.log('Loading hidden');
  }

  closeModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.remove();
    }
  }

  fillSavedData() {
    // Implementar preenchimento de dados salvos
  }

  validatePaymentData() {
    return true; // Implementar validação de pagamento
  }

  updatePaymentDetails(method) {
    // Implementar atualização de detalhes do pagamento
  }
}