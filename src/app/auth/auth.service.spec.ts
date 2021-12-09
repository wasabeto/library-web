import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthData } from './auth.model';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new AuthService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have methods "login/logout"', () => {
    expect(service.login).toBeTruthy();
    expect(service.logout).toBeTruthy();
  });

  it('method "login" should return a valid response', (done: DoneFn) => {
    const expectedResponse: AuthData = {
      token: 'avalidtoken',
      user: {
        id: 'An ID',
        name: 'A name',
        picture: 'A picture',
        email: 'A email',
        createdAt: 'A createdAt',
      },
    };

    httpSpy.post.and.returnValue(of(expectedResponse));

    service.login('a', 'b').subscribe((response: any) => {
      expect(response).toEqual(expectedResponse.user);
      done();
    }, done.fail);
    expect(httpSpy.post.calls.count()).toBe(1, 'one call allowed');
  });
});
