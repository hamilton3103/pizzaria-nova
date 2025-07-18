import axios from 'axios';

export class PaymentService {
  constructor() {
    this.mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    this.baseURL = 'https://api.mercadopago.com/v1';
  }

  // Criar pagamento PIX
  async createPixPayment(pedidoData) {
    try {
      const paymentData = {
        transaction_amount: pedidoData.total,
        description: `Pedido Pizzaria Bella Vista - #${pedidoData.id}`,
        payment_method_id: 'pix',
        payer: {
          email: pedidoData.cliente_email || 'cliente@pizzaria.com',
          first_name: pedidoData.cliente_nome.split(' ')[0],
          last_name: pedidoData.cliente_nome.split(' ').slice(1).join(' ') || 'Cliente',
          identification: {
            type: 'CPF',
            number: pedidoData.cliente_cpf || '00000000000'
          }
        },
        notification_url: `${window.location.origin}/webhook/mercadopago`,
        external_reference: pedidoData.id.toString()
      };

      const response = await axios.post(`${this.baseURL}/payments`, paymentData, {
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        payment_id: response.data.id,
        qr_code: response.data.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: response.data.point_of_interaction?.transaction_data?.ticket_url
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento PIX'
      };
    }
  }

  // Criar pagamento com cartão
  async createCardPayment(pedidoData, cardData) {
    try {
      const paymentData = {
        transaction_amount: pedidoData.total,
        token: cardData.token,
        description: `Pedido Pizzaria Bella Vista - #${pedidoData.id}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.payment_method_id,
        issuer_id: cardData.issuer_id,
        payer: {
          email: pedidoData.cliente_email || 'cliente@pizzaria.com',
          identification: {
            type: 'CPF',
            number: pedidoData.cliente_cpf || '00000000000'
          }
        },
        notification_url: `${window.location.origin}/webhook/mercadopago`,
        external_reference: pedidoData.id.toString()
      };

      const response = await axios.post(`${this.baseURL}/payments`, paymentData, {
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        payment_id: response.data.id,
        status: response.data.status,
        status_detail: response.data.status_detail
      };
    } catch (error) {
      console.error('Erro ao criar pagamento com cartão:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento com cartão'
      };
    }
  }

  // Consultar status do pagamento
  async getPaymentStatus(paymentId) {
    try {
      const response = await axios.get(`${this.baseURL}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`
        }
      });

      return {
        success: true,
        status: response.data.status,
        status_detail: response.data.status_detail,
        transaction_amount: response.data.transaction_amount
      };
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      return {
        success: false,
        error: 'Erro ao consultar status do pagamento'
      };
    }
  }

  // Simular pagamento PIX (para desenvolvimento)
  async simulatePixPayment(pedidoData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment_id: `pix_${Date.now()}`,
          qr_code: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5925Pizzaria Bella Vista6009SAO PAULO62070503***6304',
          qr_code_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          ticket_url: '#'
        });
      }, 1000);
    });
  }
}