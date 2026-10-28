// The journey, drawn as a river town on a spring morning: flat colour, soft haze,
// a red arched bridge, the pagoda on the hill. The style follows the loading
// picture of Hanakawa (hanakawa-boat-game.vercel.app); the drawing is our own.
//
// Four stops along the water, one per stage:
//   Home     the village landing, bottom left, where the boat starts
//   Prepare  under the red bridge: the crossing
//   Arrive   the landing by the shrine gate, on the far side
//   Settle   below the pagoda, bottom right
// The family is in the boat. A laptop sees the whole picture; a phone pans along
// it, starting where the family is.

import { STAGES } from "./data.js";

const W = 1600, H = 900, HORIZON = 562;
// Where the boat waits at each stop, and where the stop's label sits.
export const STOPS = {
  home: { x: 285, y: 772, tag: [285, 856] },
  prepare: { x: 650, y: 668, tag: [650, 738] },
  arrive: { x: 1060, y: 684, tag: [1060, 756] },
  settle: { x: 1345, y: 790, tag: [1345, 860] },
};
const boatScale = y => 0.58 + (y - 640) / 320;
const PATH = "M 285 772 C 420 756 540 690 650 668 C 780 646 930 650 1060 684 C 1180 716 1280 776 1345 790";

const CLOTHES = ["#2E5E4E", "#C8553D", "#3D6FB6", "#E0A33A", "#7A4E8C", "#4E8C6A", "#D46A8A", "#35536E"];
const SKIN = ["#F1CBA8", "#E0AE86", "#C68C62", "#A06A45", "#7A4E33", "#EBC2A0"];
const HAIR = ["#2A1D16", "#4A3222", "#1C1C1E", "#7A4A2A", "#C68B3E", "#5B3A2E"];
function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
function rng(seed) { let a = seed; return () => { a = (a * 1664525 + 1013904223) % 4294967296; return a / 4294967296; }; }
const f1 = n => n.toFixed(1);

