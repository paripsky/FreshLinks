export type GitHubUser = {
  id: string;
  name: string;
  login: string;
  email: string;
  avatar_url: string;
};

export async function getGitHubUser(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message);
  }

  return await res.json() as Promise<GitHubUser>;
}

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export async function getGitHubUserEmail(accessToken: string) {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message);
  }

  const emails = await res.json() as GitHubEmail[];
  const primaryEmail = emails.find(({ primary }) => primary)?.email ??
    emails.at(0)?.email;

  if (!primaryEmail) {
    throw new Error("Could not get github email");
  }

  return primaryEmail;
}
