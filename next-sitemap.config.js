/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://myaesthetics.com',
  generateRobotsTxt: true,
  sitemapSize: 50000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/manage/*',
    '/api/*',
    '/admin/*',
    '/404',
    '/500',
    '/_app',
    '/_document',
    '/_error',
    '/sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/manage', '/api', '/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/manage', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://myaesthetics.com/sitemap-services.xml',
      'https://myaesthetics.com/sitemap-branches.xml',
    ],
  },
  additionalPaths: async () => {
    const paths = [
      {
        loc: '/services',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/branches',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/customer/booking',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/customer/appointments',
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
    ];
    return paths;
  },
};

module.exports = config;
