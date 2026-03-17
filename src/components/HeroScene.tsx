import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const NEON_RED = 0xff2a2a;
const NEON_RED_DIM = 0x661111;
const NEON_BLUE = 0x00d4ff;
const NODE_COUNT = 55;
const LAYER_COUNT = 4;

function buildNeuralNetwork(scene: THREE.Scene) {
  const nodePositions: THREE.Vector3[] = [];
  const geomDispose: THREE.BufferGeometry[] = [];
  const matDispose: THREE.Material[] = [];

  // ── Nodes ─────────────────────────────────────────────────────────────────
  const nodeMat = new THREE.MeshStandardMaterial({
    color: NEON_RED,
    emissive: NEON_RED,
    emissiveIntensity: 1.2,
    roughness: 0.3,
    metalness: 0.6,
  });
  matDispose.push(nodeMat);

  for (let i = 0; i < NODE_COUNT; i++) {
    const layer = i % LAYER_COUNT;
    const x = (layer - (LAYER_COUNT - 1) / 2) * 3.2 + (Math.random() - 0.5) * 1.2;
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 5;
    const pos = new THREE.Vector3(x, y, z);
    nodePositions.push(pos);

    const radius = 0.08 + Math.random() * 0.1;
    const geo = new THREE.SphereGeometry(radius, 12, 12);
    geomDispose.push(geo);
    const mesh = new THREE.Mesh(geo, nodeMat);
    mesh.position.copy(pos);
    scene.add(mesh);
  }

  // ── Edges ─────────────────────────────────────────────────────────────────
  const edges: [number, number][] = [];
  const edgeMat = new THREE.LineBasicMaterial({
    color: NEON_RED_DIM,
    transparent: true,
    opacity: 0.35,
  });
  matDispose.push(edgeMat);

  for (let a = 0; a < NODE_COUNT; a++) {
    // Connect to ~3 neighbours in the next layer
    let connected = 0;
    for (let b = a + 1; b < NODE_COUNT && connected < 3; b++) {
      const dist = nodePositions[a].distanceTo(nodePositions[b]);
      if (dist < 4.5) {
        edges.push([a, b]);
        connected++;
        const points = [nodePositions[a].clone(), nodePositions[b].clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        geomDispose.push(geo);
        const line = new THREE.Line(geo, edgeMat);
        scene.add(line);
      }
    }
  }

  // ── Data Pulses ────────────────────────────────────────────────────────────
  const pulses: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; t: number; speed: number }[] = [];
  const pulseMat = new THREE.MeshBasicMaterial({ color: NEON_BLUE });
  matDispose.push(pulseMat);

  // Pick 20 random edges for pulses
  const pickedEdges = [...edges].sort(() => Math.random() - 0.5).slice(0, 20);
  pickedEdges.forEach(([a, b]) => {
    const mid = nodePositions[a].clone().lerp(nodePositions[b], 0.5);
    mid.y += (Math.random() - 0.5) * 0.8;
    const curve = new THREE.CatmullRomCurve3([
      nodePositions[a].clone(),
      mid,
      nodePositions[b].clone(),
    ]);
    const geo = new THREE.SphereGeometry(0.06, 8, 8);
    geomDispose.push(geo);
    const mesh = new THREE.Mesh(geo, pulseMat);
    scene.add(mesh);
    pulses.push({ mesh, curve, t: Math.random(), speed: 0.003 + Math.random() * 0.004 });
  });

  return { pulses, geomDispose, matDispose };
}

const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    // ── Lighting ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const redLight = new THREE.PointLight(NEON_RED, 3, 20);
    redLight.position.set(0, 3, 5);
    scene.add(redLight);
    const blueLight = new THREE.PointLight(NEON_BLUE, 2, 20);
    blueLight.position.set(0, -3, 5);
    scene.add(blueLight);

    // ── Network ─────────────────────────────────────────────────────────────
    const { pulses, geomDispose, matDispose } = buildNeuralNetwork(scene);

    // ── Controls ─────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 5;
    controls.maxDistance = 22;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // ── Resize ───────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // ── Animation Loop ───────────────────────────────────────────────────────
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      pulses.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const pos = p.curve.getPoint(p.t);
        p.mesh.position.copy(pos);
        // Pulse size
        const s = 0.8 + Math.sin(p.t * Math.PI) * 0.5;
        p.mesh.scale.setScalar(s);
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      geomDispose.forEach(g => g.dispose());
      matDispose.forEach(m => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'grab',
        background: 'radial-gradient(ellipse at center, rgba(255,42,42,0.06) 0%, transparent 70%)',
        border: '1px solid rgba(255,42,42,0.15)',
        boxSizing: 'border-box',
      }}
      title="Drag to rotate · Scroll to zoom"
    />
  );
};

export default HeroScene;
