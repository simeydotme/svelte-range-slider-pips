export const waitTime = 400;
export const springSettleTime = 1200;

export const $ = (selector: string, root: Element | Document = document) =>
  root.querySelector(selector);
export const $$ = (selector: string, root: Element | Document = document) =>
  root.querySelectorAll(selector);
