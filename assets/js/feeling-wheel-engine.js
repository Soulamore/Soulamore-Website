/**
 * Soulamore Feeling Wheel Engine (v2.0)
 * Reusable 3-Ring SVG Emotion Wheel & Assessment Mapper
 */

export const WHEEL_DATA = {
  Happy: { color: "#E4CE55", light: true, middles: {
    Playful: ["Aroused", "Cheeky"], Content: ["Free", "Joyful"], Interested: ["Curious", "Inquisitive"],
    Proud: ["Successful", "Confident"], Accepted: ["Respected", "Valued"], Powerful: ["Courageous", "Creative"],
    Peaceful: ["Loving", "Thankful"], Trusting: ["Sensitive", "Intimate"], Optimistic: ["Hopeful", "Inspired"]
  }},
  Surprised: { color: "#A98CDB", light: true, middles: {
    Startled: ["Shocked", "Dismayed"], Confused: ["Disillusioned", "Perplexed"],
    Amazed: ["Astonished", "Awe"], Excited: ["Eager", "Energetic"]
  }},
  Bad: { color: "#6FBF8E", light: true, middles: {
    Bored: ["Indifferent", "Apathetic"], Busy: ["Pressured", "Rushed"],
    Stressed: ["Overwhelmed", "Out of control"], Tired: ["Sleepy", "Unfocussed"]
  }},
  Fearful: { color: "#E2A863", light: false, middles: {
    Scared: ["Helpless", "Frightened"], Anxious: ["Overwhelmed", "Worried"], Insecure: ["Inadequate", "Inferior"],
    Weak: ["Worthless", "Insignificant"], Rejected: ["Excluded", "Persecuted"], Threatened: ["Nervous", "Exposed"]
  }},
  Angry: { color: "#E1706B", light: false, middles: {
    "Let down": ["Betrayed", "Resentful"], Humiliated: ["Disrespected", "Ridiculed"], Bitter: ["Indignant", "Violated"],
    Mad: ["Furious", "Jealous"], Aggressive: ["Provoked", "Hostile"], Frustrated: ["Infuriated", "Annoyed"],
    Distant: ["Withdrawn", "Numb"], Critical: ["Sceptical", "Dismissive"]
  }},
  Disgusted: { color: "#8B909A", light: false, middles: {
    Disapproving: ["Judgmental", "Embarrassed"], Disappointed: ["Appalled", "Revolted"],
    Awful: ["Nauseated", "Detestable"], Repelled: ["Horrified", "Hesitant"]
  }},
  Sad: { color: "#6E96C8", light: false, middles: {
    Lonely: ["Isolated", "Abandoned"], Vulnerable: ["Victimised", "Fragile"], Despair: ["Grief", "Powerless"],
    Guilty: ["Ashamed", "Remorseful"], Depressed: ["Empty", "Inferior"], Hurt: ["Disappointed", "Embarrassed"]
  }}
};

export const EMOTION_BUCKETS = {
  Scared: "anxiety", Anxious: "anxiety", Insecure: "anxiety", Weak: "anxiety", Threatened: "anxiety", Rejected: "relationships",
  "Let down": "relationships", Humiliated: "relationships", Bitter: "relationships", Distant: "relationships", Critical: "relationships",
  Mad: "burnout", Aggressive: "burnout", Frustrated: "burnout",
  Disapproving: "relationships", Disappointed: "relationships", Awful: "anxiety", Repelled: "anxiety",
  Lonely: "expats", Vulnerable: "relationships", Despair: "grief", Depressed: "grief", Guilty: "relationships", Hurt: "relationships",
  Bored: "burnout", Busy: "burnout", Stressed: "burnout", Tired: "burnout"
};

