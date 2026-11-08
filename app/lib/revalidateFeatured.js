import { revalidateTag, revalidatePath } from 'next/cache';

// Call after any admin mutation that can change the featured set, a featured item's
// title/slug/thumbnail, or delete a featured item, so the home page (ISR, revalidate 300)
// and the 'featured-work' cache entry refresh on the next request.
export function revalidateFeatured() {
  revalidateTag('featured-work');
  revalidatePath('/');
}
