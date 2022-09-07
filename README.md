# Recoil-Todo-App

## Recoil

### State Management에 대하여

- 상태관리를 하지않고 prop으로만 넘겨준다면?
    - prop이 10000개가 넘는다면 일일히 다 넘길수 없기에(계속해서 자식의 자식의 자식의 state...를 넘겨주어야한다) 상태관리 툴을 사용한다. => `Traveling Prop`, `Props Drilling`을 방지

- 상태관리 툴을 사용한다면, Global State를 사용할 수 있다.
    - Global state는 전역으로 모든 컴포넌트에서 공유될 수 있으며, 특정 Value에 접근하거나 Value를 수정하기 위해 사용되는 State이다.
    - Ex) 유저의 로그인 상태, 로그인을 했다면, 많은 컴포넌트에서 보이는 모습들이 달라져야한다. 로그인 상태는 전역으로 관리해야한다.

- 대표적인 State Management : Redux, Recoil, MobX, Zustand 등등..

### 리코일?
    
- 페이스북에서 만든 Atomic 모델 기반의 상태관리 라이브러리.

    ```jsx
    npm install recoil
    ```

- `Atom` 이라는 상태 단위로 상태를 관리하며 컴포넌트는 Atom을 구독하기만 하면 되는 구조이다.

- `리코일 사용법`
    1. RecoilRoot로 index.tsx 감싸기 => redux의 Provider 처럼 App에 리코일을 사용하기 위해선 RecoilRoot가 필요
    ```jsx
    //index.tsx
    import { RecoilRoot } from "recoil";

    <RecoilRoot>
        <App />
    </RecoilRoot>
    ```

    2. 상태관리를 할 atom을 생성
        - atom 안에는 항상 Key와 Default가 필수로 들어가야한다.
    ```jsx
    //atoms.ts
    import { atom } from "recoil";

    export const isDarkAtom = atom({
        key: "isDark",
        default: true
    })
    ```

    3. 컴포넌트에서 atom을 사용해서 전역 상태관리 실시
        - atom을 사용하는 방법은 여러가지가 있다.
            1. `useRecoilValue()` : atom의 value 값을 가져오고, 감지하는 리코일의 메소드
            2. `useSetRecoilState()` : atom의 value 값을 변경해주는 리코일의 메소드
            3. `useRecoilState()` : 앞의 useRecoilValue, useSetReocilState가 합쳐진 메소드 => react의 useState와 유사하다.
## React Hook Form
