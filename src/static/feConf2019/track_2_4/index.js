/** =======================================
 *
======================================= */
/**
 * // ===== 개요
 * . 의존성이 높으면 순간에는 편하지만 중요한 순간에 버그를 만들 수 있다.
 * . 버그 발생 시 고객 경험에 치명적이고 고객 이탈.
 * . msa 를 사용하면 의존성을 줄일 수 있다.
 * . 기능들 사이의 의존성을 최소화.
 * . 공통의 protocol만으로 통신.
 * . 하나의 코드로 통신을 전부 관리.
 * . iframe 으로 나뉘어져 있어서 오류가 발생해도 전체 앱은 멈추지 않는다.
 * . 각 기능은 SDK 형태로 추상화 되어 있어서 쉽게 개발 가능.
 *
 *
 * // ===== 의존성을 없애기 위한 핵심
 * . 각각의 Feature를 어떻게 만드느냐가 아닌 Service간의 데이터 교환 체계를
 * 어떻게 구축 할것인가?
 *
 *
 * // ===== 각 서비스의 단위
 * . iframe 이 서비스의 단위.
 *
 *
 * // ===== 서비스 간의 통신
 * . postMessage를 이용해 통신
 * @ 부모 -> 자식
 * > foo.html
 *    `
 *     const bar = document.getElementById('bar);
 *     // 데이터 송신
 *     bar.contentWindow.postMessage({ hello: 'World' });
 *    `
 * > <iframe id="bar" />
 *   `
 *    // 이벤트 수신
 *    window.addEventListener('message', (event) => {
 *      console.log(event); // { hello: 'world' }
 *    });
 *   `
 *
 * @ 자식 -> 부모
 * > foo.html
 *    `
 *      window.addEventListener('message', (event) => {
 *        console.log(event); // { hello: 'world' }
 *      });
 *    `
 * > <iframe id="bar" /> (자식에서 호출)
 *   `
 *    // 데이터 송신
 *    window.parent.postMessage({
 *      hello: 'parent',
 *    });
 *   `
 *
 *
 * // ===== 문제
 * . 하나의 통로밖에 없어서 요청 마다 switch...case 문으로 분기를 만들어야 됨.
 *
 *
 * // ===== 해결해야 될 과제
 * . 자식이 부모에게 요청 시.
 * . 부모가 자식 내의 특정 데이터를 변경하고 싶을 때.
 *
 *
 * // ===== 해결책
 * @ Request / Response 인터페이스
 * . 메시지에 Unique한 id를 부여(uuid 사용)
 * . 각 메시지 마다 Unique한 ID를 생성 (UUID)
 * . 응답 메시지에 요청 메시지 ID를 넣어 `one-to-one` 대응 관계를 만든다.
 * 1. 부모가 특정 함수 레지스트리에 등록
 *   - function echo(sqy:string): string {...}
 * 2. 자식이 sdk를 통해서 해당함수에 이름과 arguments를 이용해 요청
 *   - sdk.sendRequest('echo', ['Hello, FEConf']): Promise<"Hello, FEConf">
 *   - { id: '1234', eventName: 'request', name: 'echo', arguments: 'Hello, FEConf' }
 * 3. echo 함수가 요청에 대한 값을 리턴
 *   - { id: '9876', eventName: 'response', requestId: '1234', returnValue: 'Hello, FEConf' }
 *
 * @ Action / Reaction 인터페이스
 * . 메시지에 Unique한 id 부여(uuid)
 * . 응답 메시지에 요청 메시지의 ID를 넣어 one-to-many 관계를 만들어 줍니다.
 * . 사용 예시 : 이미지를 업로드 시 서버가 요청을 날렸을 때 10%, 20%, ... 계속 올라가게.
 * 1. 부모: 함수 레지스트리 등록
 *   - function echoThreeTimes(react:Function, say:string): void
 * 2. 자식: 해당함수의 이름과 arguments를 호출.
 *   - promise를 리턴하는 것이 아닌 listener를 등록
 *   - sdk.emitAction('echoThreeTimes', ['Hello, FEConf'])
 *      .on((reaction) => { console.log(action) });
 * 3. 자식: 해당 정보 부모로 전송.
 * 4. 부모: 전달받은 함수 실행.
 * 5. 부모: 해당 함수 실행시에 항상 실행시 마다 자식에게 날아옴.(emit)
 * 6. 자식: 요청 수신.(on)
 *
 *
 * @ One-way Binding 인터페이스
 * . Mobx Observable 활용.
 * 1. 부모에서 자식 컴포넌트를 감싼뒤 특정 props를 수신하도록 함.
 *   - <sdk.iframe hello="Hello, FEConf" />
 * 2. props 변경 시 메시지 전달.
 * 4. sdk 내부의 mobx가 수신 후 해당 상태를 구독중인 컴포넌트 랜더링
 *
 *
 * @ Event 인터페이스
 * . switch ... case 문
 *
 *
 * // ===== 메시지 프로토콜
 * . 네가지 통신 방법을 담을 수 있는 protocol
 * @ Context
 * . id {string}
 *   - 메시지 마다 생성되는 Unique ID (short-uuid 라이브러리 사용)
 * . createAt {string}
 *   - 메시지 생성시간. (ISO 8601)
 *   - 정확한 감지를 위해 넣음.
 * . serviceInstanceId {string}
 *   - short-uuid
 *   - 메시지가 생성된 서비스 인스턴스 ID
 *   - 어느 자식에게 요청이 왔는지 찾기 어려워 만든 ID
 *  . userId {string}
 *   - UUDI
 *   - User의 ID
 *
 * @ Content
 * . eventName {string}
 *   - 이벤트 이름
 * . body {any}
 *   - 내용
 *   - payload
 *
 *
 * // ===== 배포
 * . s3 같은 static 저장소에 배포.
 * . 적용시에는 url 입력만으로 사용가능.
 *
 *
 * // ===== 웹 소켓 서버
 * . 이벤트를 emit / listen 하는 방식으로 통신.
 * . 실시간성을 위해 지금의 방식을 그대로 적용.
 * . 서버의 시간 / ID 등을 one way binding 으로 내려줄 수 있다.
 *
 *
 * // ===== 아쉬운 점
 * . 개발 초기 단계에서 개발 생산성 하락.
 *   - 개발/배포 포인트 등이 많다.
 * . 성능 하락
 *   - 전부 싱글 스레드로 동작하기 때문에 성능 하락이 있음.
 *   - iframe으로 인한 렌더링 성능 하락.(약 30%)
 *
 * // ===== 좋았던 점
 * @ 팀 전체 개발 속도 상승
 *   - 각각 개발해서 배포 사이클을 가져갈 수 있음.
 * @ 테스트 용이성.
 *   - 새롭게 배포하는 부분만 테스트 가능.
 * @ 안전성
 * . 에러 발생 시 해당 iframe만 새로 고침 가능.
 *
 */