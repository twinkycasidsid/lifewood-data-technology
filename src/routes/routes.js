import {
  GetStartedPage,
  DashboardPage,
  AIServicesPage,
  DataServicePage,
  HorizontalLLMDataPage,
  VerticalLLMDataPage,
  AIGCPage,
  AIProjectsPage,
  AboutPage,
  OfficesPage,
  PhilImpactPage,
  CareersPage,
  ContactUsPage,
  InternalNewsPage,PrivacyPolicyPage,
  CookiePolicyPage,
  TermsConditionsPage,
} from '../pages'
import { Hero, About, ImpactStats, ESG, Clients, CTA } from '../components/sections'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'

// Route configuration
export const routeConfig = [
  {
    path: '/ai-services',
    component: AIServicesPage,
    layout: true,
  },
  {
    path: '/ai-projects',
    component: AIProjectsPage,
    layout: true,
  },
  {
    path: '/data-service',
    component: DataServicePage,
    layout: true,
  },
  {
    path: '/horizontal-llm-data',
    component: HorizontalLLMDataPage,
    layout: true,
  },
  {
    path: '/vertical-llm-data',
    component: VerticalLLMDataPage,
    layout: true,
  },
  {
    path: '/aigc',
    component: AIGCPage,
    layout: true,
  },
  {
    path: '/about',
    component: AboutPage,
    layout: true,
  },
  {
    path: '/offices',
    component: OfficesPage,
    layout: true,
  },
  {
    path: '/phil-impact',
    component: PhilImpactPage,
    layout: true,
  },
  {
    path: '/careers',
    component: CareersPage,
    layout: true,
  },
  {
    path: '/contact-us',
    component: ContactUsPage,
    layout: true,
  },
  {
    path: '/internal-news',
    component: InternalNewsPage,
    layout: true,
  },
  {
    path: '/get-started',
    component: GetStartedPage,
    layout: true,
  },
  {
    path: '/sign-in',
    component: GetStartedPage,
    layout: true,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    layout: false, // No nav/footer on dashboard
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicyPage,
    layout: false, // No nav/footer on privacy policy page
  },
  {
    path: '/cookie-policy',
    component: CookiePolicyPage,
    layout: false, // No nav/footer on cookie policy page
  },
   {
    path: '/terms-conditions',
    component: TermsConditionsPage,
    layout: false, // No nav/footer on terms and conditions page
  },
]

/**
 * Get route config for a given path
 * Returns route config object or null if not found
 */
export function getRouteConfig(path) {
  return routeConfig.find((route) => route.path === path) || null
}

/**
 * Check if route should have nav/footer layout
 */
export function shouldShowLayout(path) {
  const route = getRouteConfig(path)
  return route ? route.layout !== false : true
}

/**
 * Get the component for a given path
 */
export function getRouteComponent(path) {
  const route = getRouteConfig(path)
  return route ? route.component : null
}

/**
 * Home page sections - rendered when path is '/'
 */
export const homePageSections = [
  () => ({ component: Hero }),
  () => ({ component: About }),
  () => ({ component: ImpactStats }),
  () => ({ component: ESG }),
  () => ({ component: TrustedBy }),
  () => ({ component: CTA }),
]
