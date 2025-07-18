import { executeQuery } from '../connection.js';

export class Pizza {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.preco = data.preco;
    this.categoria = data.categoria;
    this.imagem = data.imagem;
    this.ativo = data.ativo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Buscar todas as pizzas ativas
  static async findAll() {
    const query = 'SELECT * FROM pizzas WHERE ativo = 1 ORDER BY categoria, nome';
    const results = await executeQuery(query);
    return results.map(row => new Pizza(row));
  }

  // Buscar pizza por ID
  static async findById(id) {
    const query = 'SELECT * FROM pizzas WHERE id = ? AND ativo = 1';
    const results = await executeQuery(query, [id]);
    return results.length > 0 ? new Pizza(results[0]) : null;
  }

  // Buscar pizzas por categoria
  static async findByCategory(categoria) {
    const query = 'SELECT * FROM pizzas WHERE categoria = ? AND ativo = 1 ORDER BY nome';
    const results = await executeQuery(query, [categoria]);
    return results.map(row => new Pizza(row));
  }

  // Criar nova pizza
  static async create(pizzaData) {
    const query = `
      INSERT INTO pizzas (nome, descricao, preco, categoria, imagem, ativo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      pizzaData.nome,
      pizzaData.descricao,
      pizzaData.preco,
      pizzaData.categoria,
      pizzaData.imagem,
      pizzaData.ativo || 1
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  // Atualizar pizza
  async update(updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    values.push(this.id);
    
    const query = `UPDATE pizzas SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, values);
    
    // Atualizar propriedades do objeto
    Object.assign(this, updateData);
  }

  // Deletar pizza (soft delete)
  async delete() {
    const query = 'UPDATE pizzas SET ativo = 0, updated_at = NOW() WHERE id = ?';
    await executeQuery(query, [this.id]);
    this.ativo = 0;
  }
}