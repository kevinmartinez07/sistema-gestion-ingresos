import type { NextApiRequest, NextApiResponse } from 'next';
import { openApiSpec } from '@/lib/server/presentation/docs/openapi-spec';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(openApiSpec);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
