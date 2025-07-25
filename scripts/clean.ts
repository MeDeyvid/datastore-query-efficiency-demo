import { Datastore } from '@google-cloud/datastore';

const datastore = new Datastore({ namespace: 'example' });
const KIND = 'User';
const PAGE_SIZE = 500;

// Async generator que "streama" chaves dos usuários em batches
async function* userKeyStream(): AsyncGenerator<string[], void, void> {
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const query = datastore.createQuery(KIND).select('__key__').limit(PAGE_SIZE);
    if (startCursor) query.start(startCursor);

    const [users, info] = await query.run();
    const keys = users.map((u: any) => u[datastore.KEY]);

    if (keys.length > 0) yield keys;

    startCursor = info.endCursor;
    hasMore = !!info.moreResults && users.length > 0;
  }
}

async function main() {
  let totalDeleted = 0;

  for await (const keys of userKeyStream()) {
    await datastore.delete(keys);
    totalDeleted += keys.length;
    process.stdout.write('.');
  }

  console.log(`\nTotal de usuários removidos: ${totalDeleted}`);
}

main().catch(console.error);
