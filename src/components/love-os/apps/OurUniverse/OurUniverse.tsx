
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "./OurUniverse.css";

function Galaxy() {
    const groupRef = useRef<THREE.Group>(null);
    const rotation = useRef({ x: 0.15, y: 0 });
    const target = useRef({ x: 0.15, y: 0 });
    const dragging = useRef(false);
    const previousPointer = useRef({ x: 0, y: 0 });
    const { gl } = useThree();
    const { camera } = useThree();
    const zoom = useRef(9);

    const { positions, colors } = useMemo(() => {
        const count = 12000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const pink = new THREE.Color("#ff70bd");
        const violet = new THREE.Color("#a78bfa");
        const white = new THREE.Color("#fff1fb");

        for (let i = 0; i < count; i++) {
            const radius = Math.sqrt(Math.random()) * 5.5;
            const arm = i % 4;
            const angle =
                radius * 1.15 + (arm * Math.PI * 2) / 4;
            const spread =
                (Math.random() - 0.5) * (0.3 + radius * 0.12);

            positions[i * 3] =
                Math.cos(angle) * radius + spread;
            positions[i * 3 + 1] =
                (Math.random() - 0.5) * (0.12 + radius * 0.06);
            positions[i * 3 + 2] =
                Math.sin(angle) * radius + spread;

            const colorMix = Math.random();
            const color =
                colorMix < 0.45
                    ? pink
                    : colorMix < 0.78
                        ? violet
                        : white;

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, colors };
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const smoothing = 1 - Math.exp(-12 * delta);

        rotation.current.x +=
            (target.current.x - rotation.current.x) * smoothing;
        rotation.current.y +=
            (target.current.y - rotation.current.y) * smoothing;

        groupRef.current.rotation.x = rotation.current.x;
        groupRef.current.rotation.y = rotation.current.y;
    });

    useMemo(() => {
        const canvas = gl.domElement;

        const handlePointerDown = (event: PointerEvent) => {
            if (event.button !== 0) return;

            dragging.current = true;
            previousPointer.current = {
                x: event.clientX,
                y: event.clientY,
            };

            canvas.setPointerCapture(event.pointerId);
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (!dragging.current) return;

            const dx = event.clientX - previousPointer.current.x;
            const dy = event.clientY - previousPointer.current.y;

            target.current.y += dx * 0.008;
            target.current.x = THREE.MathUtils.clamp(
                target.current.x + dy * 0.008,
                -1.35,
                1.35
            );

            previousPointer.current = {
                x: event.clientX,
                y: event.clientY,
            };
        };

        const handlePointerUp = () => {
            dragging.current = false;
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();

            zoom.current = THREE.MathUtils.clamp(
                zoom.current + event.deltaY * 0.005,
                6,
                13
            );

            camera.position.set(0, zoom.current * 0.61, zoom.current);
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerup", handlePointerUp);
        canvas.addEventListener("pointercancel", handlePointerUp);
        canvas.addEventListener("lostpointercapture", handlePointerUp);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerup", handlePointerUp);
            canvas.removeEventListener("pointercancel", handlePointerUp);
            canvas.removeEventListener("lostpointercapture", handlePointerUp);
        };
    }, [gl]);

    return (
        <group ref={groupRef} rotation={[0.15, 0, 0]}>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[colors, 3]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    size={0.035}
                    vertexColors
                    transparent
                    opacity={0.9}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            <mesh>
                <sphereGeometry args={[0.22, 24, 24]} />
                <meshBasicMaterial color="#fff0fc" />
            </mesh>

            <pointLight
                color="#ff70bd"
                intensity={18}
                distance={5}
            />
            <pointLight
                color="#a78bfa"
                intensity={12}
                distance={7}
            />
        </group>
    );
}

function Stars() {
    const positions = useMemo(() => {
        const count = 1800;
        const values = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            values[i * 3] = (Math.random() - 0.5) * 35;
            values[i * 3 + 1] = (Math.random() - 0.5) * 20;
            values[i * 3 + 2] = -Math.random() * 18;
        }

        return values;
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>

            <pointsMaterial
                color="#fff4ff"
                size={0.025}
                transparent
                opacity={0.75}
                sizeAttenuation
            />
        </points>
    );
}

export default function OurUniverse() {
    return (
        <section className="our-universe">
            <div className="universe-canvas">
                <Canvas
                    camera={{ position: [0, 5.5, 9], fov: 48 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <color attach="background" args={["#08050d"]} />
                    <ambientLight intensity={0.8} />
                    <Galaxy />
                    <Stars />
                </Canvas>
            </div>

            <div className="universe-overlay">
                <span className="universe-label">
                    LOVE OS // OUR UNIVERSE
                </span>
                <h1>
                    Our little universe<span>♥</span>
                </h1>
                <p>
                    Затисни й рухай, щоб обертати нашу галактику
                </p>
                <span className="universe-hint">
                    A WORLD MADE FOR TWO
                </span>
            </div>
        </section>
    );
}