// ---------- pieces ----------
const FIR = "M 0 -100 L 13 -74 L 7 -74 L 23 -46 L 13 -46 L 33 -9 L 4 -9 L 4 0 L -4 0 L -4 -9 L -33 -9 L -13 -46 L -23 -46 L -7 -74 L -13 -74 Z";
function firs(list, fill) { return `<g fill="${fill}">${list.map(([x, y, s]) => `<path d="${FIR}" transform="translate(${x} ${y}) scale(${s})"/>`).join("")}</g>`; }
function sakura(x, y, s, r) {
  const pinks = ["#E6A7B6", "#EDB6C3", "#F3C9D2", "#F8DCE2"];
  const blobs = [[-24, -48, 17, 0], [24, -48, 17, 0], [0, -44, 18, 1], [-15, -64, 21, 2], [16, -65, 21, 2], [0, -80, 19, 3], [-30, -62, 12, 1], [31, -60, 12, 1]];
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -3 0 C -2 -14 -6 -24 -1 -38 M -1 -26 C 6 -32 12 -36 20 -42 M -2 -30 C -10 -36 -15 -40 -22 -46" stroke="#6B4A3C" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${blobs.map(([bx, by, br, k]) => `<circle cx="${f1(bx + (r() - 0.5) * 4)}" cy="${f1(by + (r() - 0.5) * 4)}" r="${br}" fill="${pinks[k]}"/>`).join("")}
    <circle cx="-9" cy="-86" r="9" fill="#FCEAEE"/><circle cx="-26" cy="-68" r="7" fill="#FBE4E8"/></g>`;
}
function machiya(x, y, s, lit = false) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-46" y="-82" width="92" height="40" fill="#EFE4CE"/>
    <rect x="-46" y="-66" width="92" height="3" fill="#D6C7A8"/>
    <rect x="-32" y="-76" width="18" height="10" fill="${lit ? "#FFD9A0" : "#CDB995"}"/><rect x="12" y="-76" width="18" height="10" fill="#CDB995"/>
    <path d="M -56 -80 L -42 -101 L 42 -101 L 56 -80 Z" fill="#41444C"/><path d="M -42 -101 L 42 -101 L 44 -97 L -44 -97 Z" fill="#5A5E67"/>
    <rect x="-46" y="-42" width="92" height="42" fill="url(#rsKoshi)"/>
    <path d="M -53 -40 L -47 -49 L 47 -49 L 53 -40 Z" fill="#4A4D55"/>
    <rect x="-13" y="-35" width="26" height="35" fill="#2F4563"/><rect x="-13" y="-35" width="26" height="4" fill="#22344D"/>
  </g>`;
}
function lantern(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="rs-lantern"><circle r="22" fill="url(#rsGlow)" class="glow"/>
    <path d="M 0 -16 V -9" stroke="#2C2522" stroke-width="1.2"/><rect x="-4" y="-10" width="8" height="2.2" fill="#2C2522"/>
    <ellipse rx="6.4" ry="8" fill="#DC5A3C"/><path d="M -6 -2.6 H 6 M -6 2.6 H 6" stroke="#B8402A" stroke-width=".9"/><rect x="-4" y="7.6" width="8" height="2.2" fill="#2C2522"/></g>`;
}
function lanternString(x0, y0, x1, y1, sag, n) {
  let s = `<path d="M ${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}" stroke="#3A3330" stroke-width="1.2" fill="none" opacity=".7"/>`;
  for (let i = 1; i < n; i++) {
    const t = i / n, x = x0 + (x1 - x0) * t, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag * 2) + t * t * y1;
    s += i % 2 ? lantern(x, y + 11, 0.62) : `<path d="M ${f1(x - 4)} ${f1(y)} L ${f1(x + 4)} ${f1(y)} L ${f1(x)} ${f1(y + 11)} Z" fill="${["#E8C24A", "#6EA7D8", "#F2F0E6", "#E77F6A"][i % 4]}"/>`;
  }
  return s;
}
function torii(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-40" y="-112" width="9" height="112" fill="#D2462E"/><rect x="31" y="-112" width="9" height="112" fill="#D2462E"/>
    <rect x="-44" y="-4" width="17" height="6" fill="#2B2522"/><rect x="27" y="-4" width="17" height="6" fill="#2B2522"/>
    <rect x="-52" y="-92" width="104" height="7" fill="#D2462E"/><rect x="-4" y="-104" width="8" height="14" fill="#D2462E"/>
    <rect x="-58" y="-112" width="116" height="7" fill="#D2462E"/>
    <path d="M -68 -121 Q 0 -112 68 -121 L 66 -112 Q 0 -106 -66 -112 Z" fill="#2B2522"/></g>`;
}
function stoneLantern(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#A9A396">
    <rect x="-11" y="-5" width="22" height="5"/><rect x="-4" y="-30" width="8" height="25"/><rect x="-11" y="-35" width="22" height="5"/>
    <rect x="-7" y="-48" width="14" height="13" fill="#FFE6B4" class="lit"/><path d="M -17 -48 L 0 -60 L 17 -48 Z" fill="#9C968A"/><circle cy="-63" r="3.6" fill="#9C968A"/></g>`;
}
function pagoda(x, y, s) {
  let g = "", top = -8;
  const tiers = [[76, 36], [64, 28], [56, 26], [48, 24], [40, 22]];
  g += `<rect x="-52" y="-8" width="104" height="8" fill="#B7AD99"/>`;
  tiers.forEach(([w, h], i) => {
    g += `<rect x="${-w / 2}" y="${top - h}" width="${w}" height="${h}" fill="#EFE4CF"/><rect x="${-w / 2}" y="${top - h * 0.45}" width="${w}" height="3" fill="#C9492F"/>`;
    if (i === 0) g += `<rect x="-9" y="${top - 20}" width="18" height="20" fill="#6A4D3A"/>`;
    top -= h;
    const rw = w * 0.82 + 22;
    g += `<path d="M ${-rw} ${top + 3} Q ${-rw * 0.55} ${top - 2} ${-w * 0.36} ${top - 14} L ${w * 0.36} ${top - 14} Q ${rw * 0.55} ${top - 2} ${rw} ${top + 3} Q 0 ${top - 3} ${-rw} ${top + 3} Z" fill="#3C4049"/>`;
    g += `<path d="M ${-w * 0.36} ${top - 14} L ${w * 0.36} ${top - 14} L ${w * 0.34} ${top - 11} L ${-w * 0.34} ${top - 11} Z" fill="#555A64"/>`;
    top -= 12;
  });
  g += `<rect x="-1.8" y="${top - 60}" width="3.6" height="60" fill="#4B443C"/>${[0, 1, 2, 3, 4].map(i => `<ellipse cy="${top - 14 - i * 8}" rx="${6.4 - i * 0.6}" ry="1.8" fill="#4B443C"/>`).join("")}<circle cy="${top - 62}" r="3.4" fill="#4B443C"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
function bridge(x0, x1, y0, apex) {
  // A vermilion arch: deck, top rail, posts, giboshi caps, and dark timber piers.
  const xm = (x0 + x1) / 2, qy = 2 * apex - y0;
  const at = t => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * xm + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * qy + t * t * y0];
  const curve = dy => `M ${x0} ${y0 + dy} Q ${xm} ${qy + dy} ${x1} ${y0 + dy}`;
  let posts = "";
  for (let i = 0; i <= 22; i++) { const [px, py] = at(i / 22); posts += `<rect x="${f1(px - 2.2)}" y="${f1(py - 44)}" width="4.4" height="36" fill="#C43E28"/>`; }
  let piers = "";
  for (const t of [0.24, 0.3, 0.7, 0.76]) {
    const [px, py] = at(t);
    piers += `<rect x="${f1(px - 5)}" y="${f1(py)}" width="10" height="${f1(y0 + 34 - py)}" fill="#3F3029"/>`;
  }
  for (const [ta, tb] of [[0.24, 0.3], [0.7, 0.76]]) {
    const [ax] = at(ta), [bx] = at(tb);
    piers += `<rect x="${f1(ax - 6)}" y="${y0 + 8}" width="${f1(bx - ax + 12)}" height="7" fill="#3F3029"/><rect x="${f1(ax - 6)}" y="${y0 - 26}" width="${f1(bx - ax + 12)}" height="6" fill="#3F3029"/>`;
  }
  const knob = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-5" y="-6" width="10" height="46" fill="#C43E28"/><path d="M -6 -6 Q -7 -16 0 -24 Q 7 -16 6 -6 Z" fill="#3A3330"/><circle cy="-26" r="2.4" fill="#3A3330"/></g>`;
  return `<g class="rs-bridge">${piers}
    <path d="${curve(0)}" fill="none" stroke="#D2462E" stroke-width="20"/>
    <path d="${curve(-8)}" fill="none" stroke="#E4644A" stroke-width="4"/>
    <path d="${curve(8)}" fill="none" stroke="#A8321F" stroke-width="4"/>
    ${posts}
    <path d="${curve(-44)}" fill="none" stroke="#D2462E" stroke-width="7"/>
    <path d="${curve(-26)}" fill="none" stroke="#D2462E" stroke-width="3.4"/>
    ${knob(x0 + 4, y0 - 42)}${knob(x1 - 4, y0 - 42)}</g>`;
}

