import { getKV } from "../utils/kv.ts";
import type { FreshLink, FreshLinkVisit } from "../types/link.ts";

const MAX_LAST_VISITS = 1000;

export type CreateLinkOptions = {
  url: string;
  createdBy: string;
};

export async function createLink({ url, createdBy }: CreateLinkOptions) {
  const kv = await getKV();
  const linkId = crypto.randomUUID();

  const link: FreshLink = {
    id: linkId,
    url,
    createdBy,
    visits: [],
    totalVisits: 0,
    createdAt: new Date().toISOString(),
  };
  const res = await kv.atomic()
    .set(["user_by_link", linkId], createdBy)
    .set(["links", createdBy, linkId], link)
    .commit();
  if (!res.ok) {
    throw new TypeError("Something went wrong");
  }

  return linkId;
}

export async function getUserLinks({ userId }: { userId: string }) {
  const kv = await getKV();
  const userLinksIterator = await kv.list<FreshLink>({
    prefix: ["links", userId],
  });
  const userLinks: FreshLink[] = [];
  for await (const { value } of userLinksIterator) {
    userLinks.push(value);
  }

  return userLinks.toSorted((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export type GetLinkOptions = {
  linkId: string;
  visit?: FreshLinkVisit;
};

export async function getLink({ linkId, visit }: GetLinkOptions) {
  const kv = await getKV();
  const userId = await kv.get<string>(["user_by_link", linkId]);

  if (!userId.value) throw new Error("Invalid link");

  const { value: link } = await kv.get<FreshLink>([
    "links",
    userId.value,
    linkId,
  ]);

  if (!link) throw new Error("Invalid link");

  if (visit) {
    return updateLinkVisits({ link, visit });
  }

  return link;
}

export type UpdateLinkVisitsOptions = {
  link: FreshLink;
  visit: FreshLinkVisit;
};

export async function updateLinkVisits(
  { link, visit }: UpdateLinkVisitsOptions,
) {
  const kv = await getKV();
  const newVisits = link.visits.slice();
  newVisits.unshift({
    ...visit,
    visitedAt: new Date().toISOString(),
  });

  const linkWithVisits = {
    ...link,
    visits: newVisits.slice(0, MAX_LAST_VISITS),
    totalVisits: (link.totalVisits ?? 0) + 1,
  };

  await kv.set(["links", link.createdBy, link.id], linkWithVisits);

  return linkWithVisits;
}
