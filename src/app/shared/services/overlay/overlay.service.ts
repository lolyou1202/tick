import {
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  inject
} from '@angular/core'
import {
  Overlay as CdkOverlay,
  OverlayRef as CdkOverlayRef,
  OverlayPositionBuilder
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Subject } from 'rxjs'
import {
  OverlayConfig,
  OverlayDefaultConfig,
  OverlayRef
} from './overlay.model'
import { OVERLAY_REF } from './overlay.tokens'
import { clsx } from 'clsx'
import { ComponentInputValues } from '../../utils/models/input-value.type'
import { DEFAULT_OVERLAY_ANIMATION_DELAY } from '../../../constants/overlay.constants'
import { OverlayPositionService } from './overlay-position.service'

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly _cdkOverlay = inject(CdkOverlay)
  private readonly _injector = inject(EnvironmentInjector)
  private readonly _positionService = inject(OverlayPositionService)

  private _stack: {
    id: string
    ref: OverlayRef
  }[] = []

  public create<C>({
    component,
    config,
    componentInputs
  }: {
    component: Type<C>
    componentInputs?: ComponentInputValues<C>
    config: OverlayConfig
  }): OverlayRef {
    const id = `overlay_${Math.random()}`
    const buildingConfig = this._buildDefaultConfig(config)
    const cdkRef = this._cdkOverlay.create(buildingConfig)
    this._applySizeToOverlay(cdkRef, buildingConfig)
    const overlayRef = this._createOverlayRef(cdkRef, buildingConfig)

    const injector = Injector.create({
      providers: [{ provide: OVERLAY_REF, useValue: overlayRef }],
      parent: this._injector
    })

    const portal = new ComponentPortal(component, null, injector)
    const componentRef = cdkRef.attach(portal)

    this._applyAnimation(cdkRef, buildingConfig, 'opening')

    if (componentInputs) {
      Object.entries(componentInputs).forEach(([key, value]) => {
        componentRef.setInput(key, value)
      })
    }

    this._applyAutoFocus(cdkRef, buildingConfig)

    this._stack.push({
      id,
      ref: overlayRef
    })

    this._setupAutoClose(cdkRef, buildingConfig, overlayRef.close)

    overlayRef.closed.subscribe(() => this._removeFromStack(id))

    return overlayRef
  }

  public position(): OverlayPositionBuilder {
    return this._cdkOverlay.position()
  }

  public closeAll(): void {
    ;[...this._stack].reverse().forEach(el => el.ref.close())
  }

  private _removeFromStack(id: string): void {
    this._stack = this._stack.filter(el => el.id !== id)
  }

  private _createOverlayRef(
    cdkRef: CdkOverlayRef,
    config: OverlayDefaultConfig
  ): OverlayRef {
    const afterClosed$ = new Subject<void>()

    let isClosing = false
    let isDisposed = false

    const finishClose = (): void => {
      if (isDisposed) return
      isDisposed = true
      afterClosed$.next()
      afterClosed$.complete()
      cdkRef.dispose()
    }

    const close = (): void => {
      if (isClosing || isDisposed) return
      isClosing = true

      this._applyAnimation(cdkRef, config, 'closing', finishClose)
    }

    return {
      closed: afterClosed$.asObservable(),
      close,
      updatePosition: cdkRef.updatePosition,
      config
    }
  }

  private _setupAutoClose(
    cdkRef: CdkOverlayRef,
    config: OverlayDefaultConfig,
    closeFn: () => void
  ): void {
    if (config.closeOnBackdropClick) {
      cdkRef.backdropClick().subscribe(() => {
        closeFn()
      })
    }

    if (config.closeOnEsc) {
      cdkRef.keydownEvents().subscribe(event => {
        if (event.code === 'Escape') {
          closeFn()
        }
      })
    }
  }

  private _applyAutoFocus(
    cdkRef: CdkOverlayRef,
    config: OverlayDefaultConfig
  ): void {
    if (!config.autoFocus) return

    const overlayElement = cdkRef.overlayElement

    if (!overlayElement.hasAttribute('tabindex')) {
      overlayElement.setAttribute('tabindex', '-1')
    }

    setTimeout(() => overlayElement.focus(), config.animationDuration)
  }

  private _buildDefaultConfig(config: OverlayConfig): OverlayDefaultConfig {
    const defaults = {
      scrollStrategy: this._cdkOverlay.scrollStrategies.block(),
      autoFocus: true,
      disableAnimation: false,
      animationDuration: DEFAULT_OVERLAY_ANIMATION_DELAY,
      hasBackdrop: true,
      darkBackdrop: false,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      panelClass: 'overlay-panel',
      backdropClass: 'overlay-backdrop'
    }

    return {
      ...defaults,
      positionStrategy: this._positionService.buildStrategy({
        positionStrategy: config.positionStrategy,
        customPositionStrategy: config.customPositionStrategy
      }),
      animationDuration: config.disableAnimation
        ? 0
        : (config.animationDuration ?? defaults.animationDuration),
      backdropClass: clsx(
        defaults.backdropClass,
        config.darkBackdrop && 'overlay-backdrop-dark',
        config.backdropClass
      ).split(' '),
      panelClass: clsx(defaults.panelClass, config.panelClass).split(' ')
    }
  }

  private _applySizeToOverlay(
    cdkRef: CdkOverlayRef,
    config: OverlayDefaultConfig
  ): void {
    const el = cdkRef.overlayElement
    if (config.width) el.style.width = config.width
    if (config.height) el.style.height = config.height
    if (config.minWidth) el.style.minWidth = config.minWidth
    if (config.minHeight) el.style.minHeight = config.minHeight
    if (config.maxWidth) el.style.maxWidth = config.maxWidth
    if (config.maxHeight) el.style.maxHeight = config.maxHeight
  }

  private _applyAnimation(
    cdkRef: CdkOverlayRef,
    config: OverlayDefaultConfig,
    phase: 'opening' | 'closing',
    onDone?: () => void
  ): void {
    if (config.disableAnimation) {
      onDone?.()
      return
    }

    const { overlayElement, backdropElement } = cdkRef

    const animationClass =
      phase === 'opening' ? 'overlay-opening' : 'overlay-closing'
    const duration = config.animationDuration

    overlayElement.style.animationDuration = `${duration}ms`
    if (backdropElement) {
      backdropElement.style.animationDuration = `${duration}ms`
    }
    overlayElement.classList.add(animationClass)
    backdropElement?.classList.add(animationClass)

    const finish = (): void => {
      overlayElement.classList.remove(animationClass)
      backdropElement?.classList.remove(animationClass)
      overlayElement.style.animationDuration = ''
      if (backdropElement) {
        backdropElement.style.animationDuration = ''
      }
      onDone?.()
    }

    //overlayElement.addEventListener('animationend', finish, { once: true })
    //backdropElement?.addEventListener('animationend', finish, { once: true })
    setTimeout(finish, duration + 10)
  }
}
