import { URL } from "url";

export function buildUrl(
  host: string,
  pathname: string,
  params: { [x: string]: string }
): URL {
  function fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  const url = new URL(host);
  const search = Object.entries(params)
    .map(
      ([key, value]) =>
        `${fixedEncodeURIComponent(key)}=${fixedEncodeURIComponent(value)}`
    )
    .join("&");
  url.pathname = pathname;
  url.search = search;
  return url;
}
