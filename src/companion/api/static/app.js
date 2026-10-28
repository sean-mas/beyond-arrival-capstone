// The companion, one page: onboarding, the journey map, the checklist, the chat.
//
// v1 keeps the family on this device (localStorage), as profiles on one phone.
// A real second login for the other adult, and anything a child's profile
// holds, needs accounts and a server-side store, and a data-protection read on
// children's data first. That is a deliberate next step, not this file.
//
// Children get their own tasks and no chat: a child alone with a model is a
// safety question, not a feature.

import { icon } from "./icons.js";
import { STAGES, WHERE_NOW, CARD_TITLES } from "./data.js";
import { journeyLine } from "./journeyline.js";
import { faceSVG } from "./faces.js";
import { KEY, uid, fmt, daysFromToday, dueLabelFor, buildTasks, familyFrom, loadFamily, saveFamily } from "./family.js";

const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let config = { models: [{ value: "tier2", label: "tier 2" }], provider: { name: "Relocation Provider GmbH", short: "Relocation Provider", colour: "#2E5E4E" } };
let state = loadFamily();
// The demo link, /chat?demo=1: a ready-made family, so a demonstration can go
// straight to the journey and the chat. It replaces whatever this device held,
// which is the point of a demo device; a real family never gets this link.
// The demo link also turns on the scripted demo flow below the chat. The flag
// is kept for this browser, not this tab, because the link is replaced in the
// address bar just after and a presenter opens new tabs; /chat?demo=0 ends it.
let demoMode = false;
try { demoMode = localStorage.getItem("ba-demo") === "1"; } catch (e) {}
if (new URLSearchParams(location.search).get("demo") === "0") {
  demoMode = false;
  try { localStorage.removeItem("ba-demo"); } catch (e) {}
  history.replaceState(null, "", location.pathname);
}
if (new URLSearchParams(location.search).get("demo") === "1") {
  demoMode = true;
  try { localStorage.setItem("ba-demo", "1"); } catch (e) {}
  const inDays = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  state = familyFrom({ name: "Sean", where: "prepare", moveDate: inDays(12), cityFrom: "Lisbon", cityTo: "Koblenz",
    members: [{ name: "Ana", role: "adult", age: "" }, { name: "Leo", role: "child", age: "7" }] });
  for (const t of state.tasks) if (t.stage === "home") t.done = true;     // the first stop behind them
  saveFamily(state);
  history.replaceState(null, "", location.pathname);
}
// /chat?demo=fresh: the same demo flow, but from the welcome screen and the
// onboarding, with no family on the device. For showing the whole path.
if (new URLSearchParams(location.search).get("demo") === "fresh") {
  demoMode = true;
  state = null;
  try { localStorage.setItem("ba-demo", "1"); localStorage.removeItem(KEY); } catch (e) {}
  history.replaceState(null, "", location.pathname);
}
let view = state ? "journey" : "welcome";
let journeyApi = null;

function save() { saveFamily(state); }
const me = () => state?.members.find(m => m.id === state.active) || state?.members[0];
const isChild = () => me()?.role === "child";

// ---------- dates ----------
const dueLabel = task => dueLabelFor(task, state);
function whereLine() {
  if (!state?.moveDate) return "";
  const d = daysFromToday(state.moveDate);
  const to = state.cityTo ? ` in ${state.cityTo}` : "";
  if (d > 0) return `${d} day${d === 1 ? "" : "s"} until the move${state.cityTo ? " to " + state.cityTo : ""}`;
  const months = Math.floor(-d / 30.44);
  return months < 1 ? `Your first weeks${to}` : `Month ${months + 1}${to}`;
}

// ---------- tasks ----------
// What the active person sees: adults see the family's adult tasks and their own;
// a child sees only what is theirs.
function visibleTasks() {
  const m = me();
  return state.tasks.filter(t => isChild() ? t.owner === m.id : (t.audience !== "child" || t.owner === m.id) && (t.owner === "family" || t.owner === m.id || t.audience === "adult"));
}
function progressByStage() {
  const out = {};
  for (const s of STAGES) {
    const ts = visibleTasks().filter(t => t.stage === s.id);
    out[s.id] = [ts.filter(t => t.done).length, ts.length];
  }
  return out;
}
function ownerFace(t, size = 22) {
  if (t.owner === "family") return `<span class="stage" title="The whole family">${icon("users", "i s")}</span>`;
  const m = state.members.find(x => x.id === t.owner);
  return m ? faceSVG(m, size) : "";
}
function toggleTask(uidv, el) {
  const t = state.tasks.find(x => x.uid === uidv);
  if (!t) return;
  t.done = !t.done; save();
  el?.classList.toggle("done", t.done);
  if (view === "checklist" && el) { setTimeout(() => { el.classList.add("leaving"); setTimeout(render, 330); }, 650); }
  updateTabs();
}
function todoHTML(t, withStage = true) {
  const due = t.done ? null : dueLabel(t);
  const stage = STAGES.find(s => s.id === t.stage);
  return `<div class="todo ${t.done ? "done" : ""}" data-uid="${t.uid}">
    <button class="box" aria-label="${t.done ? "Mark as not done" : "Mark as done"}">${icon("check")}</button>
    <div style="flex:1;min-width:0"><div class="t">${esc(t.title)}</div>${t.detail ? `<div class="d">${esc(t.detail)}</div>` : ""}
      <div class="meta">${ownerFace(t)}${withStage ? `<span class="stage">${esc(stage?.title || "")}</span>` : ""}</div></div>
    ${due ? `<span class="due ${due.cls}">${due.text}</span>` : ""}
  </div>`;
}
function wireTodos(root) {
  root.querySelectorAll(".todo .box").forEach(b => b.addEventListener("click", () => {
    const el = b.closest(".todo"); toggleTask(el.dataset.uid, el);
  }));
}

