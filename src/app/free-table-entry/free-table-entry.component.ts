import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

import { Entry } from "../../entry";
import { TableEntryService } from "../services/table-entry.service";
import { FormEntryService } from "../services/form-entry.service";

@Component({
	selector: 'app-free-table-entry',
	templateUrl: './free-table-entry.component.html',
	styleUrls: ['./free-table-entry.component.scss']
})
export class FreeTableEntryComponent implements OnInit {

	@ViewChild(MatPaginator)
	paginator: MatPaginator;

	@ViewChild(MatSort)
	sort: MatSort;

	freeEntries = []; // Contient les entrées initiales
	error = "";
	
	// paramètres du tableau
	displayedColumns = ['location', 'reference', 'designation', 'quantity', 'status', 'commentary', 'date_entry'];
	dataSource: MatTableDataSource<any>;
	selection = new SelectionModel<any>(false, []);


	constructor(private tableEntryService: TableEntryService, private formEntryService: FormEntryService) {
	}


	ngOnInit() {
		// On récupère les entrées existantes
		this.tableEntryService.getFreeEntries()
			.subscribe(
				data => {
					this.freeEntries = data;
					this.dataSource.data = data;
					console.log('Entrées non-suivies existantes', this.dataSource.data);
				},
				error => {
					console.error();
					this.error = error;
				}
			);
		
		// On crée notre instance de MatTableDatasource
		this.dataSource = new MatTableDataSource(this.freeEntries);

		// On s'abonne au subject qui pousse un ajout d'entrée via formulaire
		this.formEntryService.freeEntrySubject.subscribe(data => {
			console.log('Entrée non-suivie ajoutée', data);
			this.dataSource.data = [data, ...this.dataSource.data];
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
}
