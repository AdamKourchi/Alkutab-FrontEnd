import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabulator-table',
  template: `<div #tabulatorContainer></div>`,
  styleUrls: ['./tabulator-table.component.scss'],
})
export class TabulatorTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tabulatorContainer', { static: true }) container!: ElementRef;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() options: any = {}; // Optional: for advanced configs

  @Output() cellEdited = new EventEmitter<any>();

  private tabulator!: Tabulator;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tabulator = new Tabulator(this.container.nativeElement, {
      data: this.data,
      placeholder: 'لا توجد بيانات متاحة',
      columns: this.columns,
      layout: 'fitColumns',
      textDirection: 'rtl',
      locale: 'ar',
      langs: {
        ar: {
          pagination: {
            first: 'الأول',
            first_title: 'الصفحة الأولى',
            last: 'الأخير',
            last_title: 'الصفحة الأخيرة',
            prev: 'السابق',
            prev_title: 'الصفحة السابقة',
            next: 'التالي',
            next_title: 'الصفحة التالية',
          },
        },
      },
      responsiveLayout: 'collapse',
      ...this.options,
    });

      this.tabulator.on('cellEdited', (cell: any) => {
      this.cellEdited.emit(cell);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detect changes to the `data` input
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateData(changes['data'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.tabulator?.destroy();
  }

  // Optional method for updating data dynamically
  updateData(newData: any[]) {
    this.tabulator.replaceData(newData);
  }

  redraw() {
    this.tabulator.redraw();
  }

  setData(newData: any[]) {
    this.tabulator.setData(newData);
  }
  setPage(pageNumber: number) {
    this.tabulator.setPage(pageNumber);
  }
}
