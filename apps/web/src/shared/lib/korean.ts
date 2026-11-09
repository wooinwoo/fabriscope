/** 받침 유무에 맞춰 "로/으로"를 붙인다. 받침이 ㄹ이거나 한글로 끝나지 않으면 "로". */
export function withDirectionalParticle(word: string) {
  const offset = word.charCodeAt(word.length - 1) - 0xac00;
  const finalConsonant = offset >= 0 && offset <= 11171 ? offset % 28 : 0;
  return `${word}${finalConsonant === 0 || finalConsonant === 8 ? "로" : "으로"}`;
}
