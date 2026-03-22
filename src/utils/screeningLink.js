const createFallbackScreeningUrl = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return new URL("/pre-screening", window.location.origin).toString();
  }

  return "http://localhost:5173/pre-screening";
};

const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};

export const buildScreeningLink = ({
  screeningUrl,
  applicationId,
  email,
  applicantName,
}) => {
  const targetUrl = screeningUrl || createFallbackScreeningUrl();
  const sessionId = applicationId || createSessionId();

  try {
    const url = new URL(targetUrl);
    url.searchParams.set("session", sessionId);
    if (applicationId) url.searchParams.set("applicationId", applicationId);
    if (email) url.searchParams.set("email", email);
    if (applicantName) url.searchParams.set("name", applicantName);
    return url.toString();
  } catch (error) {
    console.error("Failed to build screening link.", error);
    return targetUrl;
  }
};
