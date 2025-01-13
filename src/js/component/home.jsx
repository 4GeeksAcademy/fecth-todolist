import React, { useState, useEffect } from "react";


const Home = () => {
    const [tarea, setTarea] = useState("");
    const [listaTareas, setListaTareas] = useState([]);

    /// Esta funcion obtiene todas las tareas del servidor.
    function getTodoList() {

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("https://playground.4geeks.com/todo/users/JesusF", requestOptions)
            .then((response) => {
                (response);
                if (response.status === 404) {
                    createrUser()

                }
                return response.json()
            })
            .then((result) => setListaTareas(result.todos))
            .catch((error) => console.error(error));
    }

    // esta funcion crea un usuario en caso de que no exista. (funciona)
    function createrUser() {
        const requestOptions = {
            method: "POST",
            redirect: "follow"
        };

        fetch("https://playground.4geeks.com/todo/users/JesusF", requestOptions)
            .then((response) => {

                console.log(response);
                if (response.status === 404) {
                    getTodoList()

                } return response.json()
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }




    useEffect(() => {
        getTodoList();

    }, [])


    //  funcion  agregar tareas(funciona)
    const agregarTarea = (e) => {
        if (e.key === "Enter" && tarea !== "") {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "label": tarea,
                "is_done": false
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://playground.4geeks.com/todo/todos/JesusF", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setListaTareas([...listaTareas, result])
                    setTarea("");
                })

                .catch((error) => console.error(error));

        }

        //     {


        // //     setListaTareas([...listaTareas, tarea]);
        // // setTarea(""); 
        // }
    };



    // funcion para eliminar tareas (funciona)

    const eliminarTarea = (index) => {
        const nuevasTareas = listaTareas.filter((_, i) => i !== index);
        setListaTareas(nuevasTareas);

        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`https://playground.4geeks.com/todo/todos/${index}`, requestOptions)
            .then((response) => response.text())
            .then((result) => getTodoList(result))
            .catch((error) => console.error(error));
    };


    return (
        <div className="container mt-5">
            <h1>Mi lista de tareas</h1>
            <input
                type="text"
                onChange={(e) => setTarea(e.target.value)}
                value={tarea}
                placeholder="Escribe una tarea"
                onKeyDown={agregarTarea}
            />
            <p><strong>Tareas pendientes: </strong>{listaTareas.length}</p> {/* Aquí agregamos el contador de tareas */}
            <ul className="list-group mt-3">



                {listaTareas.length > 0 ? listaTareas.map((item) =>
                    <li className="list-group-item d-flex justify-content-between"
                        key={item.id}>{item.label} <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarTarea(item.id)}
                        >
                            X
                        </button> </li>) : null}
            </ul>
        </div>

    );
};

export default Home;
