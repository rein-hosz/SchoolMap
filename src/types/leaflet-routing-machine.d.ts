declare module 'leaflet-routing-machine' {
  import * as L from 'leaflet';

  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[];
      router?: L.Routing.IRouter;
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      fitSelectedRoutes?: boolean;
      lineOptions?: {
        styles?: {
          color?: string;
          opacity?: number;
          weight?: number;
        }[];
      };
      altLineOptions?: {
        styles?: {
          color?: string;
          opacity?: number;
          weight?: number;
        }[];
      };
      createMarker?: (i: number, waypoint: L.LatLng, n: number) => L.Marker | null;
    }

    class Control extends L.Control {
      constructor(options: RoutingControlOptions);
      getPlan(): L.Routing.Plan;
      getRouter(): L.Routing.IRouter;
      route(): void;
    }
  }

  export = Routing;
}

declare module 'leaflet' {
  namespace Routing {
    function control(options: RoutingControlOptions): Control;
  }

  export function icon(arg0: { iconUrl: string; shadowUrl: string; iconSize: number[]; iconAnchor: number[]; popupAnchor: number[]; }) {
    throw new Error("Function not implemented.");
  }
}