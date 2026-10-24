import { loadContent } from '@/data/content-repository';

/** Which Firestore publish this build came from; read by scripts/needs-deploy.mjs. */
export async function GET() {
  const { publishedAt } = await loadContent();
  return new Response(JSON.stringify({ publishedAt }), { headers: { 'Content-Type': 'application/json' } });
}
