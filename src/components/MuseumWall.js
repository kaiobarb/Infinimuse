import { Component, useRef, Suspense, lazy } from "react";
import { DoubleSide, Vector3, TextureLoader } from "three";
import { Box, Plane, Html } from "@react-three/drei";
import { useLoader, Dom } from "react-three-fiber";
import placeholder from "../static/spoder.jpg";
import { getImagefromID, getNextArtworkUrl } from './artwork';

function WallPiece({ artworks, position, rotation }) {
    console.log(artworks)
    var randomWork = artworks[Math.floor(Math.random() * artworks.length - 2)];
    let img;
    if (randomWork) img = randomWork;
    else img = placeholder;
    const texture = useLoader(TextureLoader, img)

    return (
        <Plane position={position} rotation={rotation} >
            <meshBasicMaterial side={DoubleSide} map={texture} />
        </Plane>
    )
}

export default function MuseumWall({artworks, position, rotation, dimensions, side }) {
    const mesh = useRef()
    var portraitPlacement = [...position];
    var artPiece = null;
    if (side == "left") {
        portraitPlacement[0] += dimensions[2] / 2 + 0.01;
    } else if (side == "right") {
        portraitPlacement[0] -= dimensions[2] / 2 + 0.01;
    } else if (side == "up") {
        portraitPlacement[2] += dimensions[2] / 2 + 0.01;
    } else if (side == "down") {
        portraitPlacement[2] -= dimensions[2] / 2 + 0.01;
    }

    return (
        <>
            <Box ref={mesh} args={dimensions} position={position} rotation={rotation}>
                <meshStandardMaterial attach="material" color="#AA2AAA" />

            </Box>
            {
                Math.random() < 0.25 ?
                    <Suspense fallback={<Plane position={portraitPlacement} rotation={rotation} />}>
                        <WallPiece artworks={artworks} position={portraitPlacement} rotation={rotation} />
                    </Suspense>
                    : null
            }
        </>
    )
}