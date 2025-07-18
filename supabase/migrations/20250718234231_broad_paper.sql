-- Script para criar as tabelas necessárias no banco de dados

-- Tabela de pizzas
CREATE TABLE IF NOT EXISTS pizzas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  categoria ENUM('tradicional', 'especial', 'doce') NOT NULL,
  imagem VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nome VARCHAR(100) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_endereco TEXT,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pendente', 'confirmado', 'preparando', 'saiu_entrega', 'entregue', 'cancelado') DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  pizza_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
);

-- Inserir pizzas de exemplo (se não existirem)
INSERT IGNORE INTO pizzas (id, nome, descricao, preco, categoria, imagem) VALUES
(1, 'Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 35.90, 'tradicional', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'),
(2, 'Pepperoni', 'Molho de tomate, mussarela e pepperoni', 42.90, 'tradicional', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg'),
(3, 'Portuguesa', 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona', 45.90, 'tradicional', 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg'),
(4, 'Quatro Queijos', 'Molho branco, mussarela, gorgonzola, parmesão e provolone', 48.90, 'especial', 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg'),
(5, 'Frango com Catupiry', 'Molho de tomate, mussarela, frango desfiado e catupiry', 46.90, 'especial', 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg'),
(6, 'Calabresa', 'Molho de tomate, mussarela, calabresa e cebola', 39.90, 'tradicional', 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg'),
(7, 'Vegetariana', 'Molho de tomate, mussarela, tomate, pimentão, cebola, azeitona e manjericão', 44.90, 'especial', 'https://images.pexels.com/photos/1552635/pexels-photo-1552635.jpeg'),
(8, 'Chocolate', 'Massa doce, chocolate ao leite e granulado', 32.90, 'doce', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'),
(9, 'Romeu e Julieta', 'Massa doce, queijo e goiabada', 34.90, 'doce', 'https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg');