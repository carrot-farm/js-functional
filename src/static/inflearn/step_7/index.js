/** =======================================
 *  take
 * . 많은 수의 iterator을 받고 지정된 배열 만큼 잘라준다.
 * . 배열및 이터레이터 양쪽 모두 평가 가능하다.
 * . 이터레이터를 평가해서 자를 경우는 모두 만드는 것이 아니라 지정된
 * 수만큰만 평가한다.
 ======================================= */
// ===== take 정의
const take = curry((l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if(res.length === l){return res;}
  }
  return res;
});

// ===== 지정된 수량만큼 자르기
console.time('range')
// log(take(5, range(10000))); // `[0, 1, 2, 3, 4]` 배열을 10000까지 만든뒤 자른다.
go(
  range(10000),
  take(5),
  reduce(add),
  log);
console.timeEnd('range'); // `2.161865234375ms`

console.time('L.range');
go(
  L.range(10000),
  take(5),
  reduce(add),
  log);
// log(take(5, L.range(10000))); // `[0, 1, 2, 3, 4]` 배열을 5개만 만든다.
// log(take(5, L.range(Infinity))); // `[0, 1, 2, 3, 4]` 무한 수열을 해도 같다.
console.timeEnd('L.range'); // `0.656982421875ms`