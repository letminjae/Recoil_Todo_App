import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  const toDos = useRecoilValue(toDoState);

  return (
    <div>
      <h1>To Do List</h1>
      <hr />
      <CreateToDo />
      <ul>
        {toDos.map((toDo) => (
          <ToDo key={toDo.id} {...toDo} />
        ))}
      </ul>
    </div>
  );
}

// interface IForm {
//   email: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   password: string;
//   password1: string;
//   extraError?: string;
// }

// function ToDoList() {
//   const {
//     register,
//     watch,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<IForm>({
//     defaultValues: {
//       email: "@naver.com",
//     },
//   });

//   const onValid = (data: IForm) => {
//     if (data.password !== data.password1) {
//       setError(
//         "password1",
//         { message: "Password are not same" },
//         { shouldFocus: true },
//       );
//     }
//     setError("extraError", { message: "Server Offline" });
//   };

//   console.log(errors);

//   return (
//     <div>
//       <form
//         style={{ display: "flex", flexDirection: "column" }}
//         onSubmit={handleSubmit(onValid)}
//       >
//         <input
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[A-Za-z0-9._%+-]+@naver.com$/,
//               message: "Only naver.com emails allowed",
//             },
//           })}
//           placeholder="Email"
//         />
//         <span>{errors?.email?.message}</span>
//         <input
//           {...register("firstName", { required: "write here", validate: (value) => value.includes("minjae") ? "no minjaes allowed" : true })}
//           placeholder="First Name"
//         />
//         <span>{errors?.firstName?.message}</span>
//         <input
//           {...register("lastName", { required: "write here" })}
//           placeholder="Last Name"
//         />
//         <span>{errors?.lastName?.message}</span>
//         <input
//           {...register("username", { required: "write here", minLength: 10 })}
//           placeholder="Username"
//         />
//         <span>{errors?.username?.message}</span>
//         <input
//           {...register("password", { required: "write here", minLength: 5 })}
//           placeholder="Password"
//         />
//         <span>{errors?.password?.message}</span>
//         <input
//           {...register("password1", {
//             required: "Password is required",
//           })}
//           placeholder="Password1"
//         />
//         <span>{errors?.password1?.message}</span>
//         <button>Add</button>
//         <span>{errors?.extraError?.message}</span>
//       </form>
//     </div>
//   );
// }

export default ToDoList;
