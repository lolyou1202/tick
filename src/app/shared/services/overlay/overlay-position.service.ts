import {
  Overlay as CdkOverlay,
  ConnectedPosition,
  PositionStrategy
} from '@angular/cdk/overlay'
import { inject, Injectable } from '@angular/core'
import { OverlayPosition, OverlayPositionStrategy } from './overlay.model'

@Injectable({ providedIn: 'root' })
export class OverlayPositionService {
  private readonly _cdkOverlay = inject(CdkOverlay)

  public buildStrategy(strategy: {
    positionStrategy?: PositionStrategy
    customPositionStrategy?: OverlayPositionStrategy
  }): PositionStrategy {
    const { positionStrategy, customPositionStrategy } = strategy

    if (positionStrategy) {
      return positionStrategy
    }

    if (customPositionStrategy) {
      if (!customPositionStrategy.origin || !customPositionStrategy.position) {
        throw new Error('customPositionStrategy requires origin and position')
      }

      const {
        origin,
        position,
        fallbackPositions,
        push,
        viewportMargin,
        offsetX,
        offsetY
      } = customPositionStrategy

      const positions = [this._getPositionPair(position, offsetX, offsetY)]

      if (fallbackPositions) {
        for (const fp of fallbackPositions) {
          positions.push(this._getPositionPair(fp, offsetX, offsetY))
        }
      }

      return this._cdkOverlay
        .position()
        .flexibleConnectedTo(origin)
        .withPositions(positions)
        .withFlexibleDimensions(false)
        .withPush(push)
        .withGrowAfterOpen(false)
        .withViewportMargin(viewportMargin ?? 0)
        .withLockedPosition(false)
    }

    return this._cdkOverlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically()
  }

  private _getPositionPair(
    position: OverlayPosition,
    offsetX = 0,
    offsetY = 0
  ): ConnectedPosition {
    switch (position) {
      case 'top-left':
        return {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX,
          offsetY
        }
      case 'top-right':
        return {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX,
          offsetY
        }
      case 'bottom-left':
        return {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX,
          offsetY
        }
      case 'bottom-right':
        return {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetX,
          offsetY
        }
      case 'top-center':
        return {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX,
          offsetY
        }
      case 'bottom-center':
        return {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX,
          offsetY
        }
      case 'left-top':
        return {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX,
          offsetY
        }
      case 'left-bottom':
        return {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX,
          offsetY
        }
      case 'right-top':
        return {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX,
          offsetY
        }
      case 'right-bottom':
        return {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',	
          offsetX,
          offsetY
        }
    }
  }
}
