import React from "react";
import { IToDo } from "../atoms";

function ToDo({ text }: IToDo) {
  return (
    <>
      <span>{text}</span>
      <button>To Do</button>
      <button>Doing</button>
      <button>Done</button>
    </>
  );
}

export default ToDo;
