<center><h1> Configurando o projeto GymPOINT - Backend <h1></center>

## Backend

<p>Após download do repositório, acesse a pasta backend, dentro dela existe arquivo oculto com o nome <strong>.env</strong>, nele
estão todas as informações necessárias para executar o projeto como esperado, abaixo segue alguns passos para configuração:

> Para executar é preciso ter instalado e rodando na máquina o PostgreSQL e Redis.</p>

#### 1 - Passo (SOMENTE SE ESTIVER COM O DOCKER INSTALADO E RODANDO, CASO CONTRÁRIO, pule essa etapa)

> OBS: Todos os comandos aqui apresentados é esperado que sejam executados em um ambiente de linha de comando, como terminal por exemplo.
> Também não irei detalhar especificamente o que cada comando faz

<p>Com o comando abaixo teremos disponível um container rodando uma imagem do PostgreSQL na porta 5432, com usuário: postgres, e senha: postgres</p>

`docker run --name database -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:11`

<p>Com o comando abaixo teremos disponível um container rodando uma imagem do Redis na porta 6379, não tem usuário e senha.</p>

`docker run --name redis -p 6379:6379 -d -t redis:alpine`

Após isso para ver os containers criados digite o comando:
`docker ps -a`

<p>Os containers serão listados, cada um possui um CONTAINER ID, anote os 3 primeiros digitos de cada um, será necessário para iniciar os mesmos.</p>

Para iniciar as imagens digite:
`docker start 'três_primeiros_digitos'` (execute duas vezes, uma para o container do Postgre, e outra para o Redis).

Para verificar se os containers estão ativos e rodando use o comando:
`docker ps`

#### 2 - Passo

Conecte no PostgreSQL com a ferramenta de sua preferência e crie um banco de dados com o commando:
`create database gympoint`

#### 3 - Passo

<p>Abra o arquivo .env que mencionamos logo acima em um editor de texto de sua preferência, vamos configurá-lo...</p>

<p>Em <strong>DB_HOST</strong> dever ser inserido o endereço do banco de dados, se estiver rodando local, pode ser colocado 'localhost' por exemplo, sem as aspas.</p>

<p>Em <strong>DB_USER</strong> deve ser inserido o usuário do banco de dados.</p>

<p>Em <strong>DB_PASS</strong> deve ser inserido a senha do banco de dados.</p>

<p>Em <strong>DB_NAME</strong> deve ser inserido o nome do banco de dados.</p>

<p>Em <strong>REDIS_HOST</strong> deve ser inserido o endereço do Redis</p>

<p>Em <strong>REDIS_PORT</strong> deve ser inserido a porta do Redis</p>

> OBS: O Redis é utilizado apenas para o envio de e-mail, o mesmo é dispensável, já no Postgre é indispensável.

Execute o seguinte comando para que seja criada as tabelas no banco de dados:
`yarn sequelize db:migrate`

Execute o seguinte comando para que seja criado um usuário padrão:
`yarn sequelize db:seed:all`

o usuário criado é:
<strong>Nome:</strong> Administrador
<strong>email:</strong> admin@gympoint.com (usado para login)
<strong>senha:</strong> 123456

Feito todos os passos anteriores considerando que tudo deu certo, acesse a pasta backend por linha de comando e execute o comando para subir o projeto:
`yarn dev`

E o seguinte comando para iniciar o serviço para envio de e-mail. (somente se estiver configurado o Redis):
`yarn queue`
