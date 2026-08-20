const SHOP_WEB_REPLACEMENT = "https://shop.ynxweb4.com/shop/";

export default function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).json({ error: "method not allowed" });
  }

  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Link", `<${SHOP_WEB_REPLACEMENT}>; rel="alternate"`);
  return response.status(410).json({
    code: "CLIENT_RETIRED",
    message: "YNX Shop for Android is retired and is no longer distributed.",
    replacementUrl: SHOP_WEB_REPLACEMENT,
    automaticRedirect: false
  });
}
