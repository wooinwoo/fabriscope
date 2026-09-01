# 기획 결정 히스토리

이 문서는 제품 기획이 바뀐 이유, 검토한 반례와 기각한 대안을 기록한다. 현재 저장소의 업무 계약은 [제조 도메인 계약](../domain/manufacturing-domain-contract.md)이, 공개 근거는 [제조 도메인 공개 근거 재검증](../domain/source-review.md)이 최종 기준이다.

## 2026-09-01 — v1.0 실행 계약 정합성 재검토

### 검토 배경

- [아이쓰리시스템 공식 SW 개발자 공고](https://i3system.career.greetinghr.com/ko/o/234020)는 내부 MES 등 업무시스템 개발, React, ERP·MES 참여 경험을 요구하고 Full Stack·Back-End·DB·UI/UX를 우대한다.
- [아이쓰리시스템 2026년 1분기 공식 보고서](https://kind.krx.co.kr/external/2026/05/13/000112/20260513000154/11013.htm)는 적외선·X-ray 영상센서 등 제조 사업과 시험·품질 맥락을 공개한다.
- 따라서 센서 제조의 작업지시·자재 LOT·검사·계보를 연결하는 제품 방향은 채용 적합성이 높다.
- 공개자료에는 회사 내부 MES의 화면, schema, 자재 투입 시점과 승인 절차가 없다. 이 제품은 내부 시스템을 추정하거나 복제하지 않고 완전한 가상 시나리오를 사용한다.
- 재검토 시점의 저장소는 문서만 존재해 제품 방향은 설명하지만 React·API·DB의 실행 증거는 아직 없다.

회사·공고 적합성은 방향 선택 근거일 뿐 도메인 규칙의 사실 근거가 아니다. 이 절의 회사명은 비공개 lab 검토 맥락이며 공개 포트폴리오로 옮길 때는 일반화한다.

### 결정 1. 검사 판정과 LOT 품질 처분을 별도 명령으로 완결한다

기존 계약은 검사 판정을 품질 disposition의 근거로 분리하고 `PENDING`에서 별도 품질 결정이 필요하다고 적었다. 그러나 API 목록, 명령 소유권과 화면에는 그 명령이 없었다.

실패 반례:

```text
최종검사 PASS
→ ProductionLot.qualityDisposition = PENDING 유지
→ ACCEPTED가 아니므로 ProductionLot 완료 거부
→ WorkOrder도 영구 미완료
```

결정:

- #12가 `decideMaterialLotQuality`를 소유한다.
- #14가 `decideProductionLotQuality`를 소유한다.
- 두 명령은 품질 담당자 권한, 필수 사유, 허용 전이, version, `commandId`와 감사를 검증한다.
- 생산 LOT `ACCEPTED`는 모든 공정·필수 검사 PASS·활성 격리 부재를 잠근 뒤 LOT 완료와 WorkOrder 완료 projection을 같은 transaction에서 처리한다.
- 검사 판정 명령은 disposition을 암묵적으로 바꾸지 않는다.

기각한 대안:

- 검사 `PASS`가 자동으로 `ACCEPTED`까지 변경: 판정 사실과 사용 승인 책임이 섞이고 수동 보류·거부 근거를 잃으므로 기각.
- 새 수입검사 모듈 추가: 현재 제품 범위를 넘어가므로 자재 LOT의 최소 품질 결정만 구현.

### 결정 2. BOM 자재는 첫 route 공정에서만 생산 LOT 몫을 투입한다

기존 `FLOW-01`은 첫 공정 투입을 말했지만 도메인 계약은 모든 `startProcessExecution`이 `consumeMaterialReservation`을 호출하는 것처럼 작성됐고, UI는 공정 2/4에서 다시 자재를 입력했다.

[SAP Routing의 component allocation 안내](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/d3a3eb7caa1842858bf0372e17ad3909/3b07414692aa4baa9c61347b4e2195a0.html)는 BOM component를 operation에 배정할 수 있으며 미배정 component는 첫 operation에 기본 배정한다고 설명한다. 이는 두 모델이 모두 가능하다는 근거이며 현재 제품에 공정별 매핑이 필수라는 뜻은 아니다.

결정:

- v1.0의 모든 BOM 자재는 첫 생산 LOT 시작 전에 작업지시 전체 요구량을 예약한다.
- 작업지시 릴리스는 계획수량 전체를 가진 초기 생산 LOT를 정확히 하나 만든다.
- 그 LOT의 첫 route 공정에서 `ProductionLot.plannedQuantity × quantityPerProductBaseUom`, 즉 작업지시 요구량 전부를 소비한다.
- 후속 공정 시작은 재고·소비·`CONSUME` 계보 거래를 만들지 않는다.
- 첫 공정 시작 뒤 일반 예약·해제를 막는다.

기각한 대안:

- `WorkOrderMaterialRequirement → ProcessStepRevision` FK 즉시 추가: 현재 표준 시나리오와 공고가 중간 공정 투입을 요구하지 않고, 독립적으로 version되는 BOM과 route를 조기에 결합하므로 기각.
- 여러 초기 생산 LOT를 즉시 지원: 남은 예약 자재가 격리될 때 진행 중 대체 예약·부분 취소까지 새로 설계해야 하므로 v1.0에서는 기각. 초기 LOT를 공정 후 분할·합류하는 흐름은 유지한다.

재검토 조건: 표준 제품 fixture에서 중간 공정 신규 투입 자재가 실제로 필요해지거나, 작업지시를 처음부터 여러 LOT로 병렬 착수해야 할 때 관련 mapping·예약 교체를 ADR로 검토한다.

### 결정 3. 하나의 가상 제품 fixture를 구현 전 과정에서 재사용한다

기존 문서는 제품명, BOM, 공정 수, LOT와 측정값 예시가 서로 달랐다. 이 상태로 #22~#19를 각각 구현하면 화면·seed·통합 테스트가 한 수직 흐름으로 연결되지 않는다.

결정:

- [도메인 계약 §7.4](../domain/manufacturing-domain-contract.md#74-가상-fixture)의 `FIX-SENSOR-01`을 기준으로 사용한다.
- 제품 `SEN-DEMO-01`, 두 자재, 2-step route, 공정검사·최종검사, 작업지시와 초기 생산 LOT을 함께 고정한다.
- 실패·동시성 테스트는 기준 fixture를 복제한 격리된 variant로 만들고 정상 seed 상태를 변형하지 않는다.
- #22가 master/release snapshot을, #12~#16이 같은 식별자와 수량을, #19가 최종 seed/reset을 완성한다.

### 결정 4. 출하는 업무가 아니라 적격성 projection만 제공한다

도메인 비범위에는 출하·물류가 있었지만 README와 화면은 `출하 승인`을 핵심 흐름처럼 표현했다. 출하 entity·command·권한·수량 계약 없이 승인 문구만 두면 구현 범위와 사용자 기대가 충돌한다.

결정:

- v1.0은 출하 command와 물류 workflow를 만들지 않는다.
- 원천 생산 LOT의 완료·품질과 활성 격리에서 읽기 전용 `shipmentEligibility = ELIGIBLE | BLOCKED`만 계산한다.
- README 핵심 흐름은 품질 처분과 완료·사용 가능 판정으로 끝낸다.

### 결정 5. `MVP` 대신 `v1.0 릴리스 범위`로 관리한다

범위를 정하는 일은 유지하지만 임시 데모로 오해되는 표현은 제거한다. v1.0은 화면 버튼이 실제 API·DB transaction·권한·오류 상태와 연결되는 제품 릴리스다. 범용 ERP, 설비제어와 추측성 기능을 넣지 않는 것은 완성도 부족이 아니라 명시적 제품 경계다.

### 결정 6. 기획 상태는 구현 증거가 생길 때까지 조건부다

기존 크로스검토본은 체크리스트가 전부 미확인인데 `Approved`였다. 문서 정합성만으로 실제 제품 완성을 주장하지 않도록 상태를 `Conditional v0.7`로 바꿨다. 체크리스트 중 구현·테스트·PR 근거가 필요한 항목은 실행 증거가 생길 때만 완료한다.

### 변경하지 않은 결정

- 한 공정의 부분 완료 제외는 이미 도메인 계약에 명시돼 있어 새 규칙을 만들지 않았다.
- 범용 MES, 실제 기업 화면 복제, 다사업장, 재작업, 공정별 자재 mapping은 새 요구가 확인되기 전까지 추가하지 않는다.
- 별도 기획 문서는 늘리지 않고 이 히스토리와 기존 계약·Issue를 함께 갱신한다.

### 영향 범위

| 대상 | 변경 내용 |
|---|---|
| README·제품 비전 | 품질 처분 단계, v1.0 표현, 출하 승인 제거 |
| 제품 크로스검토 | 첫 공정 자재 정책, 품질 command/API 소유권, 조건부 상태 |
| 도메인 계약·ADR | `RULE-34`~`RULE-36`, transaction·권한·완료 gate |
| UI 계약 | 첫 공정에서만 자재 입력, 후속 공정 읽기 전용, 별도 품질 처분 action |
| 공개 근거 재검증 | SAP 적용 한계, `CHK-28`~`CHK-31`, 재검토 조건 |
| #12·#13·#14·#16·#19·#22 | 같은 command·fixture·적격성·Acceptance criteria로 정렬 |

### 다음 구현 게이트

추가 기획을 늘리지 않는다. 이 계약을 기준으로 #1의 실행 가능한 TypeScript workspace를 만든 뒤, `FIX-SENSOR-01`의 작업지시 릴리스 → 자재 품질 승인·예약 → 첫 공정 투입 → 검사 → 생산 LOT 품질 승인·완료까지 한 수직 흐름을 먼저 실행·테스트한다.
