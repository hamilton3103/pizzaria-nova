import axios from 'axios';

export class SmsService {
  constructor() {
    this.apiKey = process.env.SMS_API_KEY;
    this.baseURL = process.env.SMS_API_URL || 'https://api.smsdev.com.br/v1';
  }

  // Enviar SMS de confirmação de pedido
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

  // Enviar SMS de atualização de status
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

  // Enviar SMS genérico
  async sendSMS(telefone, message) {
    try {
      // Limpar telefone (remover caracteres especiais)
      const cleanPhone = telefone.replace(/\D/g, '');
      
      // Validar telefone
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return {
          success: false,
          error: 'Número de telefone inválido'
        };
      }

      // Simular envio de SMS (para desenvolvimento)
      if (!this.apiKey || this.apiKey === 'your_sms_api_key_here') {
        console.log('📱 SMS Simulado para:', cleanPhone);
        console.log('📝 Mensagem:', message);
        
        return {
          success: true,
          messageId: `sim_${Date.now()}`,
          message: 'SMS enviado com sucesso (simulado)'
        };
      }

      // Envio real via API
      const response = await axios.post(`${this.baseURL}/send`, {
        key: this.apiKey,
        type: 9,
        number: cleanPhone,
        msg: message
      });

      if (response.data.situacao === 'OK') {
        return {
          success: true,
          messageId: response.data.id,
          message: 'SMS enviado com sucesso'
        };
      } else {
        return {
          success: false,
          error: response.data.descricao || 'Erro ao enviar SMS'
        };
      }
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        error: 'Erro ao enviar SMS'
      };
    }
  }

  // Formatar mensagem de confirmação de pedido
  formatOrderConfirmationMessage(pedidoData) {
    const itens = pedidoData.itens.map(item => 
      `${item.quantidade}x ${item.nome}`
    ).join(', ');

    return `🍕 Pizzaria Bella Vista
Pedido #${pedidoData.id} confirmado!

Itens: ${itens}
Total: R$ ${pedidoData.total.toFixed(2)}

Tempo estimado: 30-40 min
Acompanhe pelo WhatsApp: (11) 99999-9999`;
  }

  // Formatar mensagem de atualização de status
  formatStatusUpdateMessage(pedidoId, status) {
    const statusMessages = {
      'confirmado': '✅ Seu pedido foi confirmado e está sendo preparado!',
      'preparando': '👨‍🍳 Sua pizza está no forno!',
      'saiu_entrega': '🛵 Seu pedido saiu para entrega!',
      'entregue': '🎉 Pedido entregue! Obrigado pela preferência!',
      'cancelado': '❌ Pedido cancelado. Entre em contato conosco.'
    };

    const message = statusMessages[status] || 'Status do pedido atualizado';

    return `🍕 Pizzaria Bella Vista
Pedido #${pedidoId}

${message}

Dúvidas? WhatsApp: (11) 99999-9999`;
  }

  // Validar número de telefone
  validatePhoneNumber(telefone) {
    const cleanPhone = telefone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return {
        valid: false,
        error: 'Telefone deve ter 10 ou 11 dígitos'
      };
    }

    // Verificar se é celular (9 no início)
    if (cleanPhone.length === 11 && cleanPhone[2] !== '9') {
      return {
        valid: false,
        error: 'Número de celular inválido'
      };
    }

    return {
      valid: true,
      formatted: this.formatPhoneNumber(cleanPhone)
    };
  }

  // Formatar número de telefone
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