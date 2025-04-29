// cameraFollow.js

let cameraSpeed = 0.1;

function cameraFollow() {
    // Camera follows the player with a slight offset
    camera.position.x = player.position.x + 5;
    camera.position.y = player.position.y + 3;
    camera.position.z = player.position.z + 5;

    camera.lookAt(player.position); // Always look at the player
}
