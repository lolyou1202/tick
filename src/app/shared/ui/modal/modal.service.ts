import { inject, Injectable, TemplateRef, Type } from '@angular/core'
import { OverlayService } from '../../services/overlay/overlay.service'
import { ComponentInputValues } from '../../utils/models/input-value.type'
import { ModalConfig } from './modal.model'
import { OverlayRef } from '../../services/overlay/overlay.model'
import { ModalContainerComponent } from './modal-container/modal-container.component'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _overlayService = inject(OverlayService)

  public open<C>(
    options:
      | {
          component: Type<C>
          componentInputs?: ComponentInputValues<C>
          config: ModalConfig
        }
      | {
          template: TemplateRef<C>
          config: ModalConfig
        }
  ): OverlayRef {
    const overlayConfig: ModalConfig = {
      ...options.config,
      panelClass: 'modal-panel',
    }

    if ('template' in options) {
      const { template } = options

      return this._overlayService.create({
        component: ModalContainerComponent,
        componentInputs: {
          contentTemplate: template
        },
        config: overlayConfig
      })
    }

    if ('component' in options) {
      const { component, componentInputs } = options

      return this._overlayService.create({
        component: ModalContainerComponent,
        componentInputs: {
          contentComponent: component,
          contentComponentInputs: componentInputs
        },
        config: overlayConfig
      })
    }

    throw new Error('Необходимо предоставить либо компонент, либо шаблон')
  }
}
