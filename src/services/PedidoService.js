import { Pedido } from '../database/models/Pedido.js';

export class PedidoService {
  // Criar novo pedido
  static async createPedido(pedidoData) {
    try {
      const pedidoId = await Pedido.create(pedidoData);
      console.log('✅ Pedido criado com sucesso:', pedidoId);
      return pedidoId;
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      throw error;
    }
  }

  // Buscar pedido por ID
  static async getPedidoById(id) {
    try {
      const pedido = await Pedido.findById(id);
      return pedido;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  }

  // Buscar todos os pedidos
  static async getAllPedidos(limit = 50) {
    try {
      const pedidos = await Pedido.findAll(limit);
      return pedidos;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  // Atualizar status do pedido
  static async updatePedidoStatus(id, novoStatus) {
    try {
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }
      
      await pedido.updateStatus(novoStatus);
      console.log(`✅ Status do pedido ${id} atualizado para: ${novoStatus}`);
      return pedido;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  }

  // Formatar pedido para WhatsApp
  static formatPedidoWhatsApp(carrinho, clienteInfo) {
    let mensagem = `🍕 *NOVO PEDIDO - Larica's Pizza*\n\n`;
    
    if (clienteInfo) {
      mensagem += `👤 *Cliente:* ${clienteInfo.nome}\n`;
      mensagem += `📱 *Telefone:* ${clienteInfo.telefone}\n`;
      mensagem += `📍 *Endereço:* ${clienteInfo.endereco}\n\n`;
    }
    
    mensagem += `🛒 *Itens do Pedido:*\n`;
    
    let total = 0;
    carrinho.forEach(item => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}`;
    
    return mensagem;
  }
}