declare module "react-gtm-module" {
  export type DataLayer = Record<string, unknown>

  export interface InitializeArgs {
    gtmId: string
    dataLayer?: DataLayer
    dataLayerName?: string
    events?: Record<string, unknown>
    auth?: string
    preview?: string
  }

  export interface DataLayerArgs {
    dataLayer: DataLayer
    dataLayerName?: string
  }

  export interface GtmArgs {
    id: string
    dataLayer?: DataLayer
    dataLayerName?: string
    events?: Record<string, unknown>
    auth?: string
    preview?: string
  }

  export interface GtmElements {
    noScript: () => HTMLElement
    script: () => HTMLScriptElement
    dataScript: HTMLScriptElement
  }

  const TagManager: {
    dataScript(dataLayer: string): HTMLScriptElement
    gtm(args: GtmArgs): GtmElements
    initialize(args: InitializeArgs): void
    dataLayer(args: DataLayerArgs): number | void
  }

  export default TagManager
}
