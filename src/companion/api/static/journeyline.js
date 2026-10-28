// The journey as one drawn line with four stops, replacing the 3D river (redesign
// of 28.10.2026, canvas "Beyond Arrival redesign"). The same picture serves three
// places: the welcome screen (locked, the line draws itself), the onboarding
// backdrop (a marker moves to the stop each question is about) and the journey
// view (done stops filled, the current one pulsing, every stop opens its to-dos).
//
// Coordinates live in a 640 x 360 box; the stops are the end points of the curve's
// three segments, so the solid "travelled" line is simply the path up to a stop.

import { icon } from "./icons.js";

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const POINTS = { home: [48, 312], prepare: [250, 200], arrive: [450, 110], settle: [600, 40] };
const START = "M48 312";
const SEGMENTS = ["C 140 300, 170 220, 250 200", "C 330 180, 380 120, 450 110", "C 520 100, 560 70, 600 40"];
const ORDER = ["home", "prepare", "arrive", "settle"];
const pct = ([x, y]) => `left:${(x / 640) * 100}%;top:${(y / 360) * 100}%`;

/**
 * @param {HTMLElement} el
 * @param {{stages: object[], current?: string|null, progress?: object, focus?: string,
 *          locked?: boolean, onStop?: (id: string) => void}} opts
 */
export function journeyLine(el, opts) {
  const { stages, current = null, progress = {}, locked = false, onStop } = opts;
  const at = current ? ORDER.indexOf(current) : -1;
  // Locked (the welcome): the whole road draws itself. Otherwise the line is drawn
  // as far as the family has come.
  const travelled = locked ? SEGMENTS.length : Math.max(at, 0);
  const solid = `${START} ${SEGMENTS.slice(0, travelled).join(" ")}`;
  const full = `${START} ${SEGMENTS.join(" ")}`;

  const stops = stages.map((s, i) => {
    const state = locked ? "todo" : i < at ? "done" : i === at ? "now" : "todo";
    const [done, total] = progress[s.id] || [0, 0];
    const meta = state === "now" ? "You are here" : total ? `${done} of ${total} done` : s.sub;
    const dot = state === "done" ? icon("check", "i s") : "";
    const tag = locked ? "div" : "button";
    // Labels near the right edge read leftwards: always for the last stop, on a
    // phone for the third as well (see .narrow-left in app.css).
    const left = s.id === "settle" ? " left" : s.id === "arrive" ? " narrow-left" : "";
    return `<${tag} class="jl-stop ${state}${left}" style="${pct(POINTS[s.id])};--d:${0.5 + i * 0.35}s" ${locked ? "" : `data-stop="${s.id}" aria-label="${esc(s.title)}: ${esc(meta)}"`}>
      <span class="jl-dot">${dot}</span>
      <span class="jl-label"><b>${esc(s.title)}</b><small>${esc(meta)}</small></span></${tag}>`;
  }).join("");

  el.classList.add("jl");
  el.innerHTML = `
    <svg viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
      <path class="jl-road" d="${full}"></path>
      ${travelled ? `<path class="jl-walked" d="${solid}" pathLength="100"></path>` : ""}
    </svg>
    ${stops}
    <span class="jl-marker" hidden></span>`;
  el.querySelectorAll("[data-stop]").forEach(b => b.onclick = () => onStop?.(b.dataset.stop));

  const marker = el.querySelector(".jl-marker");
  const api = {
    update({ focus }) {
      if (!focus || !POINTS[focus]) { marker.hidden = true; return; }
      marker.hidden = false;
      marker.setAttribute("style", pct(POINTS[focus]));
      el.querySelectorAll(".jl-stop").forEach(s => s.classList.toggle("focus", s.style.left === marker.style.left));
    },
  };
  if (opts.focus) api.update({ focus: opts.focus });
  return api;
}
