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
nest new project-name         	# Crear un nuevo proyecto

nest generate module <name>    	# Crear módulo, out:"users/users.module.ts"
# nest g mo <name>

nest generate controller <name>	# Crear controlador, out:"users/users.controller.ts"
# nest g co <name>

nest generate service <name>   	# Crear servicios, out:"users/users.service.ts"
# nest g s <name>

nest g resource <name> 			# genera todo lo anterior en un solo paso
# nest g res <name>
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

Estos errores son desde el código si queremos retornar error programaticamente.  
Estos están en la librería `'@nestjs/common'`

```typescript
// Error Genérico
throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

// Errores específicos
throw new NotFoundException("Not Found");
throw new BadRequestException('not found');
throw new ForbiddenException('forbidden');
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

# 🛡️ Middleware

Middleware funciona antes de que llegue al controlador. Útil para logs, auth, headers, etc.

`nest g middleware <path/name>` o shorthand `nest g mi <path/name>`  
ej: `nest g middleware user/logger` out: src/user/logger/logger.middleware.ts

```typescript
// user/logger/logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express"; // agregamos esto para autocomplete código

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		console.log("middleware:", req.originalUrl);

		next();
	}
}
```

```typescript
// user/auth/auth.middleware.ts
import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		const { validador } = req.headers;

		if (!validador) {
			throw new HttpException("No autorizado", HttpStatus.UNAUTHORIZED);
		}

		if (validador !== "xyz") {
			throw new HttpException("Prohibido", HttpStatus.FORBIDDEN);
		}

		next();
	}
}
```

```typescript
// user.module.ts
export class UserModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware) // reglas de LoggerMiddleware
			.forRoutes(
				{ path: 'user', method: RequestMethod.POST },
				{ path: 'user/hi', method: RequestMethod.GET },
			)
			.apply(AuthMiddleware) // reglas de AuthMiddleware
			.forRoutes('user');
}
```

1. Implementar `NestModule` a la clase del module
2. Agregamos función `configure(consumer: MiddlewareConsumer)` para poder configurar sus middlewares
3. Agregar middlewares con `.apply(...)`
4. Especificamos a que routes o http methods se aplicara el middleware con `.forRoutes`

# Resource CLI command

Esto nos ayuda a crear todo nuestro modulo con module, controller, service, DTO's, etc..

`nest g resource <name>` o shorthand `nest g res <name>`

ej: `nest g resource pagos`

-   pregunta por que tipo de recurso usaras (RestAPI, GraphQL, WebSocket, Microservice non-http)
-   pregunta sí creara un CRUD o no

Output:

-   pagos.module
-   pagos.controller
-   pagos.service
-   archivos de pruebas
-   DTO's
-   Entities

# Swagger

[Go to doc official](https://docs.nestjs.com/openapi/introduction#setup-options)

Instalar : `npm install --save @nestjs/swagger`

### Configuración

abrir en http://localhost:3000/swagger

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
...
// 		swagger config
const config = new DocumentBuilder()
	.setTitle("API de NestJS")
	.setDescription("Curso de NestJS")
	.setVersion("1.0")
	.build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup("swagger", app, documentFactory); // ir a http://localhost:3000/swagger
```

### Swagger comentarios y mas...

```typescript
// controller.ts
@Get('/:id')
@ApiOperation({ summary: 'Ver una tarea por id' })
@ApiResponse({ status: 200, description: 'retorna una tarea' })
@ApiResponse({ status: 404, description: 'not found' })
getTask(@Param('id') ID: string) {
  return this.taskService.getTask(parseInt(ID));
}
```

# CORS

[Official Doc](https://docs.nestjs.com/security/cor)  
[main.ts - código ejemplo](myfirst-app/src/main.ts)  
De este modo permite cualquier dominio puede hacer un request al API

```typescript
// main.ts - bootstrap
app.enableCors();
```

De este modo podemos decirle que dominios pueden hacer request al API. Podemos poner un array de strings o un string solamente también

```typescript
// main.ts - bootstrap
app.enableCors({
	origin: ["http://example.com", "https://www.google.com"],
});
```
