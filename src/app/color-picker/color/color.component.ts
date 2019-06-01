import {Component, ElementRef, Input} from '@angular/core';
import {FocusableOption} from '@angular/cdk/a11y';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements FocusableOption {
  @Input() color: string;
  @Input() isSelected = false;

  constructor (private elementRef: ElementRef) {}

  focus () {
    this.elementRef.nativeElement.focus();
  }
}
