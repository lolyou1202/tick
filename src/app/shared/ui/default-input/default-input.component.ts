import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal
} from '@angular/core'
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-default-input',
  templateUrl: './default-input.component.html',
  styleUrl: './default-input.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DefaultInputComponent implements FormValueControl<string> {
  public type = input<'text' | 'email' | 'password'>('text')
  public variant = input<'outlined' | 'filled'>('outlined')
  public size = input<'sm' | 'md' | 'lg'>('md')
  public placeholder = input<string>()
  public clearable = input<boolean>()
  public leftSectionIconName = input<string>()
  public rightSectionIconName = input<string>()
  public leftSectionDisabled = input<boolean>()
  public rightSectionDisabled = input<boolean>()

  public value = model<string>('')
  public touched = model<boolean>(false)
  public dirty = input<boolean>(false)
  public disabled = input<boolean>(false)
  public readonly = input<boolean>(false)
  public invalid = input<boolean>(false)
  public errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])

  public focused = output<void>()
  public blurred = output<void>()
  public leftSectionClick = output<PointerEvent>()
  public rightSectionClick = output<PointerEvent>()

  protected isFocused = signal<boolean>(false)

  protected readonly showClearButton = computed(
    () =>
      this.clearable() && this.isFocused() && !this.disabled() && !!this.value()
  )

  protected errorMessages = computed(() =>
    this.errors()
      .map(error => error.message)
      .filter((msg): msg is string => !!msg)
  )

  protected onInput(value: string): void {
    if (this.disabled()) {
      this.value.set(this.value())
    }
    this.value.set(value)
    this.touched.set(true)
  }

  protected onBlur(): void {
    if (this.disabled()) return
    this.isFocused.set(false)
    this.blurred.emit()
    this.touched.set(true)
  }

  protected onFocus(): void {
    if (this.disabled()) return
    this.isFocused.set(true)
  }

  protected onClear(): void {
    if (this.disabled()) return
    this.value.set('')
  }

  protected onLeftSectionClick(event: PointerEvent): void {
    event.stopPropagation()
    if (!this.disabled()) {
      this.leftSectionClick.emit(event)
    }
  }

  protected onRightSectionClick(event: PointerEvent): void {
    event.stopPropagation()
    if (!this.disabled()) {
      this.rightSectionClick.emit(event)
    }
  }
}
