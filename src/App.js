import React, { useState,useEffect } from "react";
import './App.css'
import axios from 'axios'
export default function App() {

  const [Todolist, setTodolist] = useState([]) 
  const [Todohead, setTodohead] = useState("") 
  const [Todobody, setTodobody] = useState("")
  const [mode,setMode] = useState("post")
  const [index_for_edit,set_index_for_edit] = useState(0)
  const onSubmit = async(e) => {
    e.preventDefault();
    
    if(mode === "post"){
      setTodolist([...Todolist, { head: Todohead, body: Todobody }])
      const result = await axios.post(
        'http://127.0.0.1:8000/api/todecreate',
        {"body_list":Todobody,
        "head_list":Todohead}
      )
      console.log(result)
      if(result.data.resp.msg === "upload done"){
        alert("upload done")
      }
      else{
        alert("upload fail")
      }
    }
    else{
      const temp = [...Todolist]
      temp[index_for_edit].head = Todohead
      temp[index_for_edit].body = Todobody
      setTodolist([...temp])

      const result = await axios.post(
        'http://127.0.0.1:8000/api/todeupdate',
        {
          "id":Todolist[index_for_edit].seq,
          "body_list":Todobody,
          "head_list":Todohead
        }
      )
      setMode("post")
    }
    
  }

  const rainbowColors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#EE82EE"];

  useEffect(()=>{
      const fetchData = async () => {
        const result = await axios.get(
          'http://127.0.0.1:8000/api/todolist',
        );
        console.log(result.data.data)
        setTodolist([...result.data.data])
      }
      fetchData()
  },[])


  return (
    <div className="MainContainer">
      <h1>
        TodoList
      </h1>
      <div className="TodoContainer">
        {

    Todolist.map((val, index) => {
            return (
              <div>
                <div style={{ display: "flex" }}>
                  <div className="todo--card" style={{ backgroundColor: rainbowColors[index % 7] }} >
                    <h1>{index + 1} {val.head}</h1>
                    <p>{val.body}</p>
                  </div>
                  <button style={{ width: "5rem", borderStyle: "solid", borderRadius: "1rem", color: "white", backgroundColor: "red", marginBottom: "1rem" }}
                    onClick={ async () => {
                      const temp = Todolist.filter((v, i) => { return i != index })
                      setTodolist([...temp])

                      const result = await axios.post(
                        'http://127.0.0.1:8000/api/todedelete',
                        {"id":val.seq}
                      )
                      console.log(result.data)

                    }}>ลบ</button>
                  <button style={{ width: "5rem", borderStyle: "solid", borderRadius: "1rem", color: "black", backgroundColor: "yellow", marginBottom: "1rem" }}
                    onClick={() => {
                      setTodohead(Todolist[index].head)
                      setTodobody(Todolist[index].body)
                      set_index_for_edit(index)
                      setMode("edit")
                    }}>เเก้ไข</button>
                </div>
              </div>
            )
          })
        }
      </div>

      <form className="TodoContainer--input--zone" onSubmit={onSubmit}>

        <input value={Todohead} className="header--input" placeholder="ใส่หัวเรื่อง" onChange={(e) => { setTodohead(e.target.value) }} />
        <textarea value={Todobody} className="body--input" placeholder="ใส่เนื้อหา" onChange={(e) => { setTodobody(e.target.value) }}></textarea>
        <button className="body--submit" type="submit">
         {
          mode=="edit"?"save":"submit"
         } 
      
        </button>

      </form>
    </div>
  )
}


