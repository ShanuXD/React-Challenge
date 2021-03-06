import {useState, useEffect, useRef} from 'react';
import './App.css';
import axios from 'axios'
const URL = "https://randomuser.me/api/?results=5"

function App() {
  const [users, setUsers] = useState([])
  const [people, setPeople] = useState([])
  const [locationHeaders, setLocationHeaders] = useState<string[]>([])
  const fetchUsers = useRef(()=>{})

  // flatten Object(remove nested Object)
  const flattenData = (obj:any)=>{
    let result:any = {}
    for (let key in obj){
      if(typeof obj[key]==='object'){
        result = {...result, ...flattenData(obj[key])}
      }
      else result[key] = obj[key]
    }
    return result;
  }

  const sortData = (sortKey:string)=>{

    const sortedUsers = [...people]

    if(sortedUsers[0]['direction']==="unsorted" || sortedUsers[0]['direction']==='ascending'){
      sortedUsers.forEach((user:any)=>user['direction']='decending')
      // decending

      sortedUsers.sort((a:any, b:any)=>{
        if ( a[sortKey] > b[sortKey] ) return -1;
        if ( a[sortKey] < b[sortKey] ) return 1;
        return 0;
      })
    }
    else{
      sortedUsers.forEach((user:any)=>user['direction']='ascending')
      // ascending
      sortedUsers.sort((a:any, b:any)=>{
        if ( a[sortKey] < b[sortKey] ) return -1;
        if ( a[sortKey] > b[sortKey] ) return 1;
        return 0;
      })

    }
    setPeople(sortedUsers)
  }
  // get all the keys of Object
  const getHeaders = (locationObject:any)=>{
    const location =  locationObject
    const falttenObject = flattenData(location)
    const headers:string[] = []
    for (let key in falttenObject) headers.push(key)
    setLocationHeaders(headers)
  }

  // Collecting Data from Api
    fetchUsers.current = async ()=>{
    const {data:{results}} = await axios.get(URL)
    getHeaders(results[0].location)
    const people = results.map((person:any, index:number)=>{
      const newDetails = flattenData(person.location)
      return {...newDetails, direction:"unsorted"}
    })
    setUsers(people)
    setPeople(people)
  }

  // search value in rows
  const handleChange = (e:any)=>{

    const searchValue = e.target.value
    const peopleList = [...users]
    // const fliterPeople = peopleList.filter((row)=> JSON.stringify(row).toLowerCase().includes(searchValue))
    const newFilterPeople = peopleList.filter((row)=>{
      return Object.values(row).some((str)=>(""+str).toLowerCase().includes(searchValue))
    })

    setPeople(newFilterPeople)
  }

  useEffect(() => {
    fetchUsers.current()
  }, [])

  if(users.length===0) return (<h1 className="App">Loading...</h1>)
  return (
    <>
    <input type="text" onChange={(e)=>handleChange(e)} />
      <table className="App">
        <thead>
          <tr>
            {locationHeaders.map((header, index)=>{
              return (
                <th onClick={()=>sortData(header)} key={index}>{header}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {people.map((person:any, index:number)=>{
            return (
            <tr key={index}>
              {locationHeaders.map((header:string, hederIdx:number)=>{
                return <td key={hederIdx}>{person[header]}</td>
              })}
            </tr>)
          })}
        </tbody>
      </table>
     
    </>
  );
}

export default App;
