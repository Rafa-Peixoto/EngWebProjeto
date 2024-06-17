# Relatório do Projeto
Mateus Lemos Martins (a100645)
Rafael Vale da Costa Peixoto(a100754)
Guilherme Oliveira(a)
## Preparação do Dataset e do Povoamento Inicial

Dado o dataset que nos foi disponibilizado (um ficheiro json para cada UC), decidimos juntar tudo em um único ficheiro json, em forma de array. Alteramos também os docentes, representando-os dentro da UC apenas com a sua sigla. Criamos também outro ficheiro json (que corresponde a outra coleção) para armazenar os docentes (que, neste caso, são utilizadores do sistema, com permissões de Docente, exceto o professor José Carlos Ramalho que tem permissões de AdminDocente (Docente + Administrador)).

Posteriormente, decidimos baixar todos os ficheiros relativos às 3 UCs que estavam presentes nos datasets, copiando-os para a pasta `public/filesUploaded/jcr`. Isto significa que os ficheiros foram carregados para o site pelo professor com a sigla `jcr` (mais abaixo é explicado como funciona o sistema de ficheiros).

Em relação à verificação de ficheiros contra o manifesto, achamos que não seria necessário neste contexto, dado que os docentes podem carregar qualquer tipo de ficheiro para a sua pasta (para disponibilizar nos sumários) e apenas o seu nome (do ficheiro) é necessário.




## Estrutura do Projeto

O projeto é uma aplicação web completa que integra várias partes para fornecer um sistema de gestão de Unidades Curriculares (UCs). A aplicação é composta por três componentes principais: API, Autenticação e Interface de Utilizador. Abaixo, encontra-se uma visão detalhada:

    ├── api
    │   ├── bin
    │   │   └── www
    │   ├── controllers
    │   │   └── uc.js
    │   ├── models
    │   │   └── uc.js
    │   ├── routes
    │   │   └── ucs.js
    │   ├── app.js
    │   ├── package-lock.json
    │   └── package.json
    ├── auth
    │   ├── bin
    │   │   └── www
    │   ├── config
    │   │   └── user.js
    │   ├── controllers
    │   │   └── user.js
    │   ├── middlewares
    │   │   └── auth.js
    |    │   ├── middlewares
    │   │   └── auth.js
    |    │   ├── models
    │   │   └── user.js
    |   │   ├── routes
    │   │   └── users.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── testComparePasswords.js
    ├── datasets
    │   ├── dataset.json
    │   └── dataset2.json
    ├── html
    │   ├── bin
    │   │   └── www
    │   ├── public
    │   │   ├── filestore
    │   │       └── photos
    │   │   ├── images
    │   │       └── defaultuser.png
    |   |       └── entrada-da-universidade-do-minho_661c0d3ecb4f7.png
    │   │   ├── stylesheets
    │   │       └── style.css
    |   |       └── w3.css
    │   ├── routes
    │   │   └── auth.js
    |   |   └── index.js
    |   ├── uploads
    │   ├── views
    │   │   └── apagarUC.pug
    |   │   └── aulas.pug
    │   │   └── conteudo.pug
    |   │   └── criarAula.pug
    │   │   └── criarUC.pug
    |   │   └── editarAula.pug
    │   │   └── error.pug
    │   │   └── geral.pug
    |   │   └── indexUC.pug
    │   │   └── layout.pug
    |   │   └── login.pug
    │   │   └── paginaUC,pug
    |   │   └── perfil.pug
    │   │   └── register.pug
    │   │   └── welcomepage.pug     
    │   ├── app.js
    │   ├── package-lock.json
    │   └── package.json
    ├── .env
    ├── dokcer-compose.yml
    ├── Relatório.md
    ├── setup-container.py
    ├── ucs.json
    └── users.json
    
    
    
    
    
    
    
    
