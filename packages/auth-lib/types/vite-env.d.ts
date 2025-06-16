interface ImportMeta {
  readonly hot?: {
    accept: (deps?: string | string[], callback?: () => void) => void
    dispose: (callback: (data: any) => void) => void
  }
}
