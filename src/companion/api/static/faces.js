// The family's faces: a circle, two dots and a smile, drawn as simple shapes.
// Used in the chips, the family strip and the sheets.

const FACE_FILLS = ["#F2C9A0", "#C9DDF0", "#F6D6E0", "#D8EBC8", "#EBD9F5", "#FBE3A6"];
const HAIR = ["#3B2A20", "#1C2320", "#7A4A2A", "#C68B3E", "#5B3A5E", "#2E3B55"];

export function faceSVG(member, size = 48) {
  return `<svg class="face" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${faceG(member, 24, 24, 20)}</svg>`;
}

// A face at (x, y) with radius r. Children get a rounder, smaller face and cheeks.
export function faceG(member, x, y, r) {
  const i = Math.abs(hash(member.id || member.name || "?")) % FACE_FILLS.length;
  const child = member.role === "child";
  const rr = child ? r * .9 : r;
  const hair = [
    `<path d="M ${x - rr} ${y - rr * .1} Q ${x - rr * .9} ${y - rr * 1.15} ${x} ${y - rr * 1.05} Q ${x + rr * .95} ${y - rr * 1.1} ${x + rr} ${y - rr * .15} Q ${x + rr * .4} ${y - rr * .75} ${x - rr} ${y - rr * .1} Z"/>`,
    `<path d="M ${x - rr * 1.02} ${y + rr * .1} Q ${x - rr * 1.1} ${y - rr * 1.2} ${x + rr * .1} ${y - rr * 1.05} Q ${x + rr * 1.15} ${y - rr * .9} ${x + rr * 1.02} ${y + rr * .1} Q ${x + rr * .7} ${y - rr * .45} ${x} ${y - rr * .55} Q ${x - rr * .7} ${y - rr * .45} ${x - rr * 1.02} ${y + rr * .1} Z"/>`,
    `<circle cx="${x - rr * .55}" cy="${y - rr * .8}" r="${rr * .42}"/><circle cx="${x + rr * .05}" cy="${y - rr * .98}" r="${rr * .45}"/><circle cx="${x + rr * .6}" cy="${y - rr * .75}" r="${rr * .4}"/>`,
  ][i % 3];
  const cheeks = child
    ? `<circle cx="${x - rr * .52}" cy="${y + rr * .28}" r="${rr * .15}" fill="#F29C8F" opacity=".7"/><circle cx="${x + rr * .52}" cy="${y + rr * .28}" r="${rr * .15}" fill="#F29C8F" opacity=".7"/>`
    : "";
  return `<g class="facegrp">
    <circle cx="${x}" cy="${y}" r="${rr}" fill="${FACE_FILLS[i]}" stroke="var(--outline)" stroke-width="${Math.max(1.6, rr * .1)}"/>
    <g fill="${HAIR[i]}" stroke="var(--outline)" stroke-width="${Math.max(1.2, rr * .07)}" stroke-linejoin="round">${hair}</g>
    <circle cx="${x - rr * .33}" cy="${y}" r="${rr * .1}" fill="var(--outline)"/>
    <circle cx="${x + rr * .33}" cy="${y}" r="${rr * .1}" fill="var(--outline)"/>
    ${cheeks}
    <path d="M ${x - rr * .3} ${y + rr * .32} Q ${x} ${y + rr * .58} ${x + rr * .3} ${y + rr * .32}" fill="none" stroke="var(--outline)" stroke-width="${Math.max(1.4, rr * .09)}" stroke-linecap="round"/>
  </g>`;
}

function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; }
