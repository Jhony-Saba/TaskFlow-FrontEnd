import axios from 'axios';
import { TokenManager } from '../Models/ManegeToken';
const API_URL = import.meta.env.VITE_APP_API_URL;
const Token = new TokenManager();

/**
 * Fetches all tasks belonging to a specific project.
 * It sends a GET request to the task endpoint for the given projectId and includes the authorization token in the header.
 * If the request succeeds, it returns the task list from the backend; otherwise it logs the error.
 */
async function getTasks(projectId){
try {
  const response =await axios.get(`${API_URL}/task/${projectId}`, 
        {headers:{Authorization:`Bearer ${Token.getToken()}`}});
       
        return response.data;
  
} catch (error) {
    console.error(error);
}
}
/**
 * Retrieves task progress statistics for a project.
 * This function calls the percentage endpoint for the selected project, reads the server response, and returns its data.
 * If the request fails, it logs the error and stops without throwing it.
 */
async function getTasksStatistics(projectId){
try {
  const response =await axios.get(`${API_URL}/task/percentage/${projectId}`,
    {headers:{Authorization:`Bearer ${Token.getToken()}`}});
  return response.data;
  
} catch (error) {
  console.log(error)
  
}

}
/**
 * Creates a new task for a project.
 * It sends a POST request with the task title, current status, projectId, and deadline in the request body.
 * On success, it returns the created task data from the API; on failure, it logs the error and shows an alert.
 */
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

/**
 * Deletes a task by its ID.
 * This function makes a DELETE request to the specific task endpoint and includes the auth token in the header.
 * If the request is successful, it returns the API response; otherwise it logs the error and shows an alert.
 */
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

/**
 * Updates an existing task.
 * It sends a PUT request to the task URL with the new title, status, and deadline values.
 * If the update succeeds, it returns the server response; if it fails, it logs the error and rethrows it.
 */
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