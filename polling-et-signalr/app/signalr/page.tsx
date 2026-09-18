"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { UselessTask } from "../models/UselessTask";
import TaskView from "../_components/tasks-view";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {

  const [tasks, setTasks] = React.useState<UselessTask[]>([]);
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [nbConnexions, setNbConnexions] = useState(0);

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    let testTasks = new Array<UselessTask>(
          { id: 1, text: "Test Task 1", completed: false },
          { id: 2, text: "Test Task 2", completed: true });
        setTasks(testTasks);

    // TODO On doit commencer par créer la connexion vers le Hub
    let newHubConnection = new HubConnectionBuilder().withUrl("http://localhost:5042/taskHub").build();

    // TODO On peut commencer à écouter pour les messages qui vont déclencher des callbacks (Il y a seulement un message pour commencer)
    newHubConnection.on("TaskList", (data) => {
      setTasks(data);
    });

    newHubConnection.on("UserCount", (data) =>{
      setNbConnexions(data);
    });

    // TODO On doit ensuite se connecter
    newHubConnection.start().then(() => {
      console.log("La connexion est active");
    }).catch(err => console.log("Erreur : " + err));

    setHubConnection(newHubConnection);
  }

  function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
    hubConnection?.invoke("CompleteTask", id);
  }

  function handleTaskAdd(taskname: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    hubConnection?.invoke("AddTask", taskname);
  }

  return (
    <div className="p-4">
        <h1>SignalR!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
        <p>nb utilisateur : {nbConnexions}</p>
    </div>
  );
}