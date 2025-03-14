declare module 'feather-icons' {
  interface FeatherIcon {
    toSvg(): string;
  }

  interface FeatherIcons {
    [key: string]: FeatherIcon;
  }

  interface Feather {
    icons: FeatherIcons;
  }

  const feather: Feather;
  export default feather;
}
