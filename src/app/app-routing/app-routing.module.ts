import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeEntryComponent } from "../home-entry/home-entry.component";

const routes: Routes = [
	{ path: '', redirectTo: 'home-entry', pathMatch: 'full' },
	{ path: '**', component: HomeEntryComponent }
	// { path: 'stock-entry/:id', component: HomeEntryComponent }
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})

export class AppRoutingModule { }
