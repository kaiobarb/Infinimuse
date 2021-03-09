import { Component, useRef, Suspense, lazy } from "react";
import { DoubleSide, Vector3, TextureLoader } from "three";
import { Box, Plane, Html } from "@react-three/drei";
import { useLoader, Dom } from "react-three-fiber";
import placeholder from "../static/spoder.jpg";


function WallPiece({ position, rotation }) {
    const texture = useLoader(TextureLoader, placeholder);

    return (
        // <Suspense fallback={<Html><h1>Loading</h1></Html>}>
        <Plane position={position} rotation={[0, rotation, 0]} >
            <meshBasicMaterial side={DoubleSide} map={texture} />
        </Plane>
        // </Suspense>
    )
}

export default function MuseumWall(pos, rot, dim, side) {
    const mesh = useRef()
    var portraitPlacement = [...pos];
    var artPiece = null;
    if (side == "left") {
        portraitPlacement[0] += dim[2] / 2 + 0.01;
    } else if (side == "right") {
        portraitPlacement[0] -= dim[2] / 2 + 0.01;
    } else if (side == "up") {
        portraitPlacement[2] += dim[2] / 2 + 0.01;
    } else if (side == "down") {
        portraitPlacement[2] -= dim[2] / 2 + 0.01;
    }

    return (
        <>
            {/* <Suspense fallback={<Html><h1>Loading</h1></Html>}> */}
            <Box ref={mesh} args={dim} position={pos} rotation={[0, rot, 0]}>
                <meshStandardMaterial attach="material" color="#AA2AAA" />

            </Box>
            {
                Math.random() < 0.25 ?
                    <Suspense fallback={<Plane position={portraitPlacement} rotation={[0,rot,0]}/>}>
                        <WallPiece position={portraitPlacement} rotation={rot} />
                    </Suspense>
                    : null
            }
            {/* </Suspense> */}
        </>
    )
}