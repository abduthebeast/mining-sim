// petFollower.js

class PetFollower {
  constructor(petMesh, playerMesh, offset = { x: 1.5, y: 0, z: -1 }) {
    this.pet = petMesh;
    this.player = playerMesh;
    this.offset = offset;
  }

  update() {
    if (!this.pet || !this.player) return;

    // Calculate desired position relative to player
    const targetX = this.player.position.x + this.offset.x;
    const targetY = this.player.position.y + this.offset.y;
    const targetZ = this.player.position.z + this.offset.z;

    // Smooth follow (optional)
    this.pet.position.x += (targetX - this.pet.position.x) * 0.1;
    this.pet.position.y += (targetY - this.pet.position.y) * 0.1;
    this.pet.position.z += (targetZ - this.pet.position.z) * 0.1;
  }
}
