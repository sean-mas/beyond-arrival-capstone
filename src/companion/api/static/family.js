// The family on this device, shared by the companion page and the river game.
//
// One localStorage key holds it. Both pages read and write the same shape, so a
// family that boards the boat in the game is the family the checklist shows.

import { STAGES, STANDARD_TASKS } from "./data.js";

export const KEY = "ba-family-v1";
export const DAY = 86400000;
export const uid = () => Math.random().toString(36).slice(2, 10);

export function loadFamily() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
}
export function saveFamily(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode: the session still works */ }
}

export const fmt = d => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export function daysFromToday(ts) { return Math.round((new Date(ts).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / DAY); }

// How a to-do's date reads, given where the family is.
export function dueLabelFor(task, state) {
  const stageIdx = STAGES.findIndex(s => s.id === task.stage);
  const curIdx = STAGES.findIndex(s => s.id === state.stage);
  if (!task.dueAt) {
    // A stage the family is past: not nagged as "start now", kept for ticking off.
    if (stageIdx < curIdx) return { cls: "earlier", text: "from earlier" };
    return stageIdx === curIdx ? { cls: "start", text: "start now" } : null;
  }
  const d = daysFromToday(task.dueAt);
  // Past the date, said calmly. card_001: "If you are already past two weeks you
  // are not the first." A tired family does not need to be told it is late.
  if (d < 0) return { cls: "over", text: `was due ${fmt(task.dueAt)}` };
  if (d === 0) return { cls: "soon", text: "today" };
  if (d <= 21) return { cls: "soon", text: `in ${d} days` };
  return { cls: "later", text: `by ${fmt(task.dueAt)}` };
}

export function buildTasks(members, moveDate) {
  const kids = members.filter(m => m.role === "child");
  const out = [];
  for (const t of STANDARD_TASKS) {
    if (t.needsKidUnder && !kids.some(k => k.age !== "" && +k.age < t.needsKidUnder)) continue;
    if (t.needsKidOver && !kids.some(k => k.age !== "" && +k.age > t.needsKidOver)) continue;
    const dueAt = t.due !== undefined && moveDate ? new Date(moveDate).getTime() + t.due * DAY : null;
    if (t.audience === "child") {
      for (const k of kids) out.push({ ...t, uid: uid(), owner: k.id, dueAt, done: false, source: "standard" });
    } else {
      out.push({ ...t, uid: uid(), owner: "family", dueAt, done: false, source: "standard" });
    }
  }
  return out;
}

// A family from onboarding answers. When one already exists (onboarded on the
// page, then again in the game), keep who was already there and what was ticked.
export function familyFrom(answers, previous = null) {
  const old = previous?.members || [];
  const keep = (name, role) => old.find(m => m.name.toLowerCase() === name.toLowerCase() && m.role === role)?.id;
  const you = { id: keep(answers.name, "adult") || uid(), name: answers.name, role: "adult", age: "" };
  const members = [you, ...answers.members.map(m => ({ ...m, id: keep(m.name, m.role) || m.id || uid() }))];
  const moveDate = answers.moveDate || null;
  const tasks = buildTasks(members, moveDate);
  if (previous) {
    for (const t of tasks) {
      const was = previous.tasks.find(p => p.id === t.id && p.owner === t.owner);
      if (was) t.done = was.done;
    }
    tasks.push(...previous.tasks.filter(p => p.source !== "standard"));
  }
  return { version: 1, created: previous?.created || Date.now(), active: you.id, members,
    stage: answers.where || "home", moveDate, cityFrom: answers.cityFrom || "", cityTo: answers.cityTo || "", tasks };
}
