export class Site{
  public constructor(name: String, coordinate: google.maps.LatLng) {
    this.name = name;
    this.coordinate = coordinate;
  }

  name: String;
  coordinate: google.maps.LatLng;
}

export class LocationInfo {
  public constructor(visitTime: string, duration: number, site: Site) {
    this.visitTime = visitTime;
    this.duration = duration;
    this.site = site;
  }

  visitTime: String;
  duration: Number;
  site: Site;
}