const TERMS = [
  // 速度术语
  ['Grave','庄板','速度'],['Largo','广板','速度'],['Lento','慢板','速度'],['Adagio','柔板','速度'],['Andante','行板','速度'],['Andantino','小行板','速度'],['Moderato','中板','速度'],['Allegretto','小快板','速度'],['Allegro','快板','速度'],['Vivo','快而活泼','速度'],['Vivace','快而活泼','速度'],['Presto','急板','速度'],['ritardando (rit.)','渐慢','速度'],['rallentando (rall.)','渐慢','速度'],['ritenuto (riten.)','突慢','速度'],['accelerando (accel.)','渐快','速度'],['stringendo (string.)','渐快','速度'],['stretto','紧缩/加快','速度'],['a tempo','回到原速度','速度'],['tempo I','回到原速度','速度'],['tempo rubato','速度较自由','速度'],['allargando (allarg.)','渐慢渐强','速度'],['smorzando (smor.)','渐慢渐弱','速度'],
  // 力度术语
  ['pianissimo (pp)','很弱','力度'],['piano (p)','弱','力度'],['mezzo piano (mp)','中弱','力度'],['mezzo forte (mf)','中强','力度'],['forte (f)','强','力度'],['fortissimo (ff)','很强','力度'],['sforzando (sfz.)','个别音加强','力度'],['fp','强后即弱','力度'],['sfp','突强后即弱','力度'],['meno forte','较强','力度'],['crescendo (cresc.)','渐强','力度'],['decresc.','渐弱','力度'],['diminuendo (dim.)','渐弱','力度'],
  // 表情术语
  ['poco','一点点','表情'],['poco a poco','逐渐','表情'],['molto','很','表情'],['assai','非常','表情'],['meno','稍少一些','表情'],['possibile','尽可能','表情'],['più','更多一些','表情'],['non troppo','适度','表情'],['sempre','始终，永远','表情'],['agitato','激动不安地','表情'],['amabile','愉快地','表情'],['amoroso','可爱地','表情'],['animato','生动活泼地','表情'],['brillante','辉煌地','表情'],['buffo','滑稽地','表情'],['cantabile','如歌地','表情'],['con brio','热情地/有活力的','表情'],['con moto','生动地','表情'],['con spirito','有生气地','表情'],['dolce','柔和地','表情'],['dolente','悲哀地','表情'],['elegante','细致精美地','表情'],['espressivo','富有表情地','表情'],['giocoso','诙谐地/快乐地','表情'],['grandioso','华丽地','表情'],['grazioso','优美地','表情'],['leggiero','轻快地','表情'],['maestoso','庄严隆重地','表情'],['marcato','着重清晰地','表情'],['scherzando','诙谐地','表情'],['tranquillo','安静地','表情'],['legato','连贯圆滑地','表情'],['staccato','跳音','表情'],
  // 作品体裁术语
  ['Opus (Op.)','作品','作品体裁'],['Symphony','交响曲','作品体裁'],['Sonata','奏鸣曲','作品体裁'],['Etude','练习曲','作品体裁'],['Prelude','前奏曲','作品体裁'],['Fuga','赋格','作品体裁'],['Waltz','圆舞曲','作品体裁'],['Marcia','进行曲','作品体裁'],['Minuet','小步舞曲','作品体裁'],['Variation','变奏曲','作品体裁'],['Fantasia','幻想曲','作品体裁'],['Concerto','协奏曲','作品体裁'],['solo','独奏/独唱','作品体裁'],
  // 乐队与乐器组术语
  ['orchestra','管弦乐队','乐队'],
  ['Flute','长笛','木管乐器'],['Oboe','双簧管','木管乐器'],['Clarinet','单簧管','木管乐器'],['Bassoon','大管','木管乐器'],
  ['French horn','圆号','铜管乐器'],['Trumpet','小号','铜管乐器'],['Trombone','长号','铜管乐器'],['Tuba','大号','铜管乐器'],
  ['Timpani','定音鼓','打击乐器'],
  ['Harp','竖琴','弦乐器'],['Violin','小提琴','弦乐器'],['Viola','中提琴','弦乐器'],['Cello','大提琴','弦乐器'],['Double Bass (Contrabass)','低音提琴','弦乐器'],
  ['Soprano','女高音','人声'],['Alto','女低音','人声'],['Tenor','男高音','人声'],['Bass','男低音','人声'],['Chorus','合唱','人声']
].map((x,i)=>({id:i,term:x[0],answer:x[1],category:x[2]}));

