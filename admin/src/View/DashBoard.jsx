import { Route, Routes } from 'react-router-dom';
import { DisplayProjects, Header, AddProject, ProjectProvider } from '../PageComponents/DashboardCom';
import style from '../Styles/DashBoard.module.css';


function DashbordPage() {
  return (
    <div className={style.dashboardPage}>
      <ProjectProvider>
        <Header />
        <main className={style.dashboardMain}>
          <section className={style.dashboardHero}>
            <div>
              <p className={style.dashboardEyebrow}>Your workspace</p>
              <h2>Keep the important work moving.</h2>
              <p>Plan projects, track the next task, and see progress at a glance.</p>
            </div>
            <div className={style.dashboardHeroMark} aria-hidden="true">TF</div>
          </section>
          <Routes>
            <Route index element={<DisplayProjects />} />
            <Route path="add-project" element={<AddProject />} />
            <Route path="projects" element={<DisplayProjects />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </main>
      </ProjectProvider>
    </div>
  );
}

export default DashbordPage;
function NotFound(){
  return(<><p>Page not <i class="fa fa-cloud-download" aria-hidden="true">found </i></p></>)
}