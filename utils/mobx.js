import { withMobx } from "next-mobx-wrapper";

export function configureMobx(config, app) {
  const getStores = config.stores;

  return withMobx(getStores)(app);
}