// ---------- the boat and the family ----------
function figure(m, x, y, s, i, standing) {
  const h = hash(m.id || m.name || "you"), child = m.role === "child";
  const k = s * (child ? 0.74 : 1);
  const body = CLOTHES[h % CLOTHES.length], skin = SKIN[(h >> 3) % SKIN.length], hair = HAIR[(h >> 5) % HAIR.length];
  if (standing) return `<g class="fig" data-member="${i}" transform="translate(${x} ${y}) scale(${k})"><g class="fig-in">
      <rect x="-5" y="-30" width="10" height="30" rx="4" fill="${body}"/><circle cy="-35" r="5.4" fill="${skin}"/>
      <path d="M -14 -37 L 0 -47 L 14 -37 Q 0 -39 -14 -37 Z" fill="#D8B878"/><path d="M -14 -37 Q 0 -39 14 -37" stroke="#B89858" stroke-width="1" fill="none"/></g></g>`;
  return `<g class="fig" data-member="${i}" transform="translate(${x} ${y}) scale(${k})"><g class="fig-in">
    <rect x="-6" y="-16" width="12" height="16" rx="5" fill="${body}"/><circle cy="-21" r="5.6" fill="${skin}"/>
    <path d="M -5.8 -22 A 5.8 5.8 0 0 1 5.8 -22 Q 0 -25 -5.8 -22 Z" fill="${hair}"/></g></g>`;
}
function boat(members, locked) {
  const crew = locked ? [] : members.slice(0, 6);
  const helm = crew[0] || { id: "you", name: "?", role: "adult" };
  const sitters = crew.slice(1);
  const seats = [[-20, -10], [-4, -10], [12, -10], [28, -10], [-12, -10], [20, -10]];
  return `<g class="rs-boat-art">
    <path d="M -94 -14 L 84 -14 Q 98 -16 104 -28 L 108 -24 Q 100 4 70 8 L -76 8 Q -92 4 -96 -8 Z" fill="#6E4A30"/>
    <path d="M -94 -14 L 84 -14 Q 98 -16 104 -28 L 105 -22 Q 96 -8 84 -8 L -95 -8 Z" fill="#A57B52"/>
    <path d="M -90 -2 L 76 -2" stroke="#2E5E4E" stroke-width="3"/>
    <rect x="-40" y="-40" width="62" height="26" fill="#8A6443"/><rect x="-36" y="-36" width="54" height="16" fill="url(#rsKoshi)"/>
    <path d="M -50 -40 Q -10 -56 32 -40 L 32 -36 Q -10 -50 -50 -36 Z" fill="#4A3A30"/>
    ${sitters.map((m, i) => { const [sx, sy] = seats[i]; return figure(m, sx + 44, sy, 1, i + 1, false); }).join("")}
    ${figure(helm, -76, -14, 1, 0, true)}
    <path d="M -70 -48 L -116 30" stroke="#5E4636" stroke-width="2.4" stroke-linecap="round"/>
    <g transform="translate(96 -36)"><rect x="-1" y="-16" width="2" height="16" fill="#5B3F2C"/><path d="M 1 -16 L 16 -12 L 1 -8 Z" fill="#C8372D"/><circle cy="4" r="12" fill="url(#rsGlow)" class="glow"/><ellipse cy="3" rx="4.4" ry="5.6" fill="#DC5A3C"/></g>
    ${locked ? `<text x="-76" y="-60" text-anchor="middle" font-size="22" font-family="Zodiak, Georgia, serif" fill="#2B2522">?</text>` : ""}
  </g>`;
}

