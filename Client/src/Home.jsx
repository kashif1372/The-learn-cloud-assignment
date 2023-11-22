import React, { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";

function Home(){
    var [todos,setTodos] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3000/get')
        .then(result => setTodos(result.data))
        .catch(err => console.log(err))
    }, [])
    const dragItem = React.useRef(null);
    const dragOverItem = React.useRef(null);



  const handleSort = () => {
    //duplicate items
    let _todos = [...todos];

    //remove and save the dragged item content
    const draggedItemContent = _todos.splice(dragItem.current, 1)[0];

    //switch the position
    _todos.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setTodos(_todos);

    
  };

    function handleEdit(id){
        axios.put('http://localhost:3000/update/'+id)
        .then(result => {
            location.reload()
        })
        .catch(err => console.log(err))
    }
    function handleDelete(id){
        axios.delete('http://localhost:3000/delete/'+id)
        .then(result => {
            location.reload()
        })
        .catch(err => console.log(err))
    }
    return(
        <div className="home">
            <h2 className="heading">Todo-List</h2>
            <Create />
            {
                todos.length === 0 
                ?
                <div><h2>No record</h2></div>
                :
                todos.map((todo, index) => (
                    <div className="task"
                    key={index}
                    draggable
                    onDragStart={(e) => (dragItem.current = index)}
                    onDragEnter={(e) => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}>
                    
                        <div className="checkbox">
                        {todo.done
                            ? 
                            <input onChange={() => handleEdit(todo._id)} type="checkbox" id="myCheckbox" name="myCheckbox" checked/>
                            :
                            <input onChange={() => handleEdit(todo._id)} type="checkbox" id="myCheckbox" name="myCheckbox"/>
                        }
                        

                        <label htmlFor="myCheckbox" className={todo.done? "line_through" : ""}>{todo.task}</label>
                    </div>
                    <div>
                    <input onChange={() => handleDelete(todo._id)} type="checkbox"  name="myCheckbox2" />
                    </div>
                    </div>
                ))
            }
        </div>
        
    )
}

export default Home