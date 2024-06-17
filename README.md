# Relatório do Projeto
Mateus Lemos Martins (a100645), 
 Rafael Vale da Costa Peixoto(a100754), 
 Guilherme Oliveira(a95021)
## Preparação do Dataset 

Dados os datasets que nos foram disponibilizados decidiamos pegar nesses 3 ficheiros JSON e fazer 2 novos(ucs.json e users.json) que serão os que irão ser utilizados no projeto. O ficheiro ucs.json tem informações das UCs como a sigla, título, docentes, horario, avaliação, datas e aulas.

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
    
    
    
  ## Arquitetura 
    
  ### 1. API de Gestão de UCs (apI)

A API é responsável por gerir as Unidades Curriculares (UCs). Utiliza o framework Express.js para construir endpoints RESTful que permitem a criação, leitura, atualização e eliminação (CRUD) de UCs.

#### Estrutura
- `controllers.js`:  Gere a lógica de negócio para as operações relacionadas com as UCs.
- `models/uc.js`: Define o schema da UC no MongoDB usando Mongoose.
- `routes/ucs.js`: Define os endpoints relacionados às UCs.
- `app.js`: Configura a aplicação Express, conecta à base de dados MongoDB e inicializa as rotas.

#### Funcionalidades

1. **Criar UC**: Permite a criação de uma nova UC.
2. **Ler UCs**: Permite a obtenção de todas as UCs ou uma UC específica.
3. **Atualizar UC**: Permite a atualização dos dados de uma UC específica.
4. **Eliminar UC**: Permite a eliminação de uma UC específica.

#### Permissões

