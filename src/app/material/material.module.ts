import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
	imports: [
		CommonModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatToolbarModule,
		MatButtonModule,
		MatDialogModule,
		MatTooltipModule,
		MatPaginatorModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule
	],
	exports: [
		CommonModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatToolbarModule,
		MatButtonModule,
		MatDialogModule,
		MatTooltipModule,
		MatPaginatorModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule
	]
})
export class MaterialModule { }
