export async function getCountryByIP(ip: string) {
  const res = await fetch(`http://ip-api.com/json/${ip}`);

  if (!res.ok) {
    console.error(`Failed getting country by ip ${ip}`);
    return "Unknown";
  }

  const { country } = await res.json() as { country: string };

  return country;
}
