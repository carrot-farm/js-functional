/** =======================================
 * range와 take의 재해석
 * . 앞으로 일어날 일들을 리스트로 바라보고 프로그래밍
======================================= */
// _.go(
//   _.range(10), // 0 ~ 9 까지의 배열
//   _.take(3), // 앞에서 부터 3개만 자르기
//   _.each(console.log));

// _.go(
//   L.range(10), // 0~9 까지의 이터러블. 최대 10번 일어날 수 있는일
//   L.take(3), // 최대 3개의 값을 필요로 하고, 최대 3번의 일을 수행
//   _.each(console.log));

// ===== 시간을 리스트로 바라보는 예시
// # 지연 평가
// _.go(
//   L.range(1, 10), // 0~9 까지의 이터러블. 최대 10번 일어날 수 있는일
//   L.map(_.delay(1000)),
//   L.filter(a => a % 2), // 필터링
//   L.map(_ => new Date()), //  시간 객체
//   L.take(3), // 최대 3개의 값을 필요로 하고, 최대 3번의 일을 수행
//   _.each(console.log));

// # 즉시 평가
// _.go(
//   L.range(1, 10), // 0~9 까지의 이터러블. 최대 10번 일어날 수 있는일
//   L.map(_.delay(1000)),
//   L.filter(a => a % 2), // 필터링
//   L.map(_ => new Date()), //  시간 객체
//   _.take(3), // 3초뒤 한번에 평가된다
//   _.each(console.log));



/** =======================================
 * takeWhile, takeUntil
 * . takeWhile : f 의 리턴값이 true 일 경우 순회
 * . takeUntil : f 의 리턴값이 true가 될때까지 순회
======================================= */
// ===== takeWhile 사용법
/** f 의 리턴값이 true 일 경우 순회 */
// _.go(
//   [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
//   _.takeWhile(a => a), // true 평가 될때만 순회. 0 은 false 이므로 순회 안함.
//   _.each(console.log) // 1 2 3 4 5 6 7 8
// )

// ===== takeUntil
/** f 의 리턴값이 true가 될때까지 순회 */
// # 예시 1
// _.go(
//   [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8],
//   _.takeUntil(a => a), // true 평가 될때만 순회
//   // _.takeUntil(a => !a), // not 으로 인해 위와 반대로 행동
//   _.each(console.log) // 0 0 0 1
// )
// # 예시 2
// _.go(
//   [0, false, undefined, null, 10, 20, 30],
//   _.takeUntil(a => a),
//   _.each(console.log) // 0 false undefined null 10
// )



/** =======================================
 * 할 일들을 이터러블(리스트)로 바라보기
======================================= */
const track = [
  { cars: ['철수', '영희', '철희', '영수'] },
  { cars: ['하든', '커리', '듀란트', '탐슨'] },
  { cars: ['폴', '어빙', '릴라드', '맥컬럼'] },
  { cars: ['스파이더맨', '아이언맨'] },
  { cars: [] },
];

// ===== 예시
// _.go(
//   L.range(Infinity), // 모든 차들을 대상
//   L.map(i => track[i]), // 출전 조를 지정한다.
//   L.map(({cars}) => cars), //  cars 필드만 뽑아냄.
//   L.map(_.delay(1000)), //  출발전 대기 시간 지정.
//   // L.takeWhile(({length}) => length === 4), // 4명이 있는 곳만 출발 시킨다.
//   L.takeUntil(({length}) => length < 4), // 4명이 처음 아닐때까지 출발 시킨다.
//   L.flat, // 배열을 풀어낸다.
//   L.map(car => `${car} 출발 !`),
//   _.each(console.log),
// )



/** =======================================
 * 아임포트 결제 누락 스케쥴러 만들기
 * . 상황
 *   - 카드 결제가 되서 아임포트 측에서는 결제가 완료 됐지만
 * 쇼핑몰 측에서는 결제처리가 완료 안된것 처럼 나오는 상황.
 *   - 결제된 정보를 한번에 조회할 수 있는 양이 정해져 있다.
 *
 * . 해결 프로세스
 *   - 일정 주기로 아임포트측의 결제 정보를 확인해 싱크를 맞춘다.
======================================= */
// ===== 아임포트 정보와 api 호출 함수
const Impt = {
  // # 결제 정보
  payments: {
    1: [
      { imp_id: 11, order_id: 1, amount: 15000 },
      { imp_id: 12, order_id: 2, amount: 25000 },
      { imp_id: 13, order_id: 3, amount: 10000 },
    ],
    2: [
      { imp_id: 14, order_id: 4, amount: 25000 },
      { imp_id: 15, order_id: 5, amount: 45000 },
      { imp_id: 16, order_id: 6, amount: 15000 },
    ],
    3: [
      { imp_id: 17, order_id: 7, amount: 20000 },
      { imp_id: 18, order_id: 8, amount: 30000 },
    ],
    4: [],
    5: [],
  },
  // # 결제 정보 가져오기
  getPayments: page => {
    console.log(`http://...?page${page}`);
    return _.delay(1000, Impt.payments[page]);
  },
  // # 결제 정보 취소하기
  cancelPayment: imp_id => Promise.resolve(`${imp_id}: 취소완료`),
};

// ===== 가맹점 DB
/** 결제 완료 되어 있는 Row만 반환 된다고 가정. */
const DB = {
  getOrders: ids => _.delay(100, [
    {id: 1},
    {id: 3},
    {id: 7},
  ])
};

// ===== 결제 확인 및 취소 프로세스
async function job(){
  // # 결제된 결제 모듈측 payments 정보를 가져온다.
  /** page 단위로 가져오는데, 결제 데이터가 있을 때까지 모두 가져와서 하나로 합친다. */
  const payments = await _.go(
    L.range(1, Infinity), // 1번부터 꺼냄
    L.map(Impt.getPayments), // 비동기로 데이터 요청
    // L.takeWhile(({length}) => length), // 배열이 있는 것들만 꺼낸다.(배열이 없는것이 나올때까지 call 함.)
    L.takeUntil(({length}) => length < 3), // 위의 코드를 더 좋게 바꿔서 최대 수량 미만일 경우 call을 그만둠.
    _.flat, // 요청을 모아서 펼침
  );

  // # 결제가 실제로 완료된 가맹점 측의 id들을 뽑는다.
  const orderIds = await _.go(
    payments, // 결제 정보
    _.map(p => p.order_id), // 아이디만 추려낸다.
    DB.getOrders, // 결제 아이디를 넘겨서 가맹점에서 결제된 Row 비교 확인.
    _.map(({id}) => id), // 아이디만 추림
  );
    throw new Error('에러')
  // # 아임포트 측의 결제정보와 가맹점의 주문서를 비교해서 결제를 취소.
  await _.go(
    payments, // 아임포트 결제 정보
    L.reject(p => orderIds.includes(p.order_id)), // 결제정보에서 주문된 것들을 제외
    L.map(p => p.imp_id), // 아임포트 아이디를 뽑는다.
    L.map(Impt.cancelPayment), // 취소 요청을 한다.
    _.each(console.log), // 로그 출력
  )
}

// ===== 결제 비교 재귀 호출
/** job이 재귀 기준 시간 보다 더 걸릴 경우 job이 끝날때까지 기다린 다음 재귀 호출 */
(function recur(){
  // # job이 아직 안끝났어도 그냥 호출 된다.
  // job().then(recur);

  // # job이 끝나야 8초 뒤 재 호출 된다.
  Promise.all([
    _.delay(7000, undefined),
    job()
  ]).then(recur);
})();

