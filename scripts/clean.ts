import { Datastore } from '@google-cloud/datastore';
const datastore = new Datastore({ namespace: 'example' });
const KIND = 'User';

function deleteAllUsersStream(): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = datastore.createQuery(KIND).select('__key__');
    const stream = datastore.runQueryStream(query);
    let total = 0, batch: any[] = [];

    stream.on('data', (entity: any) => {
      batch.push(entity[datastore.KEY]);
      if (batch.length === 500) {
        stream.pause();
        datastore.delete(batch).then(() => {
          total += batch.length;
          batch = [];
          process.stdout.write('.');
          stream.resume();
        }).catch(reject);
      }
    });

    stream.on('end', async () => {
      if (batch.length) await datastore.delete(batch);
      resolve(total);
    });

    stream.on('error', reject);
  });
}

async function main() {
  const totalDeleted = await deleteAllUsersStream();
  console.log(`\nTotal removido: ${totalDeleted}`);
}

main().catch(console.error);
