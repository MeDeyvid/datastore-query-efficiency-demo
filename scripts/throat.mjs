import { Datastore } from '@google-cloud/datastore';
import throat from 'throat';
import { performance } from 'perf_hooks';

const datastore = new Datastore({ namespace: 'example' });
const KIND = 'User';
const N_USERS = 10_000;

async function main() {
  const throttle = throat(1000);

  const cpuStart = process.cpuUsage();
  const startMem = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  const [users] = await datastore.createQuery(KIND).select('__key__').limit(N_USERS).run();
  const keys = users.map((u) => u[datastore.KEY]);

  const promises = keys.map((key) => throttle(() => datastore.get(key)));
  await Promise.all(promises);

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