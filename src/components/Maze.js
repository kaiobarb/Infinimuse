import { EllerMaze, EllerArgs } from 'lazy-eller';
import MuseumWall from './MuseumWall';
import { useEffect, useState, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
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
    const [mazeRows, setMazeRows] = useState([mazeGenerator.next()]);
    const [threshold, setNewThreshold] = useState(cellSize)

    useEffect(() => {
        if (actorZPos >= threshold) {
            setMazeRows(mazeRows => [...mazeRows, mazeGenerator.next()])
            setNewThreshold(threshold + cellSize)
        }
    })
    return mazeRows;
}


const Maze = ({ artworks, cameraPos }) => {
    // var mazeWidth = 10;
    // var mazeHeight = 10;
    // var maze = [];
    // var mazeGenerator = new EllerMaze({ width: mazeWidth });
    // for (var i = 0; i < mazeHeight - 1; i++) {
    //     maze.push(mazeGenerator.next());
    // }
    // maze.push(mazeGenerator.next(true));
    // var walls = [];
    // for (var i = 0; i < mazeHeight; i++) {
    //     for (var j = 0; j < mazeWidth; j++) {
    //         walls.push(<Room artworks={artworks} cell={maze[i].value[j]} pos={[cellSize * j, -10, cellSize * i]} />);
    //     }
    // }

    // return walls;

    var maze = useMazeGenerator(cameraPos);
    var walls = [];
    var i = 0;
    var j = 0;

    maze.forEach(row => {
        console.log(row)
        for (var i = 0; i < mazeWidth; i++) {
        // row.forEach(cell => {
            // console.log(cell);
            walls.push(<Room artworks={artworks} cell={row.value[j]} pos={[cellSize * j, -10, cellSize * i]} />);
            i += 1;
        }
        j += 1;
    })

    return walls;

}

export default Maze;