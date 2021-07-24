import { React, useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

import Tasks from './components/Tasks'
import AddTask from './components/AddTask';
import Header from './components/Header';
import TaskDetails from './components/TaskDetails';

import './assets/css/App.css'

const App = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)

    const override = `
        display: flex;
        margin: 3rem auto;
    `;

    useEffect(() => {
        fetchTasks();
    }, [])

    const fetchTasks = async () => {
        setLoading(true);
        const { data } = await axios.get(
            'https://crudcrud.com/api/727606583b3c409ba848c177a85a8516/task'
        );

        setTasks(data);
        setLoading(false);
    }

    const handleTaskClick = async (taskId) => {
        const newTasks = tasks.map((task) => {
            if (task._id === taskId) return { ...task, completed: !task.completed }

            return task;
        });

        setTasks(newTasks)
    }

    const handleTaskAddition = async (taskTitle) => {
        const body = {
            title: taskTitle,
            completed: false
        }

        const { data } = await axios.post(
            'https://crudcrud.com/api/727606583b3c409ba848c177a85a8516/task',
            body
        )

        setTasks([...tasks, data])
    }

    const handleTaskDeletion = async (taskId) => {
        await axios.delete(
            `https://crudcrud.com/api/727606583b3c409ba848c177a85a8516/task/${taskId}`
        )

        fetchTasks();
    }

    return (
        <Router>
            <div className="container">
                <Header />
                <Route
                    path="/"
                    exact
                    render={() => (
                        <>
                            <AddTask handleTaskAddition={handleTaskAddition} />
                            {loading ? (
                                <ClipLoader color={'#7fff00'} className="loading" css={override} loading={loading} size={30} />
                            ) : (
                                <>
                                    <Tasks
                                        loading={loading}
                                        tasks={tasks}
                                        handleTaskClick={handleTaskClick}
                                        handleTaskDeletion={handleTaskDeletion}
                                    />
                                </>
                            )}
                        </>
                    )}
                />
                <Route path="/:taskTitle" exact component={TaskDetails} />
            </div>
        </Router>
    );
}

export default App;