- **Listar UCs**: Qualquer nível, porém aos Alunos apenas lhes são devolvidas as UCs que têm acesso
- **Obter UC**: Qualquer nível, porém aos Alunos apenas lhe é permitido obter a informação de uma UC que tenha acesso
- **Atualizar UC**: Apenas Administradores ou o Docente Criador da UC
- **Eliminar UC**: Apenas Administradores ou o Docente Criador da UC
(por fazer o que esta entre ///)
#### Dockerfiles
////

### Dockerfiles

##### Dockerfile

1. Atribui à pasta do container `/usr/src/app` o diretório de trabalho

2. Copia o package.json para o diretório de trabalho

3. npm install

4. Copia o resto dos ficheiros para o container

5. Expõe a porta 3124

6. npm start

##### Dockerfile-seed

1. Atribui à pasta do container `/data` o diretório de trabalho

2. Copia os ficheiros `ucs.json` e `users.json` para o diretório de trabalho do container

### 2. Sistema de Autenticação (auth)

#### Estrutura
-  controllers/user.js : Gere as operações relacionadas com os utilizadores.
- `models/user.js`: Define o schema do utilizador no MongoDB utilizando Mongoose e Passport-Local Mongoose.
- `routes/index.js`: Define os endpoints relacionados à autenticação e gestão de utilizadores.
- `middlewares/auth.js`: Middleware que implementa a verificação do token JWT.
- `app.js`: Configura a aplicação Express, conecta à base de dados MongoDB e inicializa as rotas.

#### Funcionalidades

1. **Registo de Utilizador**: Permite o registo de novos utilizadores.
2. **Login**: Inicia Sessão dos utilizadores e emite tokens JWT.
3. **Verificação de Token**: Verifica a validade dos tokens JWT e identifica utilizadores.

#### Permissões

Existem 3 níveis de acesso: Admin(nivel 3), Docente(nivel 2), Aluno(nivel 1).Além destes 3 niveis de acesso temos o atributo owner que apenas o criador duma UC consegue fazer alterações na mesma como adicionar aula, eliminar aula, editar UC ou editar UC.
////
#### Dockerfile

1. Atribui à pasta do container `/usr/src/app` o diretório de trabalho

2. Copia o package.json para o diretório de trabalho

3. npm install

4. Copia o resto dos ficheiros para o container

5. Expõe a porta 3123

6. npm start
/////


### 3. Interface do Utilizador(html)

#### Estrutura

- **views**: Contém os templates Pug para as diferentes páginas da aplicação.
- **routes**: Define as rotas que renderizam as páginas e processam formulários, verificando também as permissões.
- **styles**:  Contém os ficheiros CSS que definem os estilos visuais.
#### Funcionalidades

1. **Página Inicial**: Exibe uma lista de UCs aonde se vê informações como nome da UC e nome dos respetivos docentes. Permite ainda a pesquisa de uma UC e uma barra para digitar sigla duma UC que já tenha sido criada para assim o aluno adicionar uma UC à sua lista de UCs . Para finalizar ainda temos boões para adicionar UC , perfil e terminar sessão.
2. **Adicionar UC**: Formulário para adicionar novas UCs.
3. **Editar UC**: Formulário para editar UCs existentes.
4. **Conteúdo**: Permite o upload e download de ficheiros do utilizador / servidor.
5. **Obter Acesso a UC**: Formulário modal para inserir o código da UC para ter acesso à mesma.
6. **Perfil**: Visualizar o perfil do utilizador e adicionar foto ao perfil.
7. **Eliminar UC**: Permite eliminar uma UC
8. **Criar Aula**: Permite criar uma aula.
9. **Eliminar Aula**: Permite apagar uma aula.
#### Permissões

- **Fazer upload de ficheiros**: Apenas o Docente que criou a UC e Administrador
- **Obter Acesso a UC**: Apenas Alunos (Administradores e Docentes já têm acesso a todas as UCs)
- **Adicionar uma UC**: Apenas Docentes e Administrador
- **Editar uma UC**: Apenas o Docente que criou a UC e Administrador
- **Eliminar uma UC**: Apenas o Docente que criou a UC e Administrador
- **Criar Aula**: Apenas o Docente que criou a UC e Administrador
- **Eliminar Aula**: Apenas o Docente que criou a UC e Administrador
- **Adicionar Foto ao Perfil**: Todos os utiizadores

///#### Dockerfile

1. Atribui à pasta do container `/usr/src/app` o diretório de trabalho

2. Copia o package.json para o diretório de trabalho

3. npm install

4. Copia o resto dos ficheiros para o container

5. Expõe a porta 3123

6. npm start

///
////
## Configuração e Execução

### Pré-requisitos

- Docker
- Docker Compose

### Configuração do Ambiente

1. Instalação: Para instalar e configurar o projeto, utilize o script install.sh

```bash
./install.sh
```

2. Reinstalação: Para reinstalar o projeto, utilize o script reinstall.sh

```bash
./reinstall.sh
```

3. Desinstalação: Para desinstalar o projeto, utilize o script uninstall.sh

```bash
./uninstall.sh
```

### Utilização dos Scripts de Exportação e Importação

- Exportação de Dados: Para exportar dados do MongoDB, utilize o script export.sh

```bash
./export.sh <database_name>
```

- Importação de Dados (processo inverso): Para importar dados para o MongoDB, utilize o script import.sh

```bash
./import.sh <folder>
```

## Docker Compose

O ficheiro docker-compose.yml define os serviços necessários para a execução da aplicação.

### Serviços Definidos

- **mongo**: Serviço do MongoDB.
- **mongo-seed**: Serviço para popular o MongoDB com dados iniciais.
- **api-geradorucs**: Serviço da API de Gestão de UCs.
- **html-geradorucs**: Serviço da Interface de Utilizador.
- **auth-geradorucs**: Serviço de Autenticação.
/////



## Screenshots do WebSite

### Página de Boas-Vindas 

![Página de Boas-Vindas](./imagens/welcomePage.png)

### Página de Registo

![Página de Registo](./imagens/RegisterPage.png)

### Página de Login 

![Página Inicial (Administrador)](./imagens/LogInPage.png)

### Página de Perfil

![Página de Perfil](./imagens/perfil.png)

### Página Inicial Após Login

![Página Inicial Após Login](./imagens/PaginaPosLogin.png)


### Página de uma UC(Info geral)

![Página de uma UC(Info geral) ](./imagens/InfoGeraldumaUC.png)

### Página das Aulas de uma UC

![Página das Aulas de uma UC](./imagens/aulasDumaUC.png)


### Página do Conteúdo de uma UC

![Página do Conteúdo de uma UC](./imagens/conteudoDumaUC.png)

### Página de Criar Aula

![Página de Criar Aula](./imagens/criarAula.png)

### Página de Apagar UC

![Página de Apagar UC](./imagens/apagarumaUC.png)

### Página de Editar UC

### Página de Criar UC





