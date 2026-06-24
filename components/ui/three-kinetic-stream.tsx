'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatObject {
  o: THREE.Object3D;
  sp: number;
  ph: number;
  rY: number;
}

export function ThreeKineticStream({ activeState = 0 }: { activeState?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStateRef = useRef(activeState);

  useEffect(() => {
    activeStateRef.current = activeState;
  }, [activeState]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x07070d, 1);
    container.appendChild(renderer.domElement);

    // Scene & Fog setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070d, 0.017);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 200);
    camera.position.set(0, 4, 22);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0d1f2e, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc9a84c, 3, 35);
    pointLight1.position.set(-10, 12, 5);
    scene.add(pointLight1);

    const tealLight = new THREE.PointLight(0x00d4aa, 2.5, 30);
    tealLight.position.set(10, 8, 0);
    scene.add(tealLight);

    const pointLight2 = new THREE.PointLight(0xe8c96a, 1.5, 20);
    pointLight2.position.set(0, 18, -10);
    scene.add(pointLight2);

    // Materials definitions
    const gW = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });

    const gS = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.12
    });

    const glM = new THREE.MeshStandardMaterial({
      color: 0x0d2840,
      transparent: true,
      opacity: 0.22,
      metalness: 0.5,
      roughness: 0.1
    });

    const fObjs: FloatObject[] = [];

    // ─── 3D SCALE GROUP ───
    const scaleGroup = new THREE.Group();
    
    // Stand shaft
    const standGeom = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const stand = new THREE.Mesh(standGeom, gS);
    scaleGroup.add(stand);

    // Horizontal balance bar
    const barGeom = new THREE.CylinderGeometry(0.04, 0.04, 3.5, 8);
    const bar = new THREE.Mesh(barGeom, gS);
    bar.rotation.z = Math.PI / 2;
    bar.position.y = 1.8;
    scaleGroup.add(bar);

    // Left and Right pans & hanging strings
    const chainGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6);
    const panGeom = new THREE.CylinderGeometry(0.6, 0.5, 0.08, 16);
    const baseGeom = new THREE.BoxGeometry(1.2, 0.12, 0.5);

    [-1, 1].forEach((side) => {
      // Chain wire
      const chain = new THREE.Mesh(chainGeom, gW);
      chain.position.set(side * 1.75, 1.2, 0);
      scaleGroup.add(chain);

      // Pan dish
      const pan = new THREE.Mesh(panGeom, gS);
      pan.position.set(side * 1.75, 0.55, 0);
      scaleGroup.add(pan);
    });

    // Base block
    const baseBlock = new THREE.Mesh(baseGeom, gS);
    baseBlock.position.y = -2;
    scaleGroup.add(baseBlock);

    scaleGroup.position.set(-7, 2, -6);
    scaleGroup.scale.setScalar(1.2);
    scene.add(scaleGroup);
    fObjs.push({ o: scaleGroup, sp: 0.0008, ph: 0, rY: 0.003 });

    // ─── 3D GAVEL GROUP ───
    const gavelGroup = new THREE.Group();
    
    // Gavel Handle
    const handleGeom = new THREE.CylinderGeometry(0.08, 0.06, 2.5, 12);
    const handle = new THREE.Mesh(handleGeom, gS);
    handle.rotation.z = Math.PI / 4;
    gavelGroup.add(handle);

    // Gavel Head
    const headGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16);
    const head = new THREE.Mesh(headGeom, gS);
    head.rotation.z = Math.PI / 2;
    head.position.set(0.8, 0.8, 0);
    gavelGroup.add(head);

    gavelGroup.position.set(7, 3, -4);
    scene.add(gavelGroup);
    fObjs.push({ o: gavelGroup, sp: 0.0012, ph: 1.2, rY: 0.004 });

    // ─── FLOATING DOCUMENT PANELS ───
    const docPlanes: THREE.Mesh[] = [];
    const docEdges: THREE.LineSegments[] = [];
    
    const panelPositions = [
      [-4, 1, -2],
      [4, -1, -3],
      [-2, 3, -8],
      [5, 2, -10],
      [-6, -1, -5],
    ];

    const docGeom = new THREE.PlaneGeometry(1.4, 1.8);
    const edgesGeom = new THREE.EdgesGeometry(docGeom);

    panelPositions.forEach((pos, idx) => {
      const docMaterial = glM.clone();
      const doc = new THREE.Mesh(docGeom, docMaterial);
      doc.position.set(pos[0], pos[1], pos[2]);
      doc.rotation.y = (Math.random() - 0.5) * 0.8;
      doc.rotation.x = (Math.random() - 0.5) * 0.3;

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0xc9a84c : 0x00d4aa,
        transparent: true,
        opacity: 0.55
      });
      const outline = new THREE.LineSegments(edgesGeom, edgeMaterial);
      doc.add(outline);

      scene.add(doc);
      fObjs.push({ o: doc, sp: 0.0006 + idx * 0.0002, ph: idx * 0.9, rY: 0.001 });
      docPlanes.push(doc);
      docEdges.push(outline);
    });

    // ─── BACKGROUND PILLARS ───
    const pillarGeom = new THREE.CylinderGeometry(0.35, 0.4, 14, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x1a2535,
      metalness: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.45
    });

    const pillars: THREE.Mesh[] = [];
    const pillarPositions = [-14, -9, -4, 4, 9, 14];
    pillarPositions.forEach((xPos) => {
      const pillar = new THREE.Mesh(pillarGeom, pillarMat);
      pillar.position.set(xPos, 0, -18);
      scene.add(pillar);
      pillars.push(pillar);
    });

    // ─── GLOWING ORBS ───
    const orbsConfig = [
      { p: [3, 4, -1], c: 0xc9a84c, s: 0.18 },
      { p: [-5, 6, -3], c: 0x00d4aa, s: 0.14 },
      { p: [8, 1, -5], c: 0xc9a84c, s: 0.22 },
      { p: [-9, 3, -7], c: 0x00d4aa, s: 0.16 },
      { p: [2, -2, -4], c: 0xe8c96a, s: 0.12 },
      { p: [-3, 5, -9], c: 0x00d4aa, s: 0.20 },
      { p: [11, 5, -8], c: 0xc9a84c, s: 0.15 },
      { p: [-11, 1, -6], c: 0x00d4aa, s: 0.18 }
    ];

    orbsConfig.forEach((config, idx) => {
      const orbMat = new THREE.MeshStandardMaterial({
        color: config.c,
        emissive: config.c,
        emissiveIntensity: 1.3,
        metalness: 0.5,
        roughness: 0.1
      });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(config.s, 16, 16), orbMat);
      orb.position.set(config.p[0], config.p[1], config.p[2]);
      scene.add(orb);
      fObjs.push({ o: orb, sp: 0.001 + idx * 0.0003, ph: idx * 1.1, rY: 0 });
    });

    // ─── GLOWING CONES OF LIGHT ───
    const cones: THREE.Mesh[] = [];
    [0, 1, 2].forEach((idx) => {
      const coneMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xc9a84c : 0x00d4aa,
        transparent: true,
        opacity: 0.022,
        side: THREE.DoubleSide
      });
      const coneGeom = new THREE.ConeGeometry(2.5 + idx * 0.5, 12, 12, 1, true);
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.set((idx - 1) * 8, 10, -12);
      cone.rotation.x = Math.PI;
      scene.add(cone);
      cones.push(cone);
    });

    // ─── COURTROOM PERSPECTIVE GRID ───
    const grid = new THREE.GridHelper(80, 40, 0xc9a84c, 0x0d1f35);
    grid.position.y = -5;
    if (grid.material instanceof THREE.Material) {
      grid.material.transparent = true;
      grid.material.opacity = 0.12;
    }
    scene.add(grid);

    // ─── RISING PARTICLE SYSTEM ───
    const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;
    const particleCount = isMobile ? 700 : 2200;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;

      // Color distribution: gold vs teal
      if (Math.random() > 0.5) {
        colors[i * 3] = 0.788;     // R
        colors[i * 3 + 1] = 0.659; // G
        colors[i * 3 + 2] = 0.298; // B
      } else {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.831;
        colors[i * 3 + 2] = 0.667;
      }
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeom, particlesMaterial);
    scene.add(particleSystem);

    // Mouse interactive coordinates
    let mx = 0, my = 0;
    let tx = 0, ty = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Transition state variables
    let currentCamX = 0;
    let currentCamY = 4;
    let currentCamZ = 22;

    let currentScaleGroupScale = 1.2;
    let currentGavelGroupScale = 1.0;

    let currentScaleGroupX = -7;
    let currentScaleGroupY = 2;

    let currentGavelGroupX = 7;
    let currentGavelGroupY = 3;

    let targetConeOpacityMultiplier = 1.0;

    // Animation variables
    let animationId: number;
    let t = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      t += 0.016;

      // Get target positions based on active state
      const state = activeStateRef.current;
      let targetCamX = 0;
      let targetCamY = 4;
      let targetCamZ = 22;
      let targetScaleGroupScale = 1.2;
      let targetGavelGroupScale = 1.0;
      let targetScaleGroupX = -7;
      let targetScaleGroupY = 2;
      let targetGavelGroupX = 7;
      let targetGavelGroupY = 3;
      let targetConeOpacityMultiplier = 1.0;

      if (state === 0) {
        targetCamX = 0;
        targetCamY = 4;
        targetCamZ = 22;
        targetScaleGroupScale = 1.2;
        targetGavelGroupScale = 1.0;
        targetScaleGroupX = -7;
        targetGavelGroupX = 7;
        targetConeOpacityMultiplier = 0.5;
      } else if (state === 1) {
        targetCamX = -6;
        targetCamY = 2;
        targetCamZ = 24;
        targetScaleGroupScale = 0.8;
        targetGavelGroupScale = 0.7;
        targetScaleGroupX = -9;
        targetGavelGroupX = 3;
        targetConeOpacityMultiplier = 0.3;
      } else if (state === 2) {
        targetCamX = 0;
        targetCamY = 0;
        targetCamZ = 12;
        targetScaleGroupScale = 2.0;
        targetGavelGroupScale = 1.8;
        targetScaleGroupX = -3;
        targetScaleGroupY = 0;
        targetGavelGroupX = 3;
        targetGavelGroupY = 0.5;
        targetConeOpacityMultiplier = 4.0;
      } else if (state === 3) {
        targetCamX = 5;
        targetCamY = 3;
        targetCamZ = 23;
        targetScaleGroupScale = 0.75;
        targetGavelGroupScale = 0.7;
        targetScaleGroupX = -5;
        targetGavelGroupX = 9;
        targetConeOpacityMultiplier = 1.5;
      }

      // Smooth interpolation (lerp)
      currentCamX += (targetCamX - currentCamX) * 0.05;
      currentCamY += (targetCamY - currentCamY) * 0.05;
      currentCamZ += (targetCamZ - currentCamZ) * 0.05;
      
      currentScaleGroupScale += (targetScaleGroupScale - currentScaleGroupScale) * 0.05;
      currentGavelGroupScale += (targetGavelGroupScale - currentGavelGroupScale) * 0.05;
      
      currentScaleGroupX += (targetScaleGroupX - currentScaleGroupX) * 0.05;
      currentScaleGroupY += (targetScaleGroupY - currentScaleGroupY) * 0.05;
      currentGavelGroupX += (targetGavelGroupX - currentGavelGroupX) * 0.05;
      currentGavelGroupY += (targetGavelGroupY - currentGavelGroupY) * 0.05;

      // Lerp mouse offsets for camera look
      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;

      // Camera parallax move
      camera.position.x = currentCamX + tx * 2;
      camera.position.y = currentCamY - ty * 1.2;
      camera.position.z = currentCamZ;
      camera.lookAt(0, 0, 0);

      scaleGroup.scale.setScalar(currentScaleGroupScale);
      scaleGroup.position.set(currentScaleGroupX, currentScaleGroupY, -6);
      
      gavelGroup.scale.setScalar(currentGavelGroupScale);
      gavelGroup.position.set(currentGavelGroupX, currentGavelGroupY, -4);

      // Spotlight opacity transition
      cones.forEach((cone, idx) => {
        const baseOpacity = idx % 2 === 0 ? 0.022 : 0.035;
        if (cone.material instanceof THREE.Material) {
          cone.material.opacity += (baseOpacity * targetConeOpacityMultiplier - cone.material.opacity) * 0.05;
        }
      });

      // Float objects animation loop
      fObjs.forEach((item) => {
        item.o.position.y += Math.sin(t * item.sp * 1000 + item.ph) * 0.003;
        if (item.rY) {
          item.o.rotation.y += item.rY;
        }
        // Parallax horizontal drift
        item.o.position.x += (-tx * 0.3 - item.o.position.x) * 0.0015;
      });

      // Specific scales wobble tilt
      scaleGroup.rotation.z = Math.sin(t * 0.4) * 0.08;

      // Rise particles loop
      const pointsArray = particleGeom.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pointsArray[i] += 0.008; // Rise speed
        if (pointsArray[i] > 20) {
          pointsArray[i] = -20; // Recycle back to bottom
        }
      }
      particleGeom.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.0001;

      // Pulsing light intensity animations
      pointLight1.intensity = 2.5 + Math.sin(t * 1.2) * 0.8;
      tealLight.intensity = 2.0 + Math.cos(t * 0.9) * 0.7;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Clean up WebGL memory allocation
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      renderer.dispose();
      standGeom.dispose();
      barGeom.dispose();
      chainGeom.dispose();
      panGeom.dispose();
      baseGeom.dispose();
      handleGeom.dispose();
      headGeom.dispose();
      docGeom.dispose();
      edgesGeom.dispose();
      pillarGeom.dispose();
      particleGeom.dispose();

      gW.dispose();
      gS.dispose();
      glM.dispose();
      pillarMat.dispose();
      particlesMaterial.dispose();

      cones.forEach(c => {
        c.geometry.dispose();
        if (c.material instanceof THREE.Material) c.material.dispose();
      });

      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#07070d] overflow-hidden pointer-events-none z-0"
    />
  );
}
export default ThreeKineticStream;
