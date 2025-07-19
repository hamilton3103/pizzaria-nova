class SmsService {
  constructor() {
    // Simulação para produção
  }

  async sendOrderConfirmation(telefone, pedidoData) {
    try {
      const message = this.formatOrderConfirmationMessage(pedidoData);
      return await this.sendSMS(telefone, message);
    } catch (error) {
      console.error('Erro ao enviar SMS de confirmação:', error);
      return {
        success: false,
        error: 'Erro ao enviar SMS de confirmação'
      };
    }
  }

  async sendStatusUpdate(telefone, pedidoId, status) {
    try {
      const message = this.formatStatusUpdateMessage(pedidoId, status);
      return await this.sendSMS(telefone, message);
    } catch (error) {
      console.error('Erro ao enviar SMS de status:', error);
      return {
        success: false,
        error: 'Erro ao enviar SMS de status'
      };
    }
  }

  async sendSMS(telefone, message) {
    try {
      const cleanPhone = telefone.replace(/\D/g, '');
      
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return {
          success: false,
          error: 'Número de telefone inválido'
        };
      }

      console.log('📱 SMS Simulado para:', cleanPhone);
      console.log('📝 Mensagem:', message);
      
      return {
        success: true,
        messageId: `sim_${Date.now()}`,
        message: 'SMS enviado com sucesso (simulado)'
      };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        error: 'Erro ao enviar SMS'
      };
    }
  }

  formatOrderConfirmationMessage(pedidoData) {
    const itens = pedidoData.itens.map(item => 
      `${item.quantidade}x ${item.nome}`
    ).join(', ');

    return `🍕 Pizzaria Bella Vista
Pedido #${pedidoData.id} confirmado!

Itens: ${itens}
Total: R$ ${pedidoData.total.toFixed(2)}

Tempo estimado: 30-40 min`;
  }

  formatStatusUpdateMessage(pedidoId, status) {
    const statusMessages = {
      'confirmado': '✅ Seu pedido foi confirmado!',
      'preparando': '👨‍🍳 Sua pizza está no forno!',
      'saiu_entrega': '🛵 Seu pedido saiu para entrega!',
      'entregue': '🎉 Pedido entregue! Obrigado!',
      'cancelado': '❌ Pedido cancelado.'
    };

    const message = statusMessages[status] || 'Status atualizado';

    return `🍕 Pizzaria Bella Vista
Pedido #${pedidoId}

${message}`;
  }

  validatePhoneNumber(telefone) {
    const cleanPhone = telefone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return {
        valid: false,
        error: 'Telefone deve ter 10 ou 11 dígitos'
      };
    }

    return {
      valid: true,
      formatted: this.formatPhoneNumber(cleanPhone)
    };
  }

  formatPhoneNumber(telefone) {
    const clean = telefone.replace(/\D/g, '');
    
    if (clean.length === 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    } else if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    
    return telefone;
  }
}