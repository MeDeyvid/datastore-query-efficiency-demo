import { Datastore } from '@google-cloud/datastore';
import { faker } from '@faker-js/faker';
import { Readable } from 'stream';

const datastore = new Datastore({
  namespace: 'example'
});

const KIND = 'User';
const N_USERS = 10000;

function* userGenerator(count: number) {
  for (let i = 0; i < count; i++) {
    yield {
      key: datastore.key([KIND]),
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 50 }),
        createdAt: new Date()
      }
    };
  }
}

const userStream = Readable.from(userGenerator(N_USERS));

async function main() {
  let buffer: any[] = [];
  const BATCH_SIZE = 500;

  for await (const user of userStream) {
    buffer.push(user);
    if (buffer.length === BATCH_SIZE) {
      await datastore.save(buffer); // Salva em batches de BATCH_SIZE
      buffer = [];
      process.stdout.write('.');
    }
  }

  if (buffer.length) {
    await datastore.save(buffer);
    process.stdout.write('.');
  }
  console.log('\nUsuarios inseridos!');
}

main().catch(console.error);
