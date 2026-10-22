
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
            <MemoryPhoto />
        </group>
    );
}


function MemoryPhoto() {
    const { camera } = useThree();

    const photoMaterials = useRef<
        (THREE.MeshBasicMaterial | null)[]
    >([]);

    const starMaterials = useRef<
        (THREE.MeshBasicMaterial | null)[]
    >([]);

    const haloMaterials = useRef<
        (THREE.MeshBasicMaterial | null)[][]
    >([]);

    const memories = useMemo(
        () => [
            { src: "/images/universe/memory-01.jpg", angle: 0.2, radius: 3.2, y: 0.5 },
            { src: "/images/universe/memory-02.jpg", angle: 0.8, radius: 4.5, y: -0.2 },
            { src: "/images/universe/memory-03.jpg", angle: 1.5, radius: 2.7, y: 0.3 },
            { src: "/images/universe/memory-04.jpg", angle: 2.1, radius: 4.8, y: 0.1 },
            { src: "/images/universe/memory-05.jpg", angle: 2.7, radius: 3.5, y: -0.4 },
            { src: "/images/universe/memory-06.jpg", angle: 3.3, radius: 4.2, y: 0.4 },
            { src: "/images/universe/memory-07.jpg", angle: 3.9, radius: 2.9, y: -0.2 },
            { src: "/images/universe/memory-08.jpg", angle: 4.5, radius: 5.0, y: 0.2 },
            { src: "/images/universe/memory-09.jpg", angle: 5.2, radius: 3.7, y: 0.5 },
            { src: "/images/universe/memory-10.jpg", angle: 5.8, radius: 4.4, y: -0.3 },
        ],
        []
    );

    const textures = useMemo(() => {
        const loader = new THREE.TextureLoader();

        return memories.map((memory) =>
            loader.load(memory.src)
        );
    }, [memories]);

    useFrame((_, delta) => {
        const distance = camera.position.length();

        const photoOpacity = THREE.MathUtils.clamp(
            (13 - distance) / 7,
            0.05,
            0.95
        );

        const starOpacity = 1 - photoOpacity;

        photoMaterials.current.forEach((material) => {
            if (!material) return;

            material.opacity = THREE.MathUtils.damp(
                material.opacity,
                photoOpacity,
                4,
                delta
            );
        });

        starMaterials.current.forEach((material) => {
            if (!material) return;

            material.opacity = THREE.MathUtils.damp(
                material.opacity,
                starOpacity,
                4,
                delta
            );
        });

        haloMaterials.current.forEach((materials) => {
            materials.forEach((material, haloIndex) => {
                if (!material) return;

                const baseOpacity = haloIndex === 0 ? 0.08 : 0.22;

                material.opacity = THREE.MathUtils.damp(
                    material.opacity,
                    starOpacity * baseOpacity,
                    4,
                    delta
                );
            });
        });
    });

    return (
        <>
            {memories.map((memory, index) => (
                <group
                    key={memory.src}
                    position={[
                        Math.cos(memory.angle) * memory.radius,
                        memory.y,
                        Math.sin(memory.angle) * memory.radius,
                    ]}
                >
                    <mesh>
                        <planeGeometry args={[0.75, 1]} />
                        <meshBasicMaterial
                            ref={(material) => {
                                photoMaterials.current[index] = material;
                            }}
                            map={textures[index]}
                            side={THREE.DoubleSide}
                            transparent
                            opacity={0.05}
                            depthWrite={false}
                        />
                    </mesh>

                    <mesh position={[0, 0, -0.02]}>
                        <sphereGeometry args={[0.22, 16, 16]} />
                        <meshBasicMaterial
                            ref={(material) => {
                                haloMaterials.current[index] ??= [];
                                haloMaterials.current[index][0] = material;
                            }}
                            color="#fff1fb"
                            transparent
                            opacity={0.08}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>

                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshBasicMaterial
                            ref={(material) => {
                                haloMaterials.current[index] ??= [];
                                haloMaterials.current[index][0] = material;
                            }}
                            color="#ff70bd"
                            transparent
                            opacity={0.22}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                </group>
            ))}
        </>
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

    const starsRef = useRef<THREE.Points>(null);

    const twinkleData = useMemo(() => {
        const count = positions.length / 3;
        const phases = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            phases[i] = Math.random() * Math.PI * 2;
            speeds[i] = 0.7 + Math.random() * 2.3;
        }

        return { phases, speeds };
    }, [positions]);

    useFrame(({ clock }) => {
        if (!starsRef.current) return;

        const material = starsRef.current.material as THREE.PointsMaterial;
        const time = clock.elapsedTime;

        const colors = starsRef.current.geometry.attributes.color;

        if (!colors) {
            const count = twinkleData.phases.length;
            const values = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                values[i * 3] = 1;
                values[i * 3 + 1] = 1;
                values[i * 3 + 2] = 1;
            }

            starsRef.current.geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(values, 3)
            );
        }

        const colorAttribute = starsRef.current.geometry.attributes.color;

        for (let i = 0; i < twinkleData.phases.length; i++) {
            const glow =
                0.12 +
                (Math.sin(
                    time * twinkleData.speeds[i] + twinkleData.phases[i]
                ) + 1) * 0.44;

            colorAttribute.setXYZ(i, glow, glow, glow);
        }

        colorAttribute.needsUpdate = true;

        material.opacity = 1;
        material.vertexColors = true;
    });

    return (
        <points ref={starsRef}>
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
                opacity={1}
                sizeAttenuation
                vertexColors
            />
        </points>
    );
}


