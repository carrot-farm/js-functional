/** =======================================
 *  range, map, filter, take의 중첩 사용
 ======================================= */
console.time('')
go(range(10000),
map(n => n + 10),
filter(n => n % 2),
take(10),
log); // [11, 13]
console.timeEnd(''); // 11.04...

console.time('L')
go(L.range(10000),
  L.map(n => n + 10),
  L.filter(n => n % 2),
  take(10),
  log); // [11, 13]
console.timeEnd('L'); // 1.50...


/** =======================================
 * L.range, L.map, L.filter, take의 평가 순서
 ======================================= */
// clear();
go(L.range(10), // 4, 8
  L.map(n => n + 10), // 3, 5, 9
  L.filter(n => n % 2), // 2, 6, 10
  take(2), // 1, 7, 11
  log); // [11, 13]
/**
 * 1 . take: L.range, L.map, L.filter등의 연산을 하지 않고 take 연산부터 실행
 *   - while문 안쪽으로 들어가지 않고 이터레이터 객체를 받은 후 실행 next() 메소드 호출.
 * 2 . filter: while 문 들어가지 않고 next()실행
 * 3 . map: `next()` 실행.
 * 4 . range: `while` -> `yield` 실행.
 * 5 . map: `while`문 내의 `yield` 실행.
 * 6 . filter: while문 내의 `if(f(a)){...}` 실행. false
 * 7 . filter: `next()` 실행.
 * 8 . range: `while` -> `yield` 실행.
 * 9 . map: `yield f(a)` 실행
 * 10. filter: while문 내의 `if(f(a)){...}` -> yield 실행. true
 * 11. take: `res.push(a)` -> `next()` 실행.
 * ...
 */



/** =======================================
 * 엄격한 계산과 느긋한 계산의 효율성 비교.
 ======================================= */
// ===== 엄격한 계산
/** 순차적으로 전체 배열을 만들고 평가한다. */

// ===== 느긋한 계산
/** 순차적이 아니라 하나의 수를 만들고 평가한뒤 다음 수를 만든다.
 * 성능의 비교는 위의 console.time 참고. */



/** =======================================
 * map, filter 계열 함수들이 가지는 결합 법칙
 ======================================= */
// ===== 사용하는 데이터나 순서가 바뀌어도 같은 결과를 만든다.
// . 사용하는 보조 함수가 순수 함수일 경우.

// ===== 다음은 같은 결과를 반환한다.
// . [[mapping, mapping], [filtering, filtering], [mapping, mapping]]
// . [[mapping, filtering, mapping], [mapping, filtering, mapping]]
