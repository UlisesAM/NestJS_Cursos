# NestJS - Fazt Code

> [youtube curse](https://www.youtube.com/watch?v=wsqcg5ZtUMM)

# Instalación

```bash
# version de nodeJs usada : 20.11
npm i -g @nestjs/cli

nest -v
# out: 11.0.6
```

# ⚙️ CLI rápido

```bash
nest new project-name              # Crear un nuevo proyecto

nest generate module users         # Crear módulo, out:"users/users.module.ts"
# nest g mo users

nest generate controller users     # Crear controlador, out:"users/users.controller.ts"
# nest g co users

nest generate service users        # Crear servicios, out:"users/users.service.ts"
# nest g s users
```

# Crear proyecto

```bash
nest new <project-name>

# Arrancar proyecto
npm run start # nest start

# para tanspilar el codigo en un folder a parte dist/
npm run build # nest build
```

## 🧱 Estructura básica de un proyecto

Nest usa una arquitectura modular inspirada en Angular, perfecta para escalar apps grandes.

```bash
src/
├── app.controller.ts    # Maneja las rutas y solicitudes HTTP
├── app.module.ts        # Módulo raíz que agrupa los componentes
├── app.service.ts       # Lógica de negocio reutilizable
└── main.ts              # Punto de entrada de la aplicación
```

# 🚀 Bootstrap de la app `main.ts`

Aquí se crea y lanza la aplicación Nest. Puedes usar app.use() para middlewares, configurar CORS, etc.

```typescript
// main.ts
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
```

# 🧩 Módulos (Modules)

Todo en Nest vive dentro de módulos. Son como contenedores de funcionalidades relacionadas.

```typescript
@Module({
	imports: [], // Importa otros módulos
	controllers: [AppController], // Controladores del módulo
	providers: [AppService], // Servicios disponibles en el módulo
})
export class AppModule {}
```

# 📡 Controladores (Controllers)

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

## `@Body()`

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

## `@Query()`

Usado para leer la URL query de una petición http

```typescript
// GET http://localhost:3000/task?limite=3
@Get()
getAllTask(@Query() query: any) {
	console.log(query); // query.limite
	return this.taskService.getTask();
}
```

## `@Param`

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

# 🛠️ Servicios (Services)

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

## 🔗 Inyección de dependencias

Nest inyecta instancias automáticamente. Aquí se inyecta UserService al constructor del controlador.

```typescript
@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}
}
```

# 📦 DTOs (Data Transfer Objects)

Un DTO define la forma de los datos que espera recibir una petición, útil para validaciones con **class-validator**.  
Por si solo, solo serviría para poder obtener autocompletado en variables en código

```typescript
// dto/createTask.dto.ts
export class CreateTaskDto {
	title: string;
	status: boolean;
}

// task.controller.ts
@Post()
createTask(@Body() task: CreateTaskDto) {
	return this.taskService.createTask(task);
}

// task.service.ts
createTask(task: CreateTaskDto) {
	return 'crear tarea';
}
```

## DTO's Validations

[Validation nestJS](https://docs.nestjs.com/techniques/validation)

Instalar  
`npm i --save class-validator class-transformer`

En nuestros archivos de DTO's usaremos `class-validator`

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Max(120)
	age: number;

	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

// user.controller.ts - implementado en controller
import {
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
...
@Post()
@UsePipes(new ValidationPipe())
createUser(@Body() user: CreateUserDto) {
	return this.userService.create(user);
}
```

> HINT: Sí queremos usarlo de manera global en todo el proyecto, sin tener que agregar `@UsePipes(new ValidationPipe())` a cada función de los controladores, lo agregaremos al bootstrap de la app en `main.ts`

```typescript
// validator antes del listener
app.useGlobalPipes(
	new ValidationPipe({
		whitelist: true, // Opcional, evita parametros extra en un request body
	})
);
```

# Http status errors

```typescript
import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("test")
export class TestController {
	@Get("notfound")
	@HttpCode(404)
	notFoundPage() {
		return "not found page";
	}

	@Get("errorPage")
	@HttpCode(500)
	errorPage() {
		return "error Route!!";
	}

	@Get("new")
	@HttpCode(201)
	someThing() {
		return "Something new";
	}
}
```

# 🧪 Pipes (Validación / transformación)

Pipes permiten validar o transformar datos entrantes

## En URL Params

```typescript
// test.controller.ts
import {
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
...
@Get('ticket/:num')
getNumber(@Param('num', ParseIntPipe) num: number) {
	return num + 8;
}

@Get('active/:status')
isUserActive(@Param('status', ParseBoolPipe) status: boolean) {
	console.log(typeof status);
	return status;
}
```

## Personalizado

`nest g pipe <path/name>`  
ej: `nest g pipe test/pipes/ValidarUser`

```typescript
// pipes/validar-user.pipe.ts
@Injectable()
export class ValidarUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const ageNumber = parseInt(value.age.toString());

    if (isNaN(ageNumber)) {
      throw new HttpException('Age must be a number', HttpStatus.BAD_REQUEST);
    }

    return { ...value, age: ageNumber };
  }
}

// test.controller.ts
@Get('greet')
greet(@Query(ValidarUserPipe) query: { name: string; age: number }) {
    console.log(typeof query.name); // string
    console.log(typeof query.age); // number
	return `hello ${query.name}, your are ${query.age} old`;
}
```

# 🔒 Guards (Autorización)

Los guards deciden si se permite acceder a una ruta. Ideal para manejar roles o tokens JWT.

`nest g guard <path/name>`  
ej: `nest g guard test/guard/auth`

```typescript
// guard/auth.guard.ts
// Sí retornamos false, el flujo termina. Sí no este continuara
@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest() as Request;
		console.log(req.headers); // out: /test/greet?name=ulises&age=22

		if (req.url === "/test/greet") return false; // termina request en error

		if (!req.headers["validar"]) return false; // termina request en error

		return true; // continua con la lógica
	}
}

// test.controller.ts
@Get('greet')
@UseGuards(AuthGuard)
greet(@Query() query: { name: string }) {
	return `hello ${query.name}`;
}
```
