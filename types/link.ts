export type FreshLinkVisit = {
  ip: string;
  userAgent: string;
  country: string;
  referer?: string;
  visitedAt?: string;
};

export type FreshLink = {
  id: string;
  url: string;
  createdBy: string;
  createdAt: string;
  visits: FreshLinkVisit[];
  totalVisits: number;
};
