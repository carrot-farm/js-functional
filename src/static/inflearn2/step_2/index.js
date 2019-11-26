/** =======================================
 * . reduce를 너무 많이 사용하는 것은 절차형 버릇이 남아 있는 것이다.
 * . 단순한 리듀스로 만들자.
======================================= */
const users = [
  {name: 'AA', age: 35},
  {name: 'BB', age: 26},
  {name: 'CC', age: 28},
  {name: 'CC', age: 34},
  {name: 'EE', age: 23},
];

// ===== 복잡한 리듀스( 시작 값이 존재하고 total과 u의 타입이 다르다.)
console.log(
  _.reduce((total, u) => total + u.age, 0, users));

// ===== 단순한 리듀스 ( a와 b가 같은 타입으로 들어온다.)
console.log(_.reduce((a, b) => a + b, [1, 2, 3]))

// ===== 단순하게 변경.
const add = (a, b) => a + b;
console.log(
  _.reduce(add, L.map(u => u.age, users))
  )

// ===== 더 단순하게
const ages = L.map(u => u.age)
console.log(
  _.reduce(add, ages(users))
);



/** =======================================
 * reduce 하나보다는 map, filter, reduce 를
 * 복합적으로
======================================= */
console.clear();
// ===== 제약 조건이 있을 경우(30 살 미만 유저 구하기)
// # 복잡한 방법
console.log(
  _.reduce((total, u) => u.age >= 30 ? total : total + u.age,
  0, users));

// # 보기 쉽게 변경 1
console.log(
  _.reduce(add,
    L.map(u => u.age,
      L.filter(u => u.age < 30, users))));

// # 보기 쉽게 변경 2
console.log(
  _.reduce(add,
    L.filter(n => n < 30,
      L.map(u => u.age, users))));




/** =======================================
 * obj -> query string 변환
 * . reduce를 단순하게 사용하는 법
 * . reduce를 복잡하게 사용하지 않는게 어떤 의미가 있는지 확인.
======================================= */
console.clear();
const obj1 = {
  a: 1,
  b: undefined,
  c: 'CC',
  d: 'DD'
};

// ===== 일반 적인 객체 순회 코드
function query1(obj){
  let res = '';
  for( const k in obj){ // 순회
    const v = obj[k];
    if(v === undefined){ // undefined 면 다음 순회
      continue;
    }
    if(res !== ''){ res += '&' } // 배열 사이 문자
    res += k + '=' + v; // 누적
  }
  return res;
}
console.log(query1(obj1));

// ===== 단순하게 변형 ( entries를 사용 )
function query2(obj){
  return Object
    .entries(obj) //  key/value를 오브젝트를 배열로 변환.
    .reduce((query, [k, v], i) => {
      if(v === undefined){ return query; } // undefined 는 무시
      // return `${query}${( i > 0 ? '&' : '')}${k}=${v}`; //
      return `${query}${( i > 0 ? '&' : '')}${k}=${v}`;
    }, '')
    ;
}
console.log(query2(obj1));

// ===== 단순하게 변경
const join = _.curry((sep, iter) =>
  _.reduce((a, b) => `${a}${sep}${b}`, iter));

function query3(obj){
  return (
    // _.reduce((a, b) => `${a}&${b}`, // 누적
    join('&', // 누적
      _.map(([k, v]) => `${k}=${v}`, // [a=1, c=CC, d=DD]
        // _.filter(([k, v]) => v !== undefined, // undefined 는 사용안함.
        _.reject(([k, v]) => v === undefined, // 위의 코드와 같지만 더 좋게
          Object.entries(obj)))) // key/value 배열전환
  );
}
console.log(query3(obj1));


// ===== 순서를 바꿔서 더 좋게
// const query4 = (obj) => _.go(
  // obj, // pipe를 사용하면 필요없다.
const query4 = _.pipe( // go 대신 pipe 변경
  Object.entries,
  L.reject(([_, v]) => v === undefined),
  // _.map(([k, v]) => `${k}=${v}`),
  L.map(join('=')), // 위의 코드와 같다.
  join('&')
)
console.log(query4(obj1));



/** =======================================
 * query string -> obj 변환
======================================= */
console.clear();
const split = _.curry((sep, str) => str.split(sep));
const queryToObject = _.pipe(
  split('&'), // ["a=1", "c=CC", "d=DD"]
  _.map(split('=')), // [["a", "1"], ["c", "CC"], ["d", "DD"]]
  _.map(([k, v]) => ({[k]: v})), // ([{"a":"1"}, {"c":"CC"}, {"d":"DD"}])
  _.reduce(Object.assign), // {a: "1", c: "CC", d: "DD"}
);
console.log(queryToObject('a=1&c=CC&d=DD'));
