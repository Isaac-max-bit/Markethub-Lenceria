// Países y ciudades disponibles en el checkout. Cada ciudad incluye su
// departamento/estado para completarlo automáticamente al elegirla.
export const UBICACIONES = [
  {
    pais: "Colombia",
    ciudades: [
      { nombre: "Bogotá", region: "Cundinamarca" },
      { nombre: "Medellín", region: "Antioquia" },
      { nombre: "Cali", region: "Valle del Cauca" },
      { nombre: "Barranquilla", region: "Atlántico" },
      { nombre: "Cartagena", region: "Bolívar" },
      { nombre: "Bucaramanga", region: "Santander" },
      { nombre: "Pereira", region: "Risaralda" },
      { nombre: "Manizales", region: "Caldas" },
      { nombre: "Santa Marta", region: "Magdalena" },
      { nombre: "Ibagué", region: "Tolima" },
      { nombre: "Cúcuta", region: "Norte de Santander" },
      { nombre: "Villavicencio", region: "Meta" },
      { nombre: "Pasto", region: "Nariño" },
      { nombre: "Neiva", region: "Huila" },
      { nombre: "Armenia", region: "Quindío" },
      { nombre: "Valledupar", region: "Cesar" },
      { nombre: "Montería", region: "Córdoba" },
      { nombre: "Sincelejo", region: "Sucre" },
      { nombre: "Popayán", region: "Cauca" },
      { nombre: "Tunja", region: "Boyacá" },
    ],
  },
  {
    pais: "México",
    ciudades: [
      { nombre: "Ciudad de México", region: "Ciudad de México" },
      { nombre: "Guadalajara", region: "Jalisco" },
      { nombre: "Monterrey", region: "Nuevo León" },
      { nombre: "Puebla", region: "Puebla" },
      { nombre: "Querétaro", region: "Querétaro" },
      { nombre: "Mérida", region: "Yucatán" },
      { nombre: "Tijuana", region: "Baja California" },
    ],
  },
  {
    pais: "Ecuador",
    ciudades: [
      { nombre: "Quito", region: "Pichincha" },
      { nombre: "Guayaquil", region: "Guayas" },
      { nombre: "Cuenca", region: "Azuay" },
      { nombre: "Loja", region: "Loja" },
      { nombre: "Ambato", region: "Tungurahua" },
    ],
  },
  {
    pais: "Perú",
    ciudades: [
      { nombre: "Lima", region: "Lima" },
      { nombre: "Arequipa", region: "Arequipa" },
      { nombre: "Trujillo", region: "La Libertad" },
      { nombre: "Cusco", region: "Cusco" },
      { nombre: "Piura", region: "Piura" },
    ],
  },
  {
    pais: "Chile",
    ciudades: [
      { nombre: "Santiago", region: "Región Metropolitana" },
      { nombre: "Valparaíso", region: "Valparaíso" },
      { nombre: "Concepción", region: "Biobío" },
      { nombre: "Antofagasta", region: "Antofagasta" },
    ],
  },
  {
    pais: "Argentina",
    ciudades: [
      { nombre: "Buenos Aires", region: "Buenos Aires" },
      { nombre: "Córdoba", region: "Córdoba" },
      { nombre: "Rosario", region: "Santa Fe" },
      { nombre: "Mendoza", region: "Mendoza" },
    ],
  },
  {
    pais: "Panamá",
    ciudades: [
      { nombre: "Ciudad de Panamá", region: "Panamá" },
      { nombre: "Colón", region: "Colón" },
      { nombre: "David", region: "Chiriquí" },
    ],
  },
  {
    pais: "Costa Rica",
    ciudades: [
      { nombre: "San José", region: "San José" },
      { nombre: "Alajuela", region: "Alajuela" },
      { nombre: "Cartago", region: "Cartago" },
    ],
  },
  {
    pais: "Estados Unidos",
    ciudades: [
      { nombre: "Miami", region: "Florida" },
      { nombre: "Nueva York", region: "Nueva York" },
      { nombre: "Los Ángeles", region: "California" },
      { nombre: "Houston", region: "Texas" },
    ],
  },
  {
    pais: "España",
    ciudades: [
      { nombre: "Madrid", region: "Madrid" },
      { nombre: "Barcelona", region: "Cataluña" },
      { nombre: "Valencia", region: "Comunidad Valenciana" },
      { nombre: "Sevilla", region: "Andalucía" },
    ],
  },
];

export const PAIS_POR_DEFECTO = "Colombia";