export const ASSESSMENT_MATCHES = {
  anxiety: {
    testId: "anxiety_overthinking",
    badge: "CLINICAL BACKING • POPULAR",
    type: "clinical",
    title: "Anxiety & Anticipatory Stress",
    desc: "Map out the architecture of your overthinking. Separate structural anxiety from situational worry.",
    cta: "Take this test — 5 min",
    link: "/spaces/assessments/engine.html?test=anxiety_overthinking"
  },
  burnout: {
    testId: "burnout_career",
    badge: "BURNOUT • HIGH DEMAND",
    type: "clinical",
    title: "Burnout & Functional Depletion",
    desc: "Assess emotional exhaustion, structural fatigue, and signs of prolonged professional stress.",
    cta: "Take this test — 5 min",
    link: "/spaces/assessments/engine.html?test=burnout_career"
  },
  relationships: {
    testId: "relationship_patterns",
    badge: "RELATIONSHIPS & ATTACHMENT",
    type: "clinical",
    title: "Relationship & Attachment Patterns",
    desc: "Discover your interpersonal friction points, attachment sensitivities, and response to emotional proximity.",
    cta: "Take this test — 5 min",
    link: "/spaces/assessments/engine.html?test=relationship_patterns"
  },
  expats: {
    testId: "cultural_perspective_informant",
    badge: "CULTURAL & IDENTITY",
    type: "clinical",
    title: "Navigating Cultural Identity & Belonging",
    desc: "Assess the 'Presence Gap' in your new life. Differentiate between being alone and systemic isolation.",
    cta: "Take this test — 5 min",
    link: "/spaces/assessments/engine.html?test=cultural_perspective_informant"
  },
  grief: {
    testId: "psychological_first_aid_initial_response",
    badge: "GRIEF & HEALING",
    type: "clinical",
    title: "Grief, Loss & Nervous System Anchor",
    desc: "Assess how deep emotional loss or sudden life shifts are affecting your baseline state.",
    cta: "Take this test — 5 min",
    link: "/spaces/assessments/engine.html?test=psychological_first_aid_initial_response"
  },
  reflect: {
    testId: "self_care",
    badge: "SELF-CARE TOOL",
    type: "reflect",
    title: "Just Sit With This One",
    desc: "This emotion doesn't require a diagnostic quiz — it needs room to breathe. Try a short 5-minute breathing reset or journal prompt.",
    cta: "Open Self-Care Tools",
    link: "/tools/breathing.html"
  }
};

/* --- Geometry Helpers --- */
const CX = 280, CY = 280;
const R = [70, 140, 210, 270];

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx, cy, rInner, rOuter, startAngle, endAngle) {
  const large = (endAngle - startAngle) > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rOuter, startAngle);
  const p2 = polar(cx, cy, rOuter, endAngle);
  const p3 = polar(cx, cy, rInner, endAngle);
  const p4 = polar(cx, cy, rInner, startAngle);
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}
          L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

function labelPoint(cx, cy, rInner, rOuter, a1, a2) {
  const midA = (a1 + a2) / 2;
  return polar(cx, cy, (rInner + rOuter) / 2, midA);
}

function labelRotation(x, y) {
  const dx = x - CX, dy = y - CY;
  let deg = Math.atan2(dy, dx) * 180 / Math.PI;
  if (deg > 90 || deg < -90) deg += 180;
  return deg;
}

/**
 * Initialize feeling wheel inside SVG container
 * @param {SVGElement} svg 
 * @param {HTMLElement} breadcrumbEl 
 * @param {HTMLElement} resetBtn 
 * @param {Function} onChangeCallback 
 */
