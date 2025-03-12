export const $ = (selector: string, root: Element | Document = document) =>
  root.querySelector(selector);
export const $$ = (selector: string, root: Element | Document = document) =>
  root.querySelectorAll(selector);
