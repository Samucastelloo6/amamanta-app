FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Después del build, nunca antes: `npm ci` y `tsc` necesitan las dependencias
# de desarrollo, y con NODE_ENV=production npm no las instalaría.
#
# En ejecución, esto hace que la API no devuelva la traza del error al
# navegador cuando algo falla (ver error.middleware.ts) y que los registros
# usen el formato de producción. Sin esta línea, env.ts toma 'development'
# por defecto.
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]
