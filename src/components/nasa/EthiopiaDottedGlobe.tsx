"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface Hotspot {
  id: string;
  name: string;
  nameAm: string;
  lat: number;
  lon: number;
  anomaly: string;
  soil: string;
  veg: string;
  status: string;
  focus: string;
}

export const ETHIOPIA_HOTSPOTS: Hotspot[] = [
  {
    id: "borena",
    name: "BORENA",
    nameAm: "ቦረና",
    lat: 4.8,
    lon: 38.3,
    anomaly: "-1.82 σ",
    soil: "0.142 m³/m³ (-2.14 σ)",
    veg: "0.375 (-1.65 σ)",
    status: "SEVERE",
    focus: "Pastoral rangelands & Tula deep wells",
  },
  {
    id: "somali",
    name: "FAFANZON",
    nameAm: "ፋፈን",
    lat: 9.3,
    lon: 42.8,
    anomaly: "-1.45 σ",
    soil: "0.155 m³/m³ (-1.80 σ)",
    veg: "0.290 (-1.35 σ)",
    status: "HIGH",
    focus: "Lowland pastoral & riverine recharge",
  },
  {
    id: "afar",
    name: "AFAR_N",
    nameAm: "ሰሜን አፋር",
    lat: 11.8,
    lon: 41.0,
    anomaly: "-1.95 σ",
    soil: "0.118 m³/m³ (-2.40 σ)",
    veg: "0.210 (-1.90 σ)",
    status: "CRITICAL",
    focus: "Hyper-arid scrubland & livestock hydration",
  },
  {
    id: "tigray",
    name: "TIGRAY_C",
    nameAm: "ትግራይ",
    lat: 13.8,
    lon: 39.0,
    anomaly: "-0.92 σ",
    soil: "0.210 m³/m³ (-0.85 σ)",
    veg: "0.480 (-0.60 σ)",
    status: "MODERATE",
    focus: "Highland terraced agriculture & Kiremt rains",
  },
];

interface DottedGlobeProps {
  selectedHotspot: Hotspot;
  onSelectHotspot: (hotspot: Hotspot) => void;
}

export const EthiopiaDottedGlobe: React.FC<DottedGlobeProps> = ({
  selectedHotspot,
  onSelectHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.0015 });
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const beamMeshRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);

  // Convert lat/lon to 3D Cartesian coordinates on sphere of radius R
  const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 2.85;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Master Globe Group
    const globeGroup = new THREE.Group();
    // Default rotation to position Horn of Africa & Ethiopia front-center
    globeGroup.rotation.y = -Math.PI / 1.7;
    globeGroup.rotation.x = 0.25;
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 1. Globe Base Core (Deep obsidian dark glass sphere)
    const sphereGeo = new THREE.SphereGeometry(0.98, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x040507,
      transparent: true,
      opacity: 0.95,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // 2. Dotted Landmass Particle Cloud
    const particleCount = 12000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const cyanColor = new THREE.Color(0x28d7c5);
    const brightBlueColor = new THREE.Color(0x78d2ff);
    const navyColor = new THREE.Color(0x1e2e4a);
    const dimColor = new THREE.Color(0x0e1626);

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const radius = 1.0;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Geographic coordinates
      const lat = 90 - (phi * 180) / Math.PI;
      const lon = ((theta * 180) / Math.PI) % 360 - 180;

      // Highlight Ethiopia and Horn of Africa (~3°N to 15°N, 33°E to 48°E)
      const isHornOfAfrica = lat >= 3 && lat <= 15 && lon >= 33 && lon <= 48;
      const isAfrica = lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52;

      if (isHornOfAfrica) {
        colors[i * 3] = cyanColor.r;
        colors[i * 3 + 1] = cyanColor.g;
        colors[i * 3 + 2] = cyanColor.b;
        sizes[i] = 0.024;
      } else if (isAfrica) {
        colors[i * 3] = brightBlueColor.r * 0.9;
        colors[i * 3 + 1] = brightBlueColor.g * 0.9;
        colors[i * 3 + 2] = brightBlueColor.b * 0.9;
        sizes[i] = 0.018;
      } else if (Math.random() > 0.4) {
        colors[i * 3] = navyColor.r;
        colors[i * 3 + 1] = navyColor.g;
        colors[i * 3 + 2] = navyColor.b;
        sizes[i] = 0.012;
      } else {
        colors[i * 3] = dimColor.r;
        colors[i * 3 + 1] = dimColor.g;
        colors[i * 3 + 2] = dimColor.b;
        sizes[i] = 0.008;
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pointGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Custom Canvas Texture for glowing circular particles
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(40,215,197,0.8)");
      gradient.addColorStop(0.7, "rgba(65,97,159,0.3)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const pointMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pointGeo, pointMat);
    globeGroup.add(particles);

    // 3. Hotspot Markers Group
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    globeGroup.add(markersGroup);

    ETHIOPIA_HOTSPOTS.forEach((spot) => {
      const pos = latLonToVector3(spot.lat, spot.lon, 1.015);

      // Core dot
      const markerGeo = new THREE.SphereGeometry(0.022, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: spot.id === selectedHotspot.id ? 0xffffff : 0x28d7c5,
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = { spot };
      markersGroup.add(markerMesh);

      // Outer concentric ring
      const ringGeo = new THREE.RingGeometry(0.045, 0.052, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x28d7c5,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markersGroup.add(ringMesh);

      // Secondary outer ring
      const outerRingGeo = new THREE.RingGeometry(0.075, 0.082, 32);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: 0x41619f,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRingMesh.position.copy(pos);
      outerRingMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markersGroup.add(outerRingMesh);
    });

    // 4. Projection Cone / Beam for Selected Marker
    const createBeam = (spot: Hotspot) => {
      if (beamMeshRef.current) {
        globeGroup.remove(beamMeshRef.current);
      }
      const origin = latLonToVector3(spot.lat, spot.lon, 1.01);
      const coneGeo = new THREE.ConeGeometry(0.18, 0.55, 32, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x28d7c5,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(origin.clone().multiplyScalar(1.25));
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), origin.clone().normalize());
      beamMeshRef.current = cone;
      globeGroup.add(cone);
    };

    createBeam(selectedHotspot);

    // Drag Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      rotationVelocityRef.current = {
        x: deltaY * 0.0005,
        y: deltaX * 0.0005,
      };

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch events for mobile/tablet
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow Idle Auto-rotation when not dragging
      if (!isDraggingRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Pulse concentric rings around hotspots
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((child, idx) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
            const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.12;
            child.scale.set(scale, scale, scale);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* 1. Dramatic Lens Flare on the Left Edge matching the visual reference */}
      <div className="nasa-lens-flare -left-16 lg:-left-28 top-1/4 -translate-y-1/2 opacity-95" />

      {/* 2. Soft Blue Radial Atmosphere Glow behind globe */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-radial-gradient from-accent-blue/30 via-accent-cyan/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 3. Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
