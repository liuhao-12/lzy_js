import fs from 'fs';
import path from 'path';

export async function GET() {
  const lzyPath = path.join(process.cwd(), 'lzy.js');
  const lzyContent = fs.readFileSync(lzyPath, 'utf8');

  return new Response(lzyContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Content-Disposition': 'attachment; filename="lzy.js"',
    },
  });
}
