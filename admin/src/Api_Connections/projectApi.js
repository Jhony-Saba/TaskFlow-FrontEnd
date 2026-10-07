import axios from 'axios';
import { TokenManager } from '../Models/ManegeToken';

const Token = new TokenManager();
const API_URL = import.meta.env.VITE_APP_API_URL;



/**
 * Fetches all projects from the backend.
 * It sends a GET request to the project endpoint and includes the current auth token in the request header.
 * If the request succeeds, it returns the server response data; if it fails, it logs the error to the console.
 */
async function getProjects() {
 
  try {
    const response = await axios.get(`${API_URL}/project`, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}


/**
 * Creates a new project in the system.
 * It submits a POST request to the project API with the project title and context, along with the auth token.
 * When the server accepts the request, it returns the newly created project information.
 */
async function CreateProject({ title, context }) {
  try {
    const response = await axios.post(
      `${API_URL}/project`, { title, context }, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      }});

    return response.data;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}

/**
 * Deletes a project by its unique ID.
 * This sends a DELETE request to the project endpoint using the provided projectId, and it includes the token for authorization.
 * On success, it returns the response body returned by the API.
 */
async function DeleteProjectApi(projectId) {
  try {
    const response = await axios.delete(`${API_URL}/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}

/**
 * Updates an existing project record.
 * It sends a PUT request to the specific project URL, passing the updated title and context values in the body.
 * The function returns the API response data after a successful update and rethrows the error when the request fails.
 */
async function PutProject({ projectId, title, context }) {
  try {
    const response = await axios.put(`${API_URL}/project/${projectId}`,
       {
      title,
      context, },
     {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Retrieves all tasks assigned to the current project context.
 * This is a GET request to the task endpoint, and it uses the same auth header pattern as the other API calls.
 * The returned payload is the task data from the server, or the error is logged if the request fails.
 */
async function getProjectTasks() {
  try {
    const response = await axios.get(`${API_URL}/task`, {
      headers: {
        Authorization: `Bearer ${Token.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getProjects, CreateProject, PutProject, getProjectTasks, DeleteProjectApi };