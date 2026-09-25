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
          <AddProject />
          <DisplayProjects />
        </main>
      </ProjectProvider>
    </div>
  );
}

export default DashbordPage;
