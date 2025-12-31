import "reflect-metadata";

import { ContainerBuilder } from "diod";
import { glob } from "glob";

async function buildContainer() {
  const builder = new ContainerBuilder();

  // Auto-discover all DI modules
  const files = glob.sync(`${__dirname}/{contexts,shared}/**/*.ts`);

  // Register all modules
  for (const file of files) {
    const module = await import(file);
    module.register(builder);
  }

  return builder.build();
}

export const container = await buildContainer();
