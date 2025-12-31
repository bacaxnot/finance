import type { ContainerBuilder, Newable } from "diod";
import { DOMAIN_EVENT_SUBSCRIBER } from "./tags";

const autoregisteredServices: Newable<unknown>[] = [];
const autoregisteredSubscribers: Newable<unknown>[] = [];

const isNewable = (target: unknown): target is Newable<unknown> => {
  if (typeof target !== "function") {
    return false;
  }

  const prototype = target.prototype;
  return !!prototype && !!prototype.constructor;
};

export const RegisterService = (): ClassDecorator => {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    if (isNewable(target)) {
      autoregisteredServices.push(target);
    } else {
      throw new Error("Abstract classes cannot be auto registered");
    }

    return target;
  };
};

export const RegisterSubscriber = (): ClassDecorator => {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    if (isNewable(target)) {
      autoregisteredSubscribers.push(target);
    } else {
      throw new Error("Abstract classes cannot be auto registered");
    }

    return target;
  };
};

export const autoregister = (builder: ContainerBuilder): ContainerBuilder => {
  for (const service of autoregisteredServices) {
    builder.registerAndUse(service);
  }

  for (const subscriber of autoregisteredSubscribers) {
    builder.registerAndUse(subscriber).addTag(DOMAIN_EVENT_SUBSCRIBER);
  }

  return builder;
};