function strokes(r) {
  let s = "";
  for (let i = 0; i < 64; i++) {
    const y = HORIZON + 30 + Math.pow(r(), 0.85) * (H - HORIZON - 40), len = 10 + (y - HORIZON) * 0.14 + r() * 26, x = r() * W;
    s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + len)}" y2="${f1(y)}" style="animation-delay:-${f1(r() * 7)}s;animation-duration:${f1(5 + r() * 5)}s"/>`;
  }
  return s;
}
function petals(r, n) {
  let s = "";
  for (let i = 0; i < n; i++) s += `<ellipse class="petal" cx="${f1(900 + r() * 700)}" cy="-10" rx="4.6" ry="3.2" fill="${r() < 0.5 ? "#F9CDD9" : "#F2B6C6"}" style="animation-delay:-${f1(r() * 14)}s;animation-duration:${f1(9 + r() * 7)}s"/>`;
  return s;
}
function branch() {
  const bl = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5.6" rx="4.4" ry="6" fill="#F8D6DF" transform="rotate(${a})"/>`).join("")}<circle r="2.4" fill="#E48CA2"/></g>`;
  const pts = [[1578, 26], [1540, 44], [1502, 62], [1462, 84], [1426, 104], [1390, 124], [1520, 20], [1476, 50], [1440, 118], [1356, 140], [1552, 68], [1494, 92], [1410, 88]];
  return `<g class="rs-branch"><path d="M 1624 6 C 1552 26 1486 60 1440 98 S 1372 138 1336 150 M 1488 64 C 1498 80 1492 98 1482 108 M 1556 32 C 1548 54 1556 72 1546 84" stroke="#5A4034" stroke-width="6" fill="none" stroke-linecap="round"/>
    ${pts.map(([x, y], i) => bl(x, y, 0.95 + (i % 3) * 0.2)).join("")}</g>`;
}

