import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subject, Subscription, of } from 'rxjs';
import { startWith, switchMap, catchError, map, takeUntil } from 'rxjs/operators';
import { Book } from './book.model';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy, AfterViewInit {

  books: Book[] = [];
  displayedColumns: string[] = ['title', 'genre', 'author', 'published'];
  subscriptions: Subscription[] = new Array<Subscription>();
  resultsLength = 0;
  loading = true;
  isRateLimitReached = false;
  private ngUnsubscribeAll = new Subject();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _bookService: BookService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.sort.sortChange
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._bookService
            .getBooks({ sort: `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}` })
            .pipe(catchError(() => of(null)));
        }),
        map((books) => {
          this.loading = false;
          return books;
        }),
        takeUntil(this.ngUnsubscribeAll)
      )
      .subscribe((books: any) => {
        this.books = books['rows'] || [];
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this._bookService.getBooks({ sort: `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}` })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribeAll.next();
    this.ngUnsubscribeAll.complete();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
