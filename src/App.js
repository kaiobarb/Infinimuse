import React, { useRef, useState, useEffect, Suspense } from 'react';
import './App.scss';
import { AmbientLight, PointLight, Euler, Material, DoubleSide, TextureLoader } from 'three';
import ReactDOM from 'react-dom'
import { useLoader } from '@react-three/fiber';
import { Canvas, useFrame } from 'react-three-fiber';
import { Sphere, Box, PerspectiveCamera, Stars, Sky, FlyControls, Plane } from '@react-three/drei';
import { useBox, Physics } from '@react-three/cannon';
import { EllerMaze, EllerArgs } from 'lazy-eller';
import { testAPI, getArtworksFromAPI, getArtworkIDs } from './components/artwork.js';
import MuseumWall from './components/MuseumWall.js';
import floorImage from './static/floor_texture.jpg';
import Maze from './components/Maze';

var cellSize = 8;

function makeAPIRequest() {
  return fetch("https://api.artic.edu/api/v1/artworks?limit=100")
    .then(data => data.json())
}

const BuildMaze = ({ artworks }) => {
  var mazeWidth = 10;
  var mazeHeight = 40;
  var maze = [];
  var mazeGenerator = new EllerMaze({ width: mazeWidth });
  for (var i = 0; i < mazeHeight - 1; i++) {
    maze.push(mazeGenerator.next());
  }
  maze.push(mazeGenerator.next(true));
  var walls = [];
  for (var i = 0; i < mazeHeight; i++) {
    for (var j = 0; j < mazeWidth; j++) {
      walls.push(<Room artworks={artworks} cell={maze[i].value[j]} pos={[cellSize * j, cellSize / 2, cellSize * i]} />);
    }
  }

  return walls;
}

function Room({ artworks, cell, pos = [0, 0, 0], size = cellSize / 2 }) {
  const floorTexture = useLoader(TextureLoader, floorImage)
  return (
    <>
      {cell.right == null ? <MuseumWall artworks={artworks} position={[-size + pos[0], pos[1], pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"right"} /> : null}
      {cell.left == null ? <MuseumWall artworks={artworks} position={[size + pos[0], pos[1], pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"left"} /> : null}
      {cell.down == null ? <MuseumWall artworks={artworks} position={[pos[0], pos[1], size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"down"} /> : null}
      {cell.up == null ? <MuseumWall artworks={artworks} position={[pos[0], pos[1], -size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"up"} /> : null}
      <Suspense fallback={null}>
        <Plane position={[pos[0], 2, pos[2]]} args={[cellSize, cellSize, 1]} rotateOnAxis={true} rotation={[-Math.PI / 2, 0, 0]}>
          <meshPhongMaterial side={DoubleSide} shininess={0} map={floorTexture} />
        </Plane>
      </Suspense>
    </>
  )
}


function PhongBox({ pos = [0, 0, 0] }) {
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



function App() {
  const [artworks, setArtworks] = useState([]);
  const [cameraZPosition, setCameraZPositionInState] = useState(0)
  var camRef;

  var ids = [];
  console.log("Starting API IDrequest ...")

  useEffect(() => {
    let mounted = true;
    makeAPIRequest()
      .then(response => {
        if (mounted) {
          let imageURLs = []
          for (var item in response.data) {
            if (response.data[item].image_id) {
              imageURLs.push("https://www.artic.edu/iiif/2/" + response.data[item].image_id + "/full/843,/0/default.jpg");
            }
          }
          setArtworks(imageURLs);
          // console.log(artworks)
        }
      })
    return () => mounted = false;
  }, [])

  function CameraWithLight() {
    const cam = useRef();
    // useFrame((state, delta) => (cam.current ? cam.current.position.z += 0.1 : null))

    if (cam.current != undefined) {
      if (cam.current.position.z % cellSize == 0) {
        setCameraZPositionInState(cam.current.position.z);
      }
    }

    return (
      <PerspectiveCamera ref={cam} makeDefault position={[cellSize * 5, cellSize * 2, 10]} rotation={[0, Math.PI, 0]}>
        <pointLight intensity={2} decay={2} distance={55} />
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={100} // Depth of area where stars should fit (default=50)
          count={500} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0.5} // Saturation 0-1 (default=0)
          fade={false} // Faded dots (default=false)
        />
      </PerspectiveCamera>
    )
  }

  return (
    <Canvas>
      {/* <ambientLight intensity={0.3} /> */}
      <directionalLight position={[0, 1, 0]} intensity={0.5}></directionalLight>
      <Sky
        distance={450000} // Camera distance (default=450000)
        sunPosition={[0, 0, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
        inclination={0} // Sun elevation angle from 0 to 1 (default=0)
        azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
      />


      <PhongBox pos={[-5, 0, 0]} />

      <PhongSphere />
      <CameraWithLight ref={this} />
      <Suspense fallback={null}>
        {/* <BuildMaze artworks={artworks} /> */}
        <Maze artworks={artworks} cameraPos={cameraZPosition} />
      </Suspense>
      <fog attach="fog" args={["black", 100, 200]} />
      <FlyControls dragToLook={true} movementSpeed={7} rollSpeed={0.63} />
    </Canvas>
  );
}

export default App;
