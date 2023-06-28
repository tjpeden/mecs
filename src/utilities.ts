export type Class<T> = Function & {
  new (...args: any[]): T
}

export const ID = () => Math.random().toString(36).slice(2)
