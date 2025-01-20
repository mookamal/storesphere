const DOMAINS = {
  main: 'nour.com',
  accounts: 'accounts.nour.com',
  dashboard: 'dashboard.nour.com',
  blog: 'blog.nour.com'
};

export const ROUTES = {
  home: {
    url: `http://${DOMAINS.main}`,
    path: '/'
  },
  login: {
    url: `http://${DOMAINS.accounts}/login`,
    path: '/login'
  },
  signup: {
    url: `http://${DOMAINS.accounts}/signup`,
    path: '/signup'
  },
  dashboard: {
    url: `http://${DOMAINS.dashboard}`,
    path: '/'
  },
  features: {
    url: `http://${DOMAINS.main}/features`,
    path: '/features'
  },
  pricing: {
    url: `http://${DOMAINS.main}/pricing`,
    path: '/pricing'
  },
  blog: {
    url: `http://${DOMAINS.blog}`,
    path: '/'
  }
};

export const generateFullUrl = (route) => route.url;
export const generateLocalPath = (route) => route.path;

export default ROUTES;
