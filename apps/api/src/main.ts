import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";
import { resolvers } from "./resolvers";
import { AppDataSource } from "./data-source";

// TODO: Break up schema into multiple files for readability
const typeDefsArray = loadFilesSync(path.join(__dirname, "./schema.graphql"));

const typeDefs = mergeTypeDefs(typeDefsArray);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  try {
    await AppDataSource.initialize();

    console.log("Datasource initialized.");
  } catch (e) {
    console.log("Failed to initialize datasource:", e);
    process.exit(1);
  }

  // Your code here
})();

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
})();
