function updateTime() {
  const currentTimeElement = document.getElementById('current-time');
  const elapsedTimeElement = document.getElementById('elapsed-time');

  const now = new Date();
  const estOffset = -5 * 60; // utc-4
  const estTime = new Date(now.getTime() + (now.getTimezoneOffset() + estOffset) * 60000);
  const hours = String(estTime.getHours()).padStart(2, '0');
  const minutes = String(estTime.getMinutes()).padStart(2, '0');
  currentTimeElement.textContent = `${hours}:${minutes} est`;

  const startTime = new Date(sessionStorage.getItem('startTime') || now);
  sessionStorage.setItem('startTime', startTime);
  const elapsedTime = Math.floor((now - new Date(startTime)) / 1000);
  const elapsedMinutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const elapsedSeconds = String(elapsedTime % 60).padStart(2, '0');
  elapsedTimeElement.textContent = `${elapsedMinutes}:${elapsedSeconds}`;
}

if (!sessionStorage.getItem('startTime')) {
  sessionStorage.setItem('startTime', new Date());
}

setInterval(updateTime, 1000);
updateTime();

fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
      const projectsContainer = document.getElementById('projects');
      const totalProjects = projects.length;

      // get correct index with wrapping
      const getIndex = (index) => (index + totalProjects) % totalProjects;

      const createProjectElement = (project) => {
          const projectElement = document.createElement('div');
          projectElement.className = 'project flex flex-col items-center m-2 p-2 border border-gray-300 rounded';
          projectElement.innerHTML = `
              <a href="${project.link}" target="_blank">
                  <img src="${project.picture}" alt="${project.title}" class="w-24 h-24 object-cover rounded">
                  <div class="project-title text-center text-sm font-normal">${project.title}</div>
                  <div class="project-tech text-center font-thin text-xs">${project['tech-stack']}</div>
                  <div class="project-description text-center font-thin text-xs">${project.description}</div>
              </a>
          `;
          return projectElement;
      };

      const updateProjects = (startIndex) => {
          projectsContainer.innerHTML = '';
          for (let i = 0; i < 3; i++) {
              const projectIndex = getIndex(startIndex + i);
              const projectElement = createProjectElement(projects[projectIndex]);
              projectsContainer.appendChild(projectElement);
          }
      };

      let currentIndex = 0;
      updateProjects(currentIndex);

      const moveSlide = (direction) => {
          projectsContainer.classList.add('transition-transform', 'duration-500', 'ease-in-out');
          currentIndex = getIndex(currentIndex + direction);
          updateProjects(currentIndex);
      };

      document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
      document.querySelector('.next').addEventListener('click', () => moveSlide(1));
  })
  .catch(error => console.error('Error loading projects:', error));