// ---------- the picture ----------
function picture({ locked, current, members, progress, backdrop }) {
  const r = rng(11);
  const ci = STAGES.findIndex(s => s.id === current);
  const leftHouses = [[44, 552, 1.25, true], [150, 556, 1.12, false], [252, 560, 1.0, true], [344, 563, 0.9, false], [424, 566, 0.8, true]];
  const rightHouses = [[1244, 566, 0.8, false], [1328, 563, 0.9, true], [1432, 560, 1.02, false], [1548, 556, 1.16, true]];
  const bankL = `
    <path d="M 0 520 L 380 540 L 470 552 L 520 566 L 0 578 Z" fill="#86AA66"/>
    <path d="M 0 578 L 520 566 L 536 580 L 0 604 Z" fill="#B8AA90"/><path d="M 0 596 L 532 576 L 536 580 L 0 604 Z" fill="#978B74"/>
    ${sakura(214, 520, 0.95, r)}${firs([[70, 520, 0.6], [110, 516, 0.75], [300, 530, 0.5]], "#5F8A5F")}
    ${leftHouses.map(([x, y, s, l]) => machiya(x, y, s, l)).join("")}
    ${lanternString(0, 468, 470, 530, 7, 14)}
    ${sakura(500, 568, 0.72, r)}`;
  const bankR = `
    <path d="M 1600 516 L 1250 540 L 1180 552 L 1140 566 L 1600 574 Z" fill="#86AA66"/>
    <path d="M 1140 566 L 1600 574 L 1600 600 L 1126 578 Z" fill="#B8AA90"/><path d="M 1128 575 L 1600 594 L 1600 600 L 1126 578 Z" fill="#978B74"/>
    ${rightHouses.map(([x, y, s, l]) => machiya(x, y, s, l)).join("")}
    ${lanternString(1180, 530, 1600, 472, 6, 12)}
    ${torii(1180, 570, 0.72)}${stoneLantern(1236, 568, 0.9)}${sakura(1120, 572, 0.7, r)}`;
  const tags = backdrop ? "" : STAGES.map((s, i) => {
    const st = STOPS[s.id], [tx, ty] = st.tag, [done, total] = progress?.[s.id] || [0, 0];
    const state = locked ? "locked" : i < ci ? "past" : i === ci ? "now" : "next";
    const ring = !locked && total ? `<circle cx="-72" cy="0" r="15" fill="none" stroke="#E6DFD2" stroke-width="3.5"/><circle cx="-72" cy="0" r="15" fill="none" stroke="#3B7A57" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${f1(2 * Math.PI * 15 * done / total)} 999" transform="rotate(-90 -72 0)"/>` : "";
    return `<g class="rs-stop ${state}" data-stage="${s.id}" ${locked ? "" : `tabindex="0" role="button" aria-label="${s.title}: open its checklist"`} transform="translate(${tx} ${ty})">
      <rect x="-98" y="-24" width="196" height="48" rx="24" fill="#FBF8F1" opacity=".95"/>
      ${ring}<text x="-72" y="5.5" text-anchor="middle" font-size="15" font-family="Zodiak, Georgia, serif" fill="#1C2320">${state === "past" ? "✓" : state === "locked" ? "·" : s.n}</text>
      <text x="-46" y="-2" font-size="17.5" font-family="Zodiak, Georgia, serif" fill="#1C2320">${s.title}</text>
      <text x="-46" y="15" font-size="11.5" font-family="General Sans, system-ui, sans-serif" fill="#65706A">${locked ? "opens after onboarding" : state === "now" ? "you are here" : state === "past" ? "behind you" : "ahead"}</text></g>`;
  }).join("");
  const at = STOPS[current] || STOPS.home;
  return `
  <svg class="rs ${locked ? "locked" : ""} ${backdrop ? "backdrop" : ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img"
       aria-label="Your journey as a river: home, prepare the move, arrive and set up, settle in">
    <defs>
      <linearGradient id="rsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A4C6DE"/><stop offset=".6" stop-color="#DCE8EA"/><stop offset="1" stop-color="#EEF2EA"/></linearGradient>
      <radialGradient id="rsSun"><stop offset="0" stop-color="#FFFDF4" stop-opacity=".95"/><stop offset=".35" stop-color="#FFF8E6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF8E6" stop-opacity="0"/></radialGradient>
      <linearGradient id="rsHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF3EA" stop-opacity="0"/><stop offset="1" stop-color="#EEF3EA" stop-opacity=".92"/></linearGradient>
      <radialGradient id="rsGlow"><stop offset="0" stop-color="#FFB46E" stop-opacity=".7"/><stop offset="1" stop-color="#FFB46E" stop-opacity="0"/></radialGradient>
      <pattern id="rsKoshi" width="5" height="10" patternUnits="userSpaceOnUse"><rect width="5" height="10" fill="#8A6443"/><rect width="1.6" height="10" fill="#5E4129"/></pattern>
      <linearGradient id="rsWater" x1="0" y1="${HORIZON}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ABDFD6"/><stop offset=".15" stop-color="#72CBC3"/><stop offset=".55" stop-color="#42B2AF"/><stop offset="1" stop-color="#2B9199"/></linearGradient>
      <linearGradient id="rsWMist" x1="0" y1="${HORIZON}" x2="0" y2="${HORIZON + 70}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F1F6EF" stop-opacity=".85"/><stop offset="1" stop-color="#F1F6EF" stop-opacity="0"/></linearGradient>
      <linearGradient id="rsRFade" x1="0" y1="${HORIZON}" x2="0" y2="${HORIZON + 250}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="rsRMask" maskUnits="userSpaceOnUse" x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}"><rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#rsRFade)"/></mask>
      <linearGradient id="rsVeil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F1" stop-opacity=".22"/><stop offset="1" stop-color="#FBF8F1" stop-opacity=".5"/></linearGradient>
    </defs>

    <rect width="${W}" height="${HORIZON + 10}" fill="url(#rsSky)"/>
    <g class="rs-far" data-parallax=".7">
      <circle cx="1030" cy="40" r="430" fill="url(#rsSun)"/>
      <g fill="#FBFAF3" fill-opacity=".85" class="rs-clouds">
        <g class="rs-cloud" style="animation-duration:110s"><ellipse cx="1060" cy="150" rx="74" ry="16"/><ellipse cx="1020" cy="140" rx="40" ry="19"/><ellipse cx="1100" cy="136" rx="46" ry="23"/><ellipse cx="1140" cy="150" rx="48" ry="13"/></g>
        <g class="rs-cloud" style="animation-duration:140s;animation-delay:-40s"><ellipse cx="640" cy="236" rx="90" ry="13"/><ellipse cx="610" cy="226" rx="40" ry="15"/><ellipse cx="670" cy="222" rx="48" ry="18"/></g>
        <g class="rs-cloud" style="animation-duration:120s;animation-delay:-70s"><ellipse cx="300" cy="120" rx="66" ry="12"/><ellipse cx="280" cy="111" rx="30" ry="13"/><ellipse cx="324" cy="108" rx="34" ry="15"/></g>
      </g>
      <g class="rs-birds" stroke="#4E5A62" stroke-opacity=".55" stroke-width="1.8" fill="none" stroke-linecap="round">
        <path d="M 760 190 q 7 -7 14 0 q 7 -7 14 0"/><path d="M 800 172 q 5 -5 10 0 q 5 -5 10 0"/><path d="M 836 196 q 4 -4 8 0 q 4 -4 8 0"/></g>
      <path d="M -40 390 C 60 360 150 300 250 318 C 340 334 400 280 500 292 C 600 304 660 350 760 330 C 860 310 940 250 1040 270 C 1140 290 1220 330 1330 300 C 1440 270 1520 300 1640 290 L 1640 560 L -40 560 Z" fill="#B3CFD8"/>
      <path d="M -40 440 C 80 420 170 380 280 396 C 380 410 460 380 560 392 C 680 406 760 440 880 420 C 1000 400 1080 360 1200 380 C 1320 400 1420 380 1640 400 L 1640 560 L -40 560 Z" fill="#9DBEC6"/>
      <rect x="-40" y="330" width="1680" height="210" fill="url(#rsHaze)"/>
    </g>
    <g class="rs-mid" data-parallax="1.6">
      <path d="M -40 470 C 60 452 150 430 250 440 C 350 450 430 470 560 478 L 560 560 L -40 560 Z" fill="#A3C49A"/>
      <path d="M -40 500 C 80 488 160 470 260 482 C 360 494 450 504 560 510 L 560 560 L -40 560 Z" fill="#86AB70"/>
      ${firs([[10, 492, 0.9], [48, 486, 1.1], [96, 484, 0.8], [150, 486, 1], [236, 494, 0.85], [330, 510, 0.75], [400, 516, 0.6]], "#5F8A5F")}
      <path d="M 1000 540 C 1080 500 1160 430 1260 390 C 1360 350 1460 300 1640 262 L 1640 560 L 1000 560 Z" fill="#6B9660"/>
      ${firs([[1090, 500, 0.9], [1150, 470, 1.1], [1206, 444, 1.3], [1256, 420, 1.2], [1300, 400, 1.5], [1470, 330, 1.5], [1516, 318, 1.3], [1566, 308, 1.6], [1616, 300, 1.4]], "#4D7A52")}
      ${pagoda(1392, 476, 1.02)}
      ${firs([[1130, 524, 1], [1190, 506, 1.2], [1250, 486, 1.1], [1500, 420, 1.4], [1560, 410, 1.7], [1620, 404, 1.3]], "#3E6848")}
      ${sakura(1300, 482, 0.7, r)}${sakura(1478, 470, 0.75, r)}
    </g>
    <g class="rs-town">
      <rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#rsWater)"/>
      <g mask="url(#rsRMask)" opacity=".34"><g transform="matrix(1 0 0 -1 0 ${2 * 596})">${bridge(430, 1180, 596, 370)}</g></g>
      <g mask="url(#rsRMask)" opacity=".22"><g transform="matrix(1 0 0 -1 0 ${2 * 580})">${bankL}${bankR}</g></g>
      <rect x="0" y="${HORIZON}" width="${W}" height="70" fill="url(#rsWMist)"/>
      ${bankL}${bankR}
      ${bridge(430, 1180, 596, 370)}
      <g class="rs-strokes" stroke="#F4FBF8" stroke-width="2.6" stroke-linecap="round" opacity=".85">${strokes(r)}</g>
      <path class="rs-route" d="${PATH}" fill="none" stroke="#FFFFFF" stroke-opacity="${locked || backdrop ? 0 : 0.5}" stroke-width="2.2" stroke-dasharray="2 9" stroke-linecap="round"/>
      <g class="rs-boat" transform="translate(${at.x} ${at.y}) scale(${f1(boatScale(at.y))})">
        <g class="rs-wake" opacity="0"><path d="M -100 6 Q -170 12 -250 4" stroke="#F4FBF8" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M -96 12 Q -160 24 -226 22" stroke="#F4FBF8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></g>
        <g class="rs-bob">${boat(members || [], locked)}
          <g transform="translate(0 10) scale(1 -1)" opacity=".22">${boat(members || [], locked)}</g></g>
        ${!locked && !backdrop ? `<g class="rs-here"><rect x="-56" y="-118" width="112" height="32" rx="16" fill="#C8372D"/><path d="M -7 -87 L 0 -76 L 7 -87 Z" fill="#C8372D"/><text x="0" y="-97" text-anchor="middle" font-size="15" font-weight="600" font-family="General Sans, system-ui, sans-serif" fill="#FBF3E6">You are here</text></g>` : ""}
      </g>
      ${tags}
    </g>
    ${branch()}
    <g class="rs-petals">${petals(r, 16)}</g>
    ${locked ? `<rect width="${W}" height="${H}" fill="url(#rsVeil)"/>` : ""}
  </svg>`;
}

