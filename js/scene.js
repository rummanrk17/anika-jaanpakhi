// Candlelit desk, sealed envelope, drifting rose petals.
// Everything is procedural (canvas textures + primitive geometry) — no paid assets.
import * as THREE from 'three';

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const smooth = (t) => t * t * (3 - 2 * t);

// ---------- canvas texture helpers ----------
function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function paperFibres(ctx, w, h, alpha = 0.05) {
  for (let i = 0; i < w * h * 0.012; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? `rgba(90,60,30,${alpha * Math.random()})` : `rgba(255,255,240,${alpha * Math.random()})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, rand(1, 3), rand(1, 2));
  }
}

function edgeBurn(ctx, w, h, strength = 0.35) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(120,80,40,0)');
  g.addColorStop(1, `rgba(120,80,40,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function toTexture(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function woodTexture() {
  const [c, ctx] = canvas(1024, 1024);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(0, 0, 1024, 1024);
  // planks
  for (let p = 0; p < 4; p++) {
    const y0 = p * 256;
    ctx.fillStyle = `rgba(${rand(40, 70)},${rand(22, 36)},${rand(12, 20)},0.55)`;
    ctx.fillRect(0, y0, 1024, 256);
    for (let i = 0; i < 70; i++) {
      const y = y0 + Math.random() * 256;
      ctx.strokeStyle = Math.random() < 0.6 ? `rgba(20,10,5,${rand(0.08, 0.3)})` : `rgba(150,100,60,${rand(0.05, 0.16)})`;
      ctx.lineWidth = rand(0.5, 2.5);
      ctx.beginPath();
      const amp = rand(1, 6), f = rand(0.004, 0.012), ph = rand(0, TAU);
      for (let x = 0; x <= 1024; x += 16) ctx.lineTo(x, y + Math.sin(x * f + ph) * amp);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, y0, 1024, 2);
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}

function envelopeTexture(name) {
  const [c, ctx] = canvas(1100, 700);
  ctx.fillStyle = '#efe2c8';
  ctx.fillRect(0, 0, 1100, 700);
  paperFibres(ctx, 1100, 700, 0.08);
  // side + bottom folds
  ctx.strokeStyle = 'rgba(120,90,55,0.28)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 700); ctx.lineTo(560, 330); ctx.lineTo(1100, 700);
  ctx.moveTo(0, 0); ctx.lineTo(470, 360);
  ctx.moveTo(1100, 0); ctx.lineTo(630, 360);
  ctx.stroke();
  const g = ctx.createLinearGradient(0, 330, 0, 700);
  g.addColorStop(0, 'rgba(255,250,235,0.0)');
  g.addColorStop(1, 'rgba(255,250,235,0.25)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, 700); ctx.lineTo(560, 330); ctx.lineTo(1100, 700); ctx.fill();
  edgeBurn(ctx, 1100, 700, 0.3);
  ctx.fillStyle = 'rgba(45,30,20,0.85)';
  ctx.font = '54px "Homemade Apple", cursive';
  ctx.fillText(`for ${name}`, 690, 610);
  ctx.font = '26px "Special Elite", monospace';
  ctx.fillStyle = 'rgba(60,40,25,0.6)';
  ctx.fillText('21 · 10 · 2026', 70, 640);
  return toTexture(c);
}

function flapTexture() {
  const [c, ctx] = canvas(1100, 440);
  ctx.fillStyle = '#f2e6cf';
  ctx.fillRect(0, 0, 1100, 440);
  paperFibres(ctx, 1100, 440, 0.07);
  const g = ctx.createLinearGradient(0, 440, 0, 0);
  g.addColorStop(0, 'rgba(110,80,45,0.0)');
  g.addColorStop(1, 'rgba(110,80,45,0.22)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1100, 440);
  return toTexture(c);
}

function letterTexture(name) {
  const [c, ctx] = canvas(1024, 660);
  ctx.fillStyle = '#f7eedd';
  ctx.fillRect(0, 0, 1024, 660);
  paperFibres(ctx, 1024, 660, 0.06);
  ctx.strokeStyle = 'rgba(120,140,170,0.25)';
  ctx.lineWidth = 1.5;
  for (let y = 190; y < 640; y += 46) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(964, y); ctx.stroke(); }
  ctx.fillStyle = '#2b1d14';
  ctx.font = '64px "Homemade Apple", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Happy Birthday,', 512, 110);
  ctx.font = '78px "Homemade Apple", cursive';
  ctx.fillText(name, 512, 205);
  ctx.strokeStyle = 'rgba(43,29,20,0.55)';
  ctx.lineWidth = 3;
  for (let y = 278; y < 620; y += 46) {
    ctx.beginPath();
    let x = rand(80, 120);
    const end = y > 560 ? rand(400, 600) : rand(850, 940);
    ctx.moveTo(x, y);
    while (x < end) { x += rand(14, 34); ctx.lineTo(x, y - rand(2, 14) + (Math.random() < 0.3 ? 8 : 0)); }
    ctx.stroke();
  }
  edgeBurn(ctx, 1024, 660, 0.2);
  return toTexture(c);
}

function sealTextures(letter) {
  const S = 512;
  const [c, ctx] = canvas(S, S);
  const [b, bctx] = canvas(S, S);
  ctx.fillStyle = '#8e1b1b';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#777';
  bctx.fillRect(0, 0, S, S);
  for (const [k, cc] of [[0, ctx], [1, bctx]]) {
    cc.save();
    cc.translate(S / 2, S / 2);
    cc.lineWidth = 10;
    cc.strokeStyle = k ? '#555' : '#741313';
    cc.beginPath(); cc.arc(0, 0, S * 0.36, 0, TAU); cc.stroke();
    cc.lineWidth = 4;
    cc.beginPath(); cc.arc(0, 0, S * 0.31, 0, TAU); cc.stroke();
    // little dots ring
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * TAU;
      cc.fillStyle = k ? '#999' : '#a12a26';
      cc.beginPath(); cc.arc(Math.cos(a) * S * 0.405, Math.sin(a) * S * 0.405, 5, 0, TAU); cc.fill();
    }
    cc.font = `italic 500 ${S * 0.42}px "Playfair Display", serif`;
    cc.textAlign = 'center';
    cc.textBaseline = 'middle';
    cc.fillStyle = k ? '#fff' : '#b8423a';
    cc.fillText(letter, 0, S * 0.02);
    cc.restore();
  }
  return [toTexture(c), toTexture(b, false)];
}

function glowTexture(inner = 'rgba(255,220,160,1)', outer = 'rgba(255,140,40,0)', stretch = 1) {
  const [c, ctx] = canvas(128, 128 * stretch);
  ctx.scale(1, stretch);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.55)'));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

function flameTexture() {
  const [c, ctx] = canvas(64, 160);
  const g = ctx.createRadialGradient(32, 112, 2, 32, 100, 70);
  g.addColorStop(0, 'rgba(255,255,235,1)');
  g.addColorStop(0.25, 'rgba(255,214,120,0.95)');
  g.addColorStop(0.55, 'rgba(255,120,30,0.5)');
  g.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(32, 4);
  ctx.bezierCurveTo(60, 70, 60, 150, 32, 156);
  ctx.bezierCurveTo(4, 150, 4, 70, 32, 4);
  ctx.fill();
  return toTexture(c);
}

// irregular wax blob: wobble the radius by angle
function waxify(geo, amount) {
  const p = geo.attributes.position;
  const seed = rand(0, 10);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-4) continue;
    const a = Math.atan2(z, x);
    const k = 1 + amount * (Math.sin(a * 5 + seed) * 0.6 + Math.sin(a * 11 + seed * 2) * 0.4);
    p.setX(i, x * k); p.setZ(i, z * k);
  }
  geo.computeVertexNormals();
  return geo;
}

function petalGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.62, 0.28, 0.6, 1.0, 0.08, 1.22);
  s.bezierCurveTo(0.02, 1.1, -0.02, 1.1, -0.08, 1.22);
  s.bezierCurveTo(-0.6, 1.0, -0.62, 0.28, 0, 0);
  const g = new THREE.ShapeGeometry(s, 10);
  g.translate(0, -0.6, 0);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setZ(i, x * x * 0.55 - y * 0.12); // cup + curl
  }
  g.scale(0.17, 0.17, 0.17);
  g.computeVertexNormals();
  return g;
}

