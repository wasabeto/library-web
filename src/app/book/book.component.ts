import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, Subscription, of, merge, Observable } from 'rxjs';
import { startWith, switchMap, catchError, map, takeUntil } from 'rxjs/operators';
import { AuthData } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
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
  resultsLength = 0;
  loading = true;
  isRateLimitReached = false;
  userData: AuthData;
  private ngUnsubscribeAll = new Subject();
  private subscriptions: Subscription[] = new Array<Subscription>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _bookService: BookService, private _authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this._authService.currentUser.subscribe((authData: AuthData) => {
        this.userData = authData;
        if (this.userData.user) {
          this.displayedColumns = ['title', 'genre', 'author', 'published', 'actions'];
        }
      })
    );
  }

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
            .pipe(catchError(() => of({ count: 0, rows: [] })));
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

  addBook(row: Book): void {
    // Create this implementation
    // Add this book to the user collection
  }

  removeBook(row: Book): void {
    // Create this implementation
    // Delete this book from the library
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
