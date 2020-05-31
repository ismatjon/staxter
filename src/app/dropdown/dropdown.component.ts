import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() labelText: string;
  @Input() optionLabel: string;
  @Input() options: any[];
  @Input() value: any;

  @Output() changed = new EventEmitter();

  onChange(event) {
    this.changed.emit(event.value);
  }
}
