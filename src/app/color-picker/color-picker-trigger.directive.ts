import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ViewContainerRef
} from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { take } from 'rxjs/operators';
import { Directionality } from '@angular/cdk/bidi';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[color-picker-trigger]',
  exportAs: 'colorPickerTrigger'
})
export class ColorPickerTriggerDirective {
  private _overlayRef: OverlayRef;

  @Input('color-picker-trigger') colorPicker: ColorPickerComponent;

  constructor(
    public overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private dir: Directionality
  ) {}

  private init(): void {
    const overlayConfig: OverlayConfig = new OverlayConfig(<OverlayConfig>{
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      direction: this.dir.value
    });

    overlayConfig.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);
    overlayConfig.scrollStrategy = this.overlay.scrollStrategies.block();

    this._overlayRef = this.overlay.create(overlayConfig);

    this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  @HostListener('click')
  click(): void {
    if (!this.colorPicker || this.colorPicker.disabled) {
      return;
    }
    if (!this._overlayRef) {
      this.init();
    }

    this.colorPicker.valueChange
      .pipe(take(1))
      .subscribe(() => this._overlayRef.detach());

    this._overlayRef.detach();
    const picker = new TemplatePortal(
      this.colorPicker.template,
      this.viewContainerRef
    );
    this._overlayRef.attach(picker);
  }
}
