export class PaymentService {
  constructor() {
    // Simulação para produção
  }

  async createPixPayment(pedidoData) {
    return this.simulatePixPayment(pedidoData);
  }

  async createCardPayment(pedidoData, cardData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment_id: `card_${Date.now()}`,
          status: 'approved',
          status_detail: 'accredited'
        });
      }, 1000);
    });
  }

  async getPaymentStatus(paymentId) {
    return {
      success: true,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 100.00
    };
  }

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