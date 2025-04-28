import * as L from "leaflet";

declare module "leaflet" {
  export interface IconOptions {
    iconUrl: string;
    iconRetinaUrl?: string;
    iconSize?: L.Point | number[];
    iconAnchor?: L.Point | number[];
    popupAnchor?: L.Point | number[];
    shadowUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: L.Point | number[];
    shadowAnchor?: L.Point | number[];
    className?: string;
  }
}
