import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";
import { FcPlus, FcPrevious } from "react-icons/fc";
import styled from "styled-components";
interface IForm {
  toDo: string;
}

const Form = styled.form`
  display: flex;
  align-items: center;
  & > button {
    background-color: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
  }
`;

function CreateToDo() {
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);

  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ]);
    setValue("toDo", "");
  };

  return (
    <Form onSubmit={handleSubmit(handleValid)}>
      <input style={{height:"30px"}}
        {...register("toDo", {
          required: "Please write a To Do",
        })}
        placeholder="Write a to do"
      />
      <button>
        <FcPlus size={28} />
      </button>
    </Form>
  );
}

export default CreateToDo;
