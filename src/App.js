import React, { useState, useCallback, useEffect } from "react";
import Controls from "./components/Controls";
import Lists from "./components/Lists";
import Button from "./components/Button/Button";
import "./styles.scss";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineSharpIcon from "@material-ui/icons/DeleteOutlineSharp";
import { default as id } from "uuid4";
import moment from "moment";

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [allCheck, setAllCheck] = useState(null);

  const onNewTodoChange = useCallback(({ target: input }) => {
    setNewTodo(input.value);
  }, []);

  const checkAllDone = todos => {
    let allDoneValue = [];
    todos.map(todo => allDoneValue.push(todo.done));
    return allDoneValue.includes(false)
      ? setAllCheck(false)
      : setAllCheck(true);
  };

  const addTodo = useCallback(
    (todo, index) => event => {
      const newTodos = [...todos];
      newTodos.splice(index, 1, {
        ...todo,
        done: !todo.done
      });
      setTodos(newTodos);
      checkAllDone(newTodos);
      localStorage.setItem("data", JSON.stringify(newTodos));
    },
    [todos, setTodos]
  );

  const formSubmitted = useCallback(
    event => {
      event.preventDefault();
      if (!newTodo.trim()) return;
      const newTodos = [
        {
          id: id(),
          content: newTodo,
          done: false
        },
        ...todos
      ];
      setAllCheck(false);
      setTodos(newTodos);
      localStorage.setItem("data", JSON.stringify(newTodos));
      setNewTodo("");
    },
    [newTodo, todos]
  );

  const handleClear = useCallback(() => {
    setTodos([]);
    localStorage.removeItem("data");
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      setTodos(data);
      checkAllDone(data);
    } else setTodos([]);
  }, [allCheck]);

  return (
    <div onTouchStart="">
      <header className="fade-in">
        <h4>{moment().format("dddd, MMM D")}</h4>
        <h1>Todo List</h1>
      </header>

      <form
        onSubmit={formSubmitted}
        className="container"
        style={{ flexWrap: "nowrap" }}
      >
        <input
          id="newTodo"
          name="newTodo"
          className="fade-in"
          tabIndex="1"
          placeholder="Enter new todo ..."
          value={newTodo}
          onChange={onNewTodoChange}
        />
        <Button text="Add" icon={<AddIcon />} classes="add-button" />
      </form>

      <Controls
        data={todos}
        setData={setTodos}
        allCheck={allCheck}
        setAllCheck={setAllCheck}
      />

      <Lists data={todos} setData={setTodos} addTodo={addTodo} />

      <Button
        data={todos}
        classes="clear-button"
        onClick={handleClear}
        text="clear all todos"
        icon={<DeleteOutlineSharpIcon />}
      />
    </div>
  );
};

export default App;