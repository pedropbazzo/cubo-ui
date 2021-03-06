import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeHtml } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * Component `<cb-upload-image>` to make a share action
 * @param label Set if bg is true or false
 * @param icon Set bg icon to preview
 * @param value Set image to preview
 * @param size Set size of preview
 * @param fit Change fit of image preview
 * @param type Set type style of preview
 * @param accept Set the accept formats
 * @param disabled Set true or false to disabled
 */
@Component({
  selector: 'cb-upload-image',
  template: `
    <div class="upload">
      <label class="upload__button" [ngClass]="{ 'upload__button--disabled': disabled }">
        <input class="upload__input" type="file" [accept]="accept" [disabled]="disabled" (change)="uploadImage($event)" #upload>
        {{ label }}
      </label>
    </div>
    <div class="preview" [style.height]="size + 'px'" [style.width]="_width" [style.border-radius]="_borderRadius" (click)="upload.click()">
      <span class="preview__icon" aria-hidden="true" [style.background-image]="_icon" *ngIf="!_value"></span>
      <img class="preview__image" [src]="_value" [style.object-fit]="fit" *ngIf="_value">
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbUploadImageComponent),
      multi: true
    }
  ],
  styleUrls: ['./cb-upload-image.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'cb-upload-image',
    '[class.upload-image--disabled]': 'disabled',
  }
})
export class CbUploadImageComponent implements ControlValueAccessor {
  _icon: SafeStyle;
  _value: SafeHtml;
  _borderRadius: string;
  _width: string;

  @Input() disabled = false;
  @Input() fit: 'contain' | 'cover' = 'contain';
  @Input() label = 'Upload image';
  @Input() size = 64;
  @Input() accept = '.png, .jpg, .jpeg, .gif';

  @Input() set value(value: string) {
    this._value = typeof value === 'string' && value.length > 0 ? this.sanitizer.bypassSecurityTrustResourceUrl(`${value}`) : '';
  }

  @Input() set icon(icon: string) {
    this._icon = this.sanitizer.bypassSecurityTrustStyle(`url(${icon})`);
  }

  @Input() set type(value: 'circle' | '') {
    if (value === 'circle') {
      this._borderRadius = '50%';
      this._width = `${this.size}px`;
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {}

  uploadImage(upload) {
    const file = upload.target.files[0];

    if (upload.target.files && file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this._value = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
        this.writeValue(file);
      };
    }
  }

  onChange = (value: string) => {};

  onTouched = () => {};

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    this.onChange(value);
    this.onTouched();
    this.ref.detectChanges();
  }
}
