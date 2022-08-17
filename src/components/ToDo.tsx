import React from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Categories, IToDo, toDoState } from "../atoms";
import { FcCheckmark, FcCalendar, FcCancel, FcOvertime } from "react-icons/fc";

const ToDos = styled.div`
  display: flex;
  align-items: center ;
  justify-content: center;
  margin-top: 5px;
  font-size: 28px;
  font-weight: 400;
  & > li {
    list-style: none;
  }
  & > li > button {
    background-color: transparent;
    width: 28px;
    height: 28px;
    border: none;
    cursor: pointer;
  }
`;

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      const newToDo = { text, id, category: name as any };

      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };

  const deleteToDo = () => {
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      return [
        ...oldToDos.slice(0, targetIndex),
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };

  return (
    <ToDos>
      <li>
        <span>{text}</span>
        {category !== Categories.DOING && (
          <button name={Categories.DOING} onClick={onClick}>
            <FcOvertime size={24} />
          </button>
        )}
        {category !== Categories.TO_DO && (
          <button name={Categories.TO_DO} onClick={onClick}>
            <FcCalendar size={24} />
          </button>
        )}
        {category !== Categories.DONE && (
          <button name={Categories.DONE} onClick={onClick}>
            <FcCheckmark size={24} />
          </button>
        )}
        <button onClick={deleteToDo}>
          <FcCancel size={24} />
        </button>
      </li>
    </ToDos>
  );
}

export default ToDo;
