# NestJS

## instalación

```bash
# version de nodeJs usada : 20.11
npm i -g @nestjs/cli

nest -v
# out: 11.0.6
```

## Crear proyecto

```bash
nest new <project-name>

# Arrancar proyecto
npm run start # nest start

# para tanspilar el codigo en un folder a parte dist/
npm run build # nest build
```

### 🧱 Estructura básica de un proyecto

Nest usa una arquitectura modular inspirada en Angular, perfecta para escalar apps grandes.

```bash
src/
├── app.controller.ts    # Maneja las rutas y solicitudes HTTP
├── app.module.ts        # Módulo raíz que agrupa los componentes
├── app.service.ts       # Lógica de negocio reutilizable
└── main.ts              # Punto de entrada de la aplicación
```

### main.ts 🚀 Bootstrap de la app

Aquí se crea y lanza la aplicación Nest. Puedes usar app.use() para middlewares, configurar CORS, etc.

```typescript
// main.ts
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
```

### 🧩 Módulos (Modules)

Todo en Nest vive dentro de módulos. Son como contenedores de funcionalidades relacionadas.

```typescript
@Module({
	imports: [], // Importa otros módulos
	controllers: [AppController], // Controladores del módulo
	providers: [AppService], // Servicios disponibles en el módulo
})
export class AppModule {}
```

### 📡 Controladores (Controllers)

Los controladores manejan las rutas y peticiones HTTP. Usan decoradores como @Get, @Post, @Put, @Patch, @Delete, etc.

```typescript
import { Controller, Get, Post } from "@nestjs/common";

@Controller("users")
export class UserController {
	@Get()
	findAll() {
		return "All users";
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return `User #${id}`;
	}

	@Get("/hola")
	sayHi() {
		return `Hi user`;
	}

	@Post()
	create(@Body() body: CreateUserDto) {
		return body;
	}
}
```

#### `@Body()`

Usado para obtener el **Request Body** de una petición http

```typescript
// POST http://localhost:3000/task
// Content-Type: application/json
// {
//     "title":"testing",
//     "status": true
// }
@Post()
createTask(@Body() task: any) {
	return this.taskService.createTask(task);
}
```

#### `@Query()`

Usado para leer la URL query de una petición http

```typescript
// GET http://localhost:3000/task?limite=3
@Get()
getAllTask(@Query() query: any) {
	console.log(query); // query.limite
	return this.taskService.getTask();
}
```

#### `@Param`

Usado para leer URL params en nuestra petición.

`@Get('/:id')` → Configurar el decorador http con una variable genérica, esta sera con dos puntos y el nombre `:nombre`.  
Este nombre tambien se usara para _param_ así `@Param('id')`

```typescript
// GET http://localhost:3000/task/2
@Get('/:id')
getTask(@Param('id') ID: string) {
	return this.taskService.getTask(parseInt(ID));
}
```

### 🛠️ Servicios (Services)

Los servicios manejan la lógica de negocio. Son inyectables y reutilizables entre controladores y otros servicios.

```typescript
@Injectable()
export class UserService {
	private users = [];

	findAll() {
		return this.users;
	}
}
```

#### 🔗 Inyección de dependencias

Nest inyecta instancias automáticamente. Aquí se inyecta UserService al constructor del controlador.

```typescript
@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}
}
```

### 📦 DTOs (Data Transfer Objects)

```typescript
export class CreateUserDto {
	name: string;
	age: number;
}
```

## ⚙️ CLI rápido

```bash
nest new project-name              # Crear un nuevo proyecto

nest generate module users         # Crear módulo, out:"users/users.module.ts"
# nest g mo users

nest generate controller users     # Crear controlador, out:"users/users.controller.ts"
# nest g co users

nest generate service users        # Crear servicios, out:"users/users.service.ts"
# nest g s users
```
