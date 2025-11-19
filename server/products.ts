/**
 * Stripe Products and Pricing Configuration
 * Define subscription plans for FinModel Pro SaaS
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // in cents
  priceYearly: number; // in cents
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  features: string[];
  maxProjects: number;
  maxUsers: number;
  support: string;
  exportFormats: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Para empezar con modelado financiero básico',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '1 proyecto activo',
      'Todos los módulos de entrada de datos',
      'Estados financieros básicos',
      'Dashboard con KPIs',
      'Exportación a PDF',
    ],
    maxProjects: 1,
    maxUsers: 1,
    support: 'Comunidad',
    exportFormats: ['PDF'],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Para profesionales y consultores financieros',
    priceMonthly: 4900, // $49.00
    priceYearly: 47040, // $470.40 (20% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY,
    features: [
      '10 proyectos activos',
      'Todos los módulos avanzados',
      'Estados financieros completos',
      'Dashboard con gráficos interactivos',
      'Exportación a PDF y Excel',
      'Plantillas por industria',
      'Versionado de proyectos',
      'Comparación de escenarios',
    ],
    maxProjects: 10,
    maxUsers: 3,
    support: 'Email (48h)',
    exportFormats: ['PDF', 'Excel'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para equipos y organizaciones grandes',
    priceMonthly: 14900, // $149.00
    priceYearly: 142800, // $1,428.00 (20% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
    features: [
      'Proyectos ilimitados',
      'Usuarios ilimitados',
      'Todos los módulos premium',
      'API de integración',
      'Exportación avanzada',
      'Plantillas personalizadas',
      'Soporte prioritario',
      'Capacitación personalizada',
      'SLA garantizado',
    ],
    maxProjects: -1, // unlimited
    maxUsers: -1, // unlimited
    support: 'Prioritario 24/7',
    exportFormats: ['PDF', 'Excel', 'API'],
  },
};

export function getPlanById(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS[planId] || null;
}

export function canUserAccessFeature(
  userPlan: string,
  feature: 'export_excel' | 'multiple_projects' | 'advanced_charts' | 'api_access'
): boolean {
  const plan = getPlanById(userPlan);
  if (!plan) return false;

  switch (feature) {
    case 'export_excel':
      return plan.exportFormats.includes('Excel');
    case 'multiple_projects':
      return plan.maxProjects > 1 || plan.maxProjects === -1;
    case 'advanced_charts':
      return userPlan !== 'free';
    case 'api_access':
      return userPlan === 'enterprise';
    default:
      return false;
  }
}

export function canCreateProject(userPlan: string, currentProjectCount: number): boolean {
  const plan = getPlanById(userPlan);
  if (!plan) return false;
  
  if (plan.maxProjects === -1) return true; // unlimited
  return currentProjectCount < plan.maxProjects;
}
