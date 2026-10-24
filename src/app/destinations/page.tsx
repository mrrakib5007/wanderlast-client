import DestinationExplorer from "@/components/destination-explorer";

export default async function Destinations() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/destination`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load destinations (HTTP ${response.status}).`);
  }

  const result = await response.json();
  const destinations = result?.data;

  if (!Array.isArray(destinations)) {
    throw new Error("The destinations API returned an invalid response.");
  }

  return <DestinationExplorer destinations={destinations} />;
}
