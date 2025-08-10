import type { Vector3 } from "@minecraft/server";

export default class Location {
  public static Inside(
    location: [Vector3, Vector3],
    subject: Vector3,
  ): boolean {
    const minX = Math.min(location[0].x, location[1].x);
    const minZ = Math.min(location[0].z, location[1].z);
    const maxX = Math.max(location[0].x, location[1].x);
    const maxZ = Math.max(location[0].z, location[1].z);

    return (
      Math.floor(subject.x) >= Math.floor(minX) &&
      Math.floor(subject.x) <= Math.floor(maxX) &&
      Math.floor(subject.z) >= Math.floor(minZ) &&
      Math.floor(subject.z) <= Math.floor(maxZ)
    );
  }
}
