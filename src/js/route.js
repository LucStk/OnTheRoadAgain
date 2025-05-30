 import Point from "./point.js" 
 
 
 export class Route{

	constructor(coordinates,map) {
		this.coordinates = coordinates;
		// Entrypoint est le point d'entrée de la chaîne
		// C'est un point au hasard de la liste
		this.entrypoint = new Point(coordinates,map);
		this.entrypoint.route = this;
	}

    remove() {
        // Supprimer tous les points
        if (this.entrypoint) {
			let n = this.entrypoint.next;
			let p = this.entrypoint.previous;
			this.entrypoint.remove();
            function rec_drop(point, direction) {
                if (!point) return;
                const nextPoint = direction ? point.next : point.previous;
                point.remove();
                rec_drop(nextPoint, direction);
            }
            
            rec_drop(n, true);
            rec_drop(p, false);
        }
        
        // Nettoyer les références
        this.entrypoint = null;
        this.coordinates = null;
        
        // Notifier la carte si nécessaire
        if (this.map) {
            // Émettre un événement de suppression de route
            this.map.fire('routeremoved', { route: this });
        } 
	}

	getFirstPoint(){
		function rec_first(point) {
			return point.previous ? rec_first(point.previous) : point
		}
		return rec_first(this.entrypoint);
	}

	getLastPoint(){
		function rec_last(point) {
			return point.next ? rec_first(point.next) : point
		}
		return rec_last(this.entrypoint);
	}

	invertAllPoints(){
		// Change de tous les points de la route

		function rec_inv_next(point) {
			if (!point) {return;}
			rec_inv_next(point.next);
			invertPoint(point);
		}
		rec_inv_next(this.getFirstPoint());
	}

	invertPoint(point){
		let prev = point.previous;
		point.previous = point.next;
		point.next = prev;
	}

	getLength(){
		let length = 0;
		let currentPoint = this.entrypoint;
		while (currentPoint) {
				length++;
				currentPoint = currentPoint.next;
		}
		currentPoint = this.entrypoint;
		while (currentPoint) {
			length++;
			currentPoint = currentPoint.previous;
		}
		return length;
	}
}
