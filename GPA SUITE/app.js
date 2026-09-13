/* GPA Suite — Static (offline, no build tools) */
(function(){
  const LS_KEY = "delta_gpa_suite_static_v1";
  const DEFAULT_STATE = {
  ui: { improveView: "choose" },
    settings: { lang:"ar", policyId:"delta-applied-health-v1" },
    semesters: [],
    customPolicies: []
  };

  const BUILTIN_POLICIES = [
    {
      id:"delta-applied-health-v1",
      displayName:{ar:"جامعة الدلتا - العلوم الصحية التطبيقية", en:"Delta University - Applied Health Sciences"},
      excludedStatuses:["W","AU","P"],
      bands:[
        {letter:"A+",points:4.0,min:97,max:100},
        {letter:"A", points:4.0,min:93,max:96.9999},
        {letter:"A-",points:3.7,min:89,max:92.9999},
        {letter:"B+",points:3.3,min:84,max:88.9999},
        {letter:"B", points:3.0,min:80,max:83.9999},
        {letter:"B-",points:2.7,min:76,max:79.9999},
        {letter:"C+",points:2.3,min:73,max:75.9999},
        {letter:"C", points:2.0,min:70,max:72.9999},
        {letter:"C-",points:1.7,min:67,max:69.9999},
        {letter:"D+",points:1.3,min:64,max:66.9999},
        {letter:"D", points:1.0,min:60,max:63.9999},
        {letter:"F", points:0.0,min:0, max:59.9999},
      ],
      cgpaBands:[
        {ar:"ممتاز", en:"Excellent", min:3.7, max:4.0},
        {ar:"جيد جدًا", en:"Very Good", min:3.0, max:3.6999},
        {ar:"جيد", en:"Good", min:2.4, max:2.9999},
        {ar:"مقبول", en:"Pass", min:2.0, max:2.3999},
        {ar:"ضعيف", en:"Poor", min:0.0, max:1.9999},
      ]
    },
    {
      id:"generic-4.0",
      displayName:{ar:"نظام عام 4.0", en:"Generic 4.0 Scale"},
      excludedStatuses:["W","AU","P"],
      bands:[
        {letter:"A", points:4.0,min:93,max:100},
        {letter:"A-",points:3.7,min:90,max:92.9999},
        {letter:"B+",points:3.3,min:87,max:89.9999},
        {letter:"B", points:3.0,min:83,max:86.9999},
        {letter:"B-",points:2.7,min:80,max:82.9999},
        {letter:"C+",points:2.3,min:77,max:79.9999},
        {letter:"C", points:2.0,min:73,max:76.9999},
        {letter:"C-",points:1.7,min:70,max:72.9999},
        {letter:"D", points:1.0,min:60,max:69.9999},
        {letter:"F", points:0.0,min:0, max:59.9999},
      ],
      cgpaBands:[
        {ar:"ممتاز", en:"Excellent", min:3.7, max:4.0},
        {ar:"جيد جدًا", en:"Very Good", min:3.0, max:3.6999},
        {ar:"جيد", en:"Good", min:2.4, max:2.9999},
        {ar:"مقبول", en:"Pass", min:2.0, max:2.3999},
        {ar:"ضعيف", en:"Poor", min:0.0, max:1.9999},
      ]
    }
  ];

  const STR = {
    appName:{ar:"حاسبة المعدل التراكمي", en:"GPA Suite"},
    dashboard:{ar:"الرئيسية", en:"Dashboard"},
    planner:{ar:"المخطط", en:"Planner"},
    policy:{ar:"سلم النقاط", en:"Policy"},
    semesters:{ar:"الفصول", en:"Semesters"},
    addSemester:{ar:"إضافة فصل", en:"Add Semester"},
    semesterTitle:{ar:"اسم الفصل", en:"Semester title"},
    open:{ar:"فتح", en:"Open"},
    cgpa:{ar:"المعدل التراكمي", en:"CGPA"},
    gpaHours:{ar:"ساعات محتسبة", en:"GPA Hours"},
    qualityPoints:{ar:"النقاط", en:"Quality Points"},
    termGpa:{ar:"معدل الفصل", en:"Term GPA"},
    addCourse:{ar:"إضافة مقرر", en:"Add Course"},
    code:{ar:"الكود", en:"Code"},
    name:{ar:"الاسم", en:"Name"},
    credits:{ar:"الساعات", en:"Credits"},
    grade:{ar:"الدرجة", en:"Grade"},
    status:{ar:"الحالة", en:"Status"},
    actions:{ar:"إجراءات", en:"Actions"},
    delete:{ar:"حذف", en:"Delete"},
    normal:{ar:"عادي", en:"Normal"},
    withdrew:{ar:"انسحاب (W)", en:"Withdrew (W)"},
    audit:{ar:"مستمع (AU)", en:"Audit (AU)"},
    pass:{ar:"ناجح (P)", en:"Pass (P)"},
    excludedNote:{ar:"W/AU/P لا تدخل في حساب المعدل.", en:"W/AU/P are excluded from GPA."},
    chooseCollege:{ar:"اختر الجامعة/سلم النقاط", en:"Choose college/policy"},
    tools:{ar:"أدوات", en:"Tools"},
    gpaToGrade:{ar:"معرفة التقدير من الـ CGPA", en:"CGPA to Grade"},
    raiseGpa:{ar:"تحسين التقدير", en:"GPA Improvement"},
    backupRestore:{ar:"نسخ احتياطي / استرجاع", en:"Backup / Restore"},
    exportData:{ar:"تصدير البيانات", en:"Export data"},
    importData:{ar:"استيراد البيانات", en:"Import data"},
    addCollege:{ar:"إضافة كلية/جامعة", en:"Add college"},
    save:{ar:"حفظ", en:"Save"},
    result:{ar:"النتيجة", en:"Result"},
    targetCgpa:{ar:"المعدل المستهدف", en:"Target CGPA"},
    remainingCredits:{ar:"الساعات المتبقية", en:"Remaining credits"},
    requiredAvg:{ar:"المتوسط المطلوب (نقاط)", en:"Required avg (points)"},
    approxPercent:{ar:"تقريبًا أقل نسبة مطلوبة", en:"Approx minimum percent"},
    currentCgpa:{ar:"المعدل الحالي", en:"Current CGPA"},
    earnedCredits:{ar:"ساعات مُنجزة", en:"Earned credits"},
  };

  function t(k){ return STR[k][state().settings.lang]; }

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return structuredClone(DEFAULT_STATE);
      const s = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...s };
    }catch(e){
      return structuredClone(DEFAULT_STATE);
    }
  }
  function save(s){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }
  function state(){ return _state; }
  function setState(updater){
    // Accept either a function(prevState)->nextState OR a partial object to merge.
    const prev = structuredClone(_state);
    let next = prev;
    if (typeof updater === "function") {
      next = updater(prev);
    } else if (updater && typeof updater === "object") {
      next = Object.assign({}, prev, updater);
    }
    _state = next;
    save(_state);
    render();
  }
