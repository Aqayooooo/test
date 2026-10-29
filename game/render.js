import {
  VIEW,
  WORLD,
  HOUSE,
  VAN,
  GOAL,
  CAPACITY,
  platforms,
  ladders,
  hideouts,
  lightDistance,
  nearestLoot,
  hidingPlace,
  atVan,
  KEY,
  SAFE,
  BREAKER,
  SECURITY_CAMERAS,
  CREAKY_BOARDS,
  cameraAngle,
  cameraDistance,
  interactionTarget,
} from './engine.js';

const C = {
  sky: '#111d20',
  paper: '#e8dfc8',
  gold: '#c7ab71',
  red: '#b85342',
  wood: '#695344',
  outline: '#1a2423',
  green: '#8d9b77',
};
function rect(c, x, y, w, h, fill, stroke) {
  c.fillStyle = fill;
  c.fillRect(x, y, w, h);
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.strokeRect(x + 0.5, y + 0.5, w, h);
  }
}
function line(c, x, y, xx, yy, color, width = 1) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(xx, yy);
  c.stroke();
}
function ellipse(c, x, y, rx, ry, fill, stroke) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}
function path(c, points, fill, stroke) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1.5;
    c.stroke();
  }
}
function text(c, str, x, y, size = 10, color = C.gold, font = 'Manrope') {
  c.font = `500 ${size}px ${font}, sans-serif`;
  c.fillStyle = color;
  c.fillText(str, x, y);
}
function windowArt(c, x, y, w = 85, h = 100) {
  rect(c, x - 5, y - 5, w + 10, h + 10, '#45473d', '#6d6b54');
  const gradient = c.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, '#172b31');
  gradient.addColorStop(1, '#354941');
  rect(c, x, y, w, h, gradient);
  path(
    c,
    [
      [x, y + h],
      [x + w * 0.4, y + h * 0.45],
      [x + w * 0.7, y + h * 0.8],
      [x + w, y + h * 0.6],
      [x + w, y + h],
    ],
    '#263a38',
  );
  line(c, x + w / 2, y, x + w / 2, y + h, '#736f54', 4);
  line(c, x, y + h * 0.5, x + w, y + h * 0.5, '#736f54', 3);
  rect(c, x - 9, y + h + 2, w + 18, 5, '#7d7258');
}
function tree(c, x, y) {
  path(
    c,
    [
      [x - 8, y],
      [x - 5, y - 180],
      [x + 3, y - 240],
      [x + 11, y - 168],
      [x + 9, y],
    ],
    '#30352b',
    '#57503c',
  );
  for (let i = 0; i < 8; i++) {
    const side = i % 2 ? 1 : -1,
      yy = y - 65 - i * 20,
      xx = x + side * (35 + i * 5);
    line(c, x, yy + 20, xx, yy - 22, '#343c2f', 7);
    for (let j = 0; j < 5; j++) {
      const lx = xx + Math.sin(i * 3 + j * 2) * 27,
        ly = yy - 22 + Math.cos(j * 4) * 22;
      path(
        c,
        [
          [lx, ly - 8],
          [lx + 4, ly - 2],
          [lx + 11, ly - 4],
          [lx + 6, ly + 3],
          [lx + 7, ly + 9],
          [lx, ly + 5],
          [lx - 6, ly + 8],
          [lx - 4, ly],
          [lx - 9, ly - 3],
          [lx - 3, ly - 3],
        ],
        i % 3 ? '#6c4032' : '#9e4d37',
      );
    }
  }
}
function van(c, x, y, time, moving) {
  c.save();
  c.translate(x, y + (moving ? Math.sin(time * 25) * 0.8 : 0));
  ellipse(c, 0, 6, 95, 8, '#07101388');
  path(
    c,
    [
      [-93, -20],
      [-93, -81],
      [-53, -84],
      [-33, -64],
      [64, -64],
      [83, -42],
      [83, -18],
    ],
    '#bdb294',
    '#d2c4a1',
  );
  rect(c, -92, -29, 174, 10, '#8f4938');
  path(
    c,
    [
      [-84, -76],
      [-57, -77],
      [-40, -59],
      [-84, -59],
    ],
    '#243c3d',
    '#766f58',
  );
  rect(c, -28, -55, 98, 3, '#cfc2a0');
  line(c, -31, -62, -31, -20, '#7e765e');
  line(c, 38, -61, 38, -18, '#7e765e');
  rect(c, 18, -44, 9, 2, '#514c3e');
  rect(c, -96, -39, 7, 11, '#cab57b');
  rect(c, 79, -35, 5, 9, C.red);
  for (const xx of [-57, 52]) {
    ellipse(c, xx, -11, 16, 16, '#101c1d', '#93856b');
    ellipse(c, xx, -11, 7, 7, '#727363');
  }
  text(c, 'NOCTURNE', -14, -41, 8, '#514b3e');
  // otwarte drzwi = powrot
  if (!moving) {
    path(
      c,
      [
        [83, -61],
        [105, -69],
        [105, -23],
        [83, -18],
      ],
      '#70664f',
      '#bfb18c',
    );
    text(c, '←', 91, -38, 17, C.paper);
  }
  c.restore();
}
function furniture(c, state) {
  windowArt(c, 1030, 148, 76, 95);
  windowArt(c, 1630, 145, 90, 112);
  windowArt(c, 745, 358, 65, 75);
  windowArt(c, 1550, 355, 70, 95);
  // sypialnia
  rect(c, 1430, 267, 196, 14, '#76654f', '#9b8765');
  rect(c, 1430, 226, 9, 64, '#726149');
  rect(c, 1608, 250, 8, 40, '#726149');
  ellipse(c, 1485, 253, 25, 11, '#9b947b');
  if (!state.guard.awake) ellipse(c, 1490, 246, 11, 10, '#bba381');
  path(
    c,
    [
      [1498, 248],
      [1578, 248],
      [1598, 267],
      [1490, 267],
    ],
    '#59675a',
    '#7b8169',
  );
  line(c, 1508, 250, 1515, 264, '#7d826a');
  line(c, 1534, 250, 1541, 265, '#7d826a');
  if (!state.guard.awake) {
    text(c, 'z', 1500, 215 + Math.sin(state.time) * 2, 13, '#acb698');
    text(c, 'z', 1517, 198 + Math.sin(state.time + 1) * 2, 10, '#84937b');
  }
  rect(c, 1218, 160, 62, 75, '#7d7051', '#9d8962');
  rect(c, 1225, 167, 48, 61, '#243c3d');
  ellipse(c, 1256, 187, 11, 11, '#9c9c7a');
  rect(c, 1270, 266, 63, 23, '#514b3a', '#897658');
  // salon
  ellipse(c, 1268, 330, 20, 20, '#6a654e', '#a58d66');
  ellipse(c, 1268, 330, 16, 16, '#c1b28c');
  line(c, 1268, 330, 1268, 319, '#393b30', 2);
  line(c, 1268, 330, 1276, 334, '#393b30', 2);
  line(c, 1165, 303, 1165, 327, '#83714e');
  path(
    c,
    [
      [1153, 328],
      [1177, 328],
      [1185, 341],
      [1145, 341],
    ],
    '#807453',
    '#a38a61',
  );
  rect(c, 1740, 455, 43, 34, '#66543d', '#877052');
  rect(c, 1744, 460, 34, 11, '#4b4435');
  ellipse(c, 1732, 448, 13, 5, '#8e7150');
  path(
    c,
    [
      [1720, 448],
      [1744, 448],
      [1740, 472],
      [1725, 472],
    ],
    '#8e7150',
    '#b6976d',
  );
  for (let i = 0; i < 5; i++)
    line(c, 1732, 448, 1713 + Math.sin(i * 2) * 25, 421 - (i % 2) * 8, '#758167', 3);
  for (const p of platforms.filter((p) => !p.kind)) {
    rect(c, p.x, p.y, p.w, 6, '#746347', '#b59a69');
    path(
      c,
      [
        [p.x + 8, p.y + 6],
        [p.x + 8, p.y + 20],
        [p.x + 23, p.y + 6],
      ],
      '#574e3b',
    );
    for (let i = 0; i < Math.min(5, p.w / 20); i++) {
      const xx = p.x + 7 + i * 13;
      rect(c, xx, p.y - 26, 8, 25, ['#8a6247', '#66735e', '#ad986b', '#6a6b59'][i % 4]);
      line(c, xx + 2, p.y - 21, xx + 6, p.y - 21, '#b4a07b');
    }
  }
  // piwnica
  for (let i = 0; i < 6; i++) {
    rect(c, 1560 + i * 17, 689, 7, 25, '#4a6150', '#647b5a');
    rect(c, 1562 + i * 17, 680, 3, 10, '#667754');
  }
  rect(c, 1548, 714, 129, 5, '#7c674c');
  text(c, 'CAVE / 1986', 1055, 572, 11, '#6e7056');
  for (const l of ladders) {
    line(c, l.x - 14, l.top - 8, l.x - 14, l.bottom, '#89744f', 3);
    line(c, l.x + 14, l.top - 8, l.x + 14, l.bottom, '#89744f', 3);
    for (let y = l.top + 5; y < l.bottom; y += 17) line(c, l.x - 14, y, l.x + 14, y, '#9a8157', 2);
  }
  for (const h of hideouts) {
    if (h.kind === 'table') {
      rect(c, h.x - 51, h.y - 50, 102, 9, '#847050', '#ac9264');
      rect(c, h.x - 43, h.y - 41, 5, 41, '#7c694c');
      rect(c, h.x + 38, h.y - 41, 5, 41, '#7c694c');
      path(
        c,
        [
          [h.x - 45, h.y - 41],
          [h.x + 45, h.y - 41],
          [h.x + 38, h.y - 10],
          [h.x - 38, h.y - 10],
        ],
        '#424b3e',
      );
    } else if (h.kind === 'sofa') {
      rect(c, h.x - 55, h.y - 45, 110, 37, '#56624e', '#829071');
      rect(c, h.x - 60, h.y - 29, 15, 22, '#758067');
      rect(c, h.x + 45, h.y - 29, 15, 22, '#758067');
      line(c, h.x, h.y - 41, h.x, h.y - 10, '#384c3d');
      rect(c, h.x - 45, h.y - 7, 6, 7, C.wood);
      rect(c, h.x + 40, h.y - 7, 6, 7, C.wood);
    } else if (h.kind === 'curtain') {
      path(
        c,
        [
          [h.x - 37, h.y - 143],
          [h.x + 37, h.y - 143],
          [h.x + 30, h.y],
          [h.x - 31, h.y],
        ],
        '#735246',
        '#b08867',
      );
      for (let i = 0; i < 6; i++)
        line(c, h.x - 26 + i * 11, h.y - 138, h.x - 24 + i * 10, h.y - 5, '#4a4238', 2);
    } else if (h.kind === 'barrels') {
      for (let i = 0; i < 2; i++) {
        ellipse(c, h.x - 20 + i * 36, h.y - 25, 21, 28, '#65573f', '#97815a');
        line(c, h.x - 39 + i * 36, h.y - 36, h.x - 1 + i * 36, h.y - 36, '#a08e65', 3);
        line(c, h.x - 39 + i * 36, h.y - 14, h.x - 1 + i * 36, h.y - 14, '#a08e65', 3);
      }
    } else {
      rect(c, h.x - 46, h.y - 48, 92, 48, '#635640', '#8d7d56');
      line(c, h.x - 42, h.y - 44, h.x + 42, h.y - 4, '#8d7d56', 3);
      line(c, h.x + 42, h.y - 44, h.x - 42, h.y - 4, '#8d7d56', 3);
    }
    // znaczek ze mozna uzyc
    text(c, 'S', h.x - 3, h.y - 61, 9, '#a6b18c');
  }
}
function loot(c, item, time) {
  if (item.taken || item.locked) return;
  c.save();
  c.translate(item.x, item.y);
  const glow = c.createRadialGradient(0, 0, 0, 0, 0, 28);
  glow.addColorStop(0, '#d9b56827');
  glow.addColorStop(1, '#d9b56800');
  ellipse(c, 0, 0, 28, 28, glow);
  const gold = '#d9be7c';
  if (item.type === 'gem') {
    path(
      c,
      [
        [-11, -7],
        [-5, -14],
        [6, -14],
        [12, -6],
        [0, 12],
      ],
      '#89af8c',
      gold,
    );
    line(c, -5, -13, 0, 12, '#d6dfae');
    line(c, 6, -13, 0, 12, '#d6dfae');
    line(c, -11, -7, 12, -6, gold);
  } else if (item.type === 'coins') {
    for (let i = 0; i < 3; i++) {
      ellipse(c, -6 + i * 5, 6 - i * 3, 7, 3, gold, '#f2dfae');
      rect(c, -13 + i * 5, 5 - i * 3, 14, 3, '#b69a61');
    }
  } else if (item.type === 'vase') {
    path(
      c,
      [
        [-5, -17],
        [5, -17],
        [4, -7],
        [11, 3],
        [8, 13],
        [-8, 13],
        [-11, 3],
        [-4, -7],
      ],
      '#8a9a82',
      gold,
    );
    line(c, -8, 5, 8, 5, '#d9bd81', 2);
  } else if (item.type === 'ring' || item.type === 'watch' || item.type === 'necklace') {
    c.strokeStyle = gold;
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(
      0,
      -1,
      item.type === 'necklace' ? 10 : 6,
      item.type === 'necklace' ? 7 : 6,
      0,
      0,
      Math.PI * 2,
    );
    c.stroke();
    path(
      c,
      [
        [0, 5],
        [4, 9],
        [0, 13],
        [-4, 9],
      ],
      C.red,
      gold,
    );
  } else if (item.type === 'wine') {
    rect(c, -4, -12, 8, 25, '#668167', gold);
    rect(c, -2, -19, 4, 8, '#9c9165');
    rect(c, -3, -1, 6, 8, '#c0af83');
  } else if (item.type === 'painting') {
    rect(c, -12, -13, 24, 26, gold);
    rect(c, -9, -10, 18, 20, '#5f796a');
    path(
      c,
      [
        [-8, 9],
        [1, -1],
        [9, 9],
      ],
      '#ac8863',
    );
  } else if (item.type === 'treasure') {
    rect(c, -12, -4, 24, 16, '#8c6544', gold);
    path(
      c,
      [
        [-12, -5],
        [-7, -12],
        [8, -12],
        [12, -5],
      ],
      '#ab8353',
      gold,
    );
    rect(c, -2, -3, 4, 7, gold);
  } else {
    ellipse(c, 0, -7, 8, 7, gold);
    rect(c, -2, -3, 4, 13, gold);
    ellipse(c, 0, 11, 8, 2, gold);
  }
  const pulse = 0.6 + Math.sin(time * 2 + item.id) * 0.3;
  c.globalAlpha = pulse;
  line(c, 17, -21, 17, -13, C.paper);
  line(c, 13, -17, 21, -17, C.paper);
  c.restore();
}
function cat(c, p, time, arriving = false) {
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.facing, 1);
  c.globalAlpha = p.hidden ? 0.4 : 1;
  const walk = p.grounded ? Math.sin(time * 17) * Math.min(Math.abs(p.vx) / 205, 1) * 3 : 0;
  ellipse(c, 0, 1, 19, 4, '#070e1088');
  const squash =
    p.hidden || p.sneaking ? 0.83 : p.landing > 0 ? 1 - p.landing * 1.2 : !p.grounded ? 1.04 : 1;
  c.scale(1 / Math.sqrt(squash), squash);
  c.translate(0, -Math.abs(walk) * 0.25);
  c.strokeStyle = '#111e20';
  c.lineWidth = 6;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(-10, -10);
  c.bezierCurveTo(-34, -6, -31, -28, -22, -28 + Math.sin(time * 2.4) * 3);
  c.stroke();
  c.strokeStyle = '#9b9876';
  c.lineWidth = 1;
  c.stroke();
  ellipse(c, -2, -15, 12, 14, '#152224', '#a4a180');
  for (const [x, offset] of [
    [-9, walk],
    [5, -walk],
  ]) {
    line(c, x, -7, x + offset, 0, '#152224', 6);
    line(c, x + offset - 3, 0, x + offset + 3, 0, '#c4b28a', 1);
  }
  ellipse(c, 4, -30, 13, 11, '#182527', '#a4a180');
  path(
    c,
    [
      [-8, -34],
      [-7, -49],
      [2, -39],
    ],
    '#182527',
    '#a4a180',
  );
  path(
    c,
    [
      [7, -39],
      [18, -47],
      [16, -32],
    ],
    '#182527',
    '#a4a180',
  );
  ellipse(c, 5, -31, 4, 2.4, C.gold);
  ellipse(c, 14, -31, 3, 2.2, C.gold);
  line(c, 6, -33, 6, -29, '#172022', 1.6);
  line(c, 15, -33, 15, -29, '#172022', 1.4);
  path(
    c,
    [
      [15, -25],
      [19, -24],
      [16, -22],
    ],
    '#b9654c',
  );
  line(c, 12, -23, 25, -25, '#b3ab8b');
  path(
    c,
    [
      [-7, -23],
      [11, -22],
      [7, -16],
      [-9, -17],
    ],
    C.red,
    '#d08462',
  );
  path(
    c,
    [
      [-7, -21],
      [-22, -18],
      [-17, -14],
      [-25, -12],
      [-4, -17],
    ],
    '#a8473a',
  );
  if (p.bag.length) {
    ellipse(c, -11, -16, 7, 10, '#8c7950', '#c3ab72');
    line(c, -10, -25, -4, -18, '#c3ab72');
  }
  if (p.hidden) {
    c.globalAlpha = 1;
    text(c, '···', -10, -56, 13, C.green);
  }
  c.restore();
}
function person(c, g, time) {
  if (!g.awake) return;
  c.save();
  c.translate(g.x, g.y);
  c.scale(g.facing, 1);
  ellipse(c, 0, 2, 17, 4, '#070e1066');
  const step = g.moving ? Math.sin(time * 9) * 5 : 0;
  line(c, -5, -20, -8 + step, -2, '#6e7971', 6);
  line(c, 6, -20, 9 - step, -2, '#6e7971', 6);
  path(
    c,
    [
      [-11, -42],
      [8, -42],
      [13, -18],
      [-13, -18],
    ],
    '#69766b',
    '#9fa68a',
  );
  ellipse(c, -1, -50, 10, 12, '#bda382', '#c4b596');
  path(
    c,
    [
      [-12, -55],
      [-8, -66],
      [7, -64],
      [10, -53],
    ],
    '#68796d',
    '#a3ad91',
  );
  ellipse(c, -9, -65, 4, 4, '#a5af92');
  line(c, 8, -39, 20, -37, '#a9ab8d', 5);
  rect(c, 16, -41, 16, 7, '#baa86d');
  c.restore();
}
function flashlight(c, s) {
  const g = s.guard;
  if (!g.awake) return;
  if (
    g.x + 330 < s.camera.x ||
    g.x - 330 > s.camera.x + VIEW.width ||
    g.y + 330 < s.camera.y ||
    g.y - 330 > s.camera.y + VIEW.height
  )
    return;
  const ox = g.x + g.facing * 12,
    oy = g.y - 38;
  const grad = c.createRadialGradient(ox, oy, 5, ox, oy, 330);
  grad.addColorStop(0, '#eee3ad43');
  grad.addColorStop(0.65, '#d7d69a22');
  grad.addColorStop(1, '#d7d69a02');
  c.beginPath();
  c.moveTo(ox, oy);
  for (let i = 0; i <= 64; i++) {
    const a = g.angle - 0.44 + (i / 64) * 0.88,
      d = lightDistance(g, a);
    c.lineTo(ox + Math.cos(a) * d, oy + Math.sin(a) * d);
  }
  c.closePath();
  c.fillStyle = grad;
  c.fill();
}
let grain;
function texture(c) {
  if (!grain) {
    const tile = document.createElement('canvas');
    tile.width = 100;
    tile.height = 100;
    const tc = tile.getContext('2d');
    for (let i = 0; i < 950; i++) {
      tc.fillStyle = i % 2 ? '#d9c7970c' : '#050d101b';
      tc.fillRect((i * 37) % 100, (i * 61 + Math.floor(i / 100) * 7) % 100, 1, (i % 3) + 1);
    }
    grain = c.createPattern(tile, 'repeat');
  }
  c.fillStyle = grain;
  c.fillRect(0, 0, VIEW.width, VIEW.height);
}
function drawEffects(c, state) {
  for (const particle of state.effects) {
    const t = particle.age / particle.life;
    c.save();
    c.globalAlpha = (1 - t) * 0.8;
    if (particle.kind === 'noise') {
      c.strokeStyle = '#c9a36d';
      c.lineWidth = 1.5;
      c.beginPath();
      c.ellipse(particle.x, particle.y, 12 + t * 44, 5 + t * 16, 0, 0, Math.PI * 2);
      c.stroke();
      c.restore();
      continue;
    }
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = particle.x + Math.cos(angle) * t * (particle.kind === 'land' ? 24 : 37);
      const y = particle.y + Math.sin(angle) * t * 13 - t * (particle.kind === 'land' ? 2 : 30);
      if (particle.kind === 'land') ellipse(c, x, y - 2, 3 + t * 2, 1.5, '#b7a37b');
      else {
        line(c, x - 2, y, x + 2, y, C.gold);
        line(c, x, y - 2, x, y + 2, C.gold);
      }
    }
    if (particle.kind === 'pickup')
      text(c, '+1', particle.x - 7, particle.y - 23 - t * 25, 12, C.paper);
    c.restore();
  }
}
function drawMap(c, state) {
  const width = VIEW.width < 650 ? 136 : 174;
  const height = 81;
  const x = VIEW.width - width - 18;
  const y = VIEW.height - height - 18;
  const mapX = (value) => x + 9 + (value / WORLD.width) * (width - 18);
  const mapY = (value) => y + 17 + (value / WORLD.height) * (height - 23);
  c.save();
  rect(c, x, y, width, height, '#15221feb', '#a9976650');
  text(c, 'PLAN DOMU', x + 10, y + 13, 7, '#b7b292');
  for (const floor of platforms.filter((p) => p.kind)) {
    line(c, mapX(floor.x), mapY(floor.y), mapX(floor.x + floor.w), mapY(floor.y), '#7f8866');
  }
  for (const ladder of ladders)
    line(c, mapX(ladder.x), mapY(ladder.top), mapX(ladder.x), mapY(ladder.bottom), '#616c53');
  for (const item of state.loot) {
    if (!item.taken && !item.locked) ellipse(c, mapX(item.x), mapY(item.y) - 2, 1.7, 1.7, C.gold);
  }
  if (!state.inventory.key) text(c, '⌁', mapX(KEY.x) - 3, mapY(KEY.y) - 3, 9, C.gold);
  rect(c, mapX(SAFE.x) - 2, mapY(SAFE.y) - 5, 5, 5, state.safe.open ? C.green : C.red);
  for (const camera of SECURITY_CAMERAS)
    ellipse(
      c,
      mapX(camera.x),
      mapY(camera.y),
      1.5,
      1.5,
      state.security.powerOff > 0 ? '#748e6a' : C.red,
    );
  const bx = mapX(BREAKER.x),
    by = mapY(BREAKER.y) - 3;
  ellipse(c, bx, by, 6, 6, '#15221f', state.security.completed ? C.green : C.gold);
  path(
    c,
    [
      [bx + 1, by - 5],
      [bx - 3, by + 1],
      [bx, by + 1],
      [bx - 1, by + 5],
      [bx + 3, by - 1],
      [bx, by - 1],
    ],
    state.security.completed ? C.green : C.gold,
  );
  rect(
    c,
    mapX(VAN.x) - 4,
    mapY(VAN.y) - 4,
    8,
    4,
    state.deposited >= GOAL && state.security.completed ? '#a2bb8c' : '#c5baa0',
  );
  if (state.guard.awake) ellipse(c, mapX(state.guard.x), mapY(state.guard.y) - 3, 2, 2, C.red);
  const playerX = mapX(state.player.x);
  const playerY = mapY(state.player.y) - 3;
  ellipse(c, playerX, playerY, 4, 4, '#e8dfc827');
  ellipse(c, playerX, playerY, 2, 2, state.player.hidden ? '#a2bb8c' : C.paper);
  c.restore();
}
function drawHint(c, state) {
  const item = nearestLoot(state);
  const target = interactionTarget(state);
  let caption;
  let x = state.player.x;
  let y = state.player.y - 76;
  if (state.player.hidden) caption = 'W CIENIU';
  else if (atVan(state) && state.player.bag.length) caption = 'SPACJA · ODŁÓŻ ŁUP';
  else if (atVan(state) && state.deposited >= GOAL && state.security.completed)
    caption = 'SPACJA · ODJAZD';
  else if (target) {
    x = target.x;
    y = target.y - 85;
    caption =
      target.kind === 'key'
        ? 'SPACJA · KLUCZ DO SEJFU'
        : target.kind === 'safe'
          ? state.inventory.key
            ? 'TRZYMAJ SPACJĘ · SEJF'
            : 'SEJF · POTRZEBNY KLUCZ'
          : state.security.powerOff > 0
            ? 'PRĄD WYŁĄCZONY'
            : state.security.cooldown > 0
              ? 'BEZPIECZNIK STYGNIE'
              : 'SPACJA · BEZPIECZNIK / 50 WPM';
  } else if (item) {
    caption = !state.security.completed
      ? 'NAJPIERW BEZPIECZNIK W PIWNICY →'
      : state.player.bag.length >= CAPACITY
        ? 'TORBA PEŁNA · WRACAJ ←'
        : `SPACJA · ${item.name}`;
    x = item.x;
    y = Math.min(item.y - 40, state.player.y - 76);
  } else if (hidingPlace(state.player)) caption = 'S · SCHOWAJ SIĘ';
  if (!caption) return;
  c.save();
  c.font = '500 10px Manrope, sans-serif';
  const width = Math.min(VIEW.width - 32, c.measureText(caption).width + 24);
  const left = Math.max(16, Math.min(VIEW.width - width - 16, x - state.camera.x - width / 2));
  const top = Math.max(110, Math.min(VIEW.height - 120, y - state.camera.y));
  rect(c, left, top, width, 28, '#14241ff5', state.player.hidden ? '#91a87b88' : '#c7ab7188');
  c.textAlign = 'center';
  text(c, caption, left + width / 2, top + 18, 10, state.player.hidden ? '#bad0a0' : C.paper);
  c.restore();
}
function newWing(c, state) {
  windowArt(c, 1850, 145, 80, 110);
  windowArt(c, 2550, 145, 100, 108);
  windowArt(c, 2185, 348, 80, 100);
  text(c, 'BIBLIOTEKA', 1950, 143, 9, '#a69c79');
  text(c, 'KUCHNIA', 1900, 323, 9, '#9e9b77');
  text(c, 'WINIARNIA', 2250, 541, 9, '#929a77');
  for (let shelf = 0; shelf < 3; shelf++) {
    const y = 175 + shelf * 38;
    for (let book = 0; book < 14; book++) {
      const x = 2040 + book * 12;
      rect(c, x, y, 8, 24 + (book % 4), ['#715b45', '#7c805d', '#a08e62', '#526c61'][book % 4]);
      line(c, x + 1, y + 5, x + 6, y + 5, '#c0ae7755');
    }
    rect(c, 2030, y + 28, 195, 4, '#79694c');
  }
  rect(c, 2028, 155, 5, 135, '#79694c');
  rect(c, 2220, 155, 5, 135, '#79694c');
  for (let x = 2295; x < 2505; x += 26) {
    for (let y = 345; y < 426; y += 26) rect(c, x, y, 24, 24, '#435044', '#69725a33');
  }
  rect(c, 2310, 445, 195, 43, '#665d44', '#96815d');
  rect(c, 2303, 439, 210, 7, '#aa9a73');
  for (let x = 2320; x < 2495; x += 44) {
    rect(c, x, 454, 35, 26, '#51513d', '#827354');
    rect(c, x + 12, 458, 10, 2, '#baab7c');
  }
  ellipse(c, 2410, 435, 18, 5, '#a89b75');
  line(c, 2450, 435, 2450, 420, '#a89b75', 3);
  line(c, 2450, 420, 2461, 420, '#a89b75', 3);
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 8; i++) {
      const x = 2615 + i * 18;
      const y = 570 + row * 45;
      rect(c, x, y + 9, 8, 24, '#4a6350', '#789169');
      rect(c, x + 2, y + 2, 4, 10, '#869163');
    }
    rect(c, 2605, 606 + row * 45, 165, 4, '#87724e');
  }
  for (const board of CREAKY_BOARDS) {
    rect(c, board.x, board.y - 2, board.w, 5, '#b3966255');
    for (let x = board.x + 8; x < board.x + board.w; x += 24) {
      line(c, x, board.y - 4, x + 6, board.y, '#d2ae7888');
      line(c, x + 6, board.y, x + 13, board.y - 3, '#d2ae7888');
    }
  }
  const sx = SAFE.x - 34;
  rect(c, sx - 5, SAFE.y - 83, 78, 83, '#26372f', '#7d8868');
  rect(c, sx, SAFE.y - 78, 68, 77, '#586353', '#abb18b');
  if (!state.safe.open) {
    rect(c, sx + 6, SAFE.y - 71, 56, 64, '#35483e', '#85916d');
    ellipse(c, SAFE.x, SAFE.y - 40, 13, 13, '#63735b', '#c1b787');
    line(c, SAFE.x - 9, SAFE.y - 40, SAFE.x + 9, SAFE.y - 40, '#d3c99c', 2);
    line(c, SAFE.x, SAFE.y - 49, SAFE.x, SAFE.y - 31, '#d3c99c', 2);
    ellipse(c, sx + 54, SAFE.y - 20, 2, 3, '#d3c99c');
  } else {
    rect(c, sx + 6, SAFE.y - 71, 56, 64, '#13271f');
    path(
      c,
      [
        [sx + 65, SAFE.y - 72],
        [sx + 86, SAFE.y - 61],
        [sx + 86, SAFE.y - 6],
        [sx + 65, SAFE.y - 8],
      ],
      '#56684e',
      '#a1ad7e',
    );
  }
  if (!state.inventory.key) {
    const keyY = KEY.y - 27 + Math.sin(state.time * 1.8) * 1.5;
    ellipse(c, KEY.x - 7, keyY, 5, 5, '#55482f', C.gold);
    line(c, KEY.x - 2, keyY, KEY.x + 13, keyY, C.gold, 3);
    line(c, KEY.x + 8, keyY, KEY.x + 8, keyY + 5, C.gold, 2);
    line(c, KEY.x + 13, keyY, KEY.x + 13, keyY + 5, C.gold, 2);
  }
  rect(c, BREAKER.x - 22, BREAKER.y - 67, 44, 58, '#4a594a', '#9b9c77');
  rect(c, BREAKER.x - 15, BREAKER.y - 58, 30, 27, '#243d31');
  const off = state.security.powerOff > 0;
  rect(c, BREAKER.x - 7, BREAKER.y - (off ? 47 : 54), 14, 12, off ? '#9aaf7b' : C.red);
  text(c, 'PRĄD', BREAKER.x - 13, BREAKER.y - 18, 7, '#bfc09a');
}
function securityCameras(c, state) {
  for (const camera of SECURITY_CAMERAS) {
    if (
      camera.x + camera.range < state.camera.x ||
      camera.x - camera.range > state.camera.x + VIEW.width ||
      camera.y + camera.range < state.camera.y ||
      camera.y - camera.range > state.camera.y + VIEW.height
    )
      continue;
    const off = state.security.powerOff > 0;
    const angle = cameraAngle(camera, state.time);
    if (!off) {
      const gradient = c.createRadialGradient(
        camera.x,
        camera.y,
        5,
        camera.x,
        camera.y,
        camera.range,
      );
      gradient.addColorStop(0, '#ce825d30');
      gradient.addColorStop(1, '#ce825d04');
      c.beginPath();
      c.moveTo(camera.x, camera.y);
      for (let i = 0; i <= 28; i++) {
        const ray = angle - 0.34 + (i / 28) * 0.68;
        const distance = cameraDistance(camera, ray);
        c.lineTo(camera.x + Math.cos(ray) * distance, camera.y + Math.sin(ray) * distance);
      }
      c.closePath();
      c.fillStyle = gradient;
      c.fill();
      c.strokeStyle = '#ce825d30';
      c.lineWidth = 1;
      c.stroke();
    }
    line(c, camera.x, camera.y - 18, camera.x, camera.y - 4, '#92947a', 2);
    c.save();
    c.translate(camera.x, camera.y);
    c.rotate(off ? Math.PI / 2 : angle);
    rect(c, -7, -7, 18, 14, '#6d7b67', '#b0b895');
    ellipse(c, 10, 0, 4, 5, off ? '#6a825f' : '#bf6751', '#c2b287');
    c.restore();
  }
}
export function renderGame(c, s) {
  const { width: w, height: h } = VIEW;
  c.clearRect(0, 0, w, h);
  const sky = c.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#101d23');
  sky.addColorStop(1, '#30413b');
  rect(c, 0, 0, w, h, sky);
  for (let i = 0; i < 50; i++) {
    const x = (i * 137.3) % w,
      y = (i * 63.7) % 260;
    ellipse(c, x, y, i % 4 ? 0.65 : 1.2, i % 4 ? 0.65 : 1.2, '#bcc8aa77');
  }
  ellipse(c, 375 - s.camera.x * 0.08, 68, 34, 34, '#c7bd94');
  ellipse(c, 387 - s.camera.x * 0.08, 58, 31, 31, '#15232a');
  for (let i = 0; i < 8; i++) {
    const x = i * 210 - s.camera.x * 0.16;
    path(
      c,
      [
        [x - 140, 400],
        [x + 35, 180 + (i % 3) * 32],
        [x + 200, 400],
      ],
      i % 2 ? '#263a38' : '#1c302f',
    );
  }
  c.save();
  c.translate(-s.camera.x, -s.camera.y);
  // przekroj domu
  const houseWidth = HOUSE.right - HOUSE.x;
  rect(c, HOUSE.x, 125, houseWidth, 165, '#364039', '#8c7d5b');
  rect(c, HOUSE.x, 290, houseWidth, 200, '#303b34');
  rect(c, HOUSE.x, 502, houseWidth, 228, '#263330');
  rect(c, 1810, 126, HOUSE.right - 1810, 164, '#3c463b');
  rect(c, 1810, 302, HOUSE.right - 1810, 187, '#394439');
  for (let x = 540; x < HOUSE.right; x += 65) {
    line(c, x, 137, x, 284, '#a8a17c0e');
    line(c, x, 305, x, 481, '#a8a17c0b');
  }
  line(c, 510, 276, HOUSE.right - 5, 276, '#a89b6c33', 2);
  line(c, 510, 476, HOUSE.right - 5, 476, '#a89b6c22', 2);
  for (let y = 510; y < 730; y += 30)
    for (let x = 505 + (y % 60 ? 0 : 35); x < HOUSE.right; x += 75) {
      if (x + 75 < s.camera.x || x > s.camera.x + w) continue;
      rect(c, x, y, 70, 25, '#2b3832', '#3c4738');
    }
  path(
    c,
    [
      [480, 125],
      [546, 57],
      [HOUSE.right - 60, 57],
      [HOUSE.right + 20, 125],
    ],
    '#485043',
    '#898365',
  );
  for (let x = 525; x < HOUSE.right; x += 32) line(c, x, 124, x + 38, 65, '#75806a55');
  rect(c, 1470, 16, 42, 48, '#576052', '#94876c');
  line(c, 500, 125, HOUSE.right, 125, '#aa9470', 4);
  line(c, HOUSE.right, 125, HOUSE.right, 731, '#aa9470', 7);
  // lewa sciana konczy sie nad drzwiami
  rect(c, 488, 126, 12, 304, '#77735a');
  rect(c, 485, 430, 10, 60, '#af996d');
  path(
    c,
    [
      [500, 431],
      [523, 420],
      [523, 480],
      [500, 490],
    ],
    '#4c5745',
    '#a28c62',
  );
  ellipse(c, 519, 456, 2, 2, '#c5ae78');
  for (const floor of platforms.filter((p) => p.kind)) {
    rect(c, floor.x, floor.y, floor.w, 12, '#6c6550', '#968567');
    for (let x = floor.x; x < floor.x + floor.w; x += 46)
      line(c, x, floor.y + 5, x + 30, floor.y + 5, '#b2a27b22');
  }
  rect(c, 0, 502, 488, 300, '#25332c');
  for (let i = 0; i < 30; i++) {
    const x = i * 17;
    line(c, x, 490, x + Math.sin(i) * 7, 482 - (i % 5), '#748064', 1);
  }
  tree(c, 400, 490);
  for (let i = 0; i < 8; i++) ellipse(c, 40 + i * 61, 494, 15, 3, '#a2947066');
  text(c, 'AUTO / BEZPIECZNA STREFA', 99, 535, 9, '#a7af8d');
  text(c, 'PIWNICA', 532, 555, 10, '#8a9c83');
  furniture(c, s);
  newWing(c, s);
  for (const item of s.loot) loot(c, item, s.time);
  // ciemnosc polprzezroczysta
  rect(c, 500, 125, houseWidth, 605, '#07131723');
  securityCameras(c, s);
  flashlight(c, s);
  person(c, s.guard, s.time);
  const moving = ['arriving', 'leaving'].includes(s.mode);
  van(c, s.mode === 'ready' ? 180 : s.vanX, 490, s.time, moving);
  if (s.mode !== 'leaving' && (s.mode !== 'arriving' || s.sequence > (s.fastSequence ? 0.25 : 2)))
    cat(c, s.player, s.time);
  drawEffects(c, s);
  if (s.alarm > 0.04 && s.mode === 'playing') {
    c.save();
    c.globalAlpha = Math.min(1, s.alarm * 1.5);
    text(c, '!', s.guard.x - 3, s.guard.y - 82, 24, C.red);
    c.restore();
  } else if (s.guard.awake && s.guard.searchTime > 0 && s.mode === 'playing') {
    text(c, '?', s.guard.x - 4, s.guard.y - 80, 20, C.gold);
  }
  c.restore();
  const vignette = c.createRadialGradient(w * 0.5, h * 0.45, h * 0.25, w * 0.5, h * 0.5, w * 0.7);
  vignette.addColorStop(0, '#06131900');
  vignette.addColorStop(1, '#0613199c');
  rect(c, 0, 0, w, h, vignette);
  texture(c);
  if (s.mode === 'ready') return;
  if (s.mode === 'playing') {
    drawMap(c, s);
    drawHint(c, s);
    if (s.player.bag.length && s.camera.x > 300) {
      rect(c, 18, h - 52, 94, 29, '#15221feb', '#a9976650');
      text(c, '← DO AUTA', 30, h - 33, 9, C.gold);
    }
  }
  if (s.toastTime > 0 && s.toast && s.mode === 'playing') {
    c.save();
    c.globalAlpha = Math.min(1, s.toastTime);
    const size = w < 650 ? 14 : 12;
    c.font = `500 ${size}px Manrope, sans-serif`;
    const maxWidth = Math.min(w - 60, 800);
    const lines = [''];
    for (const word of s.toast.split(' ')) {
      const line = lines.at(-1);
      if (line && c.measureText(`${line} ${word}`).width > maxWidth) lines.push(word);
      else lines[lines.length - 1] = line ? `${line} ${word}` : word;
    }
    const tw = Math.min(w - 36, Math.max(...lines.map((line) => c.measureText(line).width)) + 28);
    rect(c, (w - tw) / 2, 56, tw, lines.length * 19 + 14, '#142522e8', '#837c5855');
    c.textAlign = 'center';
    c.fillStyle = C.paper;
    lines.forEach((line, i) => c.fillText(line, w / 2, 77 + i * 19));
    c.restore();
  }
}
