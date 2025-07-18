import { executeQuery } from '../connection.js';

export class Pedido {
  constructor(data) {
    this.id = data.id;
    this.cliente_nome = data.cliente_nome;
    this.cliente_telefone = data.cliente_telefone;
    this.cliente_endereco = data.cliente_endereco;
    this.itens = data.itens;
    this.total = data.total;
    this.status = data.status;
    this.observacoes = data.observacoes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Criar novo pedido
  static async create(pedidoData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Inserir pedido
      const pedidoQuery = `
        INSERT INTO pedidos (cliente_nome, cliente_telefone, cliente_endereco, total, status, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const pedidoParams = [
        pedidoData.cliente_nome,
        pedidoData.cliente_telefone,
        pedidoData.cliente_endereco,
        pedidoData.total,
        pedidoData.status || 'pendente',
        pedidoData.observacoes || ''
      ];
      
      const [pedidoResult] = await connection.execute(pedidoQuery, pedidoParams);
      const pedidoId = pedidoResult.insertId;
      
      // Inserir itens do pedido
      if (pedidoData.itens && pedidoData.itens.length > 0) {
        const itemQuery = `
          INSERT INTO pedido_itens (pedido_id, pizza_id, quantidade, preco_unitario, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        for (const item of pedidoData.itens) {
          const itemParams = [
            pedidoId,
            item.pizza_id,
            item.quantidade,
            item.preco_unitario,
            item.subtotal
          ];
          await connection.execute(itemQuery, itemParams);
        }
      }
      
      await connection.commit();
      return pedidoId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Buscar pedido por ID com itens
  static async findById(id) {
    const pedidoQuery = 'SELECT * FROM pedidos WHERE id = ?';
    const pedidoResults = await executeQuery(pedidoQuery, [id]);
    
    if (pedidoResults.length === 0) return null;
    
    const pedido = new Pedido(pedidoResults[0]);
    
    // Buscar itens do pedido
    const itensQuery = `
      SELECT pi.*, p.nome as pizza_nome
      FROM pedido_itens pi
      JOIN pizzas p ON pi.pizza_id = p.id
      WHERE pi.pedido_id = ?
    `;
    const itens = await executeQuery(itensQuery, [id]);
    pedido.itens = itens;
    
    return pedido;
  }

  // Buscar todos os pedidos
  static async findAll(limit = 50) {
    const query = 'SELECT * FROM pedidos ORDER BY created_at DESC LIMIT ?';
    const results = await executeQuery(query, [limit]);
    return results.map(row => new Pedido(row));
  }

  // Atualizar status do pedido
  async updateStatus(novoStatus) {
    const query = 'UPDATE pedidos SET status = ?, updated_at = NOW() WHERE id = ?';
    await executeQuery(query, [novoStatus, this.id]);
    this.status = novoStatus;
  }
}