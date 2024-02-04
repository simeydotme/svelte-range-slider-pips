export type NormalisedClient = { x: number; y: number };
export type Formatter = (value: number, index?: number, percent?: number) => string | number;
export type Pip = 'pip' | 'label' | boolean | undefined;
