import { RoutesService, eLayoutType } from '@abp/ng.core';
import { inject, provideAppInitializer } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);
  routes.add([
    {
      path: '/',
      name: '::Menu:Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application,
    },

    {
      path: '/product-management',
      name: '::Menu:SeaFoodStore',
      iconClass: 'fa-solid fa-box',
      order: 2,
      layout: eLayoutType.application,
    },
    {
      path: '/product',
      name: '::Menu:Products',
      parentName: '::Menu:SeaFoodStore',
      layout: eLayoutType.application,
    },
    {
      path: '/category',
      name: '::Menu:Categories',
      parentName: '::Menu:SeaFoodStore',
      layout: eLayoutType.application,
    },
    {
      path: '/blog',
      name: '::Menu:Blogs',
      parentName: '::Menu:SeaFoodStore',
      layout: eLayoutType.application,
    },
    {
      path: '/contact',
      name: '::Menu:Contacts',
      parentName: '::Menu:SeaFoodStore',
      layout: eLayoutType.application,
    },

  ]);
}