// Layers drift a little against each other when the pointer moves, as in the original.
function parallax(host, svg) {
  const layers = [...svg.querySelectorAll("[data-parallax]")];
  host.addEventListener("pointermove", e => {
    const b = host.getBoundingClientRect(), dx = (e.clientX - b.left) / b.width - 0.5, dy = (e.clientY - b.top) / b.height - 0.5;
    for (const l of layers) { const k = +l.dataset.parallax; l.setAttribute("transform", `translate(${f1(-dx * 10 * k)} ${f1(-dy * 5 * k)})`); }
  });
  host.addEventListener("pointerleave", () => layers.forEach(l => l.setAttribute("transform", "")));
}

/**
 * The journey, drawn as the river. Same options as the old map:
 *   opts.locked, opts.current, opts.members, opts.progress, opts.onStop(stageId), opts.onFace(member)
 */
export function renderJourney(host, opts) {
  const { locked = false, current = "home", members = [], progress = {} } = opts;
  host.classList.add("rs-host");
  host.innerHTML = `<div class="rs-pan">${picture({ locked, current, members, progress })}</div>`;
  const svg = host.querySelector("svg"), pan = host.querySelector(".rs-pan");
  requestAnimationFrame(() => {
    const k = svg.getBoundingClientRect().width / W;
    pan.scrollLeft = Math.max(0, (STOPS[current] || STOPS.home).x * k - pan.clientWidth / 2);
  });
  parallax(host, svg);
  if (!locked) {
    svg.querySelectorAll(".rs-stop").forEach(g => {
      g.addEventListener("click", () => zoomTo(svg, g.dataset.stage, () => opts.onStop?.(g.dataset.stage)));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); g.dispatchEvent(new Event("click")); } });
    });
    svg.querySelectorAll(".rs-boat .rs-bob > .rs-boat-art .fig").forEach(f => f.addEventListener("click", e => { e.stopPropagation(); opts.onFace?.(members[+f.dataset.member]); }));
    sail(svg, current);
  }
  return { zoomOut: () => zoomTo(svg, null) };
}

