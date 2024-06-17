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
    │   ├── package.json
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
    
    
    
    
    
    
    
    
