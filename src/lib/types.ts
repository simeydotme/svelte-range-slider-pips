export type NormalisedClient = { x: number; y: number };
export type Formatter = (value: number, index?: number, percent?: number) => string | number;
export type RangeFormatter = (
  value1: number,
  value2: number,
  percent1?: number,
  percent2?: number
) => string;
export type Pip = 'pip' | 'label' | boolean | undefined;
