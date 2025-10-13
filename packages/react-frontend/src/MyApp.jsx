// packages/react-frontend/src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const API = "http://localhost:8000";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    return fetch(`${API}/users`);
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    return fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then(async (res) => {
        if (res.status === 201) {
          const created = await res.json(); 
          setCharacters((prev) => [...prev, created]);
        } else {
          console.log("POST failed with status:", res.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(id) {
    fetch(`${API}/users/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((c) => c._id !== id));
        } else if (res.status === 404) {
          console.log("Delete failed: resource not found");
        } else {
          console.log("Delete failed with status:", res.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
