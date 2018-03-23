import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class FormEntryService {

	products: any[]   = []; // récupère les produits de Scorre pour l'autocomplétion
	locations: any[]  = []; // récupère les emplacements
	stockEntrySubject = new Subject(); // pour communiquer avec le tableau d'entrées
	freeEntrySubject  = new Subject();
	editEntrySubject  = new Subject(); // pour communiquer avec le formulaire pour édition

	BASE_URL = 'http://localhost:4201';

	constructor(private http: Http) { }

	// Autocomplétion produits suivis en stock
	getTrackedProducts() {
		// return this.http.get(this.BASE_URL + '/api/products')
		// 				.map(res => res.json())
		// 				.do(data => this.products = data);
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":-1}&rows=99999')
						.map(res => res.json())
						.do(data => this.products = data);
	}

	// Autocomplétion produits non-suivis en stock
	getUntrackedProducts() {
		// return this.http.get(this.BASE_URL + '/api/products')
		// 				.map(res => res.json())
		// 				.do(data => this.products = data);
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":0}&rows=99999')
						.map(res => res.json())
						.do(data => this.products = data);
	}

	// Autocomplétion emplacement
	getLocations() {
		return this.http.get(this.BASE_URL + '/api/locations')
						.map(res => res.json())
						.do(data => this.locations = data);
	}

	// Récupère un produit selon sa référence
	getProductByRef(ref: string) {
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":-1,"id__exact":"' + encodeURI(ref) + '"}&rows=99999');
	}

	// Récupère un produit selon sa désignation
	getProductByDes(des: string) {
		// Pour échapper caractères dans l'url
		let str = JSON.stringify(String(des));
		str = str.substring(1, str.length - 1);
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":-1,"name__exact":"' + encodeURI(str) + '"}&rows=99999');
	}

	// Ajoute une entrée suivie en stock
	addStockEntry(entry) {
		entry.id = Date.now(); // Permet id unique

		// on récupère le header à envoyer
		// const requestOptions = this.authService.addAuthorizationHeader(token);

		return this.http.post(this.BASE_URL + '/api/stock-entries', entry)
			.map(res => {
				console.log(res);
				this.stockEntrySubject.next(entry);
			});
	}

	// Ajoute une entrée non-suivie en stock
	addFreeEntry(entry) {
		entry.id = Date.now(); // Permet id unique

		// on récupère le header à envoyer
		// const requestOptions = this.authService.addAuthorizationHeader(token);

		return this.http.post(this.BASE_URL + '/api/free-entries', entry)
			.map(res => {
				console.log(res);
				this.freeEntrySubject.next(entry);
			});
	}

	// Edite une entrée
	editEntry(entry) {
		this.editEntrySubject.next(entry);
	}

}
