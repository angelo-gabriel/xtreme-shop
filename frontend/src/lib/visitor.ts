const VISITOR_STORAGE_KEY = "xtreme-shop-visitor-id";

export function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  }

  return visitorId;
}
