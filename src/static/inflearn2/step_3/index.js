/** =======================================
 * map으로 합성하기
======================================= */
const f = x => x + 10;
const g = x => x -5;
const fg = x => f(g(x));
// console.log(fg()); // NaN 에러 남.

// _.go(
//   undefined,
//   fg,
//   console.log); // NaN

// ===== 모나드를 이용한 합성
_.go(
  [],
  fg,
  console.log); // 5

// ===== 모나드와 _.map을 이용해 안전한 합성
_.go(
  [],
  _.map(fg),
  console.log); // []



/** =======================================
 * find 대신 L.filter 써보기
 * . 없을 경우 평가를 안하는 안전한 함수를 사용할 수 있다.
======================================= */
console.clear();
const users = [
  {name: 'AA', age: 35},
  {name: 'BB', age: 26},
  {name: 'CC', age: 28},
  {name: 'CC', age: 34},
  {name: 'EE', age: 23},
];

const user = _.find(u => u.name === 'BB', users);
// console.log(user); // 잘 찾아짐

// 없는 값을 찾을 경우.
const user2 = _.find(u => u.name === '99', users);
// console.log(user2); // undefined

// 없을 경우는 출력 안함
const user3 = _.find(u => u.name === '99', users);
if(user3){
  console.log(user3);
}

// filter 사용하면 평가 자체를 안한다.
_.each(
  console.log,
  L.take(1,
    L.filter(u => u.name === '99', users)));


// 코드 정리
_.go(users,
  L.filter(u => u.name === 'BB'),
  L.map(u => u.age),
  L.take(1), // [26]
  _.each(console.log) // 26
  )