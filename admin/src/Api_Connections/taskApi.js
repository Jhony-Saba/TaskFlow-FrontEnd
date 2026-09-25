import axios from 'axios';
import { TokenManager } from '../Models/ManegeToken';
const API_URL = import.meta.env.VITE_APP_API_URL;
const Token = new TokenManager();

async function getTasks(projectId){
try {
  const response =await axios.get(`${API_URL}/task/${projectId}`, 
        {headers:{Authorization:`Bearer ${Token.getToken()}`}});
       
        return response.data;
  
} catch (error) {
    console.error(error);
}
}
async function getTasksStatistics(projectId){
try {
  const response =await axios.get(`${API_URL}/task/percentage/${projectId}`,
    {headers:{Authorization:`Bearer ${Token.getToken()}`}});
  return response.data;
  
} catch (error) {
  console.log(error)
  
}

}
async function CreateTask({ title, projectId, status,deadline }) {
    try {
    const response = await axios.post(
     `${API_URL}/task/`, { title, status ,projectId ,deadline}, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      }});

    return response.data;
  } catch (error) {
    console.error(error);
    alert(error);
    // throw error;
  }
}

async function DeleteTask(taskId) {
      try {
    const response = await axios.delete(
  `${API_URL}/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      }});

    return response.data;
  } catch (error) {
    console.error(error);
    alert(error);
    // throw error;
  }
}

async function PutTask({ title,taskId,status ,deadline }) {
      try {
    const response = await axios.put(
  `${API_URL}/task/${taskId}`, { title, status ,deadline }, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      }});

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {CreateTask,DeleteTask,PutTask,getTasks,getTasksStatistics}