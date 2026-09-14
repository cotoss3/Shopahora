import { Product, ShippingRate } from '../types/product';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Audífonos Studio Pro Wireless',
    subtitle: 'Cancelación de Ruido Activa & Audio Espacial HD',
    description: 'Diseñados con transductores de titanio personalizados y almohadillas de espuma viscoelástica para una inmersión acústica completa y máxima comodidad durante jornadas extensas.',
    price: 249.99,
    b2bPrice: 199.99,
    b2bDiscountPercent: 20,
    category: 'audio',
    isItbmsExempt: false,
    stockPhysical: 48,
    allowDropshipping: false,
    isActive: true,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Destacado',
    colors: [
      { name: 'Negro Azabache', hex: '#121212' },
      { name: 'Arena Cálido', hex: '#D9C8B4' },
      { name: 'Verde Bosque', hex: '#2D4B3E' }
    ],
    features: [
      'Cancelación de ruido activa adaptativa (ANC)',
      'Hasta 40 horas de batería continua',
      'Conexión Bluetooth 5.3 de ultra baja latencia',
      'Construcción ligera de aluminio aeroespacial'
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Lámpara de Mesa Aura Minimal',
    subtitle: 'Iluminación Regulable de Tacto Suave',
    description: 'Una escultura lumínica con cuerpo de cerámica horneada artesanalmente. Difunde una luz cálida ideal para lectura, áreas de trabajo o mesitas de noche.',
    price: 129.50,
    b2bPrice: 99.00,
    b2bDiscountPercent: 23,
    category: 'hogar',
    isItbmsExempt: false,
    stockPhysical: 18,
    allowDropshipping: true,
    isActive: true,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Nuevo',
    colors: [
      { name: 'Marfil Texturizado', hex: '#F4F1EA' },
      { name: 'Terracota Sombra', hex: '#D9531E' }
    ],
    features: [
      'Sensor táctil de 3 niveles de intensidad',
      'Temperatura de color cálida de 2700K',
      'Batería recargable vía USB-C (hasta 20h)',
      'Construcción eco-sostenible'
    ],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Reloj Inteligente Horizon S',
    subtitle: 'Pantalla OLED Zafiro & Monitoreo Bio-Métrico',
    description: 'La síntesis perfecta entre alta relojería clásica y métricas avanzadas de rendimiento de salud. Cristal de zafiro resistente a rayaduras e impermeable hasta 50m.',
    price: 389.00,
    b2bPrice: 310.00,
    b2bDiscountPercent: 20,
    category: 'tecnologia',
    isItbmsExempt: false,
    stockPhysical: 0,
    allowDropshipping: true, // Dropshipping enabled
    isActive: false, // Hidden for B2C, visible for B2B dropshipping
    rating: 5.0,
    reviewsCount: 210,
    badge: 'Edición Limitada',
    colors: [
      { name: 'Titán Mate', hex: '#3A3A3C' },
      { name: 'Plata Pulida', hex: '#E5E5EA' }
    ],
    features: [
      'Pantalla OLED Always-On de 1.9 pulgadas',
      'Electrocardiograma (ECG) y SpO2 continuo',
      'GPS de doble frecuencia ultrabaja energía',
      'Resistencia al agua 5 ATM (50 metros)'
    ],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: '4',
    name: 'Mochila Urbana Nomad Leather',
    subtitle: 'Cuero Genuino & Compartimento Antirrobo Mac 16"',
    description: 'Diseñada para exploradores urbanos y creativos. Elaborada a mano con cuero vacuno seleccionado que adquiere una pátina única con el tiempo.',
    price: 185.00,
    b2bPrice: 145.00,
    b2bDiscountPercent: 21,
    category: 'accesorios',
    isItbmsExempt: false,
    stockPhysical: 25,
    allowDropshipping: false,
    isActive: true,
    rating: 4.7,
    reviewsCount: 64,
    colors: [
      { name: 'Marrón Cognac', hex: '#7A3B18' },
      { name: 'Negro Carbón', hex: '#1C1C1E' }
    ],
    features: [
      'Funda acolchada para laptops de hasta 16 pulgadas',
      'Bolsillo posterior antirrobo con cierre magnético',
      'Tratamiento repelente a lluvia ligera',
      'Herrajes de latón macizo antioxidante'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: '5',
    name: 'Teclado Mecánico Craftsman Wood',
    subtitle: 'Switches Mecánicos Lubricados & Base de Madera',
    description: 'Respuesta táctil suave y acústica enriquecida. Chasis esculpido en madera de nogal natural con retroiluminación ámbar tenue.',
    price: 169.90,
    b2bPrice: 129.90,
    b2bDiscountPercent: 23,
    category: 'tecnologia',
    isItbmsExempt: false,
    stockPhysical: 30,
    allowDropshipping: false,
    isActive: true,
    rating: 4.9,
    reviewsCount: 118,
    badge: 'Destacado',
    colors: [
      { name: 'Nogal Oscuro', hex: '#4A2E1B' },
      { name: 'Cerezo Cálido', hex: '#733725' }
    ],
    features: [
      'Switches de precisión Hot-swappable',
      'Conexión triple: Tri-Mode (2.4G, Bluetooth 5.1, USB-C)',
      'Keycaps de PBT doble inyección duraderos',
      'Batería de 4000mAh integrada'
    ],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: '6',
    name: 'Difusor Aromático Stone Calm',
    subtitle: 'Ultrasonido Silencioso & Piedra Basáltica',
    description: 'Eleva el ambiente de tu hogar con difusión ultrasónica de aceites esenciales puros y luz nocturna de respiración pasiva.',
    price: 79.00,
    b2bPrice: 59.00,
    b2bDiscountPercent: 25,
    category: 'hogar',
    isItbmsExempt: true, // ITBMS Exempt Category
    stockPhysical: 60,
    allowDropshipping: true,
    isActive: true,
    rating: 4.6,
    reviewsCount: 77,
    badge: 'Oferta',
    colors: [
      { name: 'Gris Piedra', hex: '#636366' },
      { name: 'Blanco Lino', hex: '#F2F2F7' }
    ],
    features: [
      'Difusión ultrasónica a 2.4MHz (Ultra silencioso)',
      'Temporizador automático de 2h, 4h y 8h',
      'Apagado de seguridad por depósito vacío',
      'Capacidad de 300ml para 10 horas continuas'
    ],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

export const PANAMA_SHIPPING_RATES: ShippingRate[] = [
  { province: 'Panamá Centro', vehicle: 'moto', rate: 4.50, estimatedHours: 4 },
  { province: 'Panamá Centro', vehicle: 'sedan', rate: 7.00, estimatedHours: 6 },
  { province: 'Panamá Centro', vehicle: 'panel', rate: 15.00, estimatedHours: 12 },
  { province: 'Panamá Centro', vehicle: 'camion_5t', rate: 45.00, estimatedHours: 24 },
  
  { province: 'Panamá Oeste', vehicle: 'sedan', rate: 12.00, estimatedHours: 12 },
  { province: 'Panamá Oeste', vehicle: 'panel', rate: 25.00, estimatedHours: 24 },
  { province: 'Panamá Oeste', vehicle: 'camion_5t', rate: 75.00, estimatedHours: 24 },

  { province: 'Colón', vehicle: 'panel', rate: 30.00, estimatedHours: 24 },
  { province: 'Colón', vehicle: 'camion_5t', rate: 90.00, estimatedHours: 24 },

  { province: 'Provincias Centrales (Coclé, Herrera, Los Santos, Veraguas)', vehicle: 'panel', rate: 45.00, estimatedHours: 48 },
  { province: 'Provincias Centrales (Coclé, Herrera, Los Santos, Veraguas)', vehicle: 'camion_5t', rate: 120.00, estimatedHours: 48 },

  { province: 'Chiriquí', vehicle: 'panel', rate: 65.00, estimatedHours: 48 },
  { province: 'Chiriquí', vehicle: 'camion_5t', rate: 180.00, estimatedHours: 48 },

  { province: 'Bocas del Toro & Comarcas', vehicle: 'panel', rate: 95.00, estimatedHours: 72 },
  { province: 'Bocas del Toro & Comarcas', vehicle: 'camion_5t', rate: 250.00, estimatedHours: 72 },
];
