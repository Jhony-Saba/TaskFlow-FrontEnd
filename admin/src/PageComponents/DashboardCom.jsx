import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProjects, CreateProject, DeleteProjectApi, PutProject } from '../Api_Connections/projectApi.js';
import { CreateTask, DeleteTask, PutTask, getTasks, getTasksStatistics } from '../Api_Connections/taskApi.js';
import { Project } from '../Models/Project.js';
import { Link, useNavigate } from 'react-router-dom';
import { Context, Deadline, SelectTaskStatus, Title } from '../Components/Inputs.jsx';
import { Task } from '../Models/Task.js';
import style from '../Styles/DashBoard.module.css'

const ProjectContext = createContext(null);

function ProjectProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

function UseProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectContext must be used inside ProjectProvider');
  }

  return context;
}

function DisplayProjects() {
  const [projects, setProjects] = useState([]);
  const { refreshKey } = UseProjectContext();

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjects();
      if (data) {
        const mapped = data.map((item) => new Project(item.title, item.context, item._id));
        setProjects(mapped);
      }
    };

    loadProjects();
  }, [refreshKey]);

  return (
    <section className={style.projectGrid}>
      {projects.length === 0 && <p className={style.emptyState}>No projects yet. Add your first project above.</p>}
      {projects.map((project) => (
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
  );
}

function EditProject({ project }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [context, setContext] = useState(project.context || '');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

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
      <button className={style.primaryButton} type="submit" disabled={isRunning}>{isRunning ? 'Saving...' : 'Save project'}</button>
      <button className={style.secondaryButton} type="button" onClick={() => setIsEditing(false)} disabled={isRunning}>Cancel</button>
    </form>
  );
}

function ProjectStatic({ projectId }) {
  const [statics, setStatics] = useState(null);
  const { refreshKey } = UseProjectContext();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getTasksStatistics(projectId);
        if (data) {
          setStatics({
            tasks: data.totalTasks,
            toDoTasks: data.ToDoTasks ?? data.toDoTasks,
            percentage: data.percentage,
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

function DeleteProject({ projectId }) {
  const { triggerRefresh } = UseProjectContext();

  const Deleteit = async () => {
    await DeleteProjectApi(projectId);
    triggerRefresh();
  };

  return <button className={style.iconButton} onClick={Deleteit} aria-label="Delete project">Delete</button>;
}

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };
  return (
    <header className={style.header}>
      <Link className={style.logo} to={'/dashboard/projects'}><span>TF</span>TaskFlow</Link>
      <nav className={style.headerNav} aria-label="Dashboard navigation">
        <Link to={'/dashboard/projects'}>Overview</Link>
        <Link to={'/dashboard/add-project'}>Projects</Link>
      </nav>
      <button className={style.logoutButton} onClick={handleLogout}>Log out</button>
    </header>
  );
}

function AddProject() {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    const projectData = { title, context };
    await CreateProject(projectData);
    triggerRefresh();
    setTitle('');
    setContext('');
    setIsRunning(false);
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
      <button className={style.primaryButton} type="submit" disabled={isRunning}>
        {isRunning ? 'Adding project...' : 'Add Project'}
      </button>
    </form>
  );
}

function AddTask({ projectId }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    const taskData = { title, projectId, status, deadline };
    await CreateTask(taskData);
    triggerRefresh();
    setTitle('');
    setStatus('To Do');
    setDeadline('');
    setIsRunning(false);
  };

  return (
    <form className={style.taskForm} onSubmit={handleSubmit}>
      <Title title={title} setTitle={setTitle} />
      <SelectTaskStatus status={status} setStatus={setStatus} />
      <Deadline deadline={deadline} setDeadline={setDeadline} />
      <button className={style.primaryButton} type="submit" disabled={isRunning}>
        {isRunning ? 'Adding task' : 'Add Task'}
      </button>
    </form>
  );
}

function DisplayTask({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const { refreshKey, triggerRefresh } = UseProjectContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  const handleDelete = async (taskId) => {
    await DeleteTask(taskId);
    triggerRefresh();
  };

  const handleVisible = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className={style.taskSection}>
      <button className={style.taskToggle} onClick={handleVisible} aria-expanded={isVisible}>
        {isVisible ? 'Hide tasks' : 'View tasks'} <span>{isVisible ? '−' : '+'}</span>
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
              
              <button className={style.textButton} onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditTask({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [isRunning, setIsRunning] = useState(false);
  const { triggerRefresh } = UseProjectContext();

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
      <button className={style.primaryButton} type="submit" disabled={isRunning}>{isRunning ? 'Saving...' : 'Save task'}</button>
      <button className={style.secondaryButton} type="button" onClick={() => setIsEditing(false)} disabled={isRunning}>Cancel</button>
    </form>
  );
}

function formatDeadline(deadline) {
  return deadline ? String(deadline).slice(0, 10) : '';
}

export { DisplayProjects, Header, AddProject, ProjectProvider, UseProjectContext };
