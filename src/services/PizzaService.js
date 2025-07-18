import { Pizza } from '../database/models/Pizza.js';
import { testConnection } from '../database/connection.js';

export class PizzaService {
  // Inicializar conexão com banco
  static async initialize() {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.warn('⚠️ Usando dados mockados - banco de dados não disponível');
      return false;
    }
    return true;
  }

  // Buscar todas as pizzas
  static async getAllPizzas() {
    try {
      const pizzas = await Pizza.findAll();
      return pizzas;
    } catch (error) {
      console.error('Erro ao buscar pizzas:', error);
      // Retornar dados mockados em caso de erro
      return this.getMockPizzas();
    }
  }

  // Buscar pizzas por categoria
  static async getPizzasByCategory(categoria) {
    try {
      if (categoria === 'todas') {
        return await this.getAllPizzas();
      }
      const pizzas = await Pizza.findByCategory(categoria);
      return pizzas;
    } catch (error) {
      console.error('Erro ao buscar pizzas por categoria:', error);
      const mockPizzas = this.getMockPizzas();
      return categoria === 'todas' ? mockPizzas : mockPizzas.filter(p => p.categoria === categoria);
    }
  }

  // Buscar pizza por ID
  static async getPizzaById(id) {
    try {
      const pizza = await Pizza.findById(id);
      return pizza;
    } catch (error) {
      console.error('Erro ao buscar pizza por ID:', error);
      const mockPizzas = this.getMockPizzas();
      return mockPizzas.find(p => p.id == id) || null;
    }
  }

  // Dados mockados para fallback
  static getMockPizzas() {
    return [
      {
        id: 1,
        nome: 'Margherita',
        descricao: 'Molho de tomate, mussarela, manjericão fresco e azeite',
        preco: 35.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'
      },
      {
        id: 2,
        nome: 'Pepperoni',
        descricao: 'Molho de tomate, mussarela e pepperoni',
        preco: 42.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg'
      },
      {
        id: 3,
        nome: 'Portuguesa',
        descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona',
        preco: 45.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg'
      },
      {
        id: 4,
        nome: 'Quatro Queijos',
        descricao: 'Molho branco, mussarela, gorgonzola, parmesão e provolone',
        preco: 48.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg'
      },
      {
        id: 5,
        nome: 'Frango com Catupiry',
        descricao: 'Molho de tomate, mussarela, frango desfiado e catupiry',
        preco: 46.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg'
      },
      {
        id: 6,
        nome: 'Calabresa',
        descricao: 'Molho de tomate, mussarela, calabresa e cebola',
        preco: 39.90,
        categoria: 'tradicional',
        imagem: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg'
      },
      {
        id: 7,
        nome: 'Vegetariana',
        descricao: 'Molho de tomate, mussarela, tomate, pimentão, cebola, azeitona e manjericão',
        preco: 44.90,
        categoria: 'especial',
        imagem: 'https://images.pexels.com/photos/1552635/pexels-photo-1552635.jpeg'
      },
      {
        id: 8,
        nome: 'Chocolate',
        descricao: 'Massa doce, chocolate ao leite e granulado',
        preco: 32.90,
        categoria: 'doce',
        imagem: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
      },
      {
        id: 9,
        nome: 'Romeu e Julieta',
        descricao: 'Massa doce, queijo e goiabada',
        preco: 34.90,
        categoria: 'doce',
        imagem: 'https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg'
      }
    ];
  }
}