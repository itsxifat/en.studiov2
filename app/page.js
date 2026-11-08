import StudioWebsitePage from "./components/StudioWebsitePage";
import { getFeaturedWork } from "./lib/getFeaturedWork";

// Static + ISR. Featured work is fetched once on the server, cached for 5 min,
// and invalidated from the admin routes via revalidateFeatured().
export const revalidate = 300;

export default async function Home() {
  const items = await getFeaturedWork().catch((e) => {
    console.error("featured-work", e);
    return [];
  });
  return <StudioWebsitePage items={items} />;
}
