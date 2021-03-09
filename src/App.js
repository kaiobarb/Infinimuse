import React, { useRef, Suspense } from 'react';
import './App.scss';
import { Canvas } from 'react-three-fiber';
import { Sphere, Box, PerspectiveCamera, Stars, Sky, FlyControls, Plane } from '@react-three/drei';
import { AmbientLight, PointLight, Euler, Material, DoubleSide } from 'three';
import { EllerMaze, EllerArgs } from 'lazy-eller';
import { testAPI } from './components/artwork.js';
import MuseumWall from './components/MuseumWall.js'

var cellSize = 4;

function BuildMaze() {
  var mazeWidth = 9;
  var mazeHeight = 9;
  var maze = [];
  var mazeGenerator = new EllerMaze({ width: mazeWidth });
  for (var i = 0; i < mazeHeight - 1; i++) {
    maze.push(mazeGenerator.next());
  }
  maze.push(mazeGenerator.next(true));
  var walls = [];
  for (var i = 0; i < mazeHeight; i++) {
    for (var j = 1; j < mazeWidth; j++) {
      //console.log(maze[i])
      walls.push(Room(maze[i].value[j], [cellSize * j - 25, -10, cellSize * i - 50]));
    }
  }
  walls.push(
    <>
      <Plane position={[-50 / 2, -44, -100 / 2]} args={[cellSize * mazeWidth, cellSize * mazeWidth, 100]} rotateOnAxis={true} rotation={[-Math.PI / 2, 0, 0]}>
        <meshPhongMaterial side={DoubleSide} />
      </Plane>
    </>
  )
  return walls;

}

function Room(cell, pos = [0, 0, 0], size = cellSize / 2) {
  return (
    <>
      {cell.right == null ? MuseumWall([-size + pos[0], 0 + pos[1], 0 + pos[2]], Math.PI / 2, [cellSize, 4, 0.3], "right") : null}
      {cell.left == null ? MuseumWall([size + pos[0], 0 + pos[1], 0 + pos[2]], Math.PI / 2, [cellSize, 4, 0.3], "left") : null}
      {cell.down == null ? MuseumWall([0 + pos[0], 0 + pos[1], size + pos[2]], 0, [cellSize, 4, 0.3], "down") : null}
      {cell.up == null ? MuseumWall([0 + pos[0], 0 + pos[1], -size + pos[2]], 0, [cellSize, 4, 0.3], "up") : null}
    </>
  )
}

function Wall(pos = [0, 0, 0], rot = 0) {
  const mesh = useRef()
  //mesh.current.rotate.y = rot
  return (
    <Box ref={mesh} args={[cellSize, 4, 0.3]} position={pos} rotation={[0, rot, 0]}>
      {
        Math.random() < 0.25 ? <Plane /> : null
      }
      <meshStandardMaterial attach="material" color="#AA2AAA" />
    </Box>
  )
}

function PhongBox(pos = [0, 0, 0]) {
  return (
    <Box args={[1, 1, 1]} position={pos}>
      <meshPhongMaterial attach="material" color="red" />
    </Box>
  )
}

function PhongSphere() {
  return (
    <Sphere position={[5, 0, 0]}>
      <meshPhongMaterial attach="material" color="green" />
    </Sphere>
  )
}

function cameraWithLight() {
  return (
    <PerspectiveCamera makeDefault position={[0, 0, 10]}>
      <pointLight intensity={1.0} decay={2} distance={25} />
    </PerspectiveCamera>
  )
}

function App() {
  testAPI();
  return (
    <>
      <Canvas>
        {/* <Suspense fallback={<Box></Box>}> */}
        <ambientLight intensity={0.3} />
        <directionalLight intensity={0.5}></directionalLight>
        <Sky
          distance={450000} // Camera distance (default=450000)
          sunPosition={[0, 0, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
          inclination={0} // Sun elevation angle from 0 to 1 (default=0)
          azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        //{...props} // All three/examples/jsm/objects/Sky props are valid
        />
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={70} // Depth of area where stars should fit (default=50)
          count={500} // Amount of stars (default=5000)
          factor={7} // Size factor (default=4)
          saturation={1} // Saturation 0-1 (default=0)
          fade={true} // Faded dots (default=false)
        />
        {cameraWithLight()}
        {PhongBox([-5, 0, 0])}
        {/* {Room()}
        {Room([cellSize,0,0])} */}

        {PhongSphere()}
        {/* <Suspense fallback={<Box></Box>}> */}
          <BuildMaze/>
        {/* </Suspense> */}
        <FlyControls dragToLook={true} movementSpeed={7} rollSpeed={0.63} />
        {/* </Suspense> */}
      </Canvas>
    </>
  );
}

export default App;
