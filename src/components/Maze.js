import { EllerMaze, EllerArgs } from 'lazy-eller';
import MuseumWall from './MuseumWall';
import { useEffect, useState, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html, Plane } from '@react-three/drei';
import { TextureLoader, DoubleSide } from 'three';
import floorImage from '../static/floor_texture.jpg';


var mazeWidth = 10;
var mazeHeight = 10;
var cellSize = 8;


function Room({ artworks, cell, pos = [0, 0, 0], size = cellSize / 2 }) {
    const floorTexture = useLoader(TextureLoader, floorImage)
    return (
        <>
            {cell.right == null ? <MuseumWall artworks={artworks} position={[-size + pos[0], pos[1], pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"right"} /> : null}
            {cell.left == null ? <MuseumWall artworks={artworks} position={[size + pos[0], pos[1], pos[2]]} rotation={[0, Math.PI / 2, 0]} dimensions={[cellSize, 4, 0.3]} side={"left"} /> : null}
            {cell.down == null ? <MuseumWall artworks={artworks} position={[pos[0], pos[1], size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"down"} /> : null}
            {cell.up == null ? <MuseumWall artworks={artworks} position={[pos[0], pos[1], -size + pos[2]]} rotation={[0, 0, 0]} dimensions={[cellSize, 4, 0.3]} side={"up"} /> : null}
            <Suspense fallback={null}>
                <Plane position={[pos[0], -cellSize - cellSize / 2, pos[2]]} args={[cellSize, cellSize, 1]} rotateOnAxis={true} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshPhongMaterial side={DoubleSide} shininess={0} map={floorTexture} />
                </Plane>

            </Suspense>
        </>
    )
}


// custom hook, maybe?
// useMazeGenerator ( camera z position )
// returns array of maze 
// updates when camera's z position is greater than the z position of the 2nd to last row
const useMazeGenerator = ({ actorZPos }) => {
    var mazeGenerator = new EllerMaze({ width: mazeWidth });
    var initialMazeState = [mazeGenerator.next(), mazeGenerator.next()]
    const [mazeRows, setMazeRows] = useState([...initialMazeState]);
    const [threshold, setNewThreshold] = useState(cellSize)

    useEffect(() => {
        if (actorZPos >= threshold) {
            setMazeRows(mazeRows => [...mazeRows, mazeGenerator.next()])
            setNewThreshold(threshold + cellSize)
        }
    })
    return mazeRows;
}


const Maze = ({ artworks, cameraPos, toASCII }) => {
    var maze = useMazeGenerator(cameraPos);
    var walls = [];
    var ASCIIwalls = "";
    var i = 0;
    var j = 0;

    maze.forEach(row => {
        for (var i = 0; i < mazeWidth; i++) {
        // row.forEach(cell => {
            // console.log(cell);
            walls.push(<Room artworks={artworks} cell={row.value[i]} pos={[cellSize * i, -10, cellSize * j]} />);
            // i += 1;
        }
        ASCIIwalls += EllerMaze.toASCII(row.value);
        ASCIIwalls += "."
        j += 1;
    })
    console.log("ascii")
    console.log(ASCIIwalls)
    toASCII(ASCIIwalls);
    return walls;

}

export default Maze;