import type { ContainerBuilder, Newable } from "diod";
import { glob } from "glob";
import { DOMAIN_EVENT_SUBSCRIBER } from "./tags";

/**
 * Decorator that enables dependency inference for a class.
 * Required for DIOD to extract constructor parameter types via reflect-metadata.
 * Does nothing else - registration is handled by file suffix (.usecase.ts, .subscriber.ts).
 *
 * Example:
 * @InferDependencies()
 * class CreateAccount {
 *   constructor(private readonly accountRepository: AccountRepository) {}
 * }
 *
 */
export const InferDependencies = (): ClassDecorator => {
  return (target) => target;
};

const CONTEXTS_PATH = `${__dirname}/../src/contexts`;
const USE_CASE_PATTERN = `${CONTEXTS_PATH}/**/*.usecase.ts`;
const SUBSCRIBER_PATTERN = `${CONTEXTS_PATH}/**/*.subscriber.ts`;
const DI_MODULE_PATTERN = `${__dirname}/{contexts,shared}/**/*.ts`;

function formatNoClassesError(filePath: string) {
  return `No class exports found in:\n  ${filePath}`;
}

function formatMultipleClassesError(filePath: string, classNames: string[]) {
  return (
    `Multiple class exports found in:\n` +
    `  ${filePath}\n\n` +
    `Found ${classNames.length} classes:\n` +
    classNames.map((name) => `  - ${name}`).join("\n") +
    `\n\nEach .usecase.ts/.subscriber.ts file must export exactly one class.`
  );
}

function extractSingleClassExport(
  module: Record<string, unknown>,
  filePath: string,
) {
  const classes = Object.entries(module).filter(
    (entry): entry is [string, Newable<unknown>] =>
      typeof entry[1] === "function" &&
      entry[1].prototype?.constructor !== undefined,
  );

  if (classes.length === 0) {
    throw new Error(formatNoClassesError(filePath));
  }

  if (classes.length > 1) {
    const classNames = classes.map(([name]) => name);
    throw new Error(formatMultipleClassesError(filePath, classNames));
  }

  return classes[0][1];
}

async function discoverClasses(pattern: string) {
  const files = glob.sync(pattern);
  const classes: Newable<unknown>[] = [];

  for (const file of files) {
    const module = await import(file);
    classes.push(extractSingleClassExport(module, file));
  }

  return classes;
}

async function registerUseCases(builder: ContainerBuilder) {
  const useCases = await discoverClasses(USE_CASE_PATTERN);

  for (const cls of useCases) {
    builder.registerAndUse(cls);
  }
}

async function registerSubscribers(builder: ContainerBuilder) {
  const subscribers = await discoverClasses(SUBSCRIBER_PATTERN);

  for (const cls of subscribers) {
    builder.registerAndUse(cls).addTag(DOMAIN_EVENT_SUBSCRIBER);
  }
}

async function registerDiModules(builder: ContainerBuilder) {
  const files = glob.sync(DI_MODULE_PATTERN);

  for (const file of files) {
    const module = await import(file);
    module.register(builder);
  }
}

export async function autoregister(builder: ContainerBuilder) {
  await registerDiModules(builder);
  await registerUseCases(builder);
  await registerSubscribers(builder);
}
