const owner = 'tinchods93';
let repos = JSON.parse(localStorage.getItem('repos')) || [];
const ultimoTrabajo = document.getElementById('ultimo-trabajo');
const ultimosTrabajos = document.getElementById('ultimos-trabajos');
const todosLosTrabajos = document.getElementById('todos-los-proyectos');
const newCard = (repo) => {
  return `<div class="card">
              <div class="card-header">
                <h4>${repo.name}</h4>
              </div>
              ${
                repo.description
                  ? `<div class="card-body">
                <p>
                  ${repo.description}
                </p>
              </div>`
                  : ''
              }
              <div class="card-footer">
                <!-- se justifica el uso de span porque cada uno indica uno tiene un estilo aplicado y no es simple texto -->
                ${
                  repo.languages
                    ? repo.languages
                        .map(
                          (language) =>
                            `<span class="repo-language">${language}</span>`
                        )
                        .join('')
                    : ''
                }
              </div>
            </div>`;
};

const getRepositories = async () => {
  if (!repos.length) {
    const repositories = await fetch(
      `https://api.github.com/users/${owner}/repos`
    ).then((res) => res.json());

    if (repositories.length) {
      repos = await Promise.allSettled(
        repositories.map(async (repo) => {
          const languages = await fetch(repo.languages_url)
            .then((res) => res.json())
            .then((data) => Object.keys(data))
            .catch(() => []);

          return {
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            languages,
          };
        })
      ).then((res) => res.map((r) => r.value));

      repos = repos?.filter((r) => r.owner?.login === owner);
      localStorage.setItem('repos', JSON.stringify(repos));
    } else {
      repos = [
        {
          name: 'Proyecto 1',
          description:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat dolorem nihil sint magnam aut ipsam voluptatem asperiores quos atque repellat.',
          url: 'https://www.github.com',
          languages: ['HTML', 'CSS', 'JavaScript'],
        },
        {
          name: 'Proyecto 2',
          description:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat dolorem nihil sint magnam aut ipsam voluptatem asperiores quos atque repellat.',
          url: 'https://www.github.com',
          languages: ['HTML', 'CSS', 'JavaScript'],
        },
        {
          name: 'Proyecto 3',
          description:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat dolorem nihil sint magnam aut ipsam voluptatem asperiores quos atque repellat.',
          url: 'https://www.github.com',
          languages: ['HTML', 'CSS', 'JavaScript'],
        },
      ];
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // Get the repositories

  await getRepositories();

  if (repos.length) {
    console.log('MARTIN_LOG=> repos 1', repos);
    ultimoTrabajo.innerHTML = newCard(repos[0]);
    ultimosTrabajos.innerHTML = `${newCard(repos[1])}${newCard(repos[2])}`;
    todosLosTrabajos.innerHTML = repos.map((repo) => newCard(repo)).join('');
  }
});