function ShootingStar() {
    const groupRef = useRef<THREE.Group>(null);
    const headMaterial = useRef<THREE.MeshBasicMaterial>(null);
    const trailMaterial = useRef<THREE.MeshBasicMaterial>(null);

    const flight = useRef({
        active: false,
        elapsed: 0,
        duration: 0.8,
        nextLaunch: 2 + Math.random() * 3,
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        direction: new THREE.Vector3(),
    });

    useFrame((_, delta) => {
        const star = flight.current;
        const group = groupRef.current;

        if (!group) return;

        if (!star.active) {
            star.nextLaunch -= delta;

            if (star.nextLaunch > 0) return;

            star.active = true;
            star.elapsed = 0;
            star.duration = 0.55 + Math.random() * 0.5;

            star.start.set(
                (Math.random() - 0.5) * 24,
                3 + Math.random() * 8,
                -3 - Math.random() * 12
            );

            star.end.set(
                star.start.x - (3 + Math.random() * 5),
                star.start.y - (2 + Math.random() * 4),
                star.start.z
            );

            star.direction
                .subVectors(star.end, star.start)
                .normalize();

            group.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                star.direction
            );
        }

        star.elapsed += delta;

        const progress = Math.min(
            star.elapsed / star.duration,
            1
        );

        group.position.lerpVectors(
            star.start,
            star.end,
            progress
        );

        const fade = Math.min(
            progress * 6,
            (1 - progress) * 6,
            1
        );

        if (headMaterial.current) {
            headMaterial.current.opacity = fade;
        }

        if (trailMaterial.current) {
            trailMaterial.current.opacity = fade * 0.75;
        }

        if (progress >= 1) {
            star.active = false;
            star.nextLaunch = 3 + Math.random() * 3;
        }
    });

    return (
        <group ref={groupRef} visible>
            {/* Яскрава голівка */}
            <mesh>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshBasicMaterial
                    ref={headMaterial}
                    color="#ffffff"
                    transparent
                    opacity={0}
                    toneMapped={false}
                />
            </mesh>

            {/* Довгий світний хвіст */}
            <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry
                    args={[0.002, 0.025, 0.8, 8, 1, true]}
                />
                <meshBasicMaterial
                    ref={trailMaterial}
                    color="#ffb7ec"
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
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
                    <ShootingStar />
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
