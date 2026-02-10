import { World } from './World';

export let world: World;

export const setWorld = (worldInstance: World) => {
    world = worldInstance;
};
