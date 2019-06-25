export interface Route {
    path: string;
    name: string;
    title: string;
    load: any;
}
export interface NavbarRoute extends Route {
    navbar: true;
    iconName: string;
    disabled?: boolean;
}
export interface FallbackRoute {
    default: true;
    title: string;
    name: string;
    load: any;
    path: undefined;
}

export function hasNavbar(route: SomeRoute): route is NavbarRoute {
    return !!(route as NavbarRoute).navbar;
}

export type SomeRoute = Route | NavbarRoute | FallbackRoute;

const routeSettings: SomeRoute[] = [
    {
        path: '/',
        name: 'apple',
        title: 'Apple',
        load: () => import('../views/Apple'),
        navbar: true,
    },
    {
        name: 'orange',
        title: 'Orange',
        path: '/orange/',
        load: () => import('../views/Orange'),
        navbar: true,
    },

    {
        name: 'fourHundredThree',
        title: '403',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
    },

    {
        name: 'fourHundredFour',
        title: '404',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
    },
];

export default routeSettings;
