class Project { 



  constructor(title, context, projectid) {
    this.title = title;
    this.context = context;
    this.projectid = projectid; // keep projectid private
    
  }


 

  // update project title
  updateTitle(newTitle) {
    this.title = newTitle;
    return `Title updated to ${this.title}`;
  }

  // update project context
  updateContext(newContext) {
    this.context = newContext;
    return `Context updated to ${this.context}`;
  }

  // show project info
  getInfo() {
    return `ProjectID: ${this.projectid}, Title: ${this.title}, Context: ${this.context}`;
  }
}

export { Project };

