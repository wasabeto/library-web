import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookResponse } from './book.model';

import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new BookService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method "getBooks"', () => {
    expect(service.getBooks).toBeTruthy();
  });

  it('method "getBooks" should return a valid value', (done: DoneFn) => {
    const expectedResponse: BookResponse = {
      count: 0,
      rows: [],
    };

    httpSpy.get.and.returnValue(of(expectedResponse));

    service.getBooks({}).subscribe((response: any) => {
      expect(response).toEqual(expectedResponse);
      done();
    }, done.fail);
    expect(httpSpy.get.calls.count()).toBe(1, 'one call allowed');
  });
});
