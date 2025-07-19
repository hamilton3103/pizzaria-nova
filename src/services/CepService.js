export class CepService {
  constructor() {
    this.baseURL = 'https://viacep.com.br/ws';
  }

  // Buscar endereço por CEP
  async getAddressByCep(cep) {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
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
          uf: data.uf
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

  // Calcular taxa de entrega
  async calculateDeliveryFee(cep) {
    try {
      const addressData = await this.getAddressByCep(cep);
      
      if (!addressData.success) {
        return addressData;
      }

      const deliveryZones = {
        'Centro': 5.00,
        'Vila Madalena': 7.00,
        'Pinheiros': 7.00,
        'Jardins': 8.00,
        'Moema': 8.00
      };

      const bairro = addressData.data.bairro;
      let deliveryFee = 10.00;

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

  calculateEstimatedTime(deliveryFee) {
    if (deliveryFee <= 7) return '25-35 minutos';
    if (deliveryFee <= 10) return '35-45 minutos';
    return '45-55 minutos';
  }

  async validateDeliveryArea(cep) {
    try {
      const addressData = await this.getAddressByCep(cep);
      
      if (!addressData.success) {
        return addressData;
      }

      const deliveryAreas = ['São Paulo', 'Osasco', 'Barueri'];
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