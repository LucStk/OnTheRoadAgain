
import L from 'leaflet';
import {Route, Point} from "./point.js";
export class Map extends L.Map{
  constructor() {
    super('map');
    /*
    Map contient les cartes leaflets mais également l'ensemble des routes affichées 
    sur la carte dans une liste this.routes.
    */

    // Default view
    this.setView([48.3904, -4.49], 13);
    // Add OpenStreetMap tile layer
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this);

    // Add CyclOSM tile layer
    const cycleLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a>'
    });
    // Layer control
    const baseMaps = {
      "OpenStreetMap": osm,
      "Cycle Map": cycleLayer
    };
    L.control.layers(baseMaps).addTo(this);
    // List pour les routes
    this.routes = Array();
    //Permet de poser un point avec un clic droit.
    this.addEventListener("contextmenu", this.handleContextMenu);    
  }
  newRoute(){
    var r = new Route(this);
    this.routes.push(r);
    return r
  }


  removeRoute(route) {
		const index = this.routes.indexOf(route);
		if (index !== -1) {
		  this.routes.splice(index, 1);
		}
	}

  handleContextMenu(e) {
    e.originalEvent.preventDefault();

    // Pas de route multiple pour l'instant
    if (this.routes.length > 0){
      return
    }

    if (!e.originalEvent.target.classList.contains('marker')) {
      this.addRoute([e.latlng.lat, e.latlng.lng]);
    }
  }
  remove() {
    // Nettoyage des routes
    this.routes.forEach(route => {
      route.remove()
    })
    this.routes = []
    // Suppression des événements
    this.removeEventListener("contextmenu", this.handleContextMenu);
    // Suppression de la carte
    super.remove();
    this.clearMapDiv();
  }
  clearMapDiv() {
    const newMapDiv = document.createElement('div');
    newMapDiv.id = 'map';
    const oldMapDiv = document.getElementById('map');
    if (oldMapDiv){
        oldMapDiv.parentNode.replaceChild(newMapDiv, oldMapDiv);
    }
  }
}
