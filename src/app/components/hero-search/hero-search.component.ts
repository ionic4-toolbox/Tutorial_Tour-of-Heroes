import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from 'src/app/models/hero';
import { HeroService } from 'src/app/services/hero/hero.service';

@Component({
	selector: 'app-hero-search',
	templateUrl: './hero-search.component.html',
	styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
	private MODULE ="HeroSearchComponent";

	heroes$: Observable<Hero[]>;

	private searchTerms = new Subject<string>();

	constructor(private heroService: HeroService) {
		console.log(this.MODULE + '::constructor | ');
	}

	// Push a search term into the observable stream.
	search(term: string): void {
		console.log(this.MODULE + '::search | ');

		this.searchTerms.next(term);
	}

	ngOnInit(): void {
		console.log(this.MODULE + '::ngOnInit | ');

		this.heroes$ = this.searchTerms.pipe(
			// wait 300ms after each keystroke before considering the term
			debounceTime(300),

			// ignore new term if same as previous term
			distinctUntilChanged(),

			// switch to new search observable each time the term changes
			switchMap((term: string) => this.heroService.searchHeroes(term)),
		);
	}
}