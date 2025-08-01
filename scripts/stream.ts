import { Datastore } from '@google-cloud/datastore';
import { performance } from 'perf_hooks';

const datastore = new Datastore({ namespace: 'example' });
const KIND = 'User';

async function main() {
  const cpuStart = process.cpuUsage();
  const startMem = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  let total = 0;

  const query = datastore.createQuery(KIND);
  const stream = datastore.runQueryStream(query);

  stream.on('data', (user: any) => {
    user.name = user.name?.toUpperCase(); // Exemplo de processamento
    total++;
    if (total % 500 === 0) process.stdout.write('.');
  });

  await new Promise<void>((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  const endTime = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const cpuEnd = process.cpuUsage(cpuStart);

  console.table({
    'Total Usuários': total,
    'Tempo (ms)': (endTime - startTime).toFixed(2),
    'Memória (MB)': ((endMem - startMem) / 1024 / 1024).toFixed(2),
    'CPU User (ms)': (cpuEnd.user / 1000).toFixed(2),
    'CPU System (ms)': (cpuEnd.system / 1000).toFixed(2),
  });
}

main().catch(console.error);
