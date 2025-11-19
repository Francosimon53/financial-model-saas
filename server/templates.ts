export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: string;
  defaultData: {
    duration: number;
    revenueProducts?: Array<{
      name: string;
      unitPrice: number;
      volume: number;
      growthRate: number;
    }>;
    cogsItems?: Array<{
      name: string;
      costPerUnit: number;
      growthRate: number;
    }>;
    salaries?: Array<{
      position: string;
      monthlySalary: number;
      startMonth: number;
    }>;
  };
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "refinery",
    name: "Refinería de Petróleo",
    description: "Modelo financiero para refinería con capacidad de 180,000 barriles/día",
    industry: "Energía y Petróleo",
    icon: "⚡",
    defaultData: {
      duration: 120,
      revenueProducts: [
        { name: "Gasolina", unitPrice: 8500, volume: 50000, growthRate: 2 },
        { name: "Diesel", unitPrice: 9000, volume: 60000, growthRate: 2 },
        { name: "Jet Fuel", unitPrice: 8800, volume: 40000, growthRate: 1.5 },
        { name: "Fuel Oil", unitPrice: 7000, volume: 30000, growthRate: 1 },
      ],
      cogsItems: [
        { name: "Crudo", costPerUnit: 6500, growthRate: 3 },
        { name: "Químicos", costPerUnit: 500, growthRate: 2 },
        { name: "Energía", costPerUnit: 300, growthRate: 2.5 },
      ],
      salaries: [
        { position: "CEO", monthlySalary: 50000, startMonth: 1 },
        { position: "CFO", monthlySalary: 40000, startMonth: 1 },
        { position: "Gerente de Operaciones", monthlySalary: 35000, startMonth: 1 },
        { position: "Ingeniero de Procesos", monthlySalary: 25000, startMonth: 3 },
      ],
    },
  },
  {
    id: "chemical_plant",
    name: "Planta Química",
    description: "Modelo financiero para planta de producción química industrial",
    industry: "Química",
    icon: "🧪",
    defaultData: {
      duration: 96,
      revenueProducts: [
        { name: "Producto Químico A", unitPrice: 15000, volume: 10000, growthRate: 3 },
        { name: "Producto Químico B", unitPrice: 12000, volume: 15000, growthRate: 2.5 },
        { name: "Subproductos", unitPrice: 5000, volume: 5000, growthRate: 1 },
      ],
      cogsItems: [
        { name: "Materia Prima Principal", costPerUnit: 8000, growthRate: 2.5 },
        { name: "Catalizadores", costPerUnit: 2000, growthRate: 2 },
        { name: "Utilidades", costPerUnit: 1000, growthRate: 3 },
      ],
      salaries: [
        { position: "Director General", monthlySalary: 45000, startMonth: 1 },
        { position: "Gerente de Producción", monthlySalary: 35000, startMonth: 1 },
        { position: "Químico Senior", monthlySalary: 28000, startMonth: 2 },
      ],
    },
  },
  {
    id: "solar_farm",
    name: "Granja Solar",
    description: "Modelo financiero para proyecto de energía solar fotovoltaica",
    industry: "Energías Renovables",
    icon: "☀️",
    defaultData: {
      duration: 240,
      revenueProducts: [
        { name: "Venta de Energía", unitPrice: 120, volume: 500000, growthRate: 1 },
        { name: "Certificados Verdes", unitPrice: 50, volume: 100000, growthRate: 0.5 },
      ],
      cogsItems: [
        { name: "Mantenimiento Paneles", costPerUnit: 10, growthRate: 1.5 },
        { name: "Operación y Monitoreo", costPerUnit: 5, growthRate: 2 },
      ],
      salaries: [
        { position: "Gerente de Proyecto", monthlySalary: 30000, startMonth: 1 },
        { position: "Técnico de Mantenimiento", monthlySalary: 18000, startMonth: 6 },
        { position: "Ingeniero Eléctrico", monthlySalary: 25000, startMonth: 3 },
      ],
    },
  },
  {
    id: "blank",
    name: "Proyecto en Blanco",
    description: "Comienza desde cero con un proyecto personalizado",
    industry: "General",
    icon: "📄",
    defaultData: {
      duration: 60,
    },
  },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find((t) => t.id === id);
}
