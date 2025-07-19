export class CepService {
  constructor() {
    this.baseURL = 'https://viacep.com.br/ws';
  }

  // Buscar endereço por CEP
  async getAddressByCep(cep) {
    try {
      // Limpar CEP (remover caracteres especiais)
      const cleanCep = cep.replace(/\D/g, '');
      
      // Validar formato do CEP
      if (cleanCep.length !== 8) {
        return {
          success: false,
          error: 'CEP deve conter 8 dígitos'
        };
      }

      const response = await fetch(`${this.baseURL}/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return {
          success: false,
          error: 'CEP não encontrado'
        };
      }

      return {
        success: true,
        data: {
          cep: data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          ibge: data.ibge,
          gia: data.gia,
          ddd: data.ddd,
          siafi: data.siafi
        }
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return {
        success: false,
        error: 'Erro ao consultar CEP. Tente novamente.'
      };
    }
  }

  // Calcular taxa de entrega baseada na distância
  async calculateDeliveryFee(cep) {
    try {
      const addressData = await this.getAddressByCep(cep);
      
      if (!addressData.success) {
        return addressData;
      }

      // Simular cálculo de taxa baseado no bairro/região
      const deliveryZones = {
        'Centro': 5.00,
        'Vila Madalena': 7.00,
        'Pinheiros': 7.00,
        'Jardins': 8.00,
        'Moema': 8.00,
        'Itaim Bibi': 9.00,
        'Vila Olímpia': 9.00,
        'Brooklin': 10.00,
        'Santo Amaro': 12.00,
        'Morumbi': 12.00
      };

      const bairro = addressData.data.bairro;
      let deliveryFee = 15.00; // Taxa padrão

      // Verificar se o bairro está nas zonas especiais
      for (const [zone, fee] of Object.entries(deliveryZones)) {
        if (bairro.toLowerCase().includes(zone.toLowerCase())) {
          deliveryFee = fee;
          break;
        }
      }

      return {
        success: true,
        address: addressData.data,
        deliveryFee: deliveryFee,
        estimatedTime: this.calculateEstimatedTime(deliveryFee)
      };
    } catch (error) {
      console.error('Erro ao calcular taxa de entrega:', error);
      return {
        success: false,
        error: 'Erro ao calcular taxa de entrega'
      };
    }
  }

  // Calcular tempo estimado de entrega
  calculateEstimatedTime(deliveryFee) {
    // Quanto maior a taxa, mais longe e mais tempo
    if (deliveryFee <= 7) return '25-35 minutos';
    if (deliveryFee <= 10) return '35-45 minutos';
    if (deliveryFee <= 12) return '45-55 minutos';
    return '55-65 minutos';
  }

  // Validar se entregamos na região
  async validateDeliveryArea(cep) {
    try {
      const addressData = await this.getAddressByCep(cep);
      
      if (!addressData.success) {
        return addressData;
      }

      // Lista de cidades/regiões que entregamos
      const deliveryAreas = ['São Paulo', 'Osasco', 'Barueri', 'Carapicuíba'];
      const city = addressData.data.localidade;

      const delivers = deliveryAreas.some(area => 
        city.toLowerCase().includes(area.toLowerCase())
      );

      return {
        success: true,
        delivers: delivers,
        city: city,
        message: delivers 
          ? 'Entregamos na sua região!' 
          : 'Infelizmente não entregamos na sua região ainda.'
      };
    } catch (error) {
      console.error('Erro ao validar área de entrega:', error);
      return {
        success: false,
        error: 'Erro ao validar área de entrega'
      };
    }
  }
}