// The first time the map opens, the boat sails from home to where the family is.
function sail(svg, current) {
  const boatG = svg.querySelector(".rs-boat"), wake = svg.querySelector(".rs-wake"), here = svg.querySelector(".rs-here");
  const route = svg.querySelector(".rs-route");
  const target = STOPS[current] || STOPS.home;
  const len = route.getTotalLength();
  let end = 0, best = Infinity;
  for (let l = 0; l <= len; l += len / 200) { const p = route.getPointAtLength(l); const d = (p.x - target.x) ** 2 + (p.y - target.y) ** 2; if (d < best) { best = d; end = l; } }
  if (end < 5) return;
  here && (here.style.opacity = 0);
  const t0 = performance.now() + 450, dur = 1300 + end * 1.4;
  const place = l => { const p = route.getPointAtLength(l); boatG.setAttribute("transform", `translate(${f1(p.x)} ${f1(p.y)}) scale(${boatScale(p.y).toFixed(3)})`); };
  place(0);
  (function step(now) {
    const k = Math.min(1, Math.max(0, (now - t0) / dur));
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    place(end * e);
    wake.setAttribute("opacity", f1(Math.sin(k * Math.PI)));
    if (k < 1) requestAnimationFrame(step);
    else if (here) here.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 500, fill: "forwards", easing: "cubic-bezier(.22,1,.36,1)" });
  })(performance.now());
}

