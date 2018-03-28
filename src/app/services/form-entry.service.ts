import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class FormEntryService {

	products: any[]    = []; // récupère les produits de Scorre pour l'autocomplétion
	locations: any[]   = []; // récupère les emplacements
	stockAddSubject    = new Subject(); // pour communiquer avec le tableau d'entrées
	freeAddSubject     = new Subject();
	stockEditSubject   = new Subject(); // édition
	freeEditSubject    = new Subject();
	stockDeleteSubject = new Subject(); // suppression
	freeDeleteSubject  = new Subject();

	BASE_URL = 'http://localhost:4201';

	constructor(private http: Http) { }

	// Autocomplétion produits suivis en stock
	getTrackedProducts() {
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":-1}&rows=99999')
						.map(res => res.json());
						// .do(data => this.products = data);
	}

	// Autocomplétion produits non-suivis en stock
	getUntrackedProducts() {
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":0}&rows=99999')
						.map(res => res.json());
						// .do(data => this.products = data);
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
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":-1,"name__exact":"' + encodeURIComponent(this.escapeStr(des)) + '"}&rows=99999');
	}

	getProductByFreeDes(des: string) {
		return this.http.get('http://sccoreapi/v1/product/?filter={"is_stock_managed":0,"name__contains":"' + encodeURIComponent(this.escapeStr(des)) + '"}&rows=99999')
						.map(res => res.json());
	}

	// Pour échapper caractères dans l'url
	escapeStr(str) {
		let escapedStr = JSON.stringify(String(str));
		escapedStr = escapedStr.substring(1, escapedStr.length - 1);
		return escapedStr;
	}

	// Ajoute une entrée suivie en stock
	addStockEntry(entry) {
		entry.id = Date.now(); // Permet id unique

		// on récupère le header à envoyer
		// const requestOptions = this.authService.addAuthorizationHeader(token);

		return this.http.post(this.BASE_URL + '/api/add/stock-entries', entry)
						.map(res => {
							console.log('Entrée stock ajoutée côté serveur', res);
							this.stockAddSubject.next(entry);
						});
	}

	// Ajoute une entrée non-suivie en stock
	addFreeEntry(entry) {
		entry.id = Date.now(); // Permet id unique

		// on récupère le header à envoyer
		// const requestOptions = this.authService.addAuthorizationHeader(token);

		return this.http.post(this.BASE_URL + '/api/add/free-entries', entry)
						.map(res => {
							console.log('Entrée libre ajoutée côté serveur', res);
							this.freeAddSubject.next(entry);
						});
	}

	// Mise à jour entrée
	updateStockEntry(entry) {
		return this.http.post(this.BASE_URL + '/api/upd/stock-entries', entry)
						.map(res => {
							console.log('Entrée stock modifiée côté serveur', res);
							this.stockEditSubject.next(entry);
						});
	}

	updateFreeEntry(entry) {
		return this.http.post(this.BASE_URL + '/api/upd/free-entries', entry)
						.map(res => {
							console.log('Entrée non-suivie modifiée côté serveur', res);
							this.freeEditSubject.next(entry);
						});
	}

	// Suppression entrée
	deleteStockEntry(entry) {
		return this.http.post(this.BASE_URL + '/api/del/stock-entries', entry)
						.map(res => {
							console.log('Entrée stock supprimée côté serveur', res);
							this.stockDeleteSubject.next(entry);
						});
	}

	deleteFreeEntry(entry) {
		return this.http.post(this.BASE_URL + '/api/del/free-entries', entry)
						.map(res => {
							console.log('Entrée non-suivie supprimée côté serveur', res);
							this.freeDeleteSubject.next(entry);
						});
	}

}
