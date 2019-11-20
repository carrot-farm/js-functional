/** =======================================
 *  결과를 만드는 함수 reduce, take
 * . reduce : 몀추거나 연산을 시작하는 역활.
 * . take : 몇개일지 모르는 배열에서 특정 배열로 축약을 시키는 역활.
======================================= */
// ===== reduce
const queryStr = obj => go(
  obj,
  Object.entries, // [["limit", 10], ["offset", 10], ["type", "notice"]]
  map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
  reduce((a, b) => `${a}&${b}`), // limit=10&offset=10&type=notice
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }));