// Zoom onto one stop, or back out.
export function zoomTo(svg, stageId, done) {
  const from = svg.getAttribute("viewBox").split(" ").map(Number);
  let to = [0, 0, W, H];
  if (stageId) { const s = STOPS[stageId], w = 700, h = w * H / W; to = [Math.min(Math.max(s.x - w / 2, 0), W - w), Math.min(Math.max(s.y - h * 0.62, 0), H - h), w, h]; }
  const t0 = performance.now(), dur = 700;
  (function step(now) {
    const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    svg.setAttribute("viewBox", from.map((v, i) => f1(v + (to[i] - v) * e)).join(" "));
    if (t < 1) requestAnimationFrame(step); else done?.();
  })(t0);
}

// Behind the onboarding: the same town, the boat at the stop the step is about,
// with whoever has been added so far already aboard.
const STEP_STAGE = ["home", "home", "prepare", "arrive", "settle"];
// On a laptop the steps sit on the right, so the stop sits a third of the way in.
// On a phone the picture is cropped to a tall window, so the stop is centred in
// the part that shows, kept inside the picture's edges.
function frameFor(stage, host) {
  const s = STOPS[stage], phone = innerWidth <= 760;
  const w = phone ? 760 : 1040, h = w * H / W;
  const y = Math.min(Math.max(s.y - h * (phone ? 0.66 : 0.62), 0), H - h);
  const cA = host.clientWidth / Math.max(1, host.clientHeight), vA = w / h;
  if (phone || cA < vA) {
    const vw = w * Math.min(1, cA / vA), c = Math.min(Math.max(s.x, vw / 2), W - vw / 2);
    return [c - w / 2, y, w, h];
  }
  return [Math.min(Math.max(s.x - w * 0.34, 0), W - w), y, w, h];
}
export function renderBackdrop(host, { step = 0, members = [] }) {
  host.classList.add("rs-backdrop-host");
  const stage = STEP_STAGE[Math.min(step, 4)];
  host.innerHTML = picture({ locked: false, current: stage, members, backdrop: true });
  const svg = host.querySelector("svg");
  svg.setAttribute("viewBox", frameFor(stage, host).join(" "));
  parallax(host, svg);
  return svg;
}
export function panBackdrop(host, step) {
  const svg = host.querySelector("svg"); if (!svg) return;
  const stage = STEP_STAGE[Math.min(step, 4)], to = frameFor(stage, host), from = svg.getAttribute("viewBox").split(" ").map(Number);
  const boatG = svg.querySelector(".rs-boat"), m = boatG.getAttribute("transform").match(/translate\(([-\d.]+) ([-\d.]+)\)/);
  const x0 = +m[1], y0 = +m[2], s = STOPS[stage];
  const t0 = performance.now(), dur = 1200;
  (function tick(now) {
    const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    svg.setAttribute("viewBox", from.map((v, i) => f1(v + (to[i] - v) * e)).join(" "));
    const x = x0 + (s.x - x0) * e, y = y0 + (s.y - y0) * e;
    boatG.setAttribute("transform", `translate(${f1(x)} ${f1(y)}) scale(${boatScale(y).toFixed(3)})`);
    if (t < 1) requestAnimationFrame(tick);
  })(t0);
}
// When someone is added in onboarding, redraw the boat's crew in place.
export function setBackdropCrew(host, members) {
  const art = host.querySelector(".rs-bob"); if (!art) return;
  art.innerHTML = `${boat(members, false)}<g transform="translate(0 10) scale(1 -1)" opacity=".22">${boat(members, false)}</g>`;
  art.querySelectorAll(".fig").forEach((f, i) => { if (i === members.length - 1 && i > 0) f.classList.add("hop"); });
}