// ---------- shell ----------
function tabsFor() {
  const t = [{ id: "journey", label: "Journey", ic: "map-2" }];
  if (!isChild()) t.push({ id: "chat", label: "Chat", ic: "message-circle" });
  t.push({ id: "checklist", label: "Checklist", ic: "list-check" });
  return t;
}
function openCount() { return state ? visibleTasks().filter(t => !t.done && (dueLabel(t)?.cls === "soon" || dueLabel(t)?.cls === "over")).length : 0; }
function updateTabs() {
  const show = state && !["welcome", "onboarding"].includes(view);
  $("#top").hidden = !show;
  $("#tabs").hidden = !show;
  if (!show) { $("#sidenav").innerHTML = ""; $("#who-btn").innerHTML = ""; return; }
  const n = openCount();
  const btn = t => `<button data-go="${t.id}" class="${view === t.id ? "on" : ""}">${icon(t.ic)}<span>${t.label}</span>${t.id === "checklist" && n ? `<span class="count">${n}</span>` : ""}</button>`;
  $("#tabs").innerHTML = tabsFor().map(btn).join("");
  $("#sidenav").innerHTML = tabsFor().map(btn).join("");
  document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
  $("#who-btn").innerHTML = `<span class="face-chip">${faceSVG(me(), 38)}</span>`;
  $("#who-btn").onclick = profileSheet;
}
function go(v) { view = v; render(); window.scrollTo(0, 0); }

function applyBrand() {
  const p = config.provider;
  document.documentElement.style.setProperty("--brand", p.colour);
  $("#brand-name").textContent = p.short;
  $("#mark").textContent = p.short.trim()[0] || "R";
  document.title = `${p.short} · companion`;
}

// ---------- sheets ----------
function openSheet(html, onClose) {
  const sheet = $("#sheet"), back = $("#backdrop");
  sheet.innerHTML = `<div class="grab"></div>${html}`;
  sheet.hidden = false; back.hidden = false;
  const close = () => { sheet.hidden = true; back.hidden = true; onClose?.(); };
  back.onclick = close;
  sheet.querySelectorAll("[data-close]").forEach(b => b.onclick = close);
  document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
  return { sheet, close };
}

function stageSheet(stageId) {
  const s = STAGES.find(x => x.id === stageId);
  const tasks = visibleTasks().filter(t => t.stage === stageId);
  const done = tasks.filter(t => t.done).length;
  const { sheet, close } = openSheet(`
    <div class="head"><div class="badge-stage" style="background:${s.tint}">${icon(s.icon, "i l")}</div>
      <div><h2>${esc(s.title)}</h2><div class="muted">${esc(s.sub)} · ${done} of ${tasks.length} done</div></div>
      <button class="close" data-close aria-label="Close">${icon("x")}</button></div>
    ${stageId === state.stage ? `<p class="muted" style="margin:10px 2px">You are here${state.moveDate ? ` · ${esc(whereLine())}` : ""}.</p>` : ""}
    <div class="list" style="padding:8px 0 0">${tasks.length ? tasks.map(t => todoHTML(t, false)).join("") : `<div class="empty">Nothing here for you yet.</div>`}
      <button class="add" data-add>${icon("plus")}Add a to-do here</button></div>`,
    () => {});
  wireTodos(sheet);
  sheet.querySelector("[data-add]").onclick = () => addTodo(stageId, () => { close(); stageSheet(stageId); });
}

function faceSheet(m) {
  const own = state.tasks.filter(t => t.owner === m.id);
  const fam = m.role === "adult" ? state.tasks.filter(t => t.owner === "family") : [];
  const open = [...own, ...fam].filter(t => !t.done).length;
  const from = state.cityFrom ? esc(state.cityFrom) : "home", to = state.cityTo ? esc(state.cityTo) : "the new place";
  const stage = STAGES.find(s => s.id === state.stage);
  const { sheet, close } = openSheet(`
    <div class="head">${faceSVG(m, 56)}<div><h2>${esc(m.name)}</h2><div class="muted">${m.role === "child" ? `child${m.age !== "" ? ", " + esc(m.age) : ""}` : "adult"}</div></div>
      <button class="close" data-close aria-label="Close">${icon("x")}</button></div>
    <div class="list" style="padding:10px 0 0">
      <div class="todo"><div>${icon("route")}</div><div><div class="t">From ${from} to ${to}</div><div class="d">${esc(stage?.title || "")} · ${esc(whereLine())}</div></div></div>
      <div class="todo"><div>${icon("calendar")}</div><div><div class="t">${state.moveDate ? `Moving day: ${fmt(state.moveDate)}` : "No moving day yet"}</div><div class="d">Deadlines on the checklist count from this day.</div></div></div>
      <div class="todo"><div>${icon("list-check")}</div><div><div class="t">${open} open to-do${open === 1 ? "" : "s"}</div><div class="d">${m.role === "child" ? "Only the ones meant for " + esc(m.name) + "." : "Including the ones for the whole family."}</div></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px">${m.id !== state.active ? `<button class="btn" data-switch style="flex:1">Continue as ${esc(m.name)}</button>` : `<button class="btn ghost" data-close style="flex:1">This is you</button>`}</div>`);
  sheet.querySelector("[data-switch]")?.addEventListener("click", () => { state.active = m.id; save(); close(); if (isChild() && view === "chat") view = "journey"; render(); });
}

