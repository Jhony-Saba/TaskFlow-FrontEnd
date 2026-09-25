import axios from 'axios';
import { TokenManager } from '../Models/ManegeToken';

const Token = new TokenManager();
const API_URL = import.meta.env.VITE_APP_API_URL;



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