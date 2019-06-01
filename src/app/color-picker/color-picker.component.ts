import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  HostBinding,
  OnDestroy,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { Directionality } from '@angular/cdk/bidi';
import { ColorComponent } from './color/color.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  animations: [
    trigger('picker', [
      state(
        'void',
        style({
          transform: 'scale(0)',
          opacity: 0
        })
      ),
      transition('void <=> *', [
        style({
          opacity: 1
        }),
        animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit, OnDestroy {
  static nextId = 0;
  @HostBinding() id = `hour-picker-${ColorPickerComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ViewChildren(ColorComponent) colorComponents: QueryList<ColorComponent>;
  private _value: string;
  private keyManager: FocusKeyManager<ColorComponent>;
  @Input() colors: string[] = [];
  @Input() rowSize = 4;
  public set value(color: string) {
    if (this.colors.length > 0) {
      this._value = this.colors.find((value: string) => color === value) || '';
    } else {
      this._value = color;
    }

    this.onChanged(this._value);
    this.valueChange.emit(this._value);
  }
  public get value(): string {
    return this._value;
  }

  public groupedColors: string[][];

  public controlType = 'hour-picker';
  public autofilled = false;
  public disabled = false;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  public onChanged: any = () => {};
  public onTouched: any = () => {};

  constructor(private dir: Directionality) {}

  writeValue(color: string): void {
    if (this.disabled) {
      return;
    }
    this.select(color);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {}

  select(color: string): void {
    this.value = color;
    this.onTouched();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colors) {
      this.groupedColors = this.colors
        .map((_, i) =>
          !(i % this.rowSize) ? this.colors.slice(i, i + this.rowSize) : null
        )
        .filter(Boolean);
    }

    this.setActiveItem(this.value);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')
    this.keyManager = new FocusKeyManager(this.colorComponents)
      .withHorizontalOrientation(this.dir.value)
      .withVerticalOrientation(false);

    this.setActiveItem(this.value);

    console.log(this.colorComponents);
    this.colorComponents.changes.subscribe((ch) => console.log('changes',ch));
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setActiveItem(color: string): void {
    if (color && this.keyManager) {
      this.keyManager.setActiveItem(this.colors.indexOf(color));
    }
  }

  onKeyDown(ev: KeyboardEvent): void {
    this.keyManager.onKeydown(ev);
  }

  onGridCellKeyDown(ev: KeyboardEvent, color: string): void {
      console.log(this.colorComponents);
    if (
      // tslint:disable-next-line: deprecation
      ev.keyCode === ENTER ||
      // tslint:disable-next-line: deprecation
      ev.keyCode === SPACE ||
      // tslint:disable-next-line: deprecation
      (ev.which === ENTER || ev.which === SPACE) ||
      (ev.key === 'Enter' || ev.key === ' ')
    ) {
      ev.preventDefault();
      this.select(color);
    }

    if (
      // tslint:disable-next-line: deprecation
      ev.keyCode === UP_ARROW ||
      // tslint:disable-next-line: deprecation
      ev.which === UP_ARROW ||
      ev.key === 'ArrowUp'
    ) {


      const index = this.keyManager.activeItemIndex - this.rowSize;
      this.keyManager.setActiveItem(
        index >= 0 ? index : this.keyManager.activeItemIndex
      );
    }

    if (
      // tslint:disable-next-line: deprecation
      ev.keyCode === DOWN_ARROW ||
      // tslint:disable-next-line: deprecation
      ev.which === DOWN_ARROW ||
      ev.key === 'ArrowDown'
    ) {
      const index = this.keyManager.activeItemIndex + this.rowSize;

      this.keyManager.setActiveItem(
        index < this.colors.length ? index : this.keyManager.activeItemIndex
      );
    }
  }
  ngOnDestroy(): void {
    console.log('DESTROYED')
  }
}
