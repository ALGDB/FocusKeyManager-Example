import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPickerTriggerDirective} from './color-picker/color-picker-trigger.directive';
import { ColorComponent } from './color-picker/color/color.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    ColorPickerTriggerDirective,
    ColorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OverlayModule,
    A11yModule,
    BidiModule
  ],
  providers: [],
  entryComponents: [
    ColorPickerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
