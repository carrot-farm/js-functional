/** =======================================
 * 홀수 n개 더하기
======================================= */
// ===== 명령형 코드
function f1(limit, list){
  let acc = 0; // 누적 변수
  for( const a of list){
    if(a % 2){ // 홀수 (if한번의 조건 제약)
      const b = a * a; // 제곱(값 할달)
      acc += b; // 누적
      if(--limit === 0) break; // 지정된 갯수 만큼만 누적
    }
  }
  console.log(acc);
}
// f1(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35



/** =======================================
 * if : filter
======================================= */
// =====
function f2(limit, list){
  let acc = 0;
  for( const a of L.filter(a => a % 2, list)){
    // if(a % 2){
    const b = a * a;
    acc += b;
    if(--limit === 0) break;
    // }
  }
  console.log(acc);
}
// f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35



/** =======================================
 * 값 변화 후 변수 할당 : map
======================================= */
// =====
function f3(limit, list){
  let acc = 0;
  for( const a of L.map(a => a * a, L.filter(a => a % 2, list))){
    // const b = a * a;
    // acc += b;
    acc += a;
    if(--limit === 0) break;
  }
  console.log(acc);
}
// f3(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35



/** =======================================
 * break : take
======================================= */
function f3(limit, list){
  let acc = 0;
  for( const a of L.take(limit,  L.map(a => a * a, L.filter(a => a % 2, list)))){
    acc += a;
    // if(--limit === 0) break;
  }
  console.log(acc);
}
// f3(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35

// # take 사용법
// var it = L.take(2, [1, 2, 3]);
// console.log(it.next()); // {value: 1, done: false}
// console.log(it.next()); // {value: 2, done: false}



/** =======================================
 * 축약 및 합산 : reduce
======================================= */
const add = (a, b) => a + b;
function f4(limit, list){
  // # 절차형
  // let acc = 0;
  // for( const a of L.take(limit,  L.map(a => a * a, L.filter(a => a % 2, list)))){
  //   acc += a;
  // }

  // # 함수형으로 변경
  // console.log(acc);
  // console.log(
  //   _.reduce(add,
  //     L.take(limit,
  //       L.map(a => a * a,
  //         L.filter(a => a % 2, list)))))

  // # go를 이용
  _.go(list,
    L.filter(a => a % 2),
    L.map(a => a * a),
    L.take(limit),
    _.reduce(add),
    console.log
  )
}
// f4(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35



/** =======================================
 * while : range
======================================= */
// ===== while 문
function f5(end){
  // # 일반적인 코드
  // let i = 0;
  // while(i < end){
  //   if(i % 2){
  //     console.log(i)
  //   }
  //   ++i;
  // }

  // # 효율적인 코드 변환
  let i = 1;
  while(i < end){
    console.log(i)
    i += 2;
  }
}
// f5(10); // 1 3 5 7 9

// ===== range 사용
function f6(end){
  // # 일반적인 코드
  // _.each(console.log, L.range(end));

  // # 효율적인 코드(위의 white 문의 효율적인 코드와 같다.)
  // _.each(console.log, L.range(1, end, 2)); // [1, 3, 5, 7, 9] (input type과 동일한 타입이 나온다.)

  // # go 를 이용
 _.go(
    L.range(1, end, 2),
    _.each(console.log) // 1 3 5 7 9
  )
}
// f6(10); // 1 3 5 7 9




/** =======================================
 * 별 그리기
======================================= */
const join = sep => _.reduce((a, b) => `${a}${sep}${b}`);

// ===== 2차원 배열
_.go(
  L.range(1, 5), // 4번 반복
  L.map(L.range), // 4번짜리를 0~3까지 배열 생성
  L.map(L.map(_=> '*')),
  L.map(join('')),
  join('\n'),
  console.log
)

// ===== 위와 동일
// _.go(
//   L.range(1, 5), // 4번 반복
//   L.map(s => _.go(
//     L.range(s),
//     L.map(_ => '*'),
//     _.reduce((a, b) => `${a}${b}`)
//   )),
//   _.reduce((a, b) => `${a}\n${b}`),
//   console.log
// )



/** =======================================
 * 구구단
======================================= */
_.go(
  L.range(2, 10),
  L.map(a => _.go(
    L.range(1, 10),
    L.map(b => `${a}x${b} = ${a+b}`),
    join('\n'),
  )),
  join('\n\n'),
  console.log
)