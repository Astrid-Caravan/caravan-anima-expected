const rarityInput = document.getElementById(`rarity`);

const probablyHeroInput = document.getElementById(`probably-hero`);
const probablyHeroText = document.getElementById(`probably-hero-text`);
const probablyAnimaInput = document.getElementById(`probably-anima`);
const probablyAnimaText = document.getElementById(`probably-anima-text`);
const animaCountInput = document.getElementById(`anima-count`);
const animaCountText = document.getElementById(`anima-count-text`);
const gachaCountInput = document.getElementById(`gacha-count`);
const gachaCountText = document.getElementById(`gacha-count-text`);
const resultList = document.getElementById(`result`);

const createResult = (title, body) => {
  const item = document.createElement(`li`);

  item.classList.add(`list-group-item`);
  item.innerText = `${title} - ${body}`;

  return item;
};

const calc = () => {
  const ph = Number(probablyHeroInput.value) / 100.0;
  const phc = Number(rarityInput.value);
  const pa = Number(probablyAnimaInput.value) / 100.0;
  const pac = Number(animaCountInput.value);
  const count = Number(gachaCountInput.value);

  // 本体を引けない確率
  const fh = Math.pow(1 - ph, count);

  // 前回までに本体を引けていない確率
  const f = Math.pow(1 - ph, count - 1);
  // すでに本体を引いていて得られるアニマが半分になる
  const s1 = (ph - (ph * f));
  // まだ本体を引いていないため解放分相当のアニマを得られる
  const s2 = (ph - (ph * (1 - f)));

  while(resultList.firstChild) {
    resultList.firstChild.remove();
  }

  resultList.appendChild(
    createResult(
      `本体を引ける確率`,
      `${(1 - fh) * 100} %`
    )
  );

  const expected = ((pa * pac) + (s1 * (phc / 2)) + (s2 * phc)) * count;
  resultList.appendChild(
    createResult(
      `入手できるアニマの期待値合計`,
      `${expected} 個`
    )
  );
};

rarityInput.addEventListener(`change`, calc);

const setupNumericControlsEvent = (
  input, text
) => {
  input.addEventListener(`input`, function () {
    text.value = this.value;
  });
  input.addEventListener(`change`, function () {
    calc();
  });
  text.addEventListener(`change`, function () {
    if (isNaN(this.value)) {
      // 数値でない
      this.value = input.value;
    } else {
      input.value = this.value;
    }
    calc();
  });
};

setupNumericControlsEvent(probablyHeroInput, probablyHeroText);
setupNumericControlsEvent(probablyAnimaInput, probablyAnimaText);
setupNumericControlsEvent(animaCountInput, animaCountText);
setupNumericControlsEvent(gachaCountInput, gachaCountText);
calc();