function coverCrop(tex, aspect) {
  // aspect = frame w/h ; make texture "object-fit: cover"
  const img = tex.image;
  const ia = img.width / img.height;
  if (ia > aspect) { tex.repeat.set(aspect / ia, 1); tex.offset.set((1 - aspect / ia) / 2, 0); }
  else { tex.repeat.set(1, ia / aspect); tex.offset.set(0, (1 - ia / aspect) / 2); }
}

// ======================================================================
export function createScene(canvasEl, opts) {
  const { name = 'Anika', photos = [], mobile = false, reduced = false } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const BG = new THREE.Color('#0b0705');
  scene.background = BG;
  scene.fog = new THREE.Fog('#0b0705', 9, 24);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);
  const cam = { base: new THREE.Vector3(0, 6.4, 6.9), look: new THREE.Vector3(0, 0, 0.35), parallax: 1 };
  camera.position.copy(cam.base);

  // ---- lights
  const hemi = new THREE.HemisphereLight('#ffd8b0', '#120806', 0.35);
  scene.add(hemi);
  const moon = new THREE.DirectionalLight('#8ea4ff', 0.35);
  moon.position.set(-6, 9, -5);
  scene.add(moon);

  const candleLight = new THREE.PointLight('#ffad5c', 38, 0, 1.6);
  candleLight.castShadow = true;
  candleLight.shadow.mapSize.set(mobile ? 512 : 1024, mobile ? 512 : 1024);
  candleLight.shadow.bias = -0.002;
  candleLight.shadow.radius = 6;
  scene.add(candleLight);

  // ---- desk world (hidden after opening)
  const desk = new THREE.Group();
  scene.add(desk);

  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.75, metalness: 0.05 })
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  desk.add(table);

  // ---- envelope
  const env = new THREE.Group();
  env.rotation.y = -0.06;
  desk.add(env);

  const W = 4.4, D = 2.8;
  const paperMat = new THREE.MeshStandardMaterial({ color: '#e9dcc2', roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(W, 0.05, D), [
    paperMat, paperMat,
    new THREE.MeshStandardMaterial({ map: envelopeTexture(name), roughness: 0.85 }),
    paperMat, paperMat, paperMat,
  ]);
  body.position.y = 0.025;
  body.castShadow = body.receiveShadow = true;
  env.add(body);

  // the letter inside
  const letter = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 2.58),
    new THREE.MeshStandardMaterial({ map: letterTexture(name), roughness: 0.9, side: THREE.DoubleSide })
  );
  letter.rotation.x = -Math.PI / 2;
  letter.position.set(0, 0.02, 0);
  letter.castShadow = true;
  env.add(letter);

  // flap, hinged at the far edge
  const flapPivot = new THREE.Group();
  flapPivot.position.set(0, 0.052, -D / 2);
  env.add(flapPivot);
  const fs = new THREE.Shape();
  fs.moveTo(-W / 2, 0); fs.lineTo(W / 2, 0); fs.lineTo(0.16, -1.86);
  fs.quadraticCurveTo(0, -1.92, -0.16, -1.86); fs.lineTo(-W / 2, 0);
  const flapTex = flapTexture();
  flapTex.repeat.set(1 / W, 1 / 1.92);
  flapTex.offset.set(0.5, 1);
  const flap = new THREE.Mesh(
    new THREE.ShapeGeometry(fs),
    new THREE.MeshStandardMaterial({ map: flapTex, roughness: 0.85, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 })
  );
  flap.rotation.x = -Math.PI / 2;
  flap.castShadow = true;
  flapPivot.add(flap);

  // wax seal
  const [sealMap, sealBump] = sealTextures(name[0]);
  const sealColor = new THREE.MeshStandardMaterial({ color: '#8e1b1b', roughness: 0.32, metalness: 0.08, emissive: '#e8261a', emissiveIntensity: 0 });
  const sealTop = new THREE.MeshStandardMaterial({ map: sealMap, bumpMap: sealBump, bumpScale: 3, roughness: 0.3, metalness: 0.08, emissive: '#e8261a', emissiveIntensity: 0 });
  const seal = new THREE.Group();
  const spill = new THREE.Mesh(waxify(new THREE.CylinderGeometry(0.58, 0.6, 0.03, 64), 0.09), sealColor);
  const disc = new THREE.Mesh(waxify(new THREE.CylinderGeometry(0.44, 0.47, 0.1, 64), 0.035), [sealColor, sealTop, sealColor]);
  disc.position.y = 0.05;
  spill.castShadow = disc.castShadow = true;
  seal.add(spill, disc);
  seal.position.set(0, 0.075, -D / 2 + 1.72);
  seal.rotation.y = 0.25;
  env.add(seal);

  // ---- candle
  const candle = new THREE.Group();
  candle.position.set(-4.1, 0, -2.4);
  desk.add(candle);
  const brass = new THREE.MeshStandardMaterial({ color: '#b08a4a', metalness: 0.85, roughness: 0.35 });
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.62, 0.1, 48), brass);
  dish.position.y = 0.05;
  dish.castShadow = dish.receiveShadow = true;
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 1.25, 40),
    new THREE.MeshStandardMaterial({ color: '#f1e4cc', roughness: 0.55, emissive: '#ff9a40', emissiveIntensity: 0.03 }));
  wax.position.y = 0.72;
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 6), new THREE.MeshBasicMaterial({ color: '#1b120c' }));
  wick.position.y = 1.41;
  candle.add(dish, wax, wick);
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  flame.scale.set(0.2, 0.5, 1);
  flame.position.y = 1.64;
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,190,110,0.55)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
  halo.scale.set(2.6, 2.6, 1);
  halo.position.y = 1.6;
  candle.add(flame, halo);
  candleLight.position.set(candle.position.x, 1.95, candle.position.z);

  // ---- fountain pen
  const pen = new THREE.Group();
  const black = new THREE.MeshStandardMaterial({ color: '#141010', roughness: 0.25, metalness: 0.3 });
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 1.7, 24), black);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.8, 24), black);
  cap.position.y = 1.1;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.086, 0.06, 24), brass);
  band.position.y = 0.72;
  const nib = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 24), brass);
  nib.position.y = -1.0; nib.rotation.x = Math.PI;
  for (const m of [barrel, cap, nib]) m.castShadow = true;
  pen.add(barrel, cap, band, nib);
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.55;
  pen.position.set(1.7, 0.08, 2.05);
  desk.add(pen);

  // ---- polaroids on the desk
  const loader = new THREE.TextureLoader();
  const polaroidSpots = [
    { p: [3.55, 0.012, -1.0], r: 0.32 },
    { p: [3.15, 0.022, 0.85], r: -0.18 },
    { p: [-3.35, 0.012, 1.25], r: 0.22 },
  ];
  const loads = photos.slice(0, 3).map((src, i) => new Promise((res) => {
    const spot = polaroidSpots[i];
    const g = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.012, 1.68), new THREE.MeshStandardMaterial({ color: '#f4efe4', roughness: 0.8 }));
    frame.castShadow = frame.receiveShadow = true;
    g.add(frame);
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      coverCrop(tex, 1);
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 }));
      photo.rotation.x = -Math.PI / 2;
      photo.position.set(0, 0.008, -0.13);
      g.add(photo);
      res();
    }, undefined, () => res());
    g.position.set(...spot.p);
    g.rotation.y = spot.r;
    desk.add(g);
  }));

  // ---- dust motes
  const DUST = mobile ? 120 : 260;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.05, map: glowTexture('rgba(255,225,180,1)', 'rgba(255,200,150,0)'), color: '#ffd9a8',
    transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(dust);
  let dustBox;
  function seedDust(box) {
    dustBox = box;
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = rand(box[0], box[1]);
      dustPos[i * 3 + 1] = rand(box[2], box[3]);
      dustPos[i * 3 + 2] = rand(box[4], box[5]);
      dustSeed[i] = rand(0, 100);
    }
    dustGeo.attributes.position.needsUpdate = true;
  }
  seedDust([-7, 5, 0.3, 6, -5, 3]);

  // ---- petals
  const COUNT = reduced ? 40 : mobile ? 80 : 150;
  const petals = new THREE.InstancedMesh(petalGeometry(), new THREE.MeshStandardMaterial({ roughness: 0.55, side: THREE.DoubleSide }), COUNT);
  petals.castShadow = true;
  petals.frustumCulled = false;
  const palette = ['#9d1f33', '#b8324a', '#d65a6c', '#e98a99', '#7e1626', '#c9405a'].map((c) => new THREE.Color(c));
  const P = Array.from({ length: COUNT }, (_, i) => {
    petals.setColorAt(i, palette[i % palette.length]);
    return {
      pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: new THREE.Euler(rand(0, TAU), rand(0, TAU), rand(0, TAU)),
      spin: new THREE.Vector3(rand(-1.5, 1.5), rand(-1.5, 1.5), rand(-1.5, 1.5)),
      phase: rand(0, TAU), fall: rand(0.25, 0.55), scale: rand(0.75, 1.3), rest: 0,
      heart: new THREE.Vector3(),
    };
  });
  scene.add(petals);

  let mode = 'desk';
  const vol = { desk: [-8, 8, 0, 8, -6, 4], ambient: [-12, 12, -7, 7, -7, 3] };
  function spawn(p, anywhere) {
    const v = vol[mode === 'ambient' ? 'ambient' : 'desk'];
    p.pos.set(rand(v[0], v[1]), anywhere ? rand(v[2], v[3]) : v[3] + rand(0, 2), rand(v[4], v[5]));
    p.vel.set(0, -p.fall, 0);
    p.rest = 0;
  }
  P.forEach((p) => spawn(p, true));

  // heart targets (in ambient space)
  function layoutHeart() {
    const visH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const visW = visH * camera.aspect;
    const s = Math.min(visH * 0.88 / 30, visW * 0.85 / 34);
    P.forEach((p, i) => {
      const t = (i / COUNT) * TAU + rand(-0.05, 0.05);
      const inner = i % 4 === 0 ? Math.sqrt(Math.random()) * 0.85 : 1;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      p.heart.set(x * s * inner + rand(-0.06, 0.06), (y + 2.5) * s * inner + rand(-0.06, 0.06), rand(-0.4, 0.4));
    });
  }

  // ---- state driven by main.js
  const state = { sealGlow: 0, heart: 0, wind: 0, flicker: 1, pointer: new THREE.Vector2(), pointerSmooth: new THREE.Vector2() };

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (mode !== 'ambient') {
      // portrait screens: back the camera off so the envelope still fits
      const k = camera.aspect < 1 ? THREE.MathUtils.clamp(0.82 / camera.aspect, 1, 1.95) : 1;
      cam.base.set(0, 6.4 * k, 6.9 * k);
      cam.look.set(0, 0, camera.aspect < 1 ? 1.5 : 0.35);
      renderer.toneMappingExposure = camera.aspect < 1 ? 1.35 : 1.05; // candle is off-screen on phones
    }
    layoutHeart();
  }
  window.addEventListener('resize', resize);
  resize();
  if (!mobile && !reduced) {
    window.addEventListener('pointermove', (e) => {
      state.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    });
  }

  // ---- loop
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Vector3();
  const clock = new THREE.Clock();
  let running = true;

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // camera
    if (mobile || reduced) state.pointer.set(Math.sin(t * 0.25) * 0.25, Math.cos(t * 0.2) * 0.15);
    state.pointerSmooth.lerp(state.pointer, 1 - Math.exp(-dt * 3));
    const px = state.pointerSmooth.x * cam.parallax, py = state.pointerSmooth.y * cam.parallax;
    camera.position.set(cam.base.x + px * (mode === 'ambient' ? 0.6 : 0.9), cam.base.y - py * 0.45, cam.base.z);
    camera.lookAt(cam.look);

    // candle flicker
    const n = Math.sin(t * 7.3) * 0.5 + Math.sin(t * 13.1 + 1.3) * 0.3 + Math.sin(t * 23.7) * 0.2;
    if (mode !== 'ambient') {
      candleLight.intensity = 38 * state.flicker * (0.88 + n * 0.1);
      flame.scale.set(0.2 + n * 0.015, 0.5 + n * 0.05, 1);
      flame.material.rotation = n * 0.06;
      halo.material.opacity = 0.8 + n * 0.15;
    }

    // seal glow
    const glow = state.sealGlow * (0.55 + Math.sin(t * 2.6) * 0.25);
    sealColor.emissiveIntensity = sealTop.emissiveIntensity = glow;

    // dust
    for (let i = 0; i < DUST; i++) {
      const s = dustSeed[i];
      dustPos[i * 3] += Math.sin(t * 0.3 + s) * 0.0025;
      dustPos[i * 3 + 1] += Math.cos(t * 0.23 + s * 1.3) * 0.002 + 0.0008 - state.wind * 0.004;
      dustPos[i * 3 + 2] += Math.sin(t * 0.17 + s * 0.7) * 0.002;
      if (dustPos[i * 3 + 1] > dustBox[3]) dustPos[i * 3 + 1] = dustBox[2];
      if (dustPos[i * 3 + 1] < dustBox[2]) dustPos[i * 3 + 1] = dustBox[3];
    }
    dustGeo.attributes.position.needsUpdate = true;

    // petals
    const h = smooth(THREE.MathUtils.clamp(state.heart, 0, 1));
    const beat = 1 + Math.pow(Math.max(0, Math.sin(t * 2.4)), 6) * 0.06;
    const floor = vol[mode === 'ambient' ? 'ambient' : 'desk'][2];
    for (let i = 0; i < COUNT; i++) {
      const p = P[i];
      if (p.rest > 0) {
        p.rest -= dt;
        if (p.rest <= 0) spawn(p, false);
      } else {
        const sway = Math.sin(t * 0.9 + p.phase);
        p.vel.x += (sway * 0.35 - p.vel.x) * dt * 0.9;
        p.vel.y += (-p.fall - p.vel.y) * dt * 0.9;
        p.vel.z += (Math.cos(t * 0.7 + p.phase) * 0.15 - p.vel.z) * dt * 0.9;
        p.pos.addScaledVector(p.vel, dt);
        p.pos.y += state.wind * dt;
        p.rot.x += p.spin.x * dt * (1 - h); p.rot.y += p.spin.y * dt * (1 - h); p.rot.z += p.spin.z * dt * 0.5;
        if (mode !== 'ambient' && p.pos.y < 0.03 && Math.abs(p.pos.x) < 9) {
          p.pos.y = 0.03 + i * 0.0001;
          p.rot.set(-Math.PI / 2 + rand(-0.15, 0.15), 0, rand(0, TAU));
          p.rest = rand(6, 14);
        } else if (p.pos.y < floor - 1) spawn(p, false);
        else if (p.pos.y > vol.ambient[3] + 3) p.pos.y = floor - 0.5;
      }
      dummy.position.copy(p.pos);
      if (h > 0) dummy.position.lerp(tmp.set(p.heart.x * beat, p.heart.y * beat, p.heart.z), h);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // ---- public api
  const api = {
    ready: Promise.all(loads),
    start() { clock.start(); requestAnimationFrame(tick); },
    state,

    setSealGlow(v) { gsap.to(state, { sealGlow: v, duration: 1.2 }); },

    burst(count = 40) {
      const origin = seal.getWorldPosition(new THREE.Vector3());
      for (let i = 0; i < Math.min(count, COUNT); i++) {
        const p = P[i];
        p.rest = 0;
        p.pos.copy(origin).add(new THREE.Vector3(rand(-0.3, 0.3), 0.2, rand(-0.3, 0.3)));
        p.vel.set(rand(-2.2, 2.2), rand(2, 4.5), rand(-2, 1.5));
      }
    },

    // the cinematic opening; resolves when the screen is covered by paper
    open({ flash, onCovered }) {
      return new Promise((resolve) => {
        cam.parallax = 0.25;
        const fast = reduced ? 0.4 : 1;
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        const closeK = camera.aspect < 1 ? 1.45 : 1;
        tl.to(state, { sealGlow: 1.4, duration: 0.6 * fast }, 0)
          .to(state, { flicker: 1.5, duration: 0.5, yoyo: true, repeat: 1 }, 0)
          .to(cam.base, { x: 0, y: 4.6 * closeK, z: 4.4 * closeK, duration: 1.6 * fast }, 0)
          .to(cam.look, { x: 0, y: 0, z: 0, duration: 1.6 * fast }, 0)
          // seal pops off
          .to(seal.position, { y: 1.2, duration: 0.7 * fast, ease: 'back.in(2)' }, 0.9 * fast)
          .to(seal.rotation, { x: 1.4, z: 0.8, duration: 0.7 * fast, ease: 'power2.in' }, 0.9 * fast)
          .to(seal.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.35 * fast, ease: 'power2.in' }, 1.35 * fast)
          .call(() => api.burst(reduced ? 10 : 45), null, 1.55 * fast)
          // flap opens
          .to(flapPivot.rotation, { x: -Math.PI * 0.94, duration: 1.3 * fast, ease: 'power3.inOut' }, 1.5 * fast)
          // letter slides out of the envelope
          .to(letter.position, { z: -2.25, y: 0.12, duration: 1.2 * fast, ease: 'power2.inOut' }, 2.4 * fast)
          // letter rises to the camera
          .add(() => {
            const from = letter.getWorldPosition(new THREE.Vector3());
            const qFrom = letter.getWorldQuaternion(new THREE.Quaternion());
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            const to = camera.position.clone().addScaledVector(dir, 1.2);
            const qTo = camera.quaternion.clone();
            const o = { k: 0 };
            const parentInv = env.matrixWorld.clone().invert();
            gsap.to(o, {
              k: 1, duration: 1.5 * fast, ease: 'power3.in',
              onUpdate() {
                const wp = from.clone().lerp(to, o.k);
                wp.y += Math.sin(o.k * Math.PI) * 0.8;
                letter.position.copy(wp.applyMatrix4(parentInv));
                const wq = qFrom.clone().slerp(qTo, Math.min(1, o.k * 1.3));
                const pq = env.getWorldQuaternion(new THREE.Quaternion()).invert();
                letter.quaternion.copy(pq.multiply(wq));
              },
            });
          }, 3.5 * fast)
          .to(flash, { opacity: 1, duration: 0.7 * fast, ease: 'power1.in' }, 4.35 * fast)
          .call(() => { onCovered?.(); resolve(); }, null, 5.1 * fast);
      });
    },

    // after opening: hide the desk, petals become a page-wide ambient layer
    toAmbient() {
      mode = 'ambient';
      desk.visible = false;
      scene.background = null;
      scene.fog = new THREE.Fog('#120c09', 9, 24);
      renderer.setClearColor(0x000000, 0);
      cam.base.set(0, 0, 10);
      cam.look.set(0, 0, 0);
      cam.parallax = 0.6;
      renderer.toneMappingExposure = 1.05;
      candleLight.position.set(4, 5, 7);
      candleLight.intensity = 60;
      candleLight.castShadow = false;
      hemi.intensity = 0.55;
      halo.visible = flame.visible = false;
      seedDust([-11, 11, -6, 6, -6, 4]);
      dust.material.size = 0.09;
      P.forEach((p) => spawn(p, true));
      resize();
    },

    stop() { running = false; },
  };
  return api;
}
