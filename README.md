# datastore-query-efficiency-demo

## Objetivo

Este repositório demonstra diferentes abordagens para consulta de dados no Google Cloud Datastore, comparando eficiência de memória, CPU e tempo de execução. São apresentados exemplos de:
- Consulta com `Promise.all`
- Consulta paginada com cursor
- Consulta usando stream assíncrono

O projeto também inclui um script para popular o banco com dados fictícios.

## Pré-requisitos

- Node.js **>=18**
- Conta e projeto no Google Cloud com Datastore ativado
- Permissões de autenticação configuradas (ex: variável de ambiente `GOOGLE_APPLICATION_CREDENTIALS` apontando para o JSON da service account)
- pnpm (ou npm/yarn, mas o lock está em pnpm)

## Instalação

```bash
pnpm install
# ou
npm install
```

## Populando o banco de dados

Antes de rodar os exemplos, popule o Datastore com 10.000 usuários fictícios:

```bash
pnpm run seed
# ou
npm run seed
```

## Executando os exemplos

Cada script executa uma estratégia diferente de consulta e exibe uma tabela com tempo, memória e uso de CPU:

- **Promise.all** (busca todas as entidades em paralelo):
  ```bash
  pnpm run promise
  # ou
  npm run promise
  ```
- **Cursor** (consulta paginada usando cursor):
  ```bash
  pnpm run cursor
  # ou
  npm run cursor
  ```
- **Stream** (consulta usando stream assíncrono):
  ```bash
  pnpm run stream
  # ou
  npm run stream
  ```

## Observações

- O namespace usado é `example` e o tipo de entidade é `User`.
- O script de seed insere usuários com nome, email, idade e data de criação.
- Os scripts de consulta exibem métricas de desempenho no final da execução.

## Limpeza

- Para remover todos os usuários do Datastore:

```bash
pnpm run clean
# ou
npm run clean
```

## Licença

ISC 