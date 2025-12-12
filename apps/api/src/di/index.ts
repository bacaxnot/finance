import "reflect-metadata";
import { ContainerBuilder } from "diod";
import { glob } from "glob";

async function buildContainer() {
  const builder = new ContainerBuilder();

  // Auto-discover all DI modules
  const diFiles = glob.sync(`${__dirname}/modules/**/*.ts`);

  // Register all modules
  for (const file of diFiles) {
    const module = await import(file);
    module.register(builder);
  }

  return builder.build();
}

export const container = await buildContainer();
