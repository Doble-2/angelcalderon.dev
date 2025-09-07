# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Contact API (Enviar correos desde el formulario)

Este proyecto incluye un endpoint `POST /api/contact` que puede enviar correos usando SendGrid (recomendado) o SMTP vía `nodemailer`.

Pasos rápidos:

1. Copia `.env.example` a `.env` y rellena las variables necesarias.
2. Instala dependencias (añadimos `nodemailer` en package.json):

```bash
pnpm install
```

3. Ejecuta el servidor en local:

```bash
pnpm run dev
```

4. Prueba el endpoint con curl:

```bash
curl -X POST http://localhost:4173/api/contact -H 'Content-Type: application/json' -d '{"name":"Test","email":"test@example.com","message":"Hola desde curl"}'
```

Si `SENDGRID_API_KEY` está presente, se usa SendGrid; si no, el servidor intenta usar `nodemailer` con las variables `SMTP_*`.

### Configurar SMTP con Namecheap

Si tu buzón está en Namecheap, usa estos valores típicos (verifica en tu panel de Namecheap si son distintos):

- SMTP_HOST: mail.tudominio.com (o mail.namecheaphosting.com)
- SMTP_PORT: 587
- SMTP_SECURE: false
- SMTP_USER: tu_correo@tudominio.com
- SMTP_PASS: tu_contraseña_de_correo

Ejemplo usando el script de prueba:

```bash
SMTP_HOST=mail.tudominio.com SMTP_PORT=587 SMTP_SECURE=false SMTP_USER=tu@dominio.com SMTP_PASS='tu-pass' FROM_EMAIL=tu@dominio.com TO_EMAIL=tu@dominio.com node scripts/test-smtp.js
```

Si el envío funciona, ahora el endpoint `/api/contact` podrá enviar correos usando las mismas variables de entorno.
