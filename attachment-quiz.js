/* Original reflection prompts, not ECR/ECR-R items or a validated assessment. */
(function () {
  'use strict';

  const questions = [
    { axis: 'anxiety', text: '對方沒有照平常的時間回訊息時，我會反覆猜測是不是自己做錯了什麼。' },
    { axis: 'avoidance', text: '即使遇到難題，我也會刻意避免向親近的人求助。' },
    { axis: 'anxiety', reverse: true, text: '對方想安排自己的活動時，我仍能安心做自己的事。' },
    { axis: 'avoidance', reverse: true, text: '遇到在意的事情時，我願意讓信任的人知道自己的真實感受。' },
    { axis: 'anxiety', text: '即使相處順利，我仍常需要對方再次確認我們的關係。' },
    { axis: 'avoidance', text: '當關係變得更親密，我會想減少聯絡來拉開距離。' },
    { axis: 'anxiety', text: '一次小爭執，就容易讓我擔心這段關係會結束。' },
    { axis: 'avoidance', text: '有人認真關心我的脆弱時，我常會轉移話題。' },
    { axis: 'anxiety', reverse: true, text: '我不需要透過不斷確認對方的動態，才能感到安心。' },
    { axis: 'avoidance', reverse: true, text: '我能和親近的人商量彼此需要多少陪伴與獨處。' },
    { axis: 'anxiety', text: '對方的語氣稍微冷淡，我就很難專心處理自己的生活。' },
    { axis: 'avoidance', text: '當對方想談我們的關係，我常會拖延或迴避這個話題。' },
    { axis: 'anxiety', text: '為了讓對方留下，我有時會答應自己其實不願意的事。' },
    { axis: 'avoidance', text: '比起說出需要安慰，我通常寧願讓對方以為我沒事。' },
    { axis: 'anxiety', reverse: true, text: '即使彼此意見不同，我仍相信自己的感受值得被尊重。' },
    { axis: 'avoidance', reverse: true, text: '接受對方適度的照顧時，我能感到自在。' },
    { axis: 'anxiety', text: '對方和別人互動熱絡時，我容易擔心自己會被取代。' },
    { axis: 'avoidance', text: '對方期待更穩定的陪伴時，我常先想到自己會失去自由。' },
    { axis: 'anxiety', text: '分開一陣子後，我常需要立即聯絡對方，才能平復不安。' },
    { axis: 'avoidance', text: '衝突發生時，我常直接抽離，而且不告訴對方何時願意再談。' },
    { axis: 'anxiety', reverse: true, text: '暫時無法聯絡對方時，我通常能先安頓自己的情緒。' },
    { axis: 'avoidance', reverse: true, text: '當我需要暫停一段對話時，我願意約好稍後繼續談。' },
    { axis: 'anxiety', text: '對方沒有明確表達在乎時，我容易覺得自己不夠好。' },
    { axis: 'avoidance', text: '即使想念一個人，我也常刻意不讓對方看出自己在乎。' }
  ];
  const styles = {
    secure: {
      name: '安全型傾向', icon: '🌿', axes: '較低焦慮 × 較低迴避',
      description: '這次作答中，你比較能在親密與自主之間取得平衡，也較願意表達需要、接受支持。這不代表你從不感到不安。',
      strength: '你可能較能信任彼此，並在有分歧時保持溝通。',
      practices: ['繼續說清楚自己的界線與需要，也詢問對方的感受。', '遇到壓力時，留意自己是否需要更多支持或獨處。', '把有效的相處方式說出來，讓彼此知道什麼能帶來安心。'],
      prompt: '「我很珍惜我們的相處，也想知道怎麼做能讓你更自在。」'
    },
    anxious: {
      name: '焦慮型傾向', icon: '💗', axes: '較高焦慮 × 較低迴避',
      description: '這次作答中，你比較在意關係是否穩定，可能容易因回覆或距離的變化感到不安，同時仍希望靠近對方。',
      strength: '你可能很重視連結，也願意投入時間照顧關係。',
      practices: ['先分開寫下「我知道的事實」與「我擔心的猜測」。', '在再次傳訊息前，留一點時間呼吸、走動或做自己的事。', '把需要轉成具體請求，並一起討論可行的聯絡節奏。'],
      prompt: '「沒有消息時我有點不安，我們能聊聊彼此舒服的聯絡方式嗎？」'
    },
    avoidant: {
      name: '逃避型傾向', icon: '🕊️', axes: '較低焦慮 × 較高迴避',
      description: '這次作答中，你比較習慣自己承擔事情；當關係更靠近時，可能會透過保留感受或拉開距離來維持自在。',
      strength: '你可能很珍惜自主，也知道獨處對自己有多重要。',
      practices: ['從一件小事開始，向信任的人表達感受或提出協助請求。', '需要空間時，說明原因並約好何時回來談。', '觀察「我想獨處」和「我害怕被看見需要」有沒有不同。'],
      prompt: '「我現在需要一點時間整理，今晚八點我們再繼續聊，好嗎？」'
    },
    mixed: {
      name: '混合型傾向（恐懼逃避型）', icon: '🌊', axes: '較高焦慮 × 較高迴避',
      description: '這次作答中，你可能同時渴望連結，又在靠近時感到不安，於是出現想靠近、又想退開的拉扯。這裡的混合型是兩個面向都較高的探索分類。',
      strength: '你可能很在意關係，也對自己的安全感與界線相當敏銳。',
      practices: ['留意想靠近與想退開分別出現在什麼情境，先不用責怪自己。', '從能承受的小幅度分享開始，允許關係慢慢建立信任。', '感到不安時先暫停，向對方說明需要，而不是突然消失或勉強靠近。'],
      prompt: '「我想和你靠近，但現在也有點緊張，我們可以慢一點嗎？」'
    }
  };
  const labels = ['很不符合', '不太符合', '一半符合', '大致符合', '非常符合'];
  const disclaimer = '這是原創的自我探索測驗，未經心理計量驗證，不是心理診斷，也不代表固定的人格。';

  function calculate(answers) {
    if (!Array.isArray(answers) || answers.length !== questions.length ||
        Array.from(answers).some(value => !Number.isInteger(value) || value < 1 || value > 5)) {
      throw new Error('請完成全部 24 題，每題選擇 1 至 5。');
    }
    const sums = { anxiety: 0, avoidance: 0 };
    questions.forEach((q, i) => { sums[q.axis] += q.reverse ? 6 - answers[i] : answers[i]; });
    const anxietyMean = sums.anxiety / 12;
    const avoidanceMean = sums.avoidance / 12;
    const highAnxiety = anxietyMean >= 3;
    const highAvoidance = avoidanceMean >= 3;
    return {
      type: highAnxiety ? (highAvoidance ? 'mixed' : 'anxious') : (highAvoidance ? 'avoidant' : 'secure'),
      anxiety: Math.round((anxietyMean - 1) / 4 * 100),
      avoidance: Math.round((avoidanceMean - 1) / 4 * 100),
      anxietyMean, avoidanceMean,
      nearBoundary: Math.abs(anxietyMean - 3) <= 0.25 || Math.abs(avoidanceMean - 3) <= 0.25
    };
  }

  function summary(result) {
    const style = styles[result.type];
    return ['戀愛情感導航系統｜依附風格自我探索', style.name, style.axes,
      `親密焦慮：${result.anxiety} / 100；親密迴避：${result.avoidance} / 100（不是機率或百分位）`,
      style.description, result.nearBoundary ? '分數接近分類界線，請以雙軸分數與實際經驗為主。' : '',
      '可以試試：', ...style.practices, '一句溝通練習：' + style.prompt,
      '分類採用本工具設定的中點（平均 3 分）作為探索界線，並非臨床或常模標準。', disclaimer
    ].filter(Boolean).join('\n');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questions, styles, calculate, summary };
  }
  if (typeof document === 'undefined') return;

  const entry = document.getElementById('attachmentStart');
  const panel = document.getElementById('attachmentContent');
  const heading = document.getElementById('attachmentTitle');
  let answers = Array(questions.length).fill(null);
  let position = 0;
  let stage = 'intro';
  let copyAttempt = 0;

  function focusContent() {
    const target = panel.querySelector('[data-focus]') || heading;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function updateEntry() {
    entry.textContent = stage === 'result' ? '查看測驗結果' : answers.some(v => v !== null) ? '繼續測驗' : '探索我的依附風格';
  }
  function render(focus = true) {
    copyAttempt++;
    updateEntry();
    if (stage === 'intro') {
      panel.innerHTML = `
        <p class="attachment-lead">在親密關係裡，你如何靠近，又如何保護自己？</p>
        <p>24 題，約 4–6 分鐘。請以近期一段重要的親密關係為參考，依照平常的感受作答。沒有標準答案，也不用選「理想中的自己」。</p>
        <p>目前沒有伴侶也可以回想過往經驗。若缺乏可參照的經驗，可以先閱讀下方四種傾向的說明，暫時不做測驗。</p>
        <div class="attachment-notice"><strong>先認識這份測驗</strong><p>${disclaimer} 結果可能隨對象與情境不同，請用來理解自己，而不是替自己或他人貼標籤。</p></div>
        <p class="attachment-small">答案只留在這次開啟的頁面中，不會儲存或傳送；重新整理頁面後會清除。複製結果由你自行選擇。</p>
        <button class="btn-primary" type="button" id="attachmentBegin">開始 24 題測驗</button>
        ${referenceMarkup()}`;
      panel.querySelector('#attachmentBegin').addEventListener('click', () => { stage = 'question'; render(); });
    } else if (stage === 'question') {
      const q = questions[position];
      const completed = answers.filter(v => v !== null).length;
      panel.innerHTML = `
        <div class="attachment-progress-label"><span>第 ${position + 1} / 24 題</span><span id="attachmentCount" role="status">已作答 ${completed} 題</span></div>
        <progress class="attachment-progress" max="24" value="${completed}" aria-label="已完成題數">${completed} / 24</progress>
        <fieldset class="attachment-question">
          <legend data-focus tabindex="-1">${q.text}</legend>
          <p class="attachment-small" id="attachmentScaleHint">選出最符合近期實際感受的一項。</p>
          <div class="attachment-choices" aria-describedby="attachmentScaleHint">
            ${labels.map((label, i) => `<label class="attachment-choice"><input type="radio" name="attachmentAnswer" value="${i + 1}" ${answers[position] === i + 1 ? 'checked' : ''}><span class="attachment-choice-number" aria-hidden="true">${i + 1}</span><span>${label}</span></label>`).join('')}
          </div>
        </fieldset>
        <div class="btn-row attachment-actions">
          <button class="btn-ghost" type="button" id="attachmentPrevious">${position === 0 ? '測驗說明' : '上一題'}</button>
          <button class="btn-primary" type="button" id="attachmentNext" ${answers[position] === null ? 'disabled' : ''}>${position === 23 ? '查看結果' : '下一題'}</button>
        </div>`;
      panel.querySelectorAll('input[name="attachmentAnswer"]').forEach(input => {
        input.addEventListener('change', () => {
          answers[position] = Number(input.value);
          panel.querySelector('#attachmentNext').disabled = false;
          const count = answers.filter(v => v !== null).length;
          panel.querySelector('progress').value = count;
          panel.querySelector('#attachmentCount').textContent = `已作答 ${count} 題`;
          updateEntry();
        });
      });
      panel.querySelector('#attachmentPrevious').addEventListener('click', () => {
        if (position === 0) stage = 'intro'; else position--;
        render();
      });
      panel.querySelector('#attachmentNext').addEventListener('click', () => {
        if (answers[position] === null) return;
        if (position < 23) position++; else stage = 'result';
        render();
      });
    } else {
      const result = calculate(answers);
      const style = styles[result.type];
      panel.innerHTML = `
        <p class="attachment-small">這次作答呈現的傾向</p>
        <h3 class="attachment-result-title" data-focus tabindex="-1"><span aria-hidden="true">${style.icon}</span> ${style.name}</h3>
        <p class="attachment-axis-caption">${style.axes}</p><p>${style.description}</p>
        ${result.nearBoundary ? '<p class="attachment-notice">你的分數接近分類界線。小幅改變答案就可能得到不同類型，請優先看雙軸分數與自己的實際經驗。</p>' : ''}
        <div class="attachment-scores">
          <div><span>親密焦慮</span><strong>${result.anxiety} <small>/ 100</small></strong><p>在意連結是否穩定、是否被回應</p></div>
          <div><span>親密迴避</span><strong>${result.avoidance} <small>/ 100</small></strong><p>對靠近、依靠與表達需要的不自在</p></div>
        </div>
        <figure class="attachment-map" aria-labelledby="attachmentMapCaption">
          <p class="attachment-map-top">親密焦慮較高 ↑</p>
          <div class="attachment-plot" aria-hidden="true">
            <span>焦慮型</span><span>混合型</span><span>安全型</span><span>逃避型</span>
            <i class="attachment-marker" style="left:${result.avoidance}%;top:${100 - result.anxiety}%"></i>
          </div>
          <p class="attachment-map-bottom"><span>← 迴避較低</span><span>迴避較高 →</span></p>
          <figcaption id="attachmentMapCaption">圓點代表這次作答：親密焦慮 ${result.anxiety} / 100、親密迴避 ${result.avoidance} / 100；越靠下方，焦慮越低。分數不是機率或百分位。</figcaption>
        </figure>
        <h3>你可能帶進關係的力量</h3><p>${style.strength}</p>
        <h3>可以嘗試的三個練習</h3><ul class="attachment-practices">${style.practices.map(item => `<li>${item}</li>`).join('')}</ul>
        <blockquote class="attachment-prompt"><strong>一句溝通練習</strong><p>${style.prompt}</p></blockquote>
        <div class="attachment-notice"><p>${disclaimer} 如果關係中的困擾持續影響生活，可以考慮向合格心理專業人員尋求支持。</p></div>
        <div class="btn-row attachment-actions">
          <button class="btn-primary" type="button" id="attachmentCopy">複製結果</button>
          <button class="btn-ghost" type="button" id="attachmentReview">返回修改答案</button>
          <button class="btn-ghost" type="button" id="attachmentRestart">重新作答</button>
        </div>
        <p class="attachment-small" id="attachmentCopyStatus" role="status"></p>
        <label class="attachment-fallback" id="attachmentCopyFallback" hidden>請選取並複製以下結果<textarea readonly rows="9" id="attachmentCopyText"></textarea></label>
        ${referenceMarkup()}`;
      panel.querySelector('#attachmentCopy').addEventListener('click', async () => {
        const attempt = ++copyAttempt;
        const status = panel.querySelector('#attachmentCopyStatus');
        try {
          await navigator.clipboard.writeText(summary(result));
          if (attempt === copyAttempt) status.textContent = '結果已複製，你可以自行保存或分享。';
        } catch (_) {
          if (attempt !== copyAttempt) return;
          status.textContent = '目前無法自動複製，請從下方文字框手動複製。';
          panel.querySelector('#attachmentCopyFallback').hidden = false;
          const area = panel.querySelector('#attachmentCopyText');
          area.value = summary(result); area.focus(); area.select();
        }
      });
      panel.querySelector('#attachmentReview').addEventListener('click', () => { stage = 'question'; position = 23; render(); });
      panel.querySelector('#attachmentRestart').addEventListener('click', () => {
        answers = Array(questions.length).fill(null); position = 0; stage = 'intro'; render();
      });
    }
    if (focus) focusContent();
  }

  function referenceMarkup() {
    return `<details class="attachment-details"><summary>四種傾向、計分方式與參考</summary>
      <ul>${Object.values(styles).map(style => `<li><strong>${style.name}</strong>：${style.axes}</li>`).join('')}</ul>
      <p>每題 1–5 分。焦慮與迴避各 12 題，部分題目採反向計分（6 減原始分數），各自取平均，再線性換算為 0–100 分。分數越高，代表這次作答呈現的該面向越明顯。</p>
      <p>平均 3 分（換算 50 分）及以上暫歸為較高，低於 3 分歸為較低。這個中點是本工具為方便探索所設定，並非臨床門檻或常模。原始平均落在 2.75–3.25 分時會提示接近界線。</p>
      <p>成人依附可透過焦慮與迴避兩個連續面向理解；四類只是幫助閱讀的概括。理論參考：<a href="https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm" target="_blank" rel="noopener noreferrer">R. Chris Fraley 的成人依附研究說明</a>。本測驗的原創題目與分類設定未經驗證，不是 ECR-R 正式量表。</p>
    </details>`;
  }

  entry.addEventListener('click', () => { window.goStep(7); render(); });
  document.getElementById('attachmentHome').addEventListener('click', () => {
    window.goStep(0); entry.focus({ preventScroll: true }); entry.scrollIntoView({ block: 'center' });
  });
  // Keep the site's Enter shortcut from advancing while a radio option is focused.
  document.getElementById('attachmentQuiz').addEventListener('keydown', event => { event.stopPropagation(); });
  render(false);
})();
