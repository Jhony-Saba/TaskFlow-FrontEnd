import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProjects, CreateProject, DeleteProjectApi, PutProject } from '../Api_Connections/projectApi.js';
import { CreateTask, DeleteTask, PutTask, getTasks, getTasksStatistics } from '../Api_Connections/taskApi.js';
import { Project } from '../Models/Project.js';
import { Link, useNavigate } from 'react-router-dom';
import { Context, Deadline, SelectTaskStatus, Title } from '../Components/Inputs.jsx';
import { Task } from '../Models/Task.js';
import style from '../Styles/DashBoard.module.css'

const ProjectContext = createContext(null);

/**
 * Provides project refresh state to nested dashboard components.
 * Child components can trigger a data refresh by incrementing the shared context key.
 */
function ProjectProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Increments the shared refresh value so consumers reload project-related data.
   */
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

/**
 * Reads the shared project context and guards against misuse outside the provider.
 */
function UseProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectContext must be used inside ProjectProvider');
  }

  return context;
}

/**
 * Fetches and displays all projects in the dashboard grid.
 */
function DisplayProjects() {
  const [projects, setProjects] = useState([]);
  const { refreshKey } = UseProjectContext();
  const [loading, setloading]=useState(false);

  useEffect(() => {
    /**
     * Loads the current project list from the API and maps the response into project model objects.
     */
    const loadProjects = async () => {
       setloading(true);
      const data = await getProjects();
      if (data) {
        setloading(false);
        const mapped = data.map((item) => new Project(item.title, item.context, item._id));
        setProjects(mapped);
      }
    };

    loadProjects();
  }, [refreshKey]);

  return (<>
    {projects.length === 0 && loading && <>
    <div className={style.loadingSpinner}></div> 
         <p>Uploding ...</p></>}
    <section className={style.projectGrid}>
      
      {projects.length === 0 && 
      <p className={style.emptyState}>No projects yet. Add your first project above.</p>}
      {projects.slice(0,9).map((project) => (
        <article className={style.projectCard} key={project.projectid}>
          <div className={style.projectHeading}>
            <div>
              <p className={style.cardEyebrow}>Project</p>
              <h3>{project.title}</h3>
              <p className={style.projectContext}>{project.context || 'No project description yet.'}</p>
            </div>
            <DeleteProject projectId={project.projectid} />
          </div>
          <ProjectStatic projectId={project.projectid} />
          <EditProject project={project} />
          <DisplayTask projectId={project.projectid} />
        </article>
      ))}
    </section>
    </>
  );
}

/**
 * Renders an editable project form and updates the selected project when the form is submitted.
 */
