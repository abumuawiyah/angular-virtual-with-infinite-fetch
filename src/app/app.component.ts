import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  name = 'CDK Virtual Scroll Infinite Loop';

  arr = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);

  offset = new BehaviorSubject<any>({ offset: 0 });
  infinite: Observable<any[]>;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor() {
    this.infinite = this.offset.pipe(
      map((n: any) => this.getBatch(n)),
    );
  }

  getBatch({ offset, loadPrev, loadNext, e }) {
    let arr = [...this.arr];
    if (loadPrev) {
      const last = arr[arr.length - 1];
      return [last, ...arr];
    }
    if (loadNext) {
      const first = arr[0];
      return [...arr, first];
    }
    return arr;
  }

  nextBatch(e, offset) {
    const end = this.viewPort.getRenderedRange().end;
    const start = this.viewPort.getRenderedRange().start;
    const total = this.viewPort.getDataLength();

    console.log(`e: ${e}, start: ${start}, end: ${end}, total: ${total}, offset: ${offset}`);
    if (start === 0) {
      this.offset.next({ offset: offset, loadPrev: true, e });
      console.log(`[Prepend] ${start} === 0`);
    }

    if (end === total) {
      this.offset.next({ offset: offset, loadNext: true, e });
      console.log(`[Next] ${end} === ${total}`);
    }
  }

  trackByIdx(i) {
    return i;
  }
}
