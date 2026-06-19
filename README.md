# Gestor de tareas para estudiantes

Aplicación simple de tareas construida con Next.js, Vercel y Supabase Auth/Postgres.

## Requisitos

- Node.js compatible con Next.js 16
- Cuenta/proyecto en Supabase
- Variables de entorno configuradas localmente y en Vercel

## Configuración local

Instalá dependencias:

```bash
npm ci
```

Copiá el ejemplo de variables y completalo con los valores de Supabase:

```bash
cp .env.example .env.local
```

Variables requeridas:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Ejecutá el servidor de desarrollo:

```bash
npm run dev
```

Abrí http://localhost:3000.

## Base de datos Supabase

La tabla `tasks`, sus índices y las policies de Row Level Security están en:

```txt
supabase/migrations/20260618210000_create_tasks.sql
```

Aplicá ese SQL en Supabase SQL Editor o con Supabase CLI. Las policies permiten que cada usuario autenticado lea, cree, actualice y elimine solo sus propias tareas.

## Deploy en Vercel

1. Importá el repositorio en Vercel.
2. Agregá las mismas variables de `.env.example` en Project Settings > Environment Variables.
3. Verificá que el proyecto de Supabase tenga aplicado el SQL de `supabase/migrations`.
4. Deploy.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

`/dashboard` está protegido con `proxy.ts`, que valida la sesión de Supabase antes de renderizar la ruta.

El build no depende de `next/font/google`, así que puede ejecutarse en entornos sin salida a Google Fonts.
