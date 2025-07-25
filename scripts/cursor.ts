import { Datastore } from '@google-cloud/datastore';
import { performance } from 'perf_hooks';

const datastore = new Datastore({
  namespace: 'example'
});
const KIND = 'User';

async function main() {
  const cpuStart = process.cpuUsage();
  const startMem = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  let hasMore = true;
  let startCursor: string | undefined = undefined;
  const PAGE_SIZE = 500;
  let total = 0;

  while (hasMore) {
    const query = datastore.createQuery(KIND).limit(PAGE_SIZE);
    if (startCursor) query.start(startCursor);

    const [users, info] = await query.run();

    for (const user of users) {
      user.name = user.name.toUpperCase(); // Exemplo de processamento
    }
  
    total += users.length;
    startCursor = info.endCursor;
    hasMore = !!info.moreResults && users.length > 0;
  }

  const endTime = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const cpuEnd = process.cpuUsage(cpuStart);

  console.table({
    'Tempo (ms)': (endTime - startTime).toFixed(2),
    'Memória (MB)': ((endMem - startMem) / 1024 / 1024).toFixed(2),
    'CPU User (ms)': (cpuEnd.user / 1000).toFixed(2),
    'CPU System (ms)': (cpuEnd.system / 1000).toFixed(2),
  });
}

main().catch(console.error);
