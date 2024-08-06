<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



# Dev
1. Clonar el proyecto
2. Copiar el archivo .env.template y renombrarlo a .env
3. Setear los valores de entorno de acuerdo al ambiente donde se está corriendo el proyecto en el nuevo archivo .env
4. Ejecutar:
```
yarn install
```

5. Levantar la imagen de BD usando Docker:
```
docker compose up -d
```

6. Correr el proyecto:
```
yarn start:dev
```