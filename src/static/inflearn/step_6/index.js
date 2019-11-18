/** =======================================
 *  range
 * . 파라메터로 받은 숫자 만큼의 수가 증가하는 배열을 만드는 함수
 * . reduce에서 배열을 iterator 로 만드는 과정을 한번더 거친다.
 ======================================= */
clear();
// ===== 파라메터로 받은 숫자 만큼의 배열을 만드는 함수
const range = l => {
  let i = -1;
  let res = [];
  while(++i < l){
    // log('> range : ', i);
    res.push(i);
  }
  return res;
};

// ===== 만들어진 숫자를 누적 시킨다.
var list = range(4);
log(range(list)); // `[0, 1, 2, 4]`
log(reduce(add, list)); // `6` reduce에서 배열을 iterator 로 만드는 과정을 한번더 거친다.


/** =======================================
 *  느긋한 L.range
 * . iterable 프로토콜을 활용해 위와 같이 수가 증가하는 이터레이터를 만든다.
 * . 평가를 나중으로 미루고 필요할 때만 평가할 수 있다.
 * . range와 같이 배열을 iterator 로 만드는 과정을 거치지 않기 때문에 효율적.
 ======================================= */
const L = {};
L.range = function *(l) {
  let i = -1;
  while(++i < l){
    // log('> L.range : ', i);
    yield i;
  }
};

// ===== 만들어진 숫자를 누적 시킨다.
var list = L.range(4);
log(L.range(list)); // `L.range {<suspended>}`
log(list.next()); // `0`
// log(reduce(add, list)); // 6


/** =======================================
 *  range VS L.range 비교
 * . 엄청난 차이는 나지 않지만 차이가 나긴 한다.
 ======================================= */
 clear();

// ===== 반복 실행 시 테스트
function test(name, time, f){
  console.time(name);
  while(time--) { f(); }
  console.timeEnd(name);
}

test('range', 10, () => reduce(add, range(1000000))); // `range: 480.72607421875ms`
test('L.range', 10, () => reduce(add, L.range(1000000))); // `L.range: 355.033935546875ms`