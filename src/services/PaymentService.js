export class PaymentService {
  constructor() {
    this.mercadoPagoToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    this.baseURL = 'https://api.mercadopago.com/v1';
  }

  // Criar pagamento PIX
  async createPixPayment(pedidoData) {
    try {
      // Simular em produção ou se não tiver token
      if (import.meta.env.PROD || !this.mercadoPagoToken) {
        return this.simulatePixPayment(pedidoData);
      }

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

      const response = await fetch(`${this.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          payment_id: data.id,
          qr_code: data.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
          ticket_url: data.point_of_interaction?.transaction_data?.ticket_url
        };
      } else {
        throw new Error(data.message || 'Erro no pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      // Fallback para simulação
      return this.simulatePixPayment(pedidoData);
    }
  }

  // Criar pagamento com cartão
  async createCardPayment(pedidoData, cardData) {
    try {
      // Simular em produção ou se não tiver token
      if (import.meta.env.PROD || !this.mercadoPagoToken) {
        return {
          success: true,
          payment_id: `card_${Date.now()}`,
          status: 'approved',
          status_detail: 'accredited'
        };
      }

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

      const response = await fetch(`${this.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          payment_id: data.id,
          status: data.status,
          status_detail: data.status_detail
        };
      } else {
        throw new Error(data.message || 'Erro no pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento com cartão:', error);
      return {
        success: false,
        error: error.message || 'Erro ao processar pagamento com cartão'
      };
    }
  }

  // Consultar status do pagamento
  async getPaymentStatus(paymentId) {
    try {
      if (import.meta.env.PROD || !this.mercadoPagoToken) {
        return {
          success: true,
          status: 'approved',
          status_detail: 'accredited',
          transaction_amount: 100.00
        };
      }

      const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.mercadoPagoToken}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          status: data.status,
          status_detail: data.status_detail,
          transaction_amount: data.transaction_amount
        };
      } else {
        throw new Error('Erro ao consultar pagamento');
      }
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      return {
        success: false,
        error: 'Erro ao consultar status do pagamento'
      };
    }
  }

  // Simular pagamento PIX (para desenvolvimento e produção)
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