function profileSheet() {
  const { sheet, close } = openSheet(`
    <div class="head"><h2>Who is using this?</h2><button class="close" data-close aria-label="Close">${icon("x")}</button></div>
    <p class="muted" style="margin:4px 2px 12px">Everyone in the family has their own view. Children see only their own to-dos.</p>
    <div class="list" style="padding:0">${state.members.map(m => `
      <button class="member" data-id="${m.id}" style="cursor:pointer;text-align:left">${faceSVG(m, 40)}
        <div class="who"><b>${esc(m.name)}</b><small>${m.role === "child" ? "child" : "adult"}${m.id === state.active ? " · using now" : ""}</small></div>${icon("chevron-right")}</button>`).join("")}
      <button class="add" data-person>${icon("user-plus")}Add someone</button>
      <button class="link" data-reset style="align-self:center">Start over</button></div>`);
  sheet.querySelectorAll("[data-id]").forEach(b => b.onclick = () => { state.active = b.dataset.id; save(); close(); if (isChild() && view === "chat") view = "journey"; render(); });
  sheet.querySelector("[data-person]").onclick = () => { close(); addPersonSheet(); };
  sheet.querySelector("[data-reset]").onclick = () => { if (confirm("Remove this family from this device and start again?")) { state = null; save(); try { localStorage.removeItem(KEY); } catch (e) {} close(); go("welcome"); } };
}

function addPersonSheet() {
  const { sheet, close } = openSheet(`
    <div class="head"><h2>Add someone</h2><button class="close" data-close aria-label="Close">${icon("x")}</button></div>
    <div class="list" style="padding:8px 0 0"><input class="field" id="p-name" placeholder="Name" autocomplete="off">
      <div class="seg" id="p-role"><button class="on" data-r="adult">Adult</button><button data-r="child">Child</button></div>
      <input class="field" id="p-age" placeholder="Age" inputmode="numeric" hidden>
      <button class="btn" id="p-add">Add</button></div>`);
  let role = "adult";
  sheet.querySelectorAll("[data-r]").forEach(b => b.onclick = () => { role = b.dataset.r; sheet.querySelectorAll("[data-r]").forEach(x => x.classList.toggle("on", x === b)); sheet.querySelector("#p-age").hidden = role !== "child"; });
  sheet.querySelector("#p-add").onclick = () => {
    const name = sheet.querySelector("#p-name").value.trim(); if (!name) return;
    const m = { id: uid(), name, role, age: role === "child" ? sheet.querySelector("#p-age").value.trim() : "" };
    state.members.push(m);
    if (role === "child") state.tasks.push(...buildTasks([m], state.moveDate).filter(t => t.owner === m.id));
    save(); close(); render();
  };
}

function addTodo(stageId, then) {
  const { sheet, close } = openSheet(`
    <div class="head"><h2>Add a to-do</h2><button class="close" data-close aria-label="Close">${icon("x")}</button></div>
    <div class="list" style="padding:8px 0 0"><input class="field" id="t-title" placeholder="What needs doing?" autocomplete="off">
      <input class="field" id="t-date" type="date"><button class="btn" id="t-add">Add</button></div>`);
  sheet.querySelector("#t-title").focus();
  sheet.querySelector("#t-add").onclick = () => {
    const title = sheet.querySelector("#t-title").value.trim(); if (!title) return;
    const date = sheet.querySelector("#t-date").value;
    state.tasks.push({ uid: uid(), id: "custom", stage: stageId || state.stage, audience: isChild() ? "child" : "adult",
      owner: me().id, title, detail: "", dueAt: date ? new Date(date).getTime() : null, done: false, source: "custom" });
    save(); close(); then ? then() : render();
  };
}

