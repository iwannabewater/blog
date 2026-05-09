const rawBase = import.meta.env.BASE_URL;

export const siteBase = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");

export function withBase(path: string) {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("mailto:")) {
    return path;
  }

  if (path.startsWith("#")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!siteBase) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? `${siteBase}/`
    : `${siteBase}${normalizedPath}`;
}

export function withoutBase(pathname: string) {
  if (!siteBase) {
    return pathname;
  }

  if (pathname === siteBase) {
    return "/";
  }

  if (pathname.startsWith(`${siteBase}/`)) {
    return pathname.slice(siteBase.length) || "/";
  }

  return pathname;
}

export function trimLeadingSlash(path: string) {
  return path.replace(/^\/+/, "");
}
