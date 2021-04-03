import React, { useRef, useState, useEffect } from 'react';
import './App.scss';
import { Canvas } from 'react-three-fiber';
import { Sphere, Box, PerspectiveCamera, Stars, Sky, FlyControls, Plane } from '@react-three/drei';
import { AmbientLight, PointLight, Euler, Material, DoubleSide } from 'three';
import { EllerMaze, EllerArgs } from 'lazy-eller';
import { testAPI, getArtworksFromAPI, getArtworkIDs } from './components/artwork.js';
import MuseumWall from './components/MuseumWall.js'

var cellSize = 4;

function makeAPIRequest() {
  return fetch("https://api.artic.edu/api/v1/artworks?limit=100")
    .then(data => data.json())
}

const BuildMaze = ({ artworks }) => {
  //   let IDrequestURL = 'https://api.artic.edu/api/v1/artworks?limit=20'
  // let IDrequest = new XMLHttpRequest();
  // IDrequest.open('GET', IDrequestURL);
  // IDrequest.responseType = 'json';
  // IDrequest.send();

  // IDrequest.onload = function() {
  //     const result = IDrequest.response;
  //     for (var item in result.data) {
  //       if (result.data[item].image_id) {
  //         ids.push("https://www.artic.edu/iiif/2/" + result.data[item].image_id + "/full/843,/0/default.jpg")
  //       }
  //     }
  //     console.log(ids)    
  //     setArtworks([...ids]);  
  // }

  var mazeWidth = 10;
  var mazeHeight = 10;
  var maze = [];
  var mazeGenerator = new EllerMaze({ width: mazeWidth });
  for (var i = 0; i < mazeHeight - 1; i++) {
    maze.push(mazeGenerator.next());
  }
  maze.push(mazeGenerator.next(true));
  var walls = [];
  for (var i = 0; i < mazeHeight; i++) {
    for (var j = 1; j < mazeWidth; j++) {
      walls.push(<Room artworks={artworks} cell={maze[i].value[j]} pos={[cellSize * j - 25, -10, cellSize * i - 50]} />);
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

function Room({ artworks, cell, pos = [0, 0, 0], size = cellSize / 2 }) {
  return (
    <>
      {cell.right == null ? <MuseumWall artworks={artworks} position={[-size + pos[0], 0 + pos[1], 0 + pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"right"} /> : null}
      {cell.left == null ? <MuseumWall artworks={artworks} position={[size + pos[0], 0 + pos[1], 0 + pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"left"} /> : null}
      {cell.down == null ? <MuseumWall artworks={artworks} position={[0 + pos[0], 0 + pos[1], size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"down"} /> : null}
      {cell.up == null ? <MuseumWall artworks={artworks} position={[0 + pos[0], 0 + pos[1], -size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"up"} /> : null}
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

function CameraWithLight() {
  return (
    <PerspectiveCamera makeDefault position={[0, 0, 10]}>
      <pointLight intensity={1.0} decay={2} distance={25} />
    </PerspectiveCamera>
  )
}

function App() {
  const [artworks, setArtworks] = useState([]);

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
          console.log(artworks)
        }
      })
    return () => mounted = false;
  }, [])

  return (
    <>
      <div style={{ height: 100 + "vh", width: 13 + "vw", position: "absolute", top: 0, right: 0, display: "flex", flexDirection: "column", zIndex: 1, overflow:"scroll" }}>
        {artworks.map(item => <img src={item} />)}
      </div>
      <Canvas>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0.2, 1, 0]} intensity={0.5}></directionalLight>
        <Sky
          distance={450000} // Camera distance (default=450000)
          sunPosition={[0, 0, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
          inclination={0} // Sun elevation angle from 0 to 1 (default=0)
          azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        />
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={70} // Depth of area where stars should fit (default=50)
          count={500} // Amount of stars (default=5000)
          factor={7} // Size factor (default=4)
          saturation={1} // Saturation 0-1 (default=0)
          fade={true} // Faded dots (default=false)
        />
        <CameraWithLight />
        <PhongBox pos={[-5, 0, 0]} />

        <PhongSphere />
        <BuildMaze artworks={artworks} />
        <FlyControls dragToLook={true} movementSpeed={7} rollSpeed={0.63} />
      </Canvas>
    </>
  );
}

export default App;
