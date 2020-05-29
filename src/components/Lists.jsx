import React, { useCallback, useState, useRef } from "react";
import Button from './Button/Button';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DoneIcon from '@material-ui/icons/Done';
import RemoveIcon from '@material-ui/icons/Remove';

const Lists = ({ data: todos, setData: setTodos, addTodo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const draggedTodo = useRef();
  const draggedNode = useRef();

  const handleDragEnter = useCallback((todo, index) => event => {
    event.preventDefault();
    if (draggedNode.current === event.target) return;

    let newTodos = [...todos];
    newTodos.splice(index, 0, newTodos.splice(draggedTodo.current, 1)[0]);
    setTodos((todo) => {
      draggedTodo.current = index;
      return newTodos;
    });
    localStorage.setItem('data', JSON.stringify(newTodos));
  }, [setTodos, todos]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    draggedTodo.current = null;
    draggedNode.current.removeEventListener('dragend', handleDragEnd);
    draggedNode.current = null;
  }, []);

  const handleDragStart = useCallback((todo, index) => event => {
    draggedTodo.current = index;
    draggedNode.current = event.target;
    draggedNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  }, [handleDragEnd]);

  const removeTodo = useCallback(todo => event => {
    const filteredTodos = todos.filter(other => other !== todo);
    setTodos(filteredTodos);
    localStorage.setItem('data', JSON.stringify(filteredTodos));
  }, [todos, setTodos]);

  const getClasses = useCallback((todo, index) => {
    const currentTodo = draggedTodo.current;
    if (currentTodo === index) return 'dragging';
    return null;
  }, []);

  return (
    <ul className={todos.length !== 0 ? 'divider' : null}>
      <TransitionGroup>
        {todos.map((todo, index) => (
          <CSSTransition key={todo.id} timeout={500} classNames='item'>
            <li 
              className={['container', isDragging ? getClasses(todo, index) : null].join(' ')} 
              onDragStart={handleDragStart(todo, index)}
              onDragEnter={isDragging ? handleDragEnter(todo, index) : null}
              draggable
            >
              <div className='li-container'>
                <DoneIcon 
                  className={['check', todo.done ? 'done-check' : null].join(' ')}
                  onClick={addTodo(todo, index)}
                />
                <div className={todo.done ? 'done-text' : 'done'}>
                  {todo.content}
                </div>
              </div>
              <Button 
                onClick={removeTodo(todo)} 
                text='delete' 
                icon={<RemoveIcon />} 
                classes='remove-button flex-align'
              />
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ul>
  );
};

export default Lists;