export function initFeelingWheel(svg, breadcrumbEl, resetBtn, onChangeCallback) {
  let state = { level: 0, core: null, middle: null, outer: null };

  function addLabel(lp, text, cls, fontSize) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', lp.x);
    label.setAttribute('y', lp.y);
    label.setAttribute('class', cls);
    if (fontSize) label.setAttribute('font-size', fontSize);
    const rot = labelRotation(lp.x, lp.y);
    label.setAttribute('transform', `rotate(${rot} ${lp.x} ${lp.y})`);
    label.textContent = text;
    label.style.pointerEvents = 'none';
    svg.appendChild(label);
    return label;
  }

  function render() {
    svg.innerHTML = '';
    const coreNames = Object.keys(WHEEL_DATA);
    const totalMiddles = coreNames.reduce((s, c) => s + Object.keys(WHEEL_DATA[c].middles).length, 0);

    let angleCursor = 0;
    const coreAngles = {};
    coreNames.forEach(core => {
      const count = Object.keys(WHEEL_DATA[core].middles).length;
      const span = 360 * count / totalMiddles;
      coreAngles[core] = { start: angleCursor, end: angleCursor + span };
      angleCursor += span;
    });

    // Ring 1: Core
    coreNames.forEach(core => {
      const { start, end } = coreAngles[core];
      const isSelected = state.core === core;
      const dim = state.level >= 1 && !isSelected;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', arcPath(CX, CY, R[0], R[1], start, end));
      path.setAttribute('fill', WHEEL_DATA[core].color);
      path.setAttribute('opacity', dim ? 0.18 : 1);
      path.classList.add('seg');
      path.style.cursor = 'pointer';
      path.addEventListener('click', () => selectCore(core));
      svg.appendChild(path);

      const lp = labelPoint(CX, CY, R[0], R[1], start, end);
      const lbl = addLabel(lp, core, 'seg-label core' + (WHEEL_DATA[core].light ? '' : ' light'));
      lbl.setAttribute('opacity', dim ? 0.25 : 1);
    });

    // Ring 2 + Ring 3
    coreNames.forEach(core => {
      const { start, end } = coreAngles[core];
      const middleNames = Object.keys(WHEEL_DATA[core].middles);
      const showThisRing = state.level >= 1;
      const isThisCore = state.core === core;
      let cursor = start;
      middleNames.forEach(mid => {
        const span = (end - start) / middleNames.length;
        const mStart = cursor, mEnd = cursor + span;
        cursor += span;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', arcPath(CX, CY, R[1], R[2], mStart, mEnd));
        path.setAttribute('fill', WHEEL_DATA[core].color);
        let opacity = 0;
        if (showThisRing) opacity = isThisCore ? (state.middle && state.middle !== mid ? 0.18 : 0.85) : 0.06;
        path.setAttribute('opacity', opacity);
        path.classList.add('seg');
        path.style.cursor = isThisCore ? 'pointer' : 'default';
        if (isThisCore) path.addEventListener('click', () => selectMiddle(core, mid));
        svg.appendChild(path);

        if (showThisRing && isThisCore) {
          const lp = labelPoint(CX, CY, R[1], R[2], mStart, mEnd);
          addLabel(lp, mid, 'seg-label' + (WHEEL_DATA[core].light ? '' : ' light'));
        }

        if (state.level >= 2 && isThisCore && state.middle === mid) {
          const outers = WHEEL_DATA[core].middles[mid];
          let oCursor = mStart;
          outers.forEach(word => {
            const oSpan = (mEnd - mStart) / outers.length;
            const oStart = oCursor, oEnd = oCursor + oSpan;
            oCursor += oSpan;

            const opath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            opath.setAttribute('d', arcPath(CX, CY, R[2], R[3], oStart, oEnd));
            opath.setAttribute('fill', WHEEL_DATA[core].color);
            const outerSelected = state.outer === word;
            opath.setAttribute('opacity', state.outer && !outerSelected ? 0.25 : 1);
            opath.classList.add('seg');
            opath.style.cursor = 'pointer';
            opath.addEventListener('click', () => selectOuter(core, mid, word));
            svg.appendChild(opath);

            const olp = labelPoint(CX, CY, R[2], R[3], oStart, oEnd);
            addLabel(olp, word, 'seg-label' + (WHEEL_DATA[core].light ? '' : ' light'), 8.3);
          });
        }
      });
    });

    // Center text
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', CX); centerText.setAttribute('y', CY - 4);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('font-family', "'Fraunces', 'Outfit', serif");
    centerText.setAttribute('font-style', 'italic');
    centerText.setAttribute('font-size', '14');
    centerText.setAttribute('fill', '#ECF2F1');
    centerText.textContent = state.core ? state.core : "How are you";
    svg.appendChild(centerText);

    const centerSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerSub.setAttribute('x', CX); centerSub.setAttribute('y', CY + 14);
    centerSub.setAttribute('text-anchor', 'middle');
    centerSub.setAttribute('font-size', '9.5');
    centerSub.setAttribute('fill', '#8B9BA3');
    centerSub.textContent = state.core ? "tap to reset" : "feeling right now?";
    centerSub.style.cursor = state.core ? 'pointer' : 'default';
    if (state.core) centerSub.addEventListener('click', resetAll);
    svg.appendChild(centerSub);

    renderBreadcrumb();
    if (onChangeCallback) onChangeCallback(state);
  }

  function renderBreadcrumb() {
    if (!breadcrumbEl) return;
    breadcrumbEl.innerHTML = '';
    const parts = [];
    if (state.core) parts.push({ label: state.core, onClick: () => selectCore(state.core) });
    if (state.middle) parts.push({ label: state.middle, onClick: () => selectMiddle(state.core, state.middle) });
    if (state.outer) parts.push({ label: state.outer, onClick: null });

    parts.forEach((p, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.style.color = 'rgba(255,255,255,0.3)';
        sep.textContent = ' › ';
        breadcrumbEl.appendChild(sep);
      }
      const c = document.createElement('span');
      c.style.color = '#4ECDC4';
      c.style.fontWeight = '600';
      c.textContent = p.label;
      if (p.onClick) {
        c.style.cursor = 'pointer';
        c.addEventListener('click', p.onClick);
      }
      breadcrumbEl.appendChild(c);
    });

    if (resetBtn) resetBtn.style.display = state.level > 0 ? 'inline-block' : 'none';
  }

  function selectCore(core) { state = { level: 1, core, middle: null, outer: null }; render(); }
  function selectMiddle(core, mid) { state = { level: 2, core, middle: mid, outer: null }; render(); }
  function selectOuter(core, mid, word) { state = { level: 3, core, middle: mid, outer: word }; render(); }
  function resetAll() { state = { level: 0, core: null, middle: null, outer: null }; render(); }

  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  render();

  return { resetAll, getState: () => ({ ...state }) };
}