const GROUPS = {
  '全部': ['速度','力度','表情','作品体裁','乐队','木管乐器','铜管乐器','打击乐器','弦乐器','人声'],
  '速度': ['速度'], '力度': ['力度'], '表情': ['表情'], '作品体裁': ['作品体裁'],
  '乐器与乐队': ['乐队','木管乐器','铜管乐器','打击乐器','弦乐器'], '人声': ['人声']
};
const ICONS={'速度':'♩','力度':'◒','表情':'✦','作品体裁':'▤','乐器与乐队':'♬','人声':'◉'};
const app=document.querySelector('#app');
const storage={
  get(){try{return JSON.parse(localStorage.getItem('term-score-v2'))||{attempts:0,correct:0,today:0,date:'',wrong:{}}}catch{return{attempts:0,correct:0,today:0,date:'',wrong:{}}}},
  set(v){localStorage.setItem('term-score-v2',JSON.stringify(v))}
};
let stats=storage.get();
const today=new Date().toLocaleDateString('zh-CN');
if(stats.date!==today){stats.today=0;stats.date=today;storage.set(stats)}
let config={mode:'mixed',group:'全部',count:10};
let session=null;

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function sample(a,n){return shuffle(a).slice(0,n)}
function escapeHTML(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function poolFor(group){const cats=GROUPS[group]||GROUPS['全部'];return TERMS.filter(t=>cats.includes(t.category))}
function norm(s){
  const trad={'莊':'庄','廣':'广','潑':'泼','漸':'渐','緊':'紧','縮':'缩','較':'较','強':'强','個':'个','後':'后','盡':'尽','適':'适','終':'终','遠':'远','動':'动','愛':'爱','輝':'辉','熱':'热','氣':'气','細':'细','緻':'致','詼':'诙','諧':'谐','華':'华','麗':'丽','優':'优','輕':'轻','嚴':'严','靜':'静','連':'连','貫':'贯','圓':'圆','響':'响','鳴':'鸣','練':'练','習':'习','賦':'赋','進':'进','變':'变','協':'协','獨':'独','樂':'乐','隊':'队','長':'长','雙':'双','單':'单','號':'号','豎':'竖','聲':'声','體':'体','節':'节'};
  return String(s).normalize('NFKC').trim().split('').map(c=>trad[c]||c).join('').replace(/[\s，,。．、；;：:！!？?（）()·/／]/g,'').replace(/地$/,'');
}
function accepted(answer){const parts=answer.split('/').map(norm);return [...parts,norm(answer)]}
function answerOK(input,answer){const n=norm(input);return accepted(answer).some(a=>n===a)}
function record(term,correct,given){stats.attempts++;stats.today++;if(correct){stats.correct++;if(stats.wrong[term.id]){stats.wrong[term.id].hits=(stats.wrong[term.id].hits||0)+1}}else{stats.wrong[term.id]={id:term.id,given:given||'未作答',time:Date.now(),hits:0}}storage.set(stats)}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
function updateChrome(){document.querySelector('#termCount').textContent=TERMS.length;document.querySelector('#streakLabel').textContent=stats.today?`今日已练 ${stats.today} 题`:'今日尚未练习'}

function showHome(){
  app.innerHTML=document.querySelector('#homeTemplate').innerHTML;
  document.querySelector('#statTerms').textContent=TERMS.length;
  document.querySelector('#statToday').textContent=stats.today;
  document.querySelector('#statAccuracy').textContent=stats.attempts?Math.round(stats.correct/stats.attempts*100)+'%':'—';
  document.querySelector('#statErrors').textContent=Object.keys(stats.wrong).length;
  const grid=document.querySelector('#categoryGrid');
  Object.keys(GROUPS).filter(x=>x!=='全部').forEach(name=>{const count=poolFor(name).length;grid.insertAdjacentHTML('beforeend',`<button class="category-card" data-category="${name}"><span>${ICONS[name]}</span><h3>${name}</h3><small>${count} 条术语</small></button>`)});
  updateChrome();window.scrollTo(0,0);
}

function showSetup(presetMode='mixed',presetGroup='全部'){
  config={mode:presetMode,group:presetGroup,count:10};
  app.innerHTML=`<section class="setup"><button class="back" data-action="home">← 返回首页</button><div class="panel">
    <p class="eyebrow">CUSTOM PRACTICE</p><h1>定制一次练习</h1><p class="sub">选择题型与范围，题目每次都会重新随机排列。</p>
    <div class="field"><label>题型</label><div class="segmented" id="modeSelect"><button data-value="mixed">混合练习</button><button data-value="choice">选择题</button><button data-value="fill">中文填空</button><button data-value="match">连线题</button></div></div>
    <div class="field"><label>术语分类</label><div class="chips" id="groupSelect">${Object.keys(GROUPS).map(g=>`<button class="chip" data-value="${g}">${g}<small> ${poolFor(g).length}</small></button>`).join('')}</div></div>
    <div class="field"><label>练习数量</label><div class="range-row"><input id="countRange" type="range" min="5" max="30" step="5" value="10"><span class="range-value" id="countValue">10</span></div><p class="sub">连线题将按每组最多 6 对出题。</p></div>
    <button class="primary" data-action="begin">开始练习 →</button>
  </div></section>`;
  syncSetup();window.scrollTo(0,0);
}
function syncSetup(){document.querySelectorAll('#modeSelect button').forEach(b=>b.classList.toggle('active',b.dataset.value===config.mode));document.querySelectorAll('#groupSelect button').forEach(b=>b.classList.toggle('active',b.dataset.value===config.group))}

function begin(){
  const pool=poolFor(config.group);const count=Math.min(config.count,pool.length);
  let modes=config.mode==='mixed'?['choice','fill','match']: [config.mode];
  let qs=[];
  if(config.mode==='match') qs=chunk(sample(pool,count),6).map(items=>({mode:'match',items}));
  else {const picked=sample(pool,count);let i=0;while(i<picked.length){const m=modes[i%modes.length];if(m==='match'){const items=picked.slice(i,i+Math.min(6,picked.length-i));qs.push({mode:'match',items});i+=items.length}else{qs.push({mode:m,term:picked[i]});i++}}}
  session={questions:qs,index:0,score:0,answered:0,wrong:[],locked:false};renderQuestion();
}
function chunk(a,n){let out=[];for(let i=0;i<a.length;i+=n)out.push(a.slice(i,i+n));return out}
function renderQuestion(){
  if(session.index>=session.questions.length)return showResults();
  session.locked=false;const q=session.questions[session.index];const pct=Math.round(session.index/session.questions.length*100);
  app.innerHTML=`<section class="quiz-shell"><button class="back" data-action="quit">← 结束本次练习</button><div class="quiz-head"><div class="progress"><i style="width:${pct}%"></i></div><span class="score-pill">${session.score} 分</span></div><div class="panel" id="questionPanel"></div></section>`;
  if(q.mode==='choice')renderChoice(q);else if(q.mode==='fill')renderFill(q);else renderMatch(q);
  window.scrollTo(0,0);
}
function questionHeader(q,label,note){return `<p class="question-no">${String(session.index+1).padStart(2,'0')} / ${String(session.questions.length).padStart(2,'0')} · ${label}</p><h1 class="question"><em>${escapeHTML(q.term?.term||'连线配对')}</em></h1><p class="prompt-note">${note}</p>`}
function distractors(term){let p=TERMS.filter(t=>t.id!==term.id&&t.category===term.category);if(p.length<3)p=TERMS.filter(t=>t.id!==term.id);return sample(p,3)}
function renderChoice(q){
  const opts=shuffle([q.term,...distractors(q.term)]);
  document.querySelector('#questionPanel').innerHTML=questionHeader(q,'选择题','请选择这个术语对应的中文含义')+`<div class="options">${opts.map(o=>`<button class="option" data-id="${o.id}">${escapeHTML(o.answer)}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
}
function choose(id){if(session.locked)return;session.locked=true;const q=session.questions[session.index],ok=id===q.term.id;document.querySelectorAll('.option').forEach(b=>{b.disabled=true;if(+b.dataset.id===q.term.id)b.classList.add('correct');else if(+b.dataset.id===id)b.classList.add('wrong')});finishSingle(q.term,ok,TERMS[id]?.answer)}
function renderFill(q){
  document.querySelector('#questionPanel').innerHTML=questionHeader(q,'中文填空','请填写中文释义；不用输入括号或标点')+`<form class="fill-form" id="fillForm"><input id="fillInput" lang="zh-CN" autocomplete="off" placeholder="在这里输入中文…" aria-label="中文答案"><button>提交答案</button></form><div class="only-cn" id="cnHint"></div><div class="feedback" id="feedback"></div>`;
  setTimeout(()=>document.querySelector('#fillInput').focus(),50);
}
function submitFill(){if(session.locked)return;const input=document.querySelector('#fillInput');const v=input.value.trim();if(!v){document.querySelector('#cnHint').textContent='请先填写答案';return}if(/[A-Za-z]/.test(v)){document.querySelector('#cnHint').textContent='这里只需填写中文释义';input.classList.add('bad');return}session.locked=true;input.disabled=true;const q=session.questions[session.index];finishSingle(q.term,answerOK(v,q.term.answer),v)}
function finishSingle(term,ok,given){record(term,ok,given);session.answered++;if(ok)session.score+=10;else session.wrong.push(term);updateChrome();const box=document.querySelector('#feedback');box.innerHTML=`<div class="feedback-message"><strong>${ok?'回答正确 ✓':'再记一次'}</strong><small>${escapeHTML(term.term)} = ${escapeHTML(term.answer)}</small></div><button class="next" data-action="next">${session.index===session.questions.length-1?'查看结果':'下一题 →'}</button>`}
function renderMatch(q){
  q.state={selected:null,matched:new Set(),mistakes:0};const rights=shuffle(q.items);
  document.querySelector('#questionPanel').innerHTML=`<p class="question-no">${String(session.index+1).padStart(2,'0')} / ${String(session.questions.length).padStart(2,'0')} · 连线题</p><h1 class="question">连接对应术语</h1><p class="prompt-note">先点左侧术语，再点右侧中文；匹配后会自动连线。</p><div class="match-board" id="matchBoard"><svg class="match-lines" id="matchLines"></svg><div class="match-col">${q.items.map(t=>`<button class="match-item term" data-side="left" data-id="${t.id}">${escapeHTML(t.term)}</button>`).join('')}</div><div class="match-col">${rights.map(t=>`<button class="match-item" data-side="right" data-id="${t.id}">${escapeHTML(t.answer)}</button>`).join('')}</div></div><div class="match-status" id="matchStatus">已连 0 / ${q.items.length}</div><div class="feedback" id="feedback"></div>`;
}
function matchClick(btn){const q=session.questions[session.index],s=q.state,id=+btn.dataset.id;if(s.matched.has(id))return;if(btn.dataset.side==='left'){document.querySelectorAll('[data-side="left"]').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');s.selected=id;return}if(s.selected===null){toast('请先选择左侧术语');return}if(s.selected===id){s.matched.add(id);document.querySelectorAll(`.match-item[data-id="${id}"]`).forEach(b=>{b.classList.remove('selected');b.classList.add('matched');b.disabled=true});s.selected=null;drawLines(q);document.querySelector('#matchStatus').textContent=`已连 ${s.matched.size} / ${q.items.length}`;if(s.matched.size===q.items.length)finishMatch(q)}else{s.mistakes++;const left=document.querySelector(`[data-side="left"][data-id="${s.selected}"]`);btn.classList.add('shake');left.classList.add('shake');setTimeout(()=>{btn.classList.remove('shake');left.classList.remove('shake')},280);toast('还不对，再试一次')};}
function drawLines(q){const board=document.querySelector('#matchBoard'),svg=document.querySelector('#matchLines'),br=board.getBoundingClientRect();svg.innerHTML='';q.state.matched.forEach(id=>{const a=document.querySelector(`[data-side="left"][data-id="${id}"]`).getBoundingClientRect(),b=document.querySelector(`[data-side="right"][data-id="${id}"]`).getBoundingClientRect();const x1=a.right-br.left,y1=a.top+a.height/2-br.top,x2=b.left-br.left,y2=b.top+b.height/2-br.top;svg.insertAdjacentHTML('beforeend',`<path d="M${x1} ${y1} C${x1+35} ${y1},${x2-35} ${y2},${x2} ${y2}" fill="none" stroke="#4b8b62" stroke-width="2"/>`)})}
function finishMatch(q){const ok=q.state.mistakes===0;q.items.forEach(t=>record(t,ok,ok?'全部匹配':`${q.state.mistakes} 次误连`));session.answered+=q.items.length;if(ok)session.score+=q.items.length*10;else session.wrong.push(...q.items);updateChrome();document.querySelector('#feedback').innerHTML=`<div class="feedback-message"><strong>${ok?'全部一次配对成功 ✓':`完成配对 · ${q.state.mistakes} 次重试`}</strong><small>本组 ${q.items.length} 个术语已完成</small></div><button class="next" data-action="next">${session.index===session.questions.length-1?'查看结果':'下一组 →'}</button>`}
function next(){session.index++;renderQuestion()}
function showResults(){const max=session.answered*10,pct=max?Math.round(session.score/max*100):0;app.innerHTML=`<section class="results"><div class="panel"><p class="eyebrow">PRACTICE COMPLETE</p><h1>${pct>=90?'漂亮完成！':pct>=70?'稳步前进':'再练一轮'}</h1><p class="sub">本次共完成 ${session.answered} 个术语</p><div class="result-ring" style="--pct:${pct*3.6}deg"><strong>${pct}%</strong></div><p>得分 <b>${session.score}</b> / ${max} · 待巩固 ${session.wrong.length}</p><div class="result-actions"><button class="primary" data-action="again">重新练习</button><button class="secondary" data-action="review">错题回顾</button><button class="secondary" data-action="home">返回首页</button></div></div></section>`;window.scrollTo(0,0)}
function showReview(){const ids=Object.keys(stats.wrong).map(Number);app.innerHTML=`<section class="review-page"><button class="back" data-action="home">← 返回首页</button><div class="section-heading"><div><p class="eyebrow">MISTAKE REVIEW</p><h2>错题回顾</h2></div>${ids.length?'<button class="text-btn" data-action="clear-errors">清空记录</button>':''}</div>${ids.length?`<div class="review-list">${ids.sort((a,b)=>stats.wrong[b].time-stats.wrong[a].time).map(id=>{const t=TERMS[id];return `<div class="review-item"><em>${escapeHTML(t.term)}</em><span>${escapeHTML(t.answer)}</span><span class="badge">${t.category}</span></div>`}).join('')}</div><button class="primary" style="margin-top:22px" data-action="practice-errors">重新练习这些术语</button>`:`<div class="empty"><span>♩</span><h3>暂时没有错题</h3><p class="sub">去完成一轮练习，错题会自动收进这里。</p><button class="primary" data-action="quick-start">开始练习</button></div>`}</section>`;window.scrollTo(0,0)}
function practiceErrors(){const p=Object.keys(stats.wrong).map(Number).map(i=>TERMS[i]).filter(Boolean);if(!p.length)return showReview();const picked=shuffle(p);session={questions:picked.map((term,i)=>({mode:i%2?'fill':'choice',term})),index:0,score:0,answered:0,wrong:[],locked:false};renderQuestion()}

document.addEventListener('click',e=>{
  const mode=e.target.closest('[data-mode]');if(mode)return showSetup(mode.dataset.mode,'全部');
  const cat=e.target.closest('[data-category]');if(cat)return showSetup('mixed',cat.dataset.category);
  const opt=e.target.closest('.option');if(opt)return choose(+opt.dataset.id);
  const mi=e.target.closest('.match-item');if(mi)return matchClick(mi);
  const sel=e.target.closest('#modeSelect button');if(sel){config.mode=sel.dataset.value;syncSetup();return}
  const grp=e.target.closest('#groupSelect button');if(grp){config.group=grp.dataset.value;syncSetup();return}
  const act=e.target.closest('[data-action]')?.dataset.action;
  if(act==='home'||act==='quit')showHome();else if(act==='quick-start'){showSetup('mixed','全部')}else if(act==='begin')begin();else if(act==='next')next();else if(act==='again')begin();else if(act==='review')showReview();else if(act==='practice-errors')practiceErrors();else if(act==='clear-errors'){stats.wrong={};storage.set(stats);showReview()}
});
document.addEventListener('input',e=>{if(e.target.id==='countRange'){config.count=+e.target.value;document.querySelector('#countValue').textContent=e.target.value}});
document.addEventListener('submit',e=>{if(e.target.id==='fillForm'){e.preventDefault();submitFill()}});
document.querySelector('#reviewTop').addEventListener('click',showReview);
window.addEventListener('resize',()=>{const q=session?.questions?.[session.index];if(q?.mode==='match')drawLines(q)});
showHome();
