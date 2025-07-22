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
//lista de usuarios
export const dataAdmin = {
  conductores: [
    {
      id: 1,
      nombre: "María López",
      email: "maria.lopez@example.com",
      rol: "Conductor",
      dni: "87654321B",
      estado: "Activo",
      fecha: "2023-02-20",
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria.lopez@example.com",
      rol: "Conductor",
      dni: "87654321B",
      estado: "Inactivo",
      fecha: "2023-02-20",
    },
  ],
  pasajeros: [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      rol: "Pasajero",
      dni: "45678912C",
      estado: "Activo",
      fecha: "2023-03-10",
      direccion: "Calle Principal 123, Ciudad",
    },
    {
      id: 2,
      nombre: "pepo Rodríguez",
      email: "carlos.rodriguez@example.com",
      rol: "Pasajero",
      dni: "123456789",
      estado: "Inactivo",
      fecha: "2023-03-10",
      direccion: "Calle Principal 123, Ciudad",
    },
  ],
  vehiculos: [
    {
      id: 1,
      patente: "AB123CD",
      marca: "Toyota",
      modelo: "Corolla",
      anio: 2020,
      color: "Negro",
      conductor: "Carlos Gómez",
      estado: "Activo",
    },
    {
      id: 2,
      patente: "EF456GH",
      marca: "Ford",
      modelo: "Focus",
      anio: 2018,
      color: "Gris",
      conductor: "Juan Torres",
      estado: "Inactivo",
    },
  ],
  viajes: [
    {
      id: 1,
      fecha: "2024-05-10",
      origen: "Av. rosario 123",
      destino: "Calle Falsa 456",
      pasajero: "nico Ramírez",
      conductor: "Juan Pérez",
      estado: "Completado",
      importe: "$1500",
    },
    {
      id: 2,
      fecha: "2024-05-11",
      origen: "Av. Siempre Viva 123",
      destino: "Calle Falsa 456",
      pasajero: "Pedro Ramírez",
      conductor: "Juan Pérez",
      estado: "Cancelado",
      importe: "$1500",
    },
    {
      id: 3,
      fecha: "2024-05-12",
      origen: "Av. Siempre Viva 123",
      destino: "Calle Falsa 456",
      pasajero: "Pedro Ramírez",
      conductor: "Juan Pérez",
      estado: "En curso",
      importe: "$1500",
    },
  ],
};
//ubicaciones vehiculos
export const vehiclesUbications = [
  {
    plate: "ABC123",
    driver: "Juan Pérez",
    status: "Activo",
    updated: "Hace 5 min",
    selected: false,
    location: "Puerto Madero, Buenos Aires",
  },
  {
    plate: "XYZ789",
    driver: "María López",
    status: "Activo",
    updated: "Hace 2 min",
    selected: true,
    location: "san telmo, Buenos Aires",
  },
  {
    plate: "DEF456",
    driver: "Carlos Rodríguez",
    status: "Inactivo",
    updated: "Hace 30 min",
    selected: false,
    location: "rosario",
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

//chats de ejemplo

export const initialChats = [
  {
    id: 1,
    name: "María González",
    online: true,
    messages: [
      {
        from: "other",
        text: "Hola, ¿a qué hora llegas? Estoy esperando en la entrada principal.",
        time: "12:30",
      },
      {
        from: "me",
        text: "Estoy a 5 minutos de distancia. Llego enseguida.",
        time: "12:32",
      },
      {
        from: "other",
        text: "Perfecto, te espero. Estoy usando una chaqueta roja.",
        time: "12:33",
      },
      {
        from: "me",
        text: "Ya te veo. Estoy estacionando el auto.",
        time: "12:35",
      },
    ],
  },
  {
    id: 2,
    name: "Juan Pérez",
    online: false,
    messages: [
      {
        from: "other",
        text: "Gracias por el viaje, excelente servicio.",
        time: "Ayer",
      },
    ],
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    online: false,
    unread: 2,
    messages: [
      {
        from: "other",
        text: "Hola, ¿puedes recogerme en otra dirección?",
        time: "10:15",
      },
    ],
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
export const viajesProgramados = [
  {
    id: 1, // ID único del viaje
    origin: "Jujuy 3201 (Luis Agote)", // Dirección de origen
    originLat: -32.9331312,
    originLng: -60.6650407,
    destination: "Jujuy (Alberto Olmedo)", // Dirección de destino
    destinationLat: -32.934184,
    destinationLng: -60.659619,
    date: "2025-07-25T14:30:00", // Fecha y hora programada
    price: 600, // Precio estimado del viaje
    status: "Pending", // Estado: Pending, Accepted, Completed, Cancelled
    clientId: 123, // ID del cliente que lo solicitó
    driverId: null, // ID del conductor asignado (null si aún no tiene)
  },
];

export const paymentMethods = [
  {
    id: 1,
    type: "mercado_pago",
    name: "Mercado Pago",
    expiry: "12/25",
  },
  { id: 2, type: "cash", name: "Efectivo", description: "Pago al conductor" },
];
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
