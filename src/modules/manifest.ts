export interface RouteMeta {
  layout: string
}

export interface Route {
  path: string;
  name: string;
  meta?: RouteMeta;
  component: string;
}
