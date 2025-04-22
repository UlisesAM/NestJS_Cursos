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

Los controladores manejan las rutas y peticiones HTTP. Usan decoradores como @Get, @Post, etc.

```typescript
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

	@Post()
	create(@Body() body: CreateUserDto) {
		return body;
	}
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
nest generate controller users     # Crear controlador, out:"users/users.controller.ts"
nest generate service users        # Crear servicios, out:"users/users.service.ts"
```