function getAllPolicies(){
    return [...BUILTIN_POLICIES, ...state().customPolicies];
  }
  function getPolicy(id){
    const p = getAllPolicies().find(x=>x.id===id);
    return p || BUILTIN_POLICIES[0];
  }

  function resolveGrade(grade, status, policy){
    if(policy.excludedStatuses.includes(status)) return { excluded:true };
    if(grade.kind==="percent"){
      const pct = Math.max(0, Math.min(100, Number(grade.value||0)));
      const band = policy.bands.find(b=>pct>=b.min && pct<=b.max);
      return band ? { excluded:false, letter:band.letter, points:band.points, pct } : { excluded:false, letter:"?", points:0, pct };
    }
    const letter = String(grade.value||"").trim().toUpperCase();
    const band = policy.bands.find(b=>b.letter.toUpperCase()===letter);
    return band ? { excluded:false, letter:band.letter, points:band.points } : { excluded:false, letter:letter||"?", points:0 };
  }

  function calcCourseRow(course, policy){
    const ch = Number(course.creditHours||0);
    const r = resolveGrade(course.grade||{kind:"percent",value:0}, course.status||"NORMAL", policy);
    if(r.excluded) return { included:false, gpaHours:0, qualityPoints:0 };
    return { included:true, gpaHours:ch, qualityPoints: ch * r.points, letter:r.letter, points:r.points };
  }
  function calcGPA(courses, policy){
    const rows = courses.map(c=>calcCourseRow(c, policy));
    const gpaHours = rows.reduce((s,r)=>s+r.gpaHours,0);
    const qp = rows.reduce((s,r)=>s+r.qualityPoints,0);
    if(gpaHours<=0) return { gpa:null, gpaHours:0, qualityPoints:0 };
    const gpa = Math.round((qp/gpaHours)*100)/100;
    return { gpa, gpaHours, qualityPoints:qp };
  }
  function calcCGPA(){
    const p = getPolicy(state().settings.policyId);
    const all = state().semesters.flatMap(s=>s.courses);
    return calcGPA(all, p);
  }

  function setLang(lang){
    setState(s=>{
      s.settings.lang=lang;
      return s;
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang==="ar") ? "rtl":"ltr";
    // update nav labels
    updateNavLabels();
  }

  function updateNavLabels(){
    const lang = state().settings.lang;
    const setTxt = (id, txt)=>{ const el=document.getElementById(id); if(el) el.textContent = txt; };
    setTxt("navHome", (lang==="ar") ? "الرئيسية" : "Home");
    setTxt("navGpa2Grade", (lang==="ar") ? "معرفة التقدير" : "Know your grade");
    setTxt("navRaise", (lang==="ar") ? "تحسين التقدير" : "Improve GPA");
    setTxt("navPolicy", (lang==="ar") ? "سلم النقاط" : "Points scale");
    setTxt("toggleLang", (lang==="ar") ? "EN" : "AR");
  }

  function kpiCard(label, value){
    return `
      <div class="card kpi">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
      </div>
    `;
  }

  function dashboard(){
    const lang = state().settings.lang;
    return `
      <div class="home">
        <div class="home-inner">
          <div class="home-title">${lang==="ar" ? "اختر" : "Choose"}</div>
          <div class="home-grid">
            <a class="home-card" href="#/tools/gpa2grade">
              <div class="home-card-title">${lang==="ar" ? "معرفة التقدير" : "Know your grade"}</div>
              <div class="small muted">${lang==="ar" ? "أدخل المعدل والساعات لمعرفة التقدير" : "Enter CGPA & credits to see classification"}</div>
            </a>

            <a class="home-card" href="#/tools/improve">
              <div class="home-card-title">${lang==="ar" ? "تحسين التقدير" : "Improve CGPA"}</div>
              <div class="small muted">${lang==="ar" ? "احسب معدلك بعد الفصل أو المطلوب لتحقيق هدف" : "Calculate new CGPA or required term result"}</div>
            </a>

            <a class="home-card" href="#/policy">
              <div class="home-card-title">${lang==="ar" ? "سلم النقاط" : "Points scale"}</div>
              <div class="small muted">${lang==="ar" ? "اطّلع على سلم التقديرات والنقاط" : "View the grade-to-points policy"}</div>
            </a>
          </div>

          <div class="small muted" style="margin-top:14px; text-align:center">
            ${lang==="ar" ? "كل الحسابات على مقياس 4.0" : "All calculations use a 4.0 scale"}
          </div>
        </div>
      </div>
    `;
  }


  function semesterPage(id){
    const s = state().semesters.find(x=>x.id===id);
    if(!s) return `<div class="card">${state().settings.lang==="ar" ? "الفصل غير موجود." : "Semester not found."}</div>`;
    const p = getPolicy(state().settings.policyId);
    const term = calcGPA(s.courses, p);

    const rows = s.courses.map(c=>{
      const statusOptions = [
        ["NORMAL", t("normal")],
        ["W", t("withdrew")],
        ["AU", t("audit")],
        ["P", t("pass")]
      ].map(([v,l])=>`<option value="${v}" ${c.status===v?"selected":""}>${escapeHtml(l)}</option>`).join("");

      const gradeKind = c.grade?.kind || "percent";
      const percentVal = gradeKind==="percent" ? (c.grade.value ?? 0) : "";
      const letterVal  = gradeKind==="letter"  ? (c.grade.value ?? "") : "";

      return `
        <tr>
          <td><input data-id="${c.id}" data-k="code" value="${escapeAttr(c.code||"")}" placeholder="AHS114"></td>
          <td><input data-id="${c.id}" data-k="name" value="${escapeAttr(c.name||"")}" placeholder="${state().settings.lang==="ar"?"اسم المقرر":"Course name"}"></td>
          <td style="max-width:120px"><input data-id="${c.id}" data-k="creditHours" type="number" min="0" value="${Number(c.creditHours||0)}"></td>
          <td style="min-width:260px">
            <div class="grid" style="grid-template-columns:1fr 1fr; gap:6px">
              <select data-id="${c.id}" data-k="gradeKind">
                <option value="percent" ${gradeKind==="percent"?"selected":""}>${state().settings.lang==="ar"?"نسبة %":"Percent"}</option>
                <option value="letter" ${gradeKind==="letter"?"selected":""}>${state().settings.lang==="ar"?"حرف":"Letter"}</option>
              </select>
              <input data-id="${c.id}" data-k="gradeValue" value="${escapeAttr(gradeKind==="percent"?percentVal:letterVal)}"
                     placeholder="${gradeKind==="percent"?"0..100":"A, B+, ..."}">
            </div>
          </td>
          <td>
            <select data-id="${c.id}" data-k="status">${statusOptions}</select>
          </td>
          <td><button class="btn secondary" data-id="${c.id}" data-act="del">${t("delete")}</button></td>
        </tr>
      `;
    }).join("");

    return `
      <div class="card">
        <div class="row">
          <div>
            <div class="small muted">${t("semesters")}</div>
            <div style="font-weight:800; font-size:18px">${escapeHtml(s.title)}</div>
            <div class="small muted">${escapeHtml(p.displayName[state().settings.lang])} • ${t("excludedNote")}</div>
          </div>
          <div class="row" style="gap:8px">
            <div class="badge">${t("termGpa")}: <b>${term.gpa ?? "—"}</b></div>
            <button class="btn" id="addCourseBtn">${t("addCourse")}</button>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px; overflow:auto">
        <table>
          <thead>
            <tr>
              <th>${t("code")}</th>
              <th>${t("name")}</th>
              <th>${t("credits")}</th>
              <th>${t("grade")}</th>
              <th>${t("status")}</th>
              <th>${t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${s.courses.length===0
              ? `<tr><td colspan="6" class="muted" style="text-align:center; padding:18px">${state().settings.lang==="ar" ? "لا يوجد مقررات." : "No courses."}</td></tr>`
              : rows
            }
          </tbody>
        </table>
      </div>
    `;
  }

  function policyPage(){
    const p = getPolicy(state().settings.policyId);
    const bandRows = p.bands.map(b=>`
      <tr>
        <td><b>${escapeHtml(b.letter)}</b></td>
        <td>${Number(b.points).toFixed(1)}</td>
        <td>${b.min}</td>
        <td>${b.max}</td>
      </tr>
    `).join("");

    const cgpaRows = p.cgpaBands.map(b=>`
      <tr>
        <td><b>${escapeHtml(state().settings.lang==="ar"?b.ar:b.en)}</b></td>
        <td>${b.min}</td>
        <td>${b.max}</td>
      </tr>
    `).join("");

    return `
      <div class="card">
        <div style="font-weight:800; font-size:18px">${t("policy")}</div>
        <div class="small muted" style="margin-top:4px">${escapeHtml(p.displayName[state().settings.lang])} • ${t("excludedNote")}</div>
      </div>

      <div class="card" style="margin-top:12px; overflow:auto">
        <table>
          <thead>
            <tr>
              <th>${state().settings.lang==="ar"?"الرمز":"Letter"}</th>
              <th>${state().settings.lang==="ar"?"النقاط":"Points"}</th>
              <th>${state().settings.lang==="ar"?"من %":"Min %"}</th>
              <th>${state().settings.lang==="ar"?"إلى %":"Max %"}</th>
            </tr>
          </thead>
          <tbody>${bandRows}</tbody>
        </table>
      </div>

      <div class="card" style="margin-top:12px; overflow:auto">
        <div class="small muted" style="margin-bottom:8px">${state().settings.lang==="ar"?"تصنيف التقدير حسب الـ CGPA":"CGPA Classification"}</div>
        <table>
          <thead>
            <tr>
              <th>${state().settings.lang==="ar"?"التقدير":"Grade"}</th>
              <th>${state().settings.lang==="ar"?"من":"Min"}</th>
              <th>${state().settings.lang==="ar"?"إلى":"Max"}</th>
            </tr>
          </thead>
          <tbody>${cgpaRows}</tbody>
        </table>
      </div>
    `;
  }

  function plannerPage(){
    const p = getPolicy(state().settings.policyId);
    const cgpa = calcCGPA();
    const currentHours = cgpa.gpaHours;
    const currentQP = cgpa.qualityPoints;

    return `
      <div class="card">
        <div style="font-weight:800; font-size:18px">${t("planner")}</div>
        <div class="small muted" style="margin-top:4px">${state().settings.lang==="ar"
          ? "احسب متوسط النقاط المطلوب في الساعات المتبقية للوصول للمعدل المستهدف."
          : "Compute required average points in remaining credits to reach your target CGPA."
        }</div>
      </div>

      <div class="grid grid-2" style="margin-top:12px">
        <div class="card">
          <label class="small muted">${t("targetCgpa")}</label>
          <input id="plTarget" type="number" step="0.01" value="3.00" style="margin-top:6px">
          <div style="height:10px"></div>
          <label class="small muted">${t("remainingCredits")}</label>
          <input id="plRemaining" type="number" value="30" style="margin-top:6px">
          <div class="sep"></div>
          <div class="notice">
            <div>${t("gpaHours")}: <b>${currentHours.toFixed(2)}</b></div>
            <div>${t("qualityPoints")}: <b>${currentQP.toFixed(2)}</b></div>
          </div>
        </div>

        <div class="card">
          <div class="small muted">${t("requiredAvg")}</div>
          <div class="value" id="plRequired" style="font-size:34px; font-weight:850; margin-top:6px">—</div>
          <div class="sep"></div>
          <div class="notice" id="plPercentBox">
            <div class="small muted">${t("approxPercent")}</div>
            <div style="font-weight:800; font-size:18px" id="plPercent">—</div>
            <div class="small muted" style="margin-top:6px">${state().settings.lang==="ar"?"تقريب مبني على سلم النقاط الحالي.":"Approx based on current policy bands."}</div>
          </div>
          <div id="plWarn" class="notice danger" style="display:none; margin-top:10px"></div>
        </div>
      </div>
    `;
  }

  function gpa2gradePage(){
    const p = getPolicy(state().settings.policyId);
    return `
      <div class="card">
        <div style="font-weight:800; font-size:18px">${t("gpaToGrade")}</div>
        <div class="small muted" style="margin-top:4px">${escapeHtml(p.displayName[state().settings.lang])}</div>
      </div>

      <div class="grid grid-2" style="margin-top:12px">
        <div class="card">
          <label class="small muted">${t("currentCgpa")}</label>
          <input id="g2gVal" type="number" step="0.01" min="0" max="4" value="3.00" style="margin-top:6px">
        </div>

        <div class="card">
          <div class="small muted">${t("result")}</div>
          <div class="value" id="g2gRes" style="font-size:34px; font-weight:850; margin-top:6px">—</div>
        </div>
      </div>
    `;
  }

  
  function improvePage(){
  const lang = state().settings.lang;
  const view = (state().ui && state().ui.improveView) ? state().ui.improveView : "choose";

  // No localStorage persistence here (refresh = reset). Defaults:
  const defaults = {
    total: 130,
    earned: "",
    term: "",
    curCgpa: "",
    targetCgpa: "",
    expectedPts: ""
  };

  const tLocal = (ar,en)=> lang==="ar" ? ar : en;

  const header = `
    <div class="card fade-in" style="display:flex; align-items:center; justify-content:space-between; gap:12px">
      <div>
        <div style="font-weight:900; font-size:20px">${tLocal("تحسين التقدير","Improve GPA")}</div>
        <div class="small muted" style="margin-top:4px">${tLocal("اختر أحد الوضعين. النتائج تظهر في نافذة منبثقة بعد الحساب.","Pick a mode. Results appear in a popup after calculation.")}</div>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end">
        <button class="btn secondary" id="impBack">${tLocal("رجوع","Back")}</button>
        <button class="btn secondary" id="impReset">${tLocal("Reset","Reset")}</button>
      </div>
    </div>
  `;

  const chooser = `
    <div class="grid grid-2" style="margin-top:12px">
      <button class="card cardbtn fade-in" id="impGoA">
        <div class="cardTitleRow"><span class="cardIcon">📈</span><div class="cardTitle">${tLocal("1) توقّع تقدير الفصل وتأثيره على التراكمي","1) Predict this term & impact on CGPA")}</div></div>
        <div class="small muted" style="margin-top:6px">${tLocal("ادخل توقعك للفصل (سريع أو مفصل) وسيظهر التراكمي الجديد.","Enter a term expectation (quick or detailed) to see the new CGPA.")}</div>
      </button>
      <button class="card cardbtn fade-in" id="impGoB">
        <div class="cardTitleRow"><span class="cardIcon">🎯</span><div class="cardTitle">${tLocal("2) هدف للتراكمي (المفروض أجيب كام؟)","2) Target CGPA (what do I need?)")}</div></div>
        <div class="small muted" style="margin-top:6px">${tLocal("اكتب هدفك للتراكمي وسيظهر لك المتوسط المطلوب هذا الفصل.","Enter a target CGPA to get the required term average.")}</div>
      </button>
    </div>
  `;

  const basics = `
    <div class="card fade-in" style="margin-top:12px">
      <div class="small muted">${tLocal("البيانات الأساسية","Basics")}</div>
      <div style="height:10px"></div>
      <div class="grid grid-2">
        <div>
          <label class="small muted">${tLocal("إجمالي ساعات الكلية","Total program credits")}</label>
          <input id="impTotal" type="number" min="1" value="${defaults.total}">
        </div>
        <div>
          <label class="small muted">${tLocal("الساعات المنجزة","Earned credits")}</label>
          <input id="impEarned" type="number" min="0" value="${defaults.earned}" placeholder="${tLocal("مثال: 60","e.g., 60")}">
        </div>
        <div>
          <label class="small muted">${tLocal("ساعات هذا الفصل","This term credits")}</label>
          <input id="impTerm" type="number" min="1" value="${defaults.term}" placeholder="${tLocal("مثال: 18","e.g., 18")}">
        </div>
        <div>
          <label class="small muted">${tLocal("المعدل الحالي (CGPA)","Current CGPA")}</label>
          <input id="impCurCgpa" type="number" min="0" max="4" step="0.01" value="${defaults.curCgpa}" placeholder="${tLocal("0 إلى 4","0 to 4")}">
        </div>
      </div>
      <div id="impWarn" class="warn" style="display:none; margin-top:12px"></div>
    </div>
  `;

  const blockA = `
    ${basics}
    <div class="card fade-in" style="margin-top:12px">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap">
        <div style="font-weight:900">${tLocal("توقّعك لهذا الفصل","Your term expectation")}</div>
        <label class="small muted" style="display:flex; align-items:center; gap:10px; user-select:none">
          <input id="impDetailedToggle" type="checkbox">
          <span>${tLocal("مفصل (اكتب المواد ودرجاتها)","Detailed (enter courses & scores)")}</span>
        </label>
      </div>

      <div style="height:12px"></div>

      <div id="impQuickBox" class="fade-in">
        <label class="small muted">${tLocal("المتوسط المتوقع للفصل (نقاط 0–4)","Expected term average (points 0–4)")}</label>
        <input id="impExpectedPts" type="number" min="0" max="4" step="0.01" value="${defaults.expectedPts}" placeholder="${tLocal("مثال: 3.3","e.g., 3.3")}">
        <div class="small muted" style="margin-top:6px">${tLocal("ملاحظة: 4.0 = A+ (ممتاز).","Note: 4.0 = A+ (Excellent).")}</div>
      </div>

      <div id="impDetailedBox" class="fade-in" style="display:none; margin-top:12px">
        <div class="small muted">${tLocal("أدخل المواد (الدرجة من/وعدد الساعات). سنحسب SGPA تلقائياً.","Enter courses (score/out of + credits). We’ll compute SGPA automatically.")}</div>
        <div style="height:10px"></div>
        <div id="impCourses"></div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px">
          <button class="btn secondary" id="impAddCourse">${tLocal("إضافة مادة","Add course")}</button>
          <div class="small muted" style="display:flex; align-items:center; gap:8px">
            <span>${tLocal("SGPA:","SGPA:")}</span> <b id="impSgpa">—</b>
          </div>
        </div>
      </div>

      <div style="height:12px"></div>
      <button class="btn" id="impCalcNew">${tLocal("احسب","Calculate")}</button>

      <!-- hidden holders (avoid errors) -->
      <div style="display:none">
        <div id="impNewCgpa">—</div>
        <div id="impNewGrade">—</div>
        <div id="impDelta">—</div>
      </div>
    </div>
  `;

  const blockB = `
    ${basics}
    <div class="card fade-in" style="margin-top:12px">
      <div style="font-weight:900">${tLocal("هدفك للتراكمي","Your CGPA target")}</div>
      <div class="small muted" style="margin-top:6px">${tLocal("اكتب هدفك (0–4). إذا كان أكبر من 4 سنخبرك أنه غير منطقي.","Enter a target (0–4). If it's >4 we'll mark it as unrealistic.")}</div>

      <div style="height:10px"></div>
      <label class="small muted">${tLocal("المعدل المستهدف (CGPA)","Target CGPA")}</label>
      <input id="impTargetCgpa" type="number" min="0" max="4" step="0.01" value="${defaults.targetCgpa}" placeholder="${tLocal("مثال: 3.0","e.g., 3.0")}">

      <div style="height:12px"></div>
      <button class="btn" id="impCalcReq">${tLocal("احسب المطلوب","Calculate required")}</button>

      <!-- hidden holders -->
      <div style="display:none">
        <div id="impReqPts">—</div>
      </div>
    </div>
  `;

  const body =
    view==="a" ? blockA :
    view==="b" ? blockB :
    chooser;

  return `
    ${header}
    ${body}
  `;
}

function backupPage(){
    return `
      <div class="card">
        <div style="font-weight:800; font-size:18px">${t("backupRestore")}</div>
        <div class="small muted" style="margin-top:4px">${state().settings.lang==="ar"
          ? "صدّر ملف JSON واحتفظ به، أو استرجعه لاحقًا."
          : "Export a JSON backup, or restore it later."
        }</div>
      </div>

      <div class="grid grid-2" style="margin-top:12px">
        <div class="card">
          <button class="btn" id="exportBtn">${t("exportData")}</button>
          <div class="small muted" style="margin-top:10px">${state().settings.lang==="ar"
            ? "سيتم تنزيل ملف JSON يحتوي على كل بياناتك."
            : "Downloads a JSON file with all your data."
          }</div>
        </div>
        <div class="card">
          <label class="small muted">${t("importData")}</label>
          <input id="importFile" type="file" accept="application/json" style="margin-top:6px">
          <div id="backupMsg" class="notice" style="display:none; margin-top:10px"></div>
        </div>
      </div>
    `;
  }

  function collegesPage(){
    const lang = state().settings.lang;
    const list = getAllPolicies().map(p=>{
      const isCustom = p.id.startsWith("custom-");
      return `
        <div class="row" style="padding:10px 0; border-bottom:1px solid var(--border)">
          <div>
            <div style="font-weight:650">${escapeHtml(p.displayName[lang])}</div>
            <div class="small muted">${escapeHtml(p.id)}</div>
          </div>
          <div class="row" style="gap:8px">
            ${isCustom ? `<button class="btn secondary" data-pol="${p.id}" data-act="delpol">${lang==="ar"?"حذف":"Delete"}</button>` : `<span class="badge">${lang==="ar"?"مضمن":"Built-in"}</span>`}
            <button class="btn" data-pol="${p.id}" data-act="usepol">${lang==="ar"?"اختيار":"Select"}</button>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="card">
        <div style="font-weight:800; font-size:18px">${t("addCollege")}</div>
        <div class="small muted" style="margin-top:4px">${lang==="ar"
          ? "إضافة كلية بسلم نقاط افتراضي (قابل للتعديل داخل ملف app.js إذا احتجت)."
          : "Add a college using a default template (editable inside app.js if needed)."
        }</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="grid grid-2">
          <div>
            <label class="small muted">${lang==="ar"?"الاسم (عربي)":"Name (Arabic)"}</label>
            <input id="colAr" placeholder="${lang==="ar"?"مثال: كلية علوم":"e.g. Faculty of Science"}" style="margin-top:6px">
          </div>
          <div>
            <label class="small muted">${lang==="ar"?"الاسم (English)":"Name (English)"}</label>
            <input id="colEn" placeholder="e.g. Faculty of Science" style="margin-top:6px">
          </div>
        </div>
        <div style="margin-top:10px">
          <button class="btn" id="addCollegeBtn">${t("save")}</button>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="small muted" style="margin-bottom:8px">${lang==="ar"?"كل الكليات/السياسات":"All colleges/policies"}</div>
        ${list}
      </div>
    `;
  }

  function route(){
    const hash = location.hash || "#/dashboard";
    const parts = hash.replace(/^#\//,"").split("/");
    const page = parts[0];

    if(page==="dashboard") return { name:"dashboard" };    if(page==="policy") return { name:"policy" };
    if(page==="semester") return { name:"semester", id: parts[1] };
    if(page==="tools"){
      if(parts[1]==="gpa2grade") return { name:"gpa2grade" };
      if(parts[1]==="improve") return { name:"improve" };
      if(parts[1]==="backup") return { name:"backup" };
    }
    if(page==="colleges") return { name:"colleges" };
    return { name:"dashboard" };
  }

  function render(){
    const r = route();
    const app = document.getElementById("app");
    if(!app) return;

    let html="";
    if(r.name==="dashboard") html = dashboard();
        else if(r.name==="policy") html = policyPage();
    else if(r.name==="semester") html = semesterPage(r.id);
    else if(r.name==="gpa2grade") html = gpa2gradePage();
    else if(r.name==="improve") html = improvePage();
    else if(r.name==="backup") html = backupPage();
    else if(r.name==="colleges") html = collegesPage();

    app.innerHTML = html;
    wire(r);
  }

  function wire(r){
    const lang = state().settings.lang;

    // global buttons
    updateNavLabels();

    // dashboard
    if(r.name==="dashboard"){
      const btn = document.getElementById("addSemesterBtn");
      btn && btn.addEventListener("click", ()=>{
        const title = prompt(t("semesterTitle"));
        if(!title || !title.trim()) return;
        setState(s=>{
          s.semesters.unshift({ id: crypto.randomUUID(), title:title.trim(), courses:[] });
          return s;
        });
      });

      const sel = document.getElementById("policySelect");
      sel && sel.addEventListener("change", (e)=>{
        const v = e.target.value;
        setState(s=>{ s.settings.policyId=v; return s; });
      });
    }

    // semester page
    if(r.name==="semester"){
      const btn = document.getElementById("addCourseBtn");
      btn && btn.addEventListener("click", ()=>{
        setState(s=>{
          const sem = s.semesters.find(x=>x.id===r.id);
          if(!sem) return s;
          sem.courses.unshift({
            id: crypto.randomUUID(),
            code:"",
            name:"",
            creditHours:3,
            grade:{kind:"percent", value:0},
            status:"NORMAL"
          });
          return s;
        });
      });

      // inputs
      document.querySelectorAll("input[data-id], select[data-id], button[data-act]").forEach(el=>{
        if(el.matches("button[data-act='del']")){
          el.addEventListener("click", ()=>{
            const id = el.getAttribute("data-id");
            setState(s=>{
              const sem = s.semesters.find(x=>x.id===r.id);
              if(!sem) return s;
              sem.courses = sem.courses.filter(c=>c.id!==id);
              return s;
            });
          });
        } else {
          el.addEventListener("change", (ev)=>{
            const id = el.getAttribute("data-id");
            const k = el.getAttribute("data-k");
            const v = el.value;
            setState(s=>{
              const sem = s.semesters.find(x=>x.id===r.id);
              if(!sem) return s;
              const c = sem.courses.find(x=>x.id===id);
              if(!c) return s;

              if(k==="code") c.code = v;
              if(k==="name") c.name = v;
              if(k==="creditHours") c.creditHours = Number(v||0);
              if(k==="status") c.status = v;

              if(k==="gradeKind"){
                c.grade = { kind:v, value: (v==="percent"?0:"") };
              }
              if(k==="gradeValue"){
                if(!c.grade) c.grade = {kind:"percent", value:0};
                if(c.grade.kind==="percent") c.grade.value = Number(v||0);
                else c.grade.value = v;
              }
              return s;
            });
          });
        }
      });
    }

    // gpa2grade live
    if(r.name==="gpa2grade"){
      const p = getPolicy(state().settings.policyId);
      const inp = document.getElementById("g2gVal");
      const out = document.getElementById("g2gRes");
      const recalc = ()=>{
        const x = Math.max(0, Math.min(4, Number(inp.value||0)));
        const band = p.cgpaBands.find(b=>x>=b.min && x<=b.max);
        out.textContent = band ? (lang==="ar"?band.ar:band.en) : "—";
      };
      inp.addEventListener("input", recalc);
      recalc();
    }

    
    // improve (requested workflow)
    if(r.name==="improve"){
  // view navigation
  const setView = (v)=>{
    const ui = Object.assign({}, (state().ui||{}), {improveView:v});
    setState({ui});
    render();
  };

  const q = (id)=>document.getElementById(id);

  // modal helpers (use global once)
  const modal = q("gpaModal");
  const modalTitle = q("gpaModalTitle");
  const modalBody = q("gpaModalBody");
  const modalFoot = q("gpaModalFoot");
  const printArea = q("printArea");

  const closeModal = ()=>{
    if(!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("modal-error");
    modalTitle.textContent = "";
    modalBody.innerHTML = "";
    modalFoot.innerHTML = "";
  };

  const openModal = ({title, bodyHtml, isError=false, actions=[]})=>{
    if(!modal) return;
    modal.classList.toggle("modal-error", !!isError);
    modalTitle.textContent = title || "";
    modalBody.innerHTML = bodyHtml || "";
    modalFoot.innerHTML = "";

    actions.forEach(a=>{
      const b=document.createElement("button");
      b.className = "btn " + (a.variant==="secondary" ? "secondary" : "");
      b.textContent = a.text;
      b.addEventListener("click", ()=>a.onClick && a.onClick());
      modalFoot.appendChild(b);
    });

    modal.classList.remove("hidden");
  };

  // close modal events
  const closeBtn = q("gpaModalClose");
  if(closeBtn) closeBtn.onclick = closeModal;
  if(modal){
    const bd = modal.querySelector(".modal-backdrop");
    if(bd) bd.onclick = closeModal;
  }
  document.addEventListener("keydown", (e)=>{
    if(e.key==="Escape") closeModal();
  }, {once:true});

  // choose buttons
  const goA=q("impGoA");
  const goB=q("impGoB");
  if(goA) goA.addEventListener("click", ()=>setView("a"));
  if(goB) goB.addEventListener("click", ()=>setView("b"));

  // header controls
  const back=q("impBack");
  const reset=q("impReset");
  if(back) back.addEventListener("click", ()=>{
    // if already in chooser -> go home
    const v=(state().ui && state().ui.improveView) ? state().ui.improveView : "choose";
    if(v==="choose") nav("#/dashboard");
    else setView("choose");
  });

  const warnBox = q("impWarn");
  const setWarn = (msg)=>{
    if(!warnBox) return;
    if(!msg){ warnBox.style.display="none"; warnBox.textContent=""; return; }
    warnBox.style.display="block";
    warnBox.textContent=msg;
  };

  const clamp4 = (el)=>{
    if(!el) return;
    el.addEventListener("input", ()=>{
      const v=parseFloat(el.value);
      if(Number.isFinite(v) && v>4) el.value="4";
      if(Number.isFinite(v) && v<0) el.value="0";
    });
  };

  const totalEl=q("impTotal");
  const earnedEl=q("impEarned");
  const termEl=q("impTerm");
  const curCgpaEl=q("impCurCgpa");
  clamp4(curCgpaEl);

  const clearAll = ()=>{
    if(totalEl) totalEl.value="130";
    if(earnedEl) earnedEl.value="";
    if(termEl) termEl.value="";
    if(curCgpaEl) curCgpaEl.value="";
    const exp=q("impExpectedPts"); if(exp) exp.value="";
    const tgt=q("impTargetCgpa"); if(tgt) tgt.value="";
    const dt=q("impDetailedToggle"); if(dt) dt.checked=false;
    setWarn("");
    // reset detailed rows
    if(window.__impCourses){ window.__impCourses=[]; }
    render();
  };
  if(reset) reset.addEventListener("click", clearAll);

  // detailed courses
  const coursesWrap=q("impCourses");
  const sgpaEl=q("impSgpa");
  const detailedToggle=q("impDetailedToggle");
  const detailedBox=q("impDetailedBox");
  const quickBox=q("impQuickBox");
  const expPtsEl=q("impExpectedPts");
  clamp4(expPtsEl);

  const ensureCourses = ()=>{
    if(!window.__impCourses) window.__impCourses=[];
    if(window.__impCourses.length===0){
      window.__impCourses.push({name:"", credits:"", score:"", outOf:"100"});
    }
  };

  const renderCourses = ()=>{
    if(!coursesWrap) return;
    ensureCourses();
    const lang = state().settings.lang;
    const tLocal = (ar,en)=> lang==="ar" ? ar : en;

    coursesWrap.innerHTML = window.__impCourses.map((c,i)=>`
      <div class="card" style="padding:12px; margin-bottom:10px">
        <div class="grid grid-2">
          <div>
            <label class="small muted">${tLocal("اسم المادة (اختياري)","Course name (optional)")}</label>
            <input data-c="name" data-i="${i}" value="${escapeHtml(c.name||"")}" placeholder="${tLocal("مثال: Radiology","e.g., Radiology")}">
          </div>
          <div>
            <label class="small muted">${tLocal("عدد الساعات","Credits")}</label>
            <input data-c="credits" data-i="${i}" type="number" min="0" step="0.5" value="${escapeHtml(c.credits||"")}" placeholder="${tLocal("مثال: 3","e.g., 3")}">
          </div>
          <div>
            <label class="small muted">${tLocal("درجتك","Your score")}</label>
            <input data-c="score" data-i="${i}" type="number" min="0" step="0.1" value="${escapeHtml(c.score||"")}" placeholder="${tLocal("مثال: 85","e.g., 85")}">
          </div>
          <div>
            <label class="small muted">${tLocal("من كام؟","Out of")}</label>
            <input data-c="outOf" data-i="${i}" type="number" min="1" step="1" value="${escapeHtml(c.outOf||"100")}" placeholder="100">
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:10px">
          <button class="btn secondary" data-del="${i}">${tLocal("حذف","Remove")}</button>
        </div>
      </div>
    `).join("");

    // bind inputs
    coursesWrap.querySelectorAll("input[data-c]").forEach(inp=>{
      inp.addEventListener("input", ()=>{
        const i=+inp.getAttribute("data-i");
        const k=inp.getAttribute("data-c");
        window.__impCourses[i][k]=inp.value;
        calcSgpa();
      });
    });
    coursesWrap.querySelectorAll("button[data-del]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const i=+btn.getAttribute("data-del");
        window.__impCourses.splice(i,1);
        if(window.__impCourses.length===0) window.__impCourses.push({name:"", credits:"", score:"", outOf:"100"});
        renderCourses();
        calcSgpa();
      });
    });
  };

  const addCourseBtn=q("impAddCourse");
  if(addCourseBtn){
    addCourseBtn.addEventListener("click", ()=>{
      ensureCourses();
      window.__impCourses.push({name:"", credits:"", score:"", outOf:"100"});
      renderCourses();
    });
  }

  const pctToPts = (pct)=>{
    // Generic 0-100% to 0-4 mapping: 0-59=0, 60=1, 65=1.3, 70=1.7, 75=2.0, 80=2.3, 85=2.7, 90=3.0, 95=3.7, 100=4.0
    // Uses piecewise linear between anchors.
    const anchors=[
      [0,0],[59,0],
      [60,1.0],[65,1.3],[70,1.7],[75,2.0],[80,2.3],[85,2.7],[90,3.0],[95,3.7],[100,4.0]
    ];
    const p=Math.max(0, Math.min(100, pct));
    for(let i=1;i<anchors.length;i++){
      const [p1,g1]=anchors[i-1], [p2,g2]=anchors[i];
      if(p<=p2){
        if(p2===p1) return g2;
        const r=(p-p1)/(p2-p1);
        return g1 + r*(g2-g1);
      }
    }
    return 4.0;
  };

  const calcSgpa = ()=>{
    if(!sgpaEl) return;
    ensureCourses();
    let sum=0, cr=0;
    window.__impCourses.forEach(c=>{
      const credits=parseFloat(c.credits);
      const score=parseFloat(c.score);
      const outOf=parseFloat(c.outOf||"100");
      if(Number.isFinite(credits) && credits>0 && Number.isFinite(score) && Number.isFinite(outOf) && outOf>0){
        const pct=(score/outOf)*100;
        const pts=pctToPts(pct);
        sum += pts*credits;
        cr += credits;
      }
    });
    if(cr<=0){
      sgpaEl.textContent="—";
      return;
    }
    const sgpa=sum/cr;
    sgpaEl.textContent=sgpa.toFixed(2);
    if(expPtsEl){
      expPtsEl.value=sgpa.toFixed(2);
    }
  };

  if(detailedToggle){
    detailedToggle.addEventListener("change", ()=>{
      const on=!!detailedToggle.checked;
      if(detailedBox) detailedBox.style.display=on ? "block" : "none";
      if(quickBox) quickBox.style.display="block";
      if(on){
        ensureCourses();
        renderCourses();
        calcSgpa();
      }
    });
    // initial state
    if(detailedToggle.checked){
      if(detailedBox) detailedBox.style.display="block";
      ensureCourses(); renderCourses(); calcSgpa();
    }
  }

  const validateBasics = ()=>{
    const lang=state().settings.lang;
    const tLocal=(ar,en)=> lang==="ar"?ar:en;

    const total = parseFloat(totalEl && totalEl.value);
    const earned = parseFloat(earnedEl && earnedEl.value);
    const term = parseFloat(termEl && termEl.value);
    const cur = parseFloat(curCgpaEl && curCgpaEl.value);

    if(!Number.isFinite(total) || total<=0) return {ok:false, msg:tLocal("اكتب إجمالي ساعات الكلية.","Enter total program credits.")};
    if(!Number.isFinite(earned) || earned<0) return {ok:false, msg:tLocal("اكتب الساعات المنجزة بشكل صحيح.","Enter earned credits correctly.")};
    if(!Number.isFinite(term) || term<=0) return {ok:false, msg:tLocal("اكتب ساعات هذا الفصل.","Enter this term credits.")};
    if(!Number.isFinite(cur) || cur<0 || cur>4) return {ok:false, msg:tLocal("المعدل الحالي يجب أن يكون بين 0 و 4.","Current CGPA must be between 0 and 4.")};

    return {ok:true, total, earned, term, cur};
  };

  const gradeFromPts = (pts)=>{
    // Simple label only (doesn't affect math).
    if(pts>=3.7) return state().settings.lang==="ar" ? "ممتاز" : "Excellent";
    if(pts>=3.0) return state().settings.lang==="ar" ? "جيد جدًا" : "Very Good";
    if(pts>=2.0) return state().settings.lang==="ar" ? "جيد" : "Good";
    if(pts>=1.0) return state().settings.lang==="ar" ? "مقبول" : "Pass";
    return state().settings.lang==="ar" ? "ضعيف" : "Low";
  };

  const printSummary = (title, rows)=>{
    if(!printArea) return;
    const lang=state().settings.lang;
    const tLocal=(ar,en)=> lang==="ar"?ar:en;
    printArea.innerHTML = `
      <div style="font-family: Arial, sans-serif">
        <div style="font-size:18px; font-weight:800; margin-bottom:8px">${tLocal("Summary","Summary")}</div>
        <div style="font-size:14px; font-weight:700; margin-bottom:14px">${escapeHtml(title||"")}</div>
        <div style="border:1px solid #ddd; border-radius:10px; padding:12px">
          ${rows.map(r=>`
            <div style="display:flex; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px solid #eee">
              <div style="font-weight:700">${escapeHtml(r.k)}</div>
              <div>${escapeHtml(r.v)}</div>
            </div>
          `).join("").replace(/border-bottom:1px solid #eee"(?:(?!<\/div>).)*<\/div>\s*$/, 'border-bottom:none"></div>')}
        </div>
      </div>
    `;
    window.print();
  };

  // A) Calculate new CGPA
  const btnNew=q("impCalcNew");
  if(btnNew){
    btnNew.addEventListener("click", ()=>{
      setWarn("");
      const vb=validateBasics();
      if(!vb.ok){ setWarn(vb.msg); return; }

      const lang=state().settings.lang;
      const tLocal=(ar,en)=> lang==="ar"?ar:en;

      const exp=parseFloat(expPtsEl && expPtsEl.value);
      if(!Number.isFinite(exp) || exp<0 || exp>4){
        setWarn(tLocal("اكتب متوسط الفصل المتوقع (من 0 إلى 4).","Enter expected term average (0 to 4)."));
        return;
      }

      const {earned, term, cur}=vb;
      const newCgpa = ((cur*earned) + (exp*term)) / (earned+term);
      const delta = newCgpa - cur;

      openModal({
        title: tLocal("النتيجة","Result"),
        bodyHtml: `
          <div class="grid grid-2">
            <div class="card" style="padding:14px">
              <div class="small muted">${tLocal("المعدل الجديد المتوقع (CGPA)","Expected new CGPA")}</div>
              <div style="font-size:34px; font-weight:900; margin-top:6px">${newCgpa.toFixed(2)}</div>
              <div class="small muted" style="margin-top:6px">${tLocal("التغير","Change")}: <b>${(delta>=0?"+":"") + delta.toFixed(2)}</b></div>
            </div>
            <div class="card" style="padding:14px">
              <div class="small muted">${tLocal("متوسط الفصل (SGPA)","Term average (SGPA)")}</div>
              <div style="font-size:34px; font-weight:900; margin-top:6px">${exp.toFixed(2)}</div>
              <div class="small muted" style="margin-top:6px">${tLocal("تقدير تقريبي","Approx grade")}: <b>${gradeFromPts(exp)}</b></div>
            </div>
          </div>
          <div class="small muted" style="margin-top:10px">${tLocal("كل الحسابات على مقياس 4.0.","All calculations are on a 4.0 scale.")}</div>
        `,
        actions:[
          {text:tLocal("طباعة","Print"), variant:"secondary", onClick:()=>printSummary(tLocal("توقّع الفصل وتأثيره على التراكمي","Term prediction & CGPA impact"),[
            {k:tLocal("المعدل الحالي (CGPA)","Current CGPA"), v:cur.toFixed(2)},
            {k:tLocal("الساعات المنجزة","Earned credits"), v:String(earned)},
            {k:tLocal("ساعات هذا الفصل","This term credits"), v:String(term)},
            {k:tLocal("متوسط الفصل (SGPA)","Term average (SGPA)"), v:exp.toFixed(2)},
            {k:tLocal("المعدل الجديد المتوقع (CGPA)","Expected new CGPA"), v:newCgpa.toFixed(2)},
            {k:tLocal("التغير","Change"), v:(delta>=0?"+":"")+delta.toFixed(2)}
          ])},
          {text:tLocal("إغلاق","Close"), variant:"secondary", onClick:closeModal}
        ]
      });
    });
  }

  // B) Calculate required term average to reach target
  const btnReq=q("impCalcReq");
  const targetEl=q("impTargetCgpa");
  clamp4(targetEl);

  if(btnReq){
    btnReq.addEventListener("click", ()=>{
      setWarn("");
      const vb=validateBasics();
      if(!vb.ok){ setWarn(vb.msg); return; }

      const lang=state().settings.lang;
      const tLocal=(ar,en)=> lang==="ar"?ar:en;

      const target=parseFloat(targetEl && targetEl.value);
      if(!Number.isFinite(target)){
        setWarn(tLocal("اكتب المعدل المستهدف.","Enter the target CGPA."));
        return;
      }
      if(target>4){
        openModal({
          title:tLocal("هدف غير منطقي","Unrealistic target"),
          isError:true,
          bodyHtml:`<div class="small">${tLocal("أقصى معدل على هذا المقياس هو 4.0. اكتب هدفًا بين 0 و 4.","Max on this scale is 4.0. Enter a target between 0 and 4.")}</div>`,
          actions:[{text:tLocal("إغلاق","Close"), variant:"secondary", onClick:closeModal}]
        });
        return;
      }

      const {earned, term, cur}=vb;
      const req = ((target*(earned+term)) - (cur*earned)) / term;

      const ok = (req>=0 && req<=4);
      const msg = ok ? "" : (req>4 ? tLocal("المطلوب أكبر من 4.0 (غير منطقي)","Required is >4.0 (unrealistic)") : tLocal("المطلوب أقل من 0 (غير منطقي)","Required is <0 (unrealistic)"));

      openModal({
        title:tLocal("النتيجة","Result"),
        isError:!ok,
        bodyHtml:`
          <div class="card" style="padding:14px">
            <div class="small muted">${tLocal("المتوسط المطلوب لهذا الفصل (SGPA)","Required term average (SGPA)")}</div>
            <div style="font-size:34px; font-weight:900; margin-top:6px">${req.toFixed(2)}</div>
            ${msg ? `<div style="margin-top:8px; font-weight:800; color:#ff6b6b">${msg}</div>` : ``}
          </div>
          <div class="small muted" style="margin-top:10px">${tLocal("إذا كانت النتيجة غير منطقية، فهذا يعني أن الهدف لا يمكن تحقيقه بهذه الساعات فقط.","If the result is unrealistic, the target can't be achieved with only these credits.")}</div>
        `,
        actions:[
          {text:tLocal("طباعة","Print"), variant:"secondary", onClick:()=>printSummary(tLocal("هدف للتراكمي: المطلوب هذا الفصل","Target CGPA: required this term"),[
            {k:tLocal("المعدل الحالي (CGPA)","Current CGPA"), v:cur.toFixed(2)},
            {k:tLocal("الساعات المنجزة","Earned credits"), v:String(earned)},
            {k:tLocal("ساعات هذا الفصل","This term credits"), v:String(term)},
            {k:tLocal("الهدف (CGPA)","Target CGPA"), v:target.toFixed(2)},
            {k:tLocal("المطلوب هذا الفصل (SGPA)","Required term average (SGPA)"), v:req.toFixed(2)},
            {k:tLocal("ملاحظة","Note"), v:msg || tLocal("ضمن النطاق (0–4).","Within range (0–4).")}
          ])},
          {text:tLocal("إغلاق","Close"), variant:"secondary", onClick:closeModal}
        ]
      });
    });
  }
}

// backup
    if(r.name==="backup"){
      const exportBtn = document.getElementById("exportBtn");
      const importFile = document.getElementById("importFile");
      const msg = document.getElementById("backupMsg");

      exportBtn && exportBtn.addEventListener("click", ()=>{
        const payload = {
          version:1,
          exportedAtISO: new Date().toISOString(),
          data: state()
        };
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "delta-gpa-suite-backup.json";
        a.click();
        URL.revokeObjectURL(url);
        showMsg(msg, (lang==="ar")?"تم تصدير النسخة الاحتياطية.":"Backup exported.", false);
      });

      importFile && importFile.addEventListener("change", async ()=>{
        const f = importFile.files && importFile.files[0];
        if(!f) return;
        try{
          const txt = await f.text();
          const payload = JSON.parse(txt);
          if(!payload || payload.version!==1 || !payload.data) throw new Error("Invalid backup format");
          _state = payload.data;
          save(_state);
          setLang(_state.settings.lang);
          showMsg(msg, (lang==="ar")?"تم الاسترجاع بنجاح.":"Restore done.", false);
          render();
        }catch(e){
          showMsg(msg, (lang==="ar"?"فشل الاسترجاع: ":"Restore failed: ")+ (e.message||"unknown"), true);
        }
      });
    }

    // colleges
    if(r.name==="colleges"){
      const addBtn = document.getElementById("addCollegeBtn");
      addBtn && addBtn.addEventListener("click", ()=>{
        const ar = (document.getElementById("colAr").value||"").trim();
        const en = (document.getElementById("colEn").value||"").trim() || ar;
        if(!ar) return;
        const id = "custom-" + crypto.randomUUID();
        const template = structuredClone(BUILTIN_POLICIES[0]);
        template.id = id;
        template.displayName = {ar,en};
        setState(s=>{
          s.customPolicies.push(template);
          s.settings.policyId = id;
          return s;
        });
        location.hash = "#/dashboard";
      });

      document.querySelectorAll("button[data-act='usepol']").forEach(b=>{
        b.addEventListener("click", ()=>{
          const pid = b.getAttribute("data-pol");
          setState(s=>{ s.settings.policyId=pid; return s; });
          location.hash = "#/dashboard";
        });
      });
      document.querySelectorAll("button[data-act='delpol']").forEach(b=>{
        b.addEventListener("click", ()=>{
          const pid = b.getAttribute("data-pol");
          setState(s=>{
            s.customPolicies = s.customPolicies.filter(p=>p.id!==pid);
            if(s.settings.policyId===pid) s.settings.policyId = BUILTIN_POLICIES[0].id;
            return s;
          });
          render();
        });
      });
    }
  }

  function showMsg(el, text, isDanger){
    if(!el) return;
    el.style.display="block";
    el.textContent = text;
    el.className = "notice" + (isDanger ? " danger":"");
  }

  function escapeHtml(s){
    return String(s||"").replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,"&quot;"); }

  // init
  let _state = load();
  document.getElementById("toggleLang").addEventListener("click", ()=>{
    const next = state().settings.lang==="ar" ? "en":"ar";
    setLang(next);
  });
  window.addEventListener("hashchange", render);

// Persistence disabled: always start clean on refresh
try{
  localStorage.removeItem("delta_gpa_suite_imp_meta_v1");
  localStorage.removeItem("delta_gpa_suite_state_v1");
} catch(e){}


  setLang(_state.settings.lang);
  if(!location.hash) location.hash = "#/dashboard";
  render();
})();