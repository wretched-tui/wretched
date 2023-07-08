declare const base: unique symbol
export type Opaque<BaseType> = {
  readonly [base]: BaseType
}
