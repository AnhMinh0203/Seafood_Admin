import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44358/',
  redirectUri: baseUrl,
  clientId: 'SeaFood_App',
  responseType: 'code',
  scope: 'offline_access SeaFood',
  requireHttps: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'SeaFood',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44358',
      rootNamespace: 'SeaFood',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
