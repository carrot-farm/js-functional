/** =======================================
 * 2차원 배열 다루기
======================================= */
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10]
];

// ======
/** 3개만 평가하고 나머지는 평가하지 않는다. */
go(arr,
  L.flatten, // 전체 펼치기
  L.filter(a => a % 2), // 홀수만 남김
  take(3), // 3개 담기.
  reduce(add), // 누적 합산
  log)



/** =======================================
 * 이터러블 중심의 실무적인 코드
======================================= */
clear();
// ===== 사람 데이터
const users = [
  {name: 'a', age: 21, family: [
    {name: 'a1', age: 53}, {name: 'a2', age: 47},
    {name: 'a3', age: 16}, {name: 'a4', age: 15},
  ]},
  {name: 'b', age: 24, family: [
    {name: 'b1', age: 58}, {name: 'b2', age: 51},
    {name: 'b3', age: 19}, {name: 'b4', age: 22},
  ]},
  {name: 'c', age: 31, family: [
    {name: 'c1', age: 64}, {name: 'c2', age: 62},
  ]},
  {name: 'd', age: 20, family: [
    {name: 'd1', age: 42}, {name: 'd2', age: 42},
    {name: 'd3', age: 11}, {name: 'd4', age: 7},
  ]},
];

// ===== 사람 데이터
go(users,
  L.map(u => u.family), // family 을 뽑는다.
  L.flatten, // 전체 펼치기
  L.filter(u => u.age < 20), // 미성년자
  L.map(u => u.age), // 나이
  take(4),
  // reduce(add),
  log); // 61
