import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

import { Entry } from "../../entry";
import { TableEntryService } from "../services/table-entry.service";
import { FormEntryService } from "../services/form-entry.service";

@Component({
	selector: 'app-stock-table-entry',
	templateUrl: './stock-table-entry.component.html',
	styleUrls: ['./stock-table-entry.component.scss']
})
export class StockTableEntryComponent implements OnInit {

	@ViewChild(MatPaginator)
		paginator: MatPaginator;
	
	@ViewChild(MatSort)
		sort: MatSort;

	stockEntries = []; // Contient les entrées initiales
	error        = "";

	// paramètres du tableau
	displayedColumns = ['location', 'reference', 'designation', 'quantity', 'status', 'commentary', 'date_entry'];
	dataSource: MatTableDataSource<any>;
	selection = new SelectionModel<any>(false, []);

	constructor(private tableEntryService: TableEntryService, private formEntryService: FormEntryService) {
	}

	ngOnInit() {
		// On récupère les entrées existantes
		this.tableEntryService.getStockEntries()
			.subscribe(
				data => {
					this.stockEntries = data;
					this.dataSource.data = data;
					console.log('Entrées stock existantes', this.dataSource.data);
				},
				error => {
					console.error();
					this.error = error;
				}
			);
		
		// On crée notre instance de MatTableDatasource
		this.dataSource = new MatTableDataSource(this.stockEntries);
		
		// On s'abonne au subject qui pousse un ajout d'entrée via formulaire
		this.formEntryService.stockAddSubject.subscribe(data => {
			console.log('Entrée stock ajoutée', data);
			this.dataSource.data = [data, ...this.dataSource.data];
			console.log('Entrées stock existantes', this.dataSource.data);
		});

		// On s'abonne pour l'édition d'une entrée
		this.formEntryService.stockEditSubject.subscribe(data => {
			console.log('Entrée stock modifiée', data);
			// let entryIndex = this.dataSource.data.findIndex(item => item.id == (data as Entry).id);
			// this.dataSource.data[entryIndex] = data;
			// this.dataSource.data = this.dataSource.data;
			this.tableEntryService.getStockEntries().subscribe(
				data => {
					this.stockEntries = data;
					this.dataSource.data = data;
					console.log('Entrées stock existantes', this.dataSource.data);
				}
			);
		});

		// On s'abonne pour la suppression d'une entrée
		this.formEntryService.stockDeleteSubject.subscribe(data => {
			console.log('Entrée stock supprimée', data);
			// let entryIndex = this.dataSource.data.findIndex(item => item.id == (data as Entry).id);
			// this.dataSource.data.splice(this.dataSource.data[entryIndex], 1);
			// this.dataSource.data = this.dataSource.data;
			this.tableEntryService.getStockEntries().subscribe(
				data => {
					this.stockEntries = data;
					this.dataSource.data = data;
					console.log('Entrées stock existantes', this.dataSource.data);
				}
			);
		});
		
		// Si l'utilisateur change l'ordre d'une colomne, revient à la 1ère page
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	}
	
	ngAfterViewInit() {
		// Pagination + ordre sortie colomnes
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	// Méthode pour implémenter filtre du tableau
	applyFilter(filterValue: string): void {
		filterValue = filterValue.trim();
		filterValue = filterValue.toLowerCase();
		this.dataSource.filter = filterValue;
	}

	// Méthode pour édition entrée
	toggleToEditMode(entry) {
		this.selection.toggle(entry);
		this.tableEntryService.editStockEntry(entry);
	}
	
}
