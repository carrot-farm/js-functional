/** =======================================
 *  sum
 ======================================= */
const products = [
  { name: '반팔티', price: 15000, quantity: 1, is_selected: true },
  { name: '긴팔티', price: 20000, quantity: 2, is_selected: false },
  { name: '핸드폰케이스', price: 15000, quantity: 3, is_selected: false },
  { name: '후드티', price: 30000, quantity: 4, is_selected: true },
  { name: '바지', price: 25000, quantity: 5, is_selected: false },
];

// ===== 합산
const add = (a, b) => a + b;

// ===== 누적 계산 시 누적되어야 할 부분 f에 위임.
// # curry 적용 전
const sum_old_1 = (f, iter) => go(
  iter,
  map(f),
  reduce(add));

// # curry 적용 후
const sum = curry((f, iter) => go(
  iter,
  map(f),
  reduce(add)));

// ===== 총 수량
// #o pipe 적용 전.
const total_quantity_old_1 = products =>  go(products,
  map(p=>p.quantity),
  reduce(add));

// #o  pipe 적용 후. sum 적용 전
const total_quantity_old_2 = pipe(
  map(p=>p.quantity),
  reduce(add));

// #o sum 적용 curry 적용 전.
const total_quantity_old_3 = products => sum_old_1( p => p.quantity, products);
// log(total_quantity_old_3(products));

// # sum 적용된 curry 적용 후
const total_quantity = sum( p => p.quantity);
// log(total_quantity(products));


// ===== 합산 가격
const total_price = sum( p => p.price * p.quantity);
// log(total_price(products));

/** =======================================
 *  html 랜더링
 ======================================= */
// =====
document.querySelector('#cart').innerHTML = `
  <table>
    <tr>
      <th></th>
      <th>상품 이름</th>
      <th>가격</th>
      <th>수량</th>
      <th>총 가격</th>
    </tr>
    ${go(
      products,
      // map(p => `
      //   <tr>
      //     <td>${p.name}</td>
      //     <td>${p.price}</td>
      //     <td>
      //       <input type="number" value="${p.quantity}" />
      //     </td>
      //     <td>${add(p.price, p.quantity)}</td>
      //   </tr>
      // `),
      // reduce(add), // html 출력시 정상 표기가 안되는데 이를 해결하기 위해 문자열을 합쳐준다.(안할 경우 배열에 문자열이 있다.)
      sum(p => `
        <tr>
          <td><input type="checkbox" ${p.is_selected ? 'checked': ''} /> </td>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>
            <input type="number" value="${p.quantity}" />
          </td>
          <td>${add(p.price, p.quantity)}</td>
        </tr>
      `),
    )}
    <tr>
      <td colspan="2">합계</td>
      <td>${total_quantity(filter(p => p.is_selected, products))}</td>
      <td>${total_price(filter(p => p.is_selected, products))}</td>
    </tr>
  </table>
`;