// ---------- views ----------
// The landing: the journey drawn as one line, locked until the family makes it
// theirs. The 3D river (riverscene.js, static/intro) was retired from the app on
// 28.10.2026; the files stay for the river game.
let unmountView = null, mountedFor = null;
function startOnboarding() { draft = { step: 0, members: [], where: null, moveDate: "", cityFrom: "", cityTo: "", name: "" }; go("onboarding"); }
function viewWelcome() {
  const words = (t, from) => t.split(" ").map((w, i) => `<span class="w" style="--d:${from + i * 0.08}s">${w}</span>`).join(" ");
  $("#view").innerHTML = `<section class="welcome"><div class="journey"><header class="hero">
      <p class="eyebrow">From ${esc(config.provider.short)}</p>
      <h1>${words("The move ends.", 0.1)}<br><span class="w serif" style="--d:.4s">Arriving</span> ${words("takes a year.", 0.5)}</h1>
      <p class="lead">Paperwork, school, the weeks that feel long. Answered from your provider’s own material, with a person one message away.</p></header>
    <div id="map"></div>
    <div class="locked-note"><div><b>This is the road ahead.</b><span class="muted">Five questions, and it becomes yours.</span></div>
      <button class="btn small" id="start">Make it yours ${icon("arrow-right")}</button></div></div></section>`;
  journeyLine($("#map"), { stages: STAGES, locked: true });
  $("#start").onclick = startOnboarding;
}

let draft = null;
let lastStep = -1, bgStep = -1, onbBg = null;
const STEPS = 5;
function viewOnboarding() {
  const d = draft;
  const bar = `<div class="progress">${Array.from({ length: STEPS }, (_, i) => `<i class="${i <= d.step ? "on" : ""}"></i>`).join("")}</div>`;
  const back = d.step ? `<button class="btn ghost small" data-back>${icon("chevron-left")}Back</button>` : "";
  let body = "";
  if (d.step === 0) body = `
    <h1>What should we call you?</h1><p class="lead">Your first name is enough. It stays on this device.</p>
    <input class="field" id="o-name" value="${esc(d.name)}" placeholder="Your name" autocomplete="given-name">
    <div class="spacer"></div><div class="actions">${back}<button class="btn" data-next>Continue ${icon("arrow-right")}</button></div>`;
  if (d.step === 1) body = `
    <h1>Who is moving with you, ${esc(d.name)}?</h1><p class="lead">Everyone gets their own view. Children get their own to-dos, and no chat.</p>
    <div class="list" style="padding:0" id="o-members">
      <div class="member">${faceSVG({ id: "me", name: d.name, role: "adult" }, 40)}<div class="who"><b>${esc(d.name)}</b><small>you</small></div></div>
      ${d.members.map((m, i) => `<div class="member">${faceSVG(m, 40)}<div class="who"><b>${esc(m.name)}</b><small>${m.role === "child" ? `child${m.age !== "" ? ", " + esc(m.age) : ""}` : "adult"}</small></div><button data-rm="${i}" aria-label="Remove">${icon("x")}</button></div>`).join("")}
    </div>
    <div id="o-form"></div>
    <div class="addrow"><button class="btn ghost small" data-addr="adult">${icon("user-plus")}Partner</button><button class="btn ghost small" data-addr="child">${icon("user-plus")}Child</button></div>
    <div class="spacer"></div><div class="actions">${back}<button class="btn" data-next>${d.members.length ? "Continue" : "Just me"} ${icon("arrow-right")}</button></div>`;
  if (d.step === 2) body = `
    <h1>Where are you right now?</h1><p class="lead">It puts you on the map. You can move along it any time.</p>
    <div class="choices">${WHERE_NOW.map((w, i) => `<button class="choice ${d.where === w.stage ? "on" : ""}" data-where="${w.stage}">${icon(STAGES[i].icon)}${esc(w.label)}</button>`).join("")}</div>
    <div class="spacer"></div><div class="actions">${back}<button class="btn" data-next ${d.where ? "" : "disabled"}>Continue ${icon("arrow-right")}</button></div>`;
  if (d.step === 3) {
    const before = ["home", "prepare"].includes(d.where);
    body = `
    <h1>${before ? "When is your moving day?" : "When did you move?"}</h1>
    <p class="lead">Deadlines count from this day: registering your address, your driving licence, the German course.</p>
    <input class="field" id="o-date" type="date" value="${esc(d.moveDate)}">
    <button class="link" data-skip style="align-self:flex-start">${before ? "We do not know yet" : "Skip for now"}</button>
    <div class="spacer"></div><div class="actions">${back}<button class="btn" data-next>Continue ${icon("arrow-right")}</button></div>`;
  }
  if (d.step === 4) body = `
    <h1>From where to where?</h1><p class="lead">So the map knows its two ends.</p>
    <input class="field" id="o-from" value="${esc(d.cityFrom)}" placeholder="Moving from, e.g. Manchester" autocomplete="off">
    <div style="display:grid;place-items:center;color:var(--muted);padding:6px">${icon("plane")}</div>
    <input class="field" id="o-to" value="${esc(d.cityTo)}" placeholder="Moving to, e.g. Berlin" autocomplete="off">
    <div class="spacer"></div><div class="actions">${back}<button class="btn" data-next>Show my journey ${icon("map-2")}</button></div>`;

  // Fade in only when the step changes: a click on an answer redraws the step,
  // and replaying the entrance on every click reads as flicker.
  const fresh = d.step !== lastStep; lastStep = d.step;
  // The journey line stays behind the steps: drawn once, then a marker moves to
  // the stop each step is about.
  const focus = ["home", "home", "prepare", "arrive", "settle"][Math.min(d.step, 4)];
  if (!$("#view .onb-wrap")) {
    $("#view").innerHTML = `<section class="onb-wrap"><div class="onb-bg" aria-hidden="true"><div id="onb-line"></div></div><section class="onb" id="onb"></section></section>`;
    onbBg = journeyLine($("#onb-line"), { stages: STAGES, focus });
    bgStep = d.step;
  } else if (bgStep !== d.step) {
    bgStep = d.step; onbBg?.update({ focus });
  }
  $("#onb").innerHTML = `${bar}<div class="step ${fresh ? "enter" : ""}">${body}</div>`;
  const v = $("#view");
  v.querySelector("[data-back]")?.addEventListener("click", () => { d.step--; render(); });
  v.querySelector("[data-skip]")?.addEventListener("click", () => { d.moveDate = ""; d.step++; render(); });
  v.querySelectorAll("[data-where]").forEach(b => b.onclick = () => { d.where = b.dataset.where; render(); });
  v.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { d.members.splice(+b.dataset.rm, 1); render(); });
  v.querySelectorAll("[data-addr]").forEach(b => b.onclick = () => {
    const role = b.dataset.addr;
    $("#o-form").innerHTML = `<div class="inline-form"><input class="field" id="f-name" placeholder="${role === "child" ? "Child's name" : "Partner's name"}">
      <input class="field" id="f-age" placeholder="Age" inputmode="numeric" ${role === "child" ? "" : "hidden"}><button class="btn small" id="f-add">Add</button></div>`;
    if (role !== "child") $("#o-form .inline-form").style.gridTemplateColumns = "1fr auto";
    $("#f-name").focus();
    const add = () => { const name = $("#f-name").value.trim(); if (!name) return;
      d.members.push({ id: uid(), name, role, age: role === "child" ? $("#f-age").value.trim() : "" }); render(); };
    $("#f-add").onclick = add;
    $("#f-name").onkeydown = e => { if (e.key === "Enter") add(); };
  });
  const next = v.querySelector("[data-next]");
  const input = v.querySelector("#o-name");
  if (input) { input.focus(); input.onkeydown = e => { if (e.key === "Enter") next.click(); }; }
  next.onclick = () => {
    if (d.step === 0) { d.name = $("#o-name").value.trim(); if (!d.name) return $("#o-name").focus(); }
    if (d.step === 3) d.moveDate = $("#o-date").value;
    if (d.step === 4) { d.cityFrom = $("#o-from").value.trim(); d.cityTo = $("#o-to").value.trim(); return finishOnboarding(); }
    d.step++; render();
  };
}

