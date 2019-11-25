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
  const titleElement = document.createElement(`span`);
  const bodyElement = document.createElement(`span`);

  item.classList.add(`list-group-item`);
  item.classList.add(`result-item`);
  titleElement.innerText = title;
  item.appendChild(titleElement);
  bodyElement.innerText = body;
  item.appendChild(bodyElement);

  return item;
};


const calc = () => {
  const ph = Number(probablyHeroInput.value) / 100.0;
  const phc = Number(rarityInput.value);
  const pa = Number(probablyAnimaInput.value) / 100.0;
  const pac = Number(animaCountInput.value);
  const count = Number(gachaCountInput.value);

  while(resultList.firstChild) {
    resultList.firstChild.remove();
  }

  // 本体を引けない確率
  const fh = Math.pow(1 - ph, count);
  resultList.appendChild(
    createResult(
      `本体を引ける確率`,
      `${(1 - fh) * 100} %`
    )
  );

  // 各回数でのアニマ取得期待値の総和
  const expected = Array.from({ length: count }, (_, i) => i + 1).reduce((acc, c) => {
    // 前回までに本体を引けていない確率
    const f = Math.pow(1 - ph, c - 1);
    // すでに本体を引いていて得られるアニマが半分になる
    const s1 = (ph - (ph * f));
    // まだ本体を引いていないため解放分相当のアニマを得られる
    const s2 = (ph - (ph * (1 - f)));

    return acc + (pa * pac) + (s1 * (phc / 2)) + (s2 * phc);
  });
  resultList.appendChild(
    createResult(
      `入手できるアニマの期待値合計`,
      `${expected} 個`
    )
  );
};

document.querySelectorAll(`input[data-bind-control]`).forEach(range => {
  const textInput = document.getElementById(range.getAttribute(`data-bind-control`));

  if (textInput) {
    range.addEventListener(`input`, function () {
      textInput.value = this.value;
    });
    range.addEventListener(`change`, function () {
      calc();
    });
    textInput.addEventListener(`change`, function () {
      if (isNaN(this.value)) {
        // 数値でない
        this.value = range.value;
      } else {
        range.value = this.value;
      }
      calc();
    });
  }
});
rarityInput.addEventListener(`change`, calc);

calc();