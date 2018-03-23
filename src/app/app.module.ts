import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from "./app-routing/app-routing.module";
import { MaterialModule } from "./material/material.module";
import { HomeEntryComponent } from './home-entry/home-entry.component';
import { StockFormEntryComponent } from './stock-form-entry/stock-form-entry.component';
import { FreeFormEntryComponent } from './free-form-entry/free-form-entry.component';
import { StockTableEntryComponent } from './stock-table-entry/stock-table-entry.component';
import { SearchEntryComponent } from './search-entry/search-entry.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { FormEntryService } from "./services/form-entry.service";
import { TableEntryService } from "./services/table-entry.service";
import { FocusDirective } from './directives/focus.directive';
import { RefValidatorDirective } from "./validators/ref-validator";
import { DesValidatorDirective } from "./validators/des-validator";
import { LocValidatorDirective } from "./validators/loc-validator";
import { FreeTableEntryComponent } from './free-table-entry/free-table-entry.component';
import { FormatedDatePipe } from './pipes/formated-date.pipe';

@NgModule({
	declarations: [
		AppComponent,
		StockFormEntryComponent,
		StockTableEntryComponent,
		SearchEntryComponent,
		SearchResultComponent,
		FocusDirective,
		RefValidatorDirective,
		DesValidatorDirective,
		LocValidatorDirective,
		FreeFormEntryComponent,
		HomeEntryComponent,
		FreeTableEntryComponent,
		FormatedDatePipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,		
		MDBBootstrapModule.forRoot(),
		AppRoutingModule,
		MaterialModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule
	],
	schemas: [ NO_ERRORS_SCHEMA ],
	providers: [ FormEntryService, TableEntryService ],
	bootstrap: [ AppComponent ] 
})
export class AppModule { }
