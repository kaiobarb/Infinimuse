import React from 'react';
import './App.scss';
import { Canvas } from 'react-three-fiber';
import { Sphere, Box, PerspectiveCamera, Stars, Sky, FlyControls } from '@react-three/drei';
import { AmbientLight, PointLight } from 'three';

function PhongBox() {
  return (
    <Box args={[1,1,1]} position={[-5,0,0]}>
      <meshPhongMaterial attach="material" color="red" />
    </Box>
  )
}

function PhongSphere() {
  return (
    <Sphere position={[5,0,0]}>
      <meshPhongMaterial attach="material" color="green" />
    </Sphere>
  )
}

function cameraWithLight() {
  return (
    <PerspectiveCamera makeDefault position={[0,0,10]}>
      <pointLight intensity={1.0} decay={2} distance={25}/>
    </PerspectiveCamera>
  )
}

function App() {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.03}/>
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
        {PhongBox()}
        {PhongSphere()}
        <FlyControls dragToLook={true} movementSpeed={7} rollSpeed={0.63}/>
      </Canvas>
    </>
  );
}

export default App;
