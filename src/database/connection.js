import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: '192.185.176.242',
  user: 'laricasp_bdpizzas',
  password: 'Ha31038866##',
  database: 'laricasp_bdpizzas',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Função para testar a conexão
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    return false;
  }
}

// Função para executar queries
export async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar query:', error.message);
    throw error;
  }
}

// Função para fechar o pool de conexões
export async function closeConnection() {
  try {
    await pool.end();
    console.log('Conexão com o banco de dados fechada');
  } catch (error) {
    console.error('Erro ao fechar conexão:', error.message);
  }
}

export default pool;