import React, { useCallback } from "react";
import Button from "./Button/Button";
import RemoveIcon from "@material-ui/icons/Remove";
import DoneIcon from "@material-ui/icons/Done";

const Controls = ({
  data: todos,
  setData: setTodos,
  allCheck,
  setAllCheck
}) => {

  const checkNoDone = todos => {
    let allDoneValue = [];
    todos.map(todo => allDoneValue.push(todo.done));
    return allDoneValue.includes(true) ? false : true;
  };

  const setAllDone = useCallback(() => {
    const updatedTodos = todos.map(todo => {
      return {
        ...todo,
        done: true
      };
    });
    setTodos(updatedTodos);
    localStorage.setItem("data", JSON.stringify(updatedTodos));
  }, [todos, setTodos]);

  const setAllUndo = useCallback(() => {
    const updatedTodos = todos.map(todo => {
      return {
        ...todo,
        done: false
      };
    });
    setTodos(updatedTodos);
    localStorage.setItem("data", JSON.stringify(updatedTodos));
  }, [todos, setTodos]);

  const handleAll = useCallback(() => {
    if (!allCheck) {
      setAllCheck(!allCheck);
      return setAllDone();
    }
    setAllCheck(!allCheck);
    return setAllUndo();
  }, [allCheck, setAllCheck, setAllDone, setAllUndo]);

  const removeAllDone = useCallback(() => {
    const filteredTodos = todos.filter(other => other.done !== true);
    setTodos(filteredTodos);
    localStorage.setItem("data", JSON.stringify(filteredTodos));
  }, [todos, setTodos]);

  return (
    <div className="container" style={{ margin: "1em 0" }}>
      {todos.length > 1 ? (
        <Button
          data={todos}
          onClick={handleAll}
          text={allCheck ? "uncheck all" : "check all"}
          icon={allCheck ? null : <DoneIcon />}
          classes="all-button"
        />
      ) : (
        <div />
      )}

      {!checkNoDone(todos) && (
        <Button
          data={todos}
          onClick={removeAllDone}
          text="delete done"
          icon={<RemoveIcon />}
          classes="remove-button"
        />
      )}
    </div>
  );
};

export default Controls;