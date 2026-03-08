export function getSectionTheme(pathname = "/") {
  if (pathname === "/") return "home";

  if (
    pathname === "/about" ||
    pathname === "/offices" ||
    pathname === "/phil-impact" ||
    pathname === "/internal-news" ||
    pathname === "/contact-us"
  ) {
    return "company";
  }

  if (pathname === "/ai-services" || pathname === "/ai-projects") {
    return "ai";
  }

  if (
    pathname === "/data-service" ||
    pathname === "/horizontal-llm-data" ||
    pathname === "/vertical-llm-data" ||
    pathname === "/aigc"
  ) {
    return "offer";
  }

  if (pathname === "/careers") return "careers";

  if (
    pathname === "/privacy-policy" ||
    pathname === "/cookie-policy" ||
    pathname === "/terms-conditions"
  ) {
    return "legal";
  }

  if (
    pathname === "/dashboard" ||
    pathname === "/get-started" ||
    pathname === "/sign-in"
  ) {
    return "utility";
  }

  return "default";
}

