import { Component } from '@angular/core';
import { of, throwError, timer } from 'rxjs';
import { catchError, delay, retry, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  result: string | null = null;
  error: string | null = null;
  loading: boolean = false;

  makeRequest() {
    this.loading = true;
    this.result = null;
    this.error = null;

    // Simulate an HTTP request
    of(null)
      .pipe(
        // Simulate network latency
        delay(1000),
        // Randomly succeed or fail the request
        switchMap(() =>
          Math.random() > 0.5
            ? of('Request succeeded!').pipe(tap(() => console.log('Request succeeded!')))
            : throwError(() => new Error('Request failed!')).pipe(tap(() => console.log('Request failed!')))
        ),
        tap(() => console.log('Initial request made')),
        retry(2), // Retry up to 2 times
        catchError((error) => {
          console.log('Handling error:', error.message);
          this.error = 'Final error after retries: ' + error.message;
          return of('Fallback response');
        }),
        tap(() => console.log('Processing complete'))
      )
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
      });
  }
}
