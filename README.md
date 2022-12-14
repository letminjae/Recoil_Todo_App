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
  </RecoilRoot>;
  ```

  2. 상태관리를 할 atom을 생성
     - atom 안에는 항상 Key와 Default가 필수로 들어가야한다.

  ```jsx
  //atoms.ts
  import { atom } from "recoil";

  export const isDarkAtom = atom({
    key: "isDark",
    default: true,
  });
  ```

  3. 컴포넌트에서 atom을 사용해서 전역 상태관리 실시
     - atom을 사용하는 방법은 여러가지가 있다.
       1. `useRecoilValue()` : atom의 value 값을 가져오고, 감지하는 리코일의 메소드
       2. `useSetRecoilState()` : atom의 value 값을 변경해주는 리코일의 메소드
       3. `useRecoilState()` : 앞의 useRecoilValue, useSetReocilState가 합쳐진 메소드 => react의 useState와 유사하다.


- Selector
  - Selector는 파생된 State(Derived state)의 일부를 나타낸다.
  - 기존 State를 가져와서, 기존 State를 이용해 새로운 State를 만들어서 반환할 수 있다. `기존 State를 이용만할 뿐 변형시키지 않는다는 점`이 핵심. `Derived state는 다른 데이터에 의존하는 동적인 데이터를 만들 수 있기 때문에` 강력하다.
  - 결론적으로 `atom을 여러개 쓰지않고 한개의 atom으로 output을 여러개로 변형`할 수 있다는 점이 중요 포인트이다

  - Selector 사용법
    1. atom과 마찬가지로 selector도 key가 필요하다.
    2. *get* : 인자로 객체를 받는다. 그 객체에는 get이 들어가 있음. 이 get funtion으로 atom을 받아올 수 있다. return 값은 atom을 이용한 selector의 value값이 된다.
      - get 함수만 제공되면 Selector는 읽기만 가능한 RecoilValueReadOnly 객체를 반환한다.
    3. *set* : Selector를 수정할 수 있다. get과 다르게 set은 인자가 두가지가 들어간다. <br />
    `set(수정하고 싶은 atom, 새로운 값)`
      - get과 마찬가지로 인자로 객체를 받는데, 객체에는 set이 들어가있다. 
      - set의 두번째 인자에는 우리가 보내는 새로운 값을 받는다. (newValue)
      - set 함수 또한 제공되면 Selector는 쓰기 가능한 RecoilState 객체를 반환한다.
    
    ```tsx
    export const minuteState = atom({
      key: "minutes",
      default: 0,
    });

    export const hourSelector = selector<number>({
      key: "hours",
      get: ({ get }) => {
        const minutes = get(minuteState);
        return minutes / 60;
      },
      set: ({ set }, newValue) => {
        const minutes = Number(newValue) * 60;
        set(minuteState, minutes);
      },
    });
    ```

  ```tsx
  import { atom, selector } from "recoil";

  export enum Categories {
    "TO_DO" = "TO_DO",
    "DOING" = "DOING",
    "DONE" = "DONE",
  }

  export interface IToDo {
    text: string;
    id: number;
    category: Categories;
  }

  export const categoryState = atom<Categories>({
    key: "category",
    default: Categories.TO_DO,
  });

  export const toDoState = atom<IToDo[]>({
    key: "toDo",
    default: [],
    effects_UNSTABLE: [persistAtom],
  });

  export const toDoselector = selector({
    key: "toDoSelector",
    get: ({ get }) => {
      const toDos = get(toDoState);
      const category = get(categoryState);
      return toDos.filter((toDo) => toDo.category === category);
    },
  });
  ```

- Enum
  - 타입스크립트 개념이지만, 리코일을 사용하다 카테고리에 하드코딩을 하다보니 불안정하다 느껴 Category atom에 Enum 사용.
  - Enum = enumberable, 열거형. 이름이 있는 상수들의 집합을 정의할 수 있다.
  - 열거형을 사용하면 의도를 문서화 하거나 구분되는 사례 집합을 더 쉽게 만들 수 있다.
    - Number Enums (숫자형 열거형)
    - 기본적으로 Enum은 프로그래머를 도와주기 위해 일련의 숫자를 문자로 표현한다.
    ```tsx
    // Up이 1로 초기화된 숫자 열거형을 선언
    // 그 지점부터 뒤따르는 멤버들은 자동으로 증가된 값을 갖는다.
    // 
    enum Direction {
      Up = 1,
      Down, // 2
      Left, // 3
      Right, // 4
    }

    // 원한다면 전부 초기화 하지 않을 수도 있다.
    // 해당 코드는 Up 값이 0, Down은 1
    enum Direction {
      Up, // 0
      Down, // 1
      Left, // 2
      Right, // 3
    }
    ```
    - String Enums (문자형 열거형)
    ```tsx
    // 문자열 열거형에서 각 멤버들은 문자열 리터럴 또는 다른 문자열 열거형의 멤버로 상수를 초기화 해야한다.
    enum Direction {
      Up = "UP",
      Down = "DOWN",
      Left = "LEFT",
      Right = "RIGHT",
    }
    ```


## React Hook Form

### 항상 똑같이 길게 작성하는 Form을 쓰기 싫다면?

- 사용하기 쉬운 유효성 검사가 가능한, 성능이 뛰어나고 유연하며 확장가능한 Form

  ```jsx
  npm install react-hook-form
  ```

- Validation (유효성) 검사가 쉽다.

  - 웹, 앱에는 항상 많은 input, form들이 들어가게 되는데, form에 많은 State를 생성해 유효성 검사를 하기엔 코드도 길어지고 무한정 State를 생성하기에 코드가 복잡하게 보일수도 있다.
    - 예를들어, 계정을 생성하기위한 회원가입 창에는 많은 input과 유효성 검사가 필요하다.
    - If 조건문의 지옥에 빠질 수 있다.
    - 에러 핸들링 : Error 코드와 내용들을 모두 정리해서 직접 작성해야하기에 힘들다.

- 한줄의 코드로 모든 Form의 성능을 구현해낸다.
  - useForm() 하나만으로 Form을 작성하는데 필요한 onChange, value 등 불필요한 props들을 form 하위 요소에 넘겨주지 않아도 되어 코드가 깔끔해보이고 간결해진다.

### React Hook Form 사용법

- useForm 사용 : React Hook Form의 근간이 되는 메소드. 아주 많은 기능을 제공한다.

  - `register` : onBlur 이벤트(Focus가 되지않았을 때), onChange 이벤트, ref, name 의 객체들을 생성.
    - 스프레드문법을 이용하여 input에 모든 register 객체들을 넣어준 뒤 마음껏 메소드를 사용할수 있게 함.
    - register에는 register의 이름(name)이 꼭 필수로 들어가야함.
    - `required(필수로 채워야하는 input 요소)` : HTMLInputElement 속성에 이미 required 속성이 있는데 왜 register에 사용하는지 의아했었지만, HTML은 사용자가 임의로 지울 수 있기에 보호받지 못하고 submit 될 수 있다. 하여, register의 JS적 요소로 보호받을 수 있게 만듬.
    - `required`는 boolean으로 설정할 수 도 있지만, String으로 내용을 적으면 에러 핸들링 시 메시지를 뿜어낼수 있다.
    - `minLength` : 최소글자 유효성 검사, 간단하게 Number로 바로 설정할 수도 있지만(방법1), 객체로 사용해 value와 message로 설정하면 에러 핸들링 메시지를 뿜어내게도 가능(방법2).
    - `maxLength` : 최대글자 유효성 검사, 간단하게 Number로 바로 설정할 수도 있지만(방법1), 객체로 사용해 value와 message로 설정하면 에러 핸들링 메시지를 뿜어내게도 가능(방법2).
    - `pattern` = _정규식(RegExp, Regular Expression) 사용_ : 유효성 검사에 항상 나오는 단골손님. 당연히 register에서도 pattern 메소드를 이용해 정규식 설정 가능. 마찬가지로 객체로 사용해 message와 함께 에러 핸들링 가능. 대표적으로 이메일에 사용을 해보았다.
  - `watch` : Form에 입력한 입력값들의 변화를 관찰할 수 있게 해주는 함수. <br />
    (= console.log(event.currentTarger.value))
  - `handleSubmit` : form의 onSubmit 함수를 항상 만들었어야 했으나, handleSubmit으로 쉽게 가능. React-Hook-Form에서는 Validation, 유효성 검사를 담당하는 함수다.
    - handleSubmit을 호출할 때 2개의 인자를 받을 수 있다.
      1. 데이터가 유효할 때 호출되는 함수 (onValid) : _필수!_
      2. 데이터가 유효하지 않을 때, 에러일 때 호출되는 함수(onInvalid) : _필수는 아님_
  - `formState`: form 양식에 대한 정보를 모두 포함하는 메소드. 대표적으로 에러에 대한 내용들을 담고 있어 ES6 문법으로 error 표기를 위해 사용.
  - `setError` : 내가 원하는 아무 규칙에 따라 유효성검사 후 에러를 뱉어낼수 있게하는 메소드. 패스워드와 패스워드 체크가 일치하지않으면 에러를 뱉어내는데 사용을 해보았다.
    - name 작성 후 , message 객체 사용으로 에러 핸들링, shouldFocus는 에러난 input 창에 자동으로 focus 되는 기능
  - `validate` : 특정 값에 유효성 검사를 통과시키고 싶을 때 쓰는 기능. 함수형태로 쓰일 수 있으며, 우리 사이트에는 minjae라는 username은 가입을 못하게 하고 싶다는 조건으로 사용해보았다.
  - `setValue` : value 값을 수정할 수 있는 메소드. submit을 하고 나면 form을 초기화 시키는 조건으로 사용해보았다.

  ```tsx
  //TodoList.tsx
  import { useForm } from "react-hook-form";

  interface IForm {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    password1: string;
    extraError?: string;
  }

  function ToDoList() {
    const {
      register,
      watch,
      handleSubmit,
      formState: { errors },
      setError,
      setValue,
    } = useForm<IForm>({
      // defaultValues: 기본값 email input에 이제 @naver.com이 채워져있음
      defaultValues: {
        email: "@naver.com",
      },
    });

    const onValid = (data: IForm) => {
      if (data.password !== data.passwordCheck) {
        setError(
          "passwordCheck",
          { message: "패스워드와 패스워드 체크가 일치하지않습니다" },
          { shouldFocus: true }
        );
      }
      setError("extraError", { message: "Server Offline" });
      setValue("email", "");
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("userName", "");
      setValue("password", "");
      setValue("passwordCheck", "");
    };

    return (
      <>
        <form onsubmit={handleSubmit(onValid)}>
          <input
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@naver.com$/,
                message: "이메일은 Naver 주소만 허용됩니다.",
              },
            })}
            placeholder="Email"
          />
          <span>{errors?.email?.message}</span>
          <input
            {...register("firstName", { required: true })}
            placeholder="FirstName"
          />
          <span>{errors?.firstName?.message}</span>
          <input
            {...register("lastName", { required: true })}
            placeholder="LastName"
          />
          <span>{errors?.lastName?.message}</span>
          <input
            {...register("userName", {
              required: true,
              minLength: 2,
              maxLength: 16,
              validate: (value) =>
                value.includes("minjae")
                  ? "minjae라는 이름은 사용할수 없습니다."
                  : true,
            })}
            placeholder="UserName"
          />
          <span>{errors?.userName?.message}</span>
          <input
            {...register("password", {
              required: "패스워드를 입력해주세요.",
              minLength: {
                value: 5,
                message: "패스워드는 5자 이상이어야합니다.",
              },
            })}
            placeholder="Password"
          />
          <span>{errors?.password?.message}</span>
          <input
            {...register("passwordCheck", {
              required: "패스워드를 입력해주세요.",
              minLength: {
                value: 5,
                message: "패스워드는 5자 이상이어야합니다.",
              },
            })}
            placeholder="PasswordCheck"
          />
          <span>{errors?.passwordCheck?.message}</span>
          <button>Add</button>
          <span>{errors?.extraError?.message}</span>
        </form>
      </>
    );
  ```
