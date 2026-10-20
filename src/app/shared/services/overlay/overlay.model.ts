import { PositionStrategy, ScrollStrategy, ViewportMargin } from '@angular/cdk/overlay'
import { Observable } from 'rxjs'

export interface OverlayRef {
  closed: Observable<void>
  close(): void
  updatePosition(): void
  config: OverlayConfig
}

export interface OverlayConfig extends Partial<OverlayDefaultConfig> {
	customPositionStrategy?: OverlayPositionStrategy
}

export interface OverlayDefaultConfig {
  positionStrategy: PositionStrategy
  scrollStrategy: ScrollStrategy
  autoFocus: boolean
  closeOnBackdropClick: boolean
  animationDuration: number
  disableAnimation: boolean
  closeOnEsc: boolean
  hasBackdrop: boolean
  darkBackdrop: boolean
  width?: string
  height?: string
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  maxHeight?: string
  backdropClass: string | string[]
  panelClass: string | string[]
}

export interface OverlayPositionStrategy {
  /** Элемент, к которому привязывается панель */
  origin?: HTMLElement
  /** Позиции панели */
  position?: OverlayPosition
  /** Запасные позиции панели (fallback) */
  fallbackPositions?: OverlayPosition[]
  /** Сдвигать панель, чтобы она не выходила за экран */
  push?: boolean
  /** Отступ от края экрана */
  viewportMargin?: ViewportMargin
  /** Смещение по X (px) */
  offsetX?: number
  /** Смещение по Y (px) */
  offsetY?: number
}

/**
 * Предустановленные позиции оверлея относительно origin-элемента.
 *
 * Формат: `[сторона появления]-[выравнивание]`
 *
 * Сторона появления:
 * - 'top' — оверлей появляется над элементом
 * - 'bottom' — оверлей появляется под элементом
 * - 'left' — оверлей появляется слева от элемента
 * - 'right' — оверлей появляется справа от элемента
 *
 * Выравнивание относительно элемента:
 * - 'left' — прижимается к левому краю
 * - 'right' — прижимается к правому краю
 * - 'top' — прижимается к верхнему краю
 * - 'bottom' — прижимается к нижнему краю
 * - 'center' — центрируется
 */
export type OverlayPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'
