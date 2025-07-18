// Serviço de banco de dados simplificado para produção
export class DatabaseService {
  constructor() {
    this.pizzas = this.getMockPizzas();
  }

  // Buscar todas as pizzas
  async getAllPizzas() {
    return Promise.resolve(this.pizzas);
  }

  // Buscar pizzas por categoria
  async getPizzasByCategory(categoria) {
    const pizzas = await this.getAllPizzas();
    return categoria === 'all' ? pizzas : pizzas.filter(p => p.categoria === categoria);
  }

  // Buscar pizza por ID
  async getPizzaById(id) {
    const pizzas = await this.getAllPizzas();
    return pizzas.find(p => p.id == id) || null;
  }

  // Salvar pedido (simulado)
  async savePedido(pedidoData) {
    const orderId = Date.now();
    console.log('Pedido salvo:', { id: orderId, ...pedidoData });
    return Promise.resolve({ id: orderId, success: true });
  }

  // Dados das pizzas
  getMockPizzas() {
    return [
      {
        id: 1,
        nome: 'Margherita',
        descricao: 'Molho de tomate, mussarela, manjericão fresco e azeite',
        preco: 35.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        ativo: true
      },
      {
        id: 2,
        nome: 'Pepperoni',
        descricao: 'Molho de tomate, mussarela e pepperoni',
        preco: 42.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg',
        ativo: true
      },
      {
        id: 3,
        nome: 'Portuguesa',
        descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona',
        preco: 45.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg',
        ativo: true
      },
      {
        id: 4,
        nome: 'Quatro Queijos',
        descricao: 'Molho branco, mussarela, gorgonzola, parmesão e provolone',
        preco: 48.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg',
        ativo: true
      },
      {
        id: 5,
        nome: 'Frango com Catupiry',
        descricao: 'Molho de tomate, mussarela, frango desfiado e catupiry',
        preco: 46.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
        ativo: true
      },
      {
        id: 6,
        nome: 'Calabresa',
        descricao: 'Molho de tomate, mussarela, calabresa e cebola',
        preco: 39.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg',
        ativo: true
      },
      {
        id: 7,
        nome: 'Vegetariana',
        descricao: 'Molho de tomate, mussarela, tomate, pimentão, cebola, azeitona e manjericão',
        preco: 44.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/1552635/pexels-photo-1552635.jpeg',
        ativo: true
      },
      {
        id: 8,
        nome: 'Chocolate',
        descricao: 'Massa doce, chocolate ao leite e granulado',
        preco: 32.90,
        categoria: 'doce',
        imagem: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
        ativo: true
      },
      {
        id: 9,
        nome: 'Romeu e Julieta',
        descricao: 'Massa doce, queijo e goiabada',
        preco: 34.90,
        categoria: 'doce',
        imagem: 'https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg',
        ativo: true
      }
    ];
  }
}