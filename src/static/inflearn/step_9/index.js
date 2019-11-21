
/** =======================================
 *  결과를 만드는 함수 reduce, take
 * . reduce : 몀추거나 연산을 시작하는 역활.
 * . take : 몇개일지 모르는 배열에서 특정 배열로 축약을 시키는 역활.
======================================= */
// ===== reduce
const queryStr = obj => go(
  obj,
  Object.entries, // [["limit", 10], ["offset", 10], ["type", "notice"]]
  L.map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
  reduce((a, b) => `${a}&${b}`), // limit=10&offset=10&type=notice
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }));



/** =======================================
 *  Array.prototype.join 보다 다형성이 높은 join
 * . join의 경우 Array만에 국한되어 있는데 reduce는 iterable에 대하여 모두 적용됨.
 ======================================= */
clear();
// ===== 지연성을 가진 entries
// L.entries = function* (obj){
//   for(const k in obj){
//     yield [k, obj[k]];
//   }
// };

// ===== Array.prototype.join 보다 다형성이 높은 join
// const join = curry((sep = ',', iter) =>
//    reduce((a, b) => `${a}${sep}${b}`, iter));


const queryStr2 = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join('&'), // limit=10&offset=10&type=notice
);

log(queryStr2({ limit: 10, offset: 10, type: 'notice' }));


/** =======================================
 *  find
 * . take를 이용해서 결론을 만드는 함수.
 * . 조건에 해당하는 모든 값을 꺼내는 것이 아니라 처음 만난 하나의 값만 꺼냄
======================================= */
clear();
const users = [
  {age: 32},
  {age: 31},
  {age: 37},
  {age: 28},
  {age: 25},
  {age: 32},
  {age: 31},
  {age: 37},
];

// const find = curry((f, iter) => go(
//   iter,
//   filter(f),
//   take(1),
//   ([a]) => a));

log(find(u => u.age < 30, users));

go(
  users,
  map(u => u.age),
  find(n => n < 30),
  log
);




/** =======================================
 *  L.map, L.filter로 map, filter 만들기
 * . fx.js 소스 참고
======================================= */



/** =======================================
 *  L.flatten, faltten
 * . 내부 배열을 펼처서 하나의 배열로 만드는 역활.
 *   - eg) [...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]
======================================= */
clear();
// # 지연 평가
// L.flatten = function *(iter) {
//   for (const a of iter){
//     if(isIterable(a)){ // 이터러블일 경우 한번더 들어간다.
//       for(const b of a){
//         yield a;
//       }
//     }else{
//       yield a;
//     }
//   }
// };

// // # 즉시 평가 함수.
// const flatten = pipe(L.flatten, takeAll);

const it = L.flatten([...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]);
const it2 = flatten([...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]);
log([...it]); // 지연 평가
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
log(it2); // 즉시 평가



/** =======================================
 *  yield *
 * . 즉시 순회 후 평가한다.
 * . yield *iterable 은 for(const val of iterable) yiled val; 과 같다.
======================================= */
// ===== yield 적용전
function *someFn(iter) {
  for( const a of iter){
    yield a;
  }
}
const itt = someFn([1, 2, 3]);
log([...itt]); // [1, 2, 3]

// ===== yield 적용 후
function *someFn2(iter) {
    yield *iter;
}
const itt2 = someFn2([1, 2, 3]);
log([...itt2]); // [1, 2, 3]



/** =======================================
 *  L.deepFlat
 * . 깊은 iterable 을 모두 펼쳐준다.
======================================= */
// L.deepFlat = function *f(iter){
//   for(const a of iter){
//     if(isIterable(a)) {
//       yield *f(a); // 재귀 호출
//     }else{
//       yield a;
//     }
//   }
// }

// log([...L.deepFlat([1, [2, [3, [4, 5]]]])]); // [1, 2, 3, 4, 5]




/** =======================================
 *  L.flatMap / flatMap
 * . flatten과 map 동시 적용.
 * . flatten과의 차이점은 함수를 이용해 변화를 줄 수 있다.
======================================= */
clear();
// ===== 기본 스펙인 flatMap
/** 즉시 평가 되서 낭비가 있다. */
log([[1, 2], [3, 4], [5, 6, 7]].flatMap(a => a));
log([[1, 2], [3, 4], [5, 6, 7]].flatMap(a => a.map(a => a*a))); // [1, 3, 4, 9, 16, 25, 36, 49]
log(flatten([[1, 2], [3, 4], [5, 6, 7]].map(a => a.map(a => a*a)))); // 위의 코드와 시간 복잡도가 동일하다.

// // ===== 전체 평가
// const flatMap = pipe(L.map, flatten);

// // ===== 지연 적인 flatmap
// L.flatMap = curry(pipe(L.map, L.flatten));

const icc = L.flatMap(map(a => a * a), [[1, 2], [3, 4], [5, 6, 7]]);
log([...icc]);

// ===== 사용법
const flatArr = [1, 2, 3];
log(map(range, flatArr)); // [[0], [0, 1], [0, 1, 2]]
log(flatMap(L.range, flatArr)); // [0, 0, 1, 0, 1, 2]
log(...L.flatMap(L.range, flatArr)); // 0 0 1 0 1 2
log(take(3, L.flatMap(L.range, flatArr))); // [0, 0, 1]
