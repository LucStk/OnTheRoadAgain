import L from 'leaflet';

export class Lines extends L.Polyline {

	constructor(coordinates,map) {
		// Créer une ligne
		super(coordinates, {
			color: 'blue',
			weight: 3,
			opacity: 0.7
		});
		
		this.colors = ['blue', 'red', 'green', 'purple', 'orange'];
		this.currentColorIndex = 0;
		this.point = null; // un segment est associé au point de départ
		this.map = map;
		this.addTo(map);

		this.on("dblclick", this.handledbClick);
		this.on("click", this.handleClick);
		this.on("contextmenu", this.handleContextMenu);
	}
	remove(){
        this.off("dblclick");
        this.off("click");
        this.off("contextmenu");

		super.remove();
		this.point = null;

	}

	nextColor() {
	  this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
	  return this.colors[this.currentColorIndex];
	}

	setColorPolyline(color) {this.setStyle({ color: color });}
	
	handledbClick(e) {
		L.DomEvent.stopPropagation(e);
	}

	handleClick(e) {
		 L.DomEvent.stopPropagation(e); // Empêche la propagation de l'événement
		 e.originalEvent.preventDefault();
		 const newColor = this.nextColor();
		 this.setColorPolyline(newColor);
	};

	handleContextMenu(e) {
		 L.DomEvent.stopPropagation(e); // Empêche la propagation de l'événement
		 e.originalEvent.preventDefault();

		 this.point.creatNext([e.latlng.lat, e.latlng.lng]);
		 this.point.next.beginDrag();
	}

}
export default Lines