function EditProject({ project }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [context, setContext] = useState(project.context || '');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  /**
   * Sends the updated project fields to the API and refreshes the project list on success.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || isRunning) return;

    setIsRunning(true);
    try {
      await PutProject({ projectId: project.projectid, title: title.trim(), context: context.trim() });
      setIsEditing(false);
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update project');
    } finally {
      setIsRunning(false);
    }
  };

  if (!isEditing) {
    return <button className={style.textButton} onClick={() => setIsEditing(true)}>Edit project</button>;
  }

  return (
    <form className={style.inlineForm} onSubmit={handleSubmit}>
      <Title title={title} setTitle={setTitle} />
      <Context context={context} setContext={setContext} />
      <button className={style.primaryButton} type="submit" disabled={isRunning} aria-busy={isRunning}>
        {isRunning ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Saving...</span> : 'Save project'}
      </button>
      <button className={style.secondaryButton} type="button" onClick={() => setIsEditing(false)} disabled={isRunning}>Cancel</button>
    </form>
  );
}

/**
 * Displays task completion statistics for a single project card.
 */
function ProjectStatic({ projectId }) {
  const [statics, setStatics] = useState(null);
  const { refreshKey } = UseProjectContext();

  useEffect(() => {
    /**
     * Fetches the latest task statistics for the given project and updates the UI summary.
     */
    const loadProjects = async () => {
      try {
        const data = await getTasksStatistics(projectId);
        if (data) {
          setStatics({
            tasks: data.totalTasks,
            toDoTasks: data.ToDoTasks ?? data.toDoTasks,
            percentage: data.percentage.toFixed(2),
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, [refreshKey, projectId]);

  if (!statics) {
    return <p className={style.loadingState}>Loading statistics...</p>;
  }

  return (
    <div className={style.projectStats}>
      <div className={style.statsHeader}>
        <h2>Project pulse</h2>
        <span>{statics.percentage}% complete</span>
      </div>
      <div className={style.statsGrid}>
        <div><strong>{statics.tasks}</strong><span>Total tasks</span></div>
        <div><strong>{statics.toDoTasks}</strong><span>To do</span></div>
        <div><strong>{statics.percentage}%</strong><span>Complete</span></div>
      </div>
    </div>
  );
}

/**
 * Deletes a project and triggers a refresh to update the dashboard list.
 */
function DeleteProject({ projectId }) {
  const { triggerRefresh } = UseProjectContext();
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Sends the delete request for the selected project and refreshes view state afterward.
   */
  const Deleteit = async () => {
    if (isRunning) return;

    setIsRunning(true);
    try {
      await DeleteProjectApi(projectId);
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete project');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <button className={style.iconButton} onClick={Deleteit} disabled={isRunning} aria-busy={isRunning}>
      {isRunning ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Deleting...</span> : 'Delete'}
    </button>
  );
}

/**
 * Renders the dashboard header with navigation and logout functionality.
 */
function Header() {
  const navigate = useNavigate();
   const [scrolled, setScrolled] = useState(false);
  /**
   * Clears the auth token and redirects the user back to the login screen.
   */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  useEffect(()=>{
    /**
     * Updates the header state when the page is scrolled to adjust styling.
     */
const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  },[]);

  return (
    <header className={scrolled ? style.scrollHeader : style.header}>
      <Link className={style.logo} to={'/dashboard/projects'}><span>TF</span>TaskFlow</Link>
      <nav className={style.headerNav} aria-label="Dashboard navigation">
        <Link to={'/dashboard/projects'}>Overview</Link>
        <Link to={'/dashboard/add-project'}>Projects</Link>
      </nav>
      <button className={style.logoutButton} onClick={handleLogout}>Log out</button>
    </header>
  );
}

/**
 * Creates a new project from the form input and refreshes the list on success.
 */
function AddProject() {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  /**
   * Validates the project fields, sends the project to the API, and resets the form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRunning) return;
      if (!title || title.trim().length < 3) {
    alert("Title must be at least 3 characters long");
    return;
  }
  if (!context || context.trim().length < 5) {
    alert("Context must be at least 5 characters long");
    return;
  }
     setIsRunning(true);
    try {
      const projectData = { title, context };
      
      await CreateProject(projectData);
      triggerRefresh();
      setTitle('');
      setContext('');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create project');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <form className={style.addProjectCard} onSubmit={handleSubmit}>
      <div className={style.addProjectHeading}>
        <div>
          <p className={style.cardEyebrow}>Start something new</p>
          <h2>Add a project</h2>
        </div>
        <span className={style.plusMark}>+</span>
      </div>
      <Title title={title} setTitle={setTitle} />
      <Context context={context} setContext={setContext} />
      <button className={style.primaryButton} type="submit" disabled={isRunning} aria-busy={isRunning}>
        {isRunning ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Adding project...</span> : 'Add Project'}
      </button>
    </form>
  );
}

/**
 * Adds a new task to a project using the task form values.
 */
function AddTask({ projectId }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  /**
   * Validates required task fields, submits the task to the API, and clears the form.
   */
const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRunning) return;
    if(!title || !projectId ||!status ||!deadline) return


    setIsRunning(true);
    try {
      const taskData = { title, projectId, status, deadline };
      await CreateTask(taskData);
      triggerRefresh();
      setTitle('');
      setStatus('To Do');
      setDeadline('');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create task');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <form className={style.taskForm} onSubmit={handleSubmit}>
      <Title title={title} setTitle={setTitle} />
      <SelectTaskStatus status={status} setStatus={setStatus} />
      <Deadline deadline={deadline} setDeadline={setDeadline} />
      <button className={style.primaryButton} type="submit" disabled={isRunning} aria-busy={isRunning}>
        {isRunning ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Adding task...</span> : 'Add Task'}
      </button>
    </form>
  );
}

/**
 * Displays all tasks belonging to a project and supports task visibility toggling.
 */
function DisplayTask({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const { refreshKey, triggerRefresh } = UseProjectContext();
  const [isVisible, setIsVisible] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    /**
     * Loads the project tasks from the backend and maps them to the task model.
     */
    const loadTasks = async () => {
      try {
        const data = await getTasks(projectId);
        if (data) {
          const mapped = data.map(
            (item) => new Task(item.title, item.status, item.projectId, item._id, formatDeadline(item.deadline))
          );
          setTasks(mapped);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();
  }, [projectId, refreshKey]);

  /**
   * Removes a task and refreshes the list after a successful delete.
   */
  const handleDelete = async (taskId) => {
    if (deletingTaskId) return;

    setDeletingTaskId(taskId);
    try {
      await DeleteTask(taskId);
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  /**
   * Toggles the task section open and closed so users can view or hide task details.
   */
  const handleVisible = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className={style.taskSection}>
      <button className={style.taskToggle} onClick={handleVisible} aria-expanded={isVisible}>
        {isVisible ? 'Hide tasks' : 'View tasks'} <span>{isVisible ? '^' : '+'}</span>
      </button>
      <div className={style.taskBody} hidden={!isVisible}>
        <AddTask projectId={projectId} />
        {tasks.map((task) => (
          <div className={style.taskItem} key={task.id}>
            <h3>{task.title}</h3>
            <p className={style.taskDeadline}>{task.deadline ? `Deadline: ${task.deadline}` : 'No deadline'}</p>
            <SelectTaskStatus status={task.status} />
            <div className={style.taskActions}>
              <EditTask task={task} />
              
              <button className={style.textButton} onClick={() => handleDelete(task.id)} disabled={deletingTaskId !== null} aria-busy={deletingTaskId === task.id}>
                {deletingTaskId === task.id ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Deleting...</span> : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Allows a task's title, status, and deadline to be updated inline.
 */
function EditTask({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  /**
   * Submits the edited task data to the backend and refreshes the task list.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || isRunning) return;

    setIsRunning(true);
    try {
      await PutTask({ taskId: task.id, title: title.trim(), status, deadline });
      setIsEditing(false);
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update task');
    } finally {
      setIsRunning(false);
    }
  };

  if (!isEditing) {
    return <button className={style.textButton} onClick={() => setIsEditing(true)}>Edit task</button>;
  }

  return (
    <form className={`${style.inlineForm} ${style.editTaskForm}`} onSubmit={handleSubmit}>
      <Title title={title} setTitle={setTitle} />
      <SelectTaskStatus status={status} setStatus={setStatus} />
      <Deadline deadline={deadline} setDeadline={setDeadline} />
      <button className={style.primaryButton} type="submit" disabled={isRunning} aria-busy={isRunning}>
        {isRunning ? <span className={style.buttonLoadingContent}><span className={style.loadingSpinner} aria-hidden="true" />Saving...</span> : 'Save task'}
      </button>
      <button className={style.secondaryButton} type="button" onClick={() => setIsEditing(false)} disabled={isRunning}>Cancel</button>
    </form>
  );
}

/**
 * Converts a raw deadline value to a compact YYYY-MM-DD string when present.
 */
function formatDeadline(deadline) {
  return deadline ? String(deadline).slice(0, 10) : '';
}

export { DisplayProjects,
     Header,
     AddProject, 
     ProjectProvider, 
     UseProjectContext };
