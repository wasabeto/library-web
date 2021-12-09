import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, Subscription, of, merge } from 'rxjs';
import { startWith, switchMap, catchError, map, takeUntil } from 'rxjs/operators';
import { Book } from './book.model';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = 'Books';
  books: Book[] = [];
  displayedColumns: string[] = ['title', 'genre', 'author', 'published'];
  subscriptions: Subscription[] = new Array<Subscription>();
  resultsLength = 0;
  loading = true;
  isRateLimitReached = false;
  private ngUnsubscribeAll = new Subject();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _bookService: BookService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._bookService
            .getBooks({
              page: this.paginator.pageIndex + 1,
              limit: this.paginator.pageSize,
              sort: `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`,
            })
            .pipe(catchError(() => of(null)));
        }),
        map((books: any) => {
          this.loading = false;
          this.isRateLimitReached = books['rows'] === [];
          this.resultsLength = books['count'];
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
    // Create this implementation
  }

  ngOnDestroy(): void {
    this.ngUnsubscribeAll.next();
    this.ngUnsubscribeAll.complete();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
