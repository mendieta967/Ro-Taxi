export const cardViajes = [
  {
    id: 1,
    title: "Viaje Programado",
    description: "Programa un viaje para más tarde",
  },
  {
    id: 2,
    title: "Favoritos",
    description: "Tus destinos favoritos",
  },
  {
    id: 3,
    title: "Métodos de Pago",
    description: "Gestiona tus métodos de pago",
  },
];

//Historial de viajes DRIVER
export const tripsDriver = [
  {
    id: 1,
    date: "2025-05-14",
    route: "Av. Corrientes 1234 → Puerto Madero",
    duration: "25 minutos (8.5 km)",
    earnings: 850,
    status: "completed",
  },
  {
    id: 2,
    date: "2025-05-13",
    route: "Palermo → Recoleta",
    duration: "Cancelado",
    earnings: 0,
    status: "canceled",
  },
  {
    id: 3,
    date: "2025-05-12",
    route: "San Telmo → Microcentro",
    duration: "20 minutos (6 km)",
    earnings: 700,
    status: "completed",
  },
  {
    id: 4,
    date: "2025-05-11",
    route: "San Telmo → Microcentro",
    duration: "20 minutos (6 km)",
    earnings: 700,
    status: "canceled",
  },
];

export const historailViajes = [
  {
    id: 1,
    title: "Viaje a Centro Comercial",
    date: "Hace 1 día",
    price: "$15.10",
  },
  {
    id: 2,
    title: "Viaje a Centro Comercial",
    date: "Hace 2 días",
    price: "$15.20",
  },
  {
    id: 3,
    title: "Viaje a Centro Comercial",
    date: "Hace 3 días",
    price: "$15.30",
  },
];

// Datos de ejemplo para el historial de pagos
export const historialPagos = [
  {
    id: 1,
    fecha: "05 May, 2025",
    hora: "14:30",
    monto: "$15.50",
    destino: "Viaje a Centro Comercial",
    origen: "Av. Insurgentes Sur 1602",
    destinoCompleto: "Centro Comercial Santa Fe",
    metodo: "Visa •••• 4242",
    conductor: "Carlos Ramírez",
    estado: "Completado",
    distancia: "5.2 km",
    tiempo: "18 min",
  },
  {
    id: 2,
    fecha: "28 Abr, 2025",
    hora: "08:15",
    monto: "$22.75",
    destino: "Viaje al Aeropuerto",
    origen: "Calle Durango 200",
    destinoCompleto: "Aeropuerto Internacional Benito Juárez",
    metodo: "Efectivo",
    conductor: "Ana Martínez",
    estado: "Completado",
    distancia: "12.8 km",
    tiempo: "35 min",
  },
  {
    id: 3,
    fecha: "15 Abr, 2025",
    hora: "09:45",
    monto: "$8.30",
    destino: "Viaje a Oficina",
    origen: "Av. Chapultepec 500",
    destinoCompleto: "Torre Reforma 222",
    metodo: "Visa •••• 4242",
    conductor: "Miguel López",
    estado: "Completado",
    distancia: "3.5 km",
    tiempo: "12 min",
  },
];

// Historial completo (más viajes para el modal de historial completo)
export const historialCompleto = [
  ...historialPagos,
  {
    id: 4,
    fecha: "10 Abr, 2025",
    hora: "19:20",
    monto: "$18.90",
    destino: "Viaje a Restaurante",
    origen: "Av. Reforma 222",
    destinoCompleto: "Restaurante Pujol",
    metodo: "Visa •••• 4242",
    conductor: "Laura Sánchez",
    estado: "Completado",
    distancia: "7.3 km",
    tiempo: "22 min",
  },
  {
    id: 5,
    fecha: "05 Abr, 2025",
    hora: "16:40",
    monto: "$12.45",
    destino: "Viaje a Gimnasio",
    origen: "Calle Sonora 180",
    destinoCompleto: "SmartFit Polanco",
    metodo: "Efectivo",
    conductor: "Roberto Díaz",
    estado: "Completado",
    distancia: "4.1 km",
    tiempo: "15 min",
  },
  {
    id: 6,
    fecha: "28 Mar, 2025",
    hora: "21:15",
    monto: "$25.30",
    destino: "Viaje a Casa",
    origen: "Antara Fashion Hall",
    destinoCompleto: "Av. Horacio 1030",
    metodo: "Visa •••• 4242",
    conductor: "Patricia Vega",
    estado: "Completado",
    distancia: "8.7 km",
    tiempo: "28 min",
  },
];

export const user = {
  name: "Carlos Rodríguez",
  email: "carlos@ejemplo.com",
  dni: "123456789",
  gender: "Masculino",
};

export const trips = [
  {
    id: 1,
    date: "Hoy, 10:30 AM",
    from: "Casa",
    to: "Oficina",
    price: "$12.50",
    status: "completados",
    driver: "Juan Pérez",
    rating: 1,
  },
  {
    id: 2,
    date: "Ayer, 6:15 PM",
    from: "Oficina",
    to: "Casa",
    price: "$13.75",
    status: "completados",
    driver: "María López",
    rating: 4,
  },
  {
    id: 3,
    date: "15 Mayo, 9:00 AM",
    from: "Casa",
    to: "Centro Comercial",
    price: "$8.90",
    status: "completados",
    driver: "Pedro Sánchez",
    rating: 5,
  },
  {
    id: 4,
    date: "10 Mayo, 2:30 PM",
    from: "Centro Comercial",
    to: "Restaurante El Mirador",
    price: "$15.20",
    status: "completados",
    driver: "Ana Martínez",
    rating: 5,
  },
  {
    id: 5,
    date: "5 Mayo, 7:45 PM",
    from: "Restaurante El Mirador",
    to: "Casa",
    price: "$11.30",
    status: "completados",
    driver: "Carlos Gómez",
    rating: 4,
  },
];

// Viaje programado de ejemplo
export const scheduledTrip = [
  {
    id: 1,
    date: "Mañana, 8:00 AM",
    from: "Casa",
    to: "Aeropuerto",
    price: "Estimado: $25.00",
    status: "programados",
  },
  {
    id: 2,
    date: "Mañana, 8:00 AM",
    from: "Casa",
    to: "Aeropuerto",
    price: "Estimado: $25.00",
    status: "programados",
  },
];

//Datos de ejemplo modal order taxi

export const modalOrderTaxi = [
  {
    type: "economico",
    name: "Económico",
    desc: "Vehículo compacto, económico",
    price: "€8-10",
    time: "5 min",
    seats: 3,
  },
  {
    type: "estandar",
    name: "Estándar",
    desc: "Vehículo cómodo para uso diario",
    price: "€10-14",
    time: "3 min",
    seats: 4,
  },
  {
    type: "premium",
    name: "Premium",
    desc: "Vehículo de alta gama",
    price: "€18-22",
    time: "7 min",
    seats: 4,
  },
];