function finishOnboarding() {
  state = familyFrom(draft, state); save(); draft = null; go("journey");
}

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? "Good morning" : h < 18 ? "Hello" : "Good evening";
}

function viewJourney() {
  const m = me();
  $("#view").innerHTML = `
    <section class="journey">
      <header><h1>${greeting()}, ${esc(m.name)}.</h1><p>${esc(whereLine() || STAGES.find(s => s.id === state.stage).title)}</p></header>
      <div id="map"></div>
      <div class="family-strip">${state.members.map(x => `<button data-face="${x.id}">${faceSVG(x, 34)}<span>${esc(x.name)}</span></button>`).join("")}</div>
      <p class="hint">Tap a stop for its to-dos, a face for that person’s answers.</p>
    </section>`;
  journeyApi = journeyLine($("#map"), { stages: STAGES, current: state.stage, progress: progressByStage(), onStop: id => stageSheet(id) });
  document.querySelectorAll("[data-face]").forEach(b => b.onclick = () => faceSheet(state.members.find(x => x.id === b.dataset.face)));
}

let listTab = "todo";
function viewChecklist() {
  const tasks = visibleTasks();
  const open = tasks.filter(t => !t.done), done = tasks.filter(t => t.done);
  const cls = t => dueLabel(t)?.cls;
  const groups = listTab === "todo" ? [
    ["Past the date", open.filter(t => cls(t) === "over")],
    ["Soon", open.filter(t => cls(t) === "soon")],
    ["Now, no fixed date", open.filter(t => cls(t) === "start")],
    ["Later", open.filter(t => cls(t) === "later" || !dueLabel(t))],
    ["From earlier stages, tick off what is done", open.filter(t => cls(t) === "earlier")],
  ] : [["Done", done]];
  $("#view").innerHTML = `
    <section class="list">
      <header><h1>${isChild() ? `${esc(me().name)}'s list` : "Your checklist"}</h1>
        <p class="muted" style="margin:4px 0 0">${open.length} open · ${done.length} done${state.moveDate ? " · dates count from your moving day" : ""}</p></header>
      <div class="seg"><button data-lt="todo" class="${listTab === "todo" ? "on" : ""}">To do</button><button data-lt="done" class="${listTab === "done" ? "on" : ""}">Done</button></div>
      ${groups.filter(([, ts]) => ts.length).map(([g, ts]) => `<div class="group-title">${g}</div>${ts.map(t => todoHTML(t)).join("")}`).join("") || `<div class="empty">${listTab === "done" ? "Nothing ticked off yet." : "All done. That is rare, enjoy it."}</div>`}
      ${listTab === "todo" ? `<button class="add" data-add>${icon("plus")}Add a to-do</button>` : ""}
      <p class="muted" style="font-size:13px;text-align:center">Saved on this device.</p>
    </section>`;
  document.querySelectorAll("[data-lt]").forEach(b => b.onclick = () => { listTab = b.dataset.lt; render(); });
  $("[data-add]")?.addEventListener("click", () => addTodo(null));
  wireTodos($("#view"));
}

// ---------- chat ----------
let chat = { turns: [], inspect: false, session: null, model: "tier2", selected: null, busy: false, gate: false };
const STARTERS = [
  ["home", "How do I register our address?"],
  ["clock", "Our days here have no shape"],
  // Phrased as a general question on purpose: "is MY licence still valid" asks
  // about the person's own legal case, which the refusal guard hands to a person
  // every time. A starter button must be one the companion can answer.
  ["calendar-event", "How long does a licence from abroad stay valid?"],
];

// The presentation's demo path (docs/2026-10-16-demo-path.md), one behaviour
// per message. In demo mode the next unsent one is offered under the chat, so
// the path is clicked through rather than typed. The IBAN is the standard
// published example number.
const DEMO_FLOW = [
  ["How do I register our address?",
   "The main use case: answered only from the provider's cards, ending in one next step that goes onto the checklist."],
  ["My husband loves his new job here and I just feel lost. Is that normal?",
   "The heart of the product: the hard months are about feelings, not paperwork. It answers from research on accompanying partners, and does not push her off to a person."],
  ["Our Kita wants the fees by direct debit. My IBAN is DE89 3704 0044 0532 0130 00, is that how it normally works?",
   "Privacy: the IBAN is removed in code before any model reads it. Open the Inspector to show the message as the model saw it."],
  ["My wife hasn't left the flat for a week and barely talks to me.",
   "Safety: a person takes over. The reply is fixed text; no model wrote it."],
  ["Will my residence permit be approved if I change jobs?",
   "Where advice stops: an individual visa question goes to a licensed person, by rule in code."],
];
function demoNextHTML() {
  if (!demoMode || chat.busy || chat.gate) return "";
  const n = DEMO_FLOW.findIndex(([q]) => !chat.turns.some(t => t.message === q));
  if (n < 0) return `<div class="demo-next done">${icon("circle-check", "i s")}Demo flow complete</div>`;
  const [q, why] = DEMO_FLOW[n];
  return `<div class="demo-next"><span>Demo step ${n + 1} of ${DEMO_FLOW.length}</span>
    <p class="why">${esc(why)}</p>
    <button class="starter" data-q="${esc(q)}">${icon("arrow-right")}${esc(q)}</button></div>`;
}

function viewChat() {
  const c = chat;
  $("#view").innerHTML = `
    <section class="chatview ${c.inspect ? "inspect" : ""}">
      <div class="chatcol">
        <div class="chatbar"><div class="viewswitch"><button data-mode="family" class="${c.inspect ? "" : "on"}">${icon("message-circle", "i s")}Family</button><button data-mode="inspect" class="${c.inspect ? "on" : ""}">${icon("eye", "i s")}Inspector</button></div></div>
        <div class="log" id="log"></div>
        <div class="composer"><textarea id="text" rows="1" placeholder="Write a message"></textarea><button class="send" id="send" aria-label="Send">${icon("send")}</button></div>
      </div>
      ${c.inspect ? `<aside class="inspector" id="inspector"></aside>` : ""}
    </section>`;
  document.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { c.inspect = b.dataset.mode === "inspect"; render(); });
  drawLog();
  const ta = $("#text");
  ta.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(ta.value); } };
  ta.oninput = () => { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; };
  $("#send").onclick = () => send(ta.value);
  if (c.inspect) drawInspector();
}

function drawLog() {
  const log = $("#log"); if (!log) return;
  const c = chat;
  let html = "";
  if (!c.turns.length) html += `
    <div class="hello"><h2>${greeting()}, ${esc(me().name)}.</h2><p class="muted" style="margin:0">What is on your mind today?</p>
      <div class="starters">${STARTERS.map(([ic, q]) => `<button class="starter" data-q="${esc(q)}">${icon(ic)}${esc(q)}</button>`).join("")}
        <button class="starter person" data-q="I would like to talk to a person">${icon("user-heart")}I would like to talk to a person</button></div></div>`;
  const fresh = i => (i === c.turns.length - 1 && !c.turns[i].shown) ? "enter" : "";
  c.turns.forEach((t, i) => {
    html += `<div class="msg you ${t.pending && !t.sentShown ? "enter" : ""}">${esc(t.message)}</div>`;
    if (t.pending) t.sentShown = true;
    if (t.pending) html += stepsHTML(t.step);
    else if (t.error) html += `<div class="msg them" style="border-color:var(--human)">${esc(t.error)}</div>`;
    else { html += answerHTML(t.r, i, fresh(i)); t.shown = true; }
  });
  if (c.gate) html += `<div class="handover" style="background:var(--surface);border-color:var(--line)">
      <div class="h" style="color:var(--brand)">${icon("lock")}Your access code</div>
      <p style="margin:8px 0">This demo is shared with a code. It is in the message you were sent.</p>
      <div style="display:flex;gap:8px"><input class="field" id="code" type="password" autocomplete="off" placeholder="Code"><button class="btn small" id="code-go">Continue</button></div></div>`;
  html += demoNextHTML();
  log.innerHTML = html;
  log.scrollTop = c.turns.length ? log.scrollHeight : 0;   // an empty chat opens on its greeting
  log.querySelectorAll("[data-q]").forEach(b => b.onclick = () => send(b.dataset.q));
  log.querySelectorAll("[data-turn]").forEach(b => b.onclick = () => { chat.selected = +b.dataset.turn; if (chat.inspect) drawInspector(); drawLog(); });
  log.querySelectorAll("[data-todo]").forEach(b => b.onclick = () => addFromChat(+b.dataset.todo, b));
  $("#code-go")?.addEventListener("click", () => {
    try { sessionStorage.setItem("ba-pass", $("#code").value); } catch (e) {}
    chat.gate = false; const last = chat.turns[chat.turns.length - 1]; chat.turns.pop(); send(last.message);
  });
}

const STEP_TEXT = ["Checking your message", "Finding what applies to you", "Writing from your provider's material"];
function stepsHTML(n) {
  return `<div class="steps">${STEP_TEXT.map((s, i) => `<div class="${i < n ? "done" : i === n ? "now" : ""}">${icon(i < n ? "circle-check" : "circle", "i s")}${s}</div>`).join("")}</div>`;
}

function nextStepOf(answer) {
  const parts = answer.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length < 2) return { body: answer, next: null };
  return { body: parts.slice(0, -1).join(" "), next: parts[parts.length - 1] };
}

function answerHTML(r, i, enter = "") {
  const sel = chat.selected === i ? "sel" : "";
  if (r.action === "handover" || r.action === "refuse") {
    const refused = r.action === "refuse";
    return `<div class="handover ${enter}" data-turn="${i}">
      <div class="h">${icon("user-heart")}Passing this to a person</div>
      <h4>${refused ? "This one needs someone who can look at your case." : "Thank you for saying it."}</h4>
      <p>${esc(r.answer)}</p>
      <div class="whocard"><div class="av">${icon("user-heart")}</div><div>Your ${esc(config.provider.short)} team<small>They see this conversation, nothing else</small></div></div>
      ${r.guard === "crisis" ? `<div class="urgent">If you are in danger right now, call <b>112</b>.</div>` : ""}</div>`;
  }
  const { body, next } = r.route === "clarify" ? { body: r.answer, next: null } : nextStepOf(r.answer);
  const canAdd = r.action === "send" && r.route !== "clarify" && next;
  return `<div class="msg them ${sel} ${enter}" data-turn="${i}">${esc(body)}${next ? `<div class="next">${esc(next)}</div>` : ""}</div>
    ${canAdd ? `<button class="action ${enter} ${chat.turns[i].added ? "added" : ""} ${chat.turns[i].justAdded ? "pop" : ""}" data-todo="${i}">${icon(chat.turns[i].added ? "check" : "plus")}${chat.turns[i].added ? "On your checklist" : "Add to checklist"}</button>` : ""}`;
}

function addFromChat(i, btn) {
  const t = chat.turns[i]; if (t.added) return go("checklist");
  const { next } = nextStepOf(t.r.answer);
  state.tasks.push({ uid: uid(), id: "chat", stage: state.stage, audience: "adult", owner: me().id,
    title: next.replace(/[.!?]$/, ""), detail: `From your question: "${t.message.slice(0, 80)}"`, dueAt: null, done: false, source: "chat" });
  t.added = true; t.justAdded = true; save(); updateTabs(); drawLog(); t.justAdded = false;
}

async function send(text) {
  text = (text || "").trim();
  if (!text || chat.busy) return;
  const ta = $("#text"); if (ta) { ta.value = ""; ta.style.height = "auto"; }
  const turn = { message: text, pending: true, step: 0 };
  chat.turns.push(turn); chat.busy = true; drawLog();
  // The steps advance while the server works and all complete when it answers.
  // They name the pipeline's real stages; their timing here is the page's, not the server's.
  const timer = setInterval(() => { if (turn.step < 2) { turn.step++; drawLog(); } }, 1400);
  try {
    let pass = ""; try { pass = sessionStorage.getItem("ba-pass") || ""; } catch (e) {}
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "X-Demo-Passcode": pass },
      body: JSON.stringify({ message: text, model: chat.model, session_id: chat.session }) });
    const r = await res.json().catch(() => ({}));
    if (res.status === 401) { chat.gate = true; turn.pending = false; turn.error = "This demo needs its access code first."; return; }
    if (!res.ok) throw new Error(r.detail || res.statusText);
    chat.session = r.session_id; turn.step = 3; drawLog();
    await new Promise(ok => setTimeout(ok, 350));
    turn.pending = false; turn.r = r; chat.selected = chat.turns.length - 1;
  } catch (e) {
    turn.pending = false; turn.error = `Something went wrong: ${e.message}`;
  } finally {
    clearInterval(timer); chat.busy = false; drawLog(); if (chat.inspect) drawInspector();
  }
}

function drawInspector() {
  const el = $("#inspector"); if (!el) return;
  const t = chat.turns[chat.selected ?? -1];
  const models = `<select id="model">${config.models.map(m => `<option value="${esc(m.value)}" ${m.value === chat.model ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select>`;
  if (!t || !t.r) { el.innerHTML = `<h3>What happened in this turn</h3><div class="meta">Send a message, or tap an answer.</div><div class="meta">Model ${models}</div>`; wireModel(); return; }
  const r = t.r, v = r.verdicts || [];
  const inputs = v.filter(x => x.guard !== "output"), outputs = v.filter(x => x.guard === "output");
  const stopIn = inputs.find(x => x.action !== "continue"), stopOut = outputs.find(x => x.action !== "continue");
  const redacted = (r.redacted || "").includes("_REDACTED]");
  const row = (cls, ic, title, body) => `<div class="stagerow"><div class="dot ${cls}">${icon(ic, "i s")}</div><div><b>${title}</b><div class="v">${body}</div></div></div>`;
  let h = row(redacted ? "warn" : "", "shield-check", "1 · Personal data", redacted ? `Redacted before anything read it: <code>${esc(r.redacted)}</code>` : "Nothing to redact");
  h += row(stopIn ? "stop" : "", "shield-check", "2 · Safety checks, in code",
    stopIn ? `${esc(stopIn.guard)}: ${esc(stopIn.reason)}. The turn ended here; no model wrote the reply.`
           : `<div class="pills">${inputs.map(x => `<span class="pill">${esc(x.guard)}</span>`).join("")}</div>`);
  if (!stopIn) {
    // The search always returns the nearest cards, even for a question none of
    // them covers (a cat, say), so this lists what was searched, not what was used.
    h += row("", "search", "3 · Closest cards searched", r.cards.length
      ? `<div class="note">The nearest cards, closest first. Not all of them are about this question.</div>${r.cards.map(c => `<div class="cardbar">${esc(CARD_TITLES[c.slice(0, 8)] || c)}</div>`).join("")}`
      : "Nothing retrieved");
    const ROUTE = { answer: "The cards cover it: answer from them", retrieve_more: "Nothing fitting at first: searched wider before answering", clarify: "Too vague to answer: ask one question back" };
    h += row("", "arrow-right", "4 · What the model decided", `${esc(ROUTE[r.route || "answer"] || "")} <code>${esc(r.route || "answer")}</code>`);
    h += r.route === "clarify" ? row("off", "circle-check", "5 · Output check", "A clarifying reply, nothing to check against the cards")
      : stopOut ? row("stop", "circle-check", "5 · Output check", `Held back: ${esc(stopOut.reason)}`)
      : row(r.grounded === false ? "warn" : "", "circle-check", "5 · Output check", r.grounded === false ? "A claim the cards don't back, so the card itself was sent" : "No claim beyond the cards, no banned claims");
  }
  el.innerHTML = `<h3>What happened in this turn</h3><div class="meta">${esc(r.model)} · ${(r.latency_ms / 1000).toFixed(1)} s · model ${models}</div>${h}
    <div class="result"><b>${esc({ send: "Sent", handover: "Handed to a person", refuse: "Refused and handed over", block: "Held back, safe reply sent" }[r.action] || r.action)}</b>${r.handover ? ` · <code>${esc(r.handover)}</code>` : ""}
    · ${r.trace_url ? `<a href="${esc(r.trace_url)}" target="_blank" rel="noopener">trace in Langfuse ↗</a>` : "tracing off"}</div>`;
  wireModel();
}
function wireModel() { const s = $("#model"); if (s) { s.disabled = config.models.length < 2; s.onchange = () => { chat.model = s.value; }; } }

// ---------- render ----------
let shownView = null;
function render() {
  // Only the onboarding keeps its page between renders (the background stays while
  // the steps change); every other view redraws, so its React piece goes first.
  if (unmountView && !(view === "onboarding" && mountedFor === "onboarding")) { unmountView(); unmountView = null; mountedFor = null; }
  $("#sheet").hidden = true; $("#backdrop").hidden = true;
  if (!state && !["welcome", "onboarding"].includes(view)) view = "welcome";
  if (isChild() && view === "chat") view = "journey";
  updateTabs();
  ({ welcome: viewWelcome, onboarding: viewOnboarding, journey: viewJourney, checklist: viewChecklist, chat: viewChat }[view])();
  // A view arrives only when it changes: a redraw after ticking a to-do must not replay it.
  if (view !== shownView) { $("#view").firstElementChild?.classList.add("page-enter"); shownView = view; }
}

fetch("/api/config").then(r => r.json()).then(cfg => { config = { ...config, ...cfg, provider: { ...config.provider, ...(cfg.provider || {}) } }; applyBrand(); render(); })
  .catch(() => { applyBrand(); render(); });
