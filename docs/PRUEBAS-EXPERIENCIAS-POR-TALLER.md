# Pruebas en local: experiencias por taller

Guía para probar en local los cambios de experiencias antes de desplegarlos.
Cuando termines y esté todo bien, puedes borrar este archivo.

## Qué se ha cambiado

Las experiencias de talleres se asocian ahora a un taller concreto: el
formulario público obliga a elegirlo, la página pública las agrupa por taller
con su media, y desde el panel se pueden editar y asignar el taller a las
experiencias antiguas que no lo tienen. Los textos tienen límite de 2000
caracteres con contador visible.

Salas universitarias, espacios amigos y voluntariado hospitalario **no cambian**.

Archivos tocados: los seis del módulo `experiences` del backend, los dos modelos
y el servicio de experiencias del frontend, y los componentes de formulario,
sección pública y panel de experiencias.

---

## 1. Antes de empezar

### Dependencias

El frontend ya está instalado. Falta el backend:

```powershell
cd C:\PERSONAL\amamanta-app\amamanta-app\backend
npm install
```

### Si `npm run build` falla por esbuild

En la instalación del frontend salió el aviso
`5 packages have install scripts not yet covered by allowScripts`, y esbuild es
uno de ellos. Angular compila con esbuild, así que si su script de instalación
no llegó a ejecutarse, el build fallará diciendo que no encuentra el binario:

```powershell
cd C:\PERSONAL\amamanta-app\amamanta-app
npm install-scripts approve esbuild
npm install
```

---

## 2. Base de datos

`backend\.env` ya apunta a la base de **producción** en Atlas, que es lo que
queremos: así pruebas con los talleres y las experiencias reales, y el trabajo
de asignar taller a las experiencias antiguas lo haces de verdad mientras
pruebas, no dos veces.

No hay que tocar nada. Dos cosas a tener en cuenta mientras trabajas así:

- Lo que envíes desde el formulario **aparece al momento en app.amamanta.es**.
  Apunta las experiencias de prueba que crees y bórralas desde el panel al
  terminar.
- Antes de tocar el botón Eliminar, asegúrate de que es una tuya de prueba y no
  un testimonio real de una familia. No hay papelera.

---

## 3. Arrancar

Dos terminales, una para cada cosa:

```powershell
# Terminal 1 — API en http://localhost:3000
cd C:\PERSONAL\amamanta-app\amamanta-app\backend
npm run dev
```

```powershell
# Terminal 2 — App en http://localhost:4200
cd C:\PERSONAL\amamanta-app\amamanta-app
npm start
```

Comprobación rápida de que la API responde:

```powershell
curl.exe http://localhost:3000/api/health
```

Antes de nada, que compile todo sin errores:

```powershell
cd C:\PERSONAL\amamanta-app\amamanta-app\backend
npm run typecheck

cd C:\PERSONAL\amamanta-app\amamanta-app
npm run build
```

---

## 4. Qué probar

### A. Formulario público de talleres

`http://localhost:4200/experiencias/workshops/compartir`

- [ ] Aparece el desplegable **"¿A qué taller has asistido?"** encima de las estrellas.
- [ ] Cada opción se lee como `Nombre — Martes 10:00`, y los talleres online llevan `· Online`.
- [ ] Solo salen talleres activos. Desactiva uno en el panel y comprueba que desaparece de la lista.
- [ ] Pulsar "Enviar experiencia" sin elegir taller abre el aviso **"Selecciona el taller"**, no el de la valoración.
- [ ] Con taller elegido pero sin estrellas, sale el aviso de la valoración.
- [ ] Con taller y estrellas, se envía y sale el modal de agradecimiento.

### B. Contador de caracteres

- [ ] Debajo de cada etiqueta se ve `0 / 2000`, y sube según escribes.
- [ ] Pega un texto de más de 2000 caracteres: el textarea corta en 2000. No se puede pasar.
- [ ] Al llegar a los últimos 100 caracteres, el contador se pone rojo y aparece "Te quedan N caracteres".

### C. Regresión: los otros tres tipos

`/experiencias/rooms/compartir`, `/experiencias/friendly-spaces/compartir`,
`/experiencias/hospitals/compartir`

- [ ] **No** aparece ningún desplegable de taller.
- [ ] Se envían igual que siempre, solo con estrellas y textos.
- [ ] El contador de caracteres sí funciona también aquí.

### D. Página pública agrupada

`http://localhost:4200/experiencias/workshops`

- [ ] Las experiencias salen agrupadas, una sección por taller.
- [ ] Cada sección muestra el nombre del taller, su media (`4,5 ★`) y cuántas valoraciones tiene.
- [ ] Arriba hay un desplegable "Filtrar por taller" que deja ver solo uno.
- [ ] Las experiencias antiguas sin taller salen agrupadas al final como **"Sin taller indicado"**.
- [ ] Los talleres salen en orden alfabético.
- [ ] En `/experiencias/rooms` y las otras dos, se ve la rejilla de tarjetas de siempre, sin agrupar.

### E. Panel de administración

`http://localhost:4200/admin/experiencias`

- [ ] Con la pestaña "Talleres LM" activa aparece el desplegable de filtro por taller, con el recuento de cada uno.
- [ ] Si hay experiencias sin asignar, sale el aviso ámbar arriba con el número y el botón "Ver solo esas".
- [ ] Pulsar ese botón filtra directamente a las que faltan.
- [ ] En las tarjetas sin taller, el botón se llama **"Asignar taller"**; en las demás, "Editar".
- [ ] Al abrir el modal, el formulario viene precargado con los valores actuales.
- [ ] Asignar un taller a una experiencia antigua la guarda, y al recargar la página pública ya aparece dentro de ese taller.
- [ ] Cambiar estrellas y textos se guarda.
- [ ] Vaciar un texto y guardar elimina ese bloque de la tarjeta.
- [ ] Intentar guardar una experiencia de taller sin taller elegido muestra el error dentro del modal y no cierra.
- [ ] Los contadores de 2000 caracteres funcionan también aquí.
- [ ] Las cifras de "Experiencias mostradas" y "Valoración media" se recalculan con el filtro aplicado.
- [ ] Cambiar de pestaña reinicia el filtro de taller.
- [ ] **Regresión:** el botón Eliminar sigue funcionando igual que antes.
- [ ] **Regresión:** al editar una experiencia de salas, espacios u hospitales no aparece ningún campo de taller.

### F. Comprobaciones de API (opcional)

```powershell
# Las experiencias de talleres vuelven con su taller
curl.exe "http://localhost:3000/api/experiences?type=workshops"

# Filtrado por taller
curl.exe "http://localhost:3000/api/experiences?workshopId=PEGA_AQUI_UN_ID"

# Sin taller en una experiencia de talleres: debe devolver 400
curl.exe -X POST http://localhost:3000/api/experiences -H "Content-Type: application/json" -d "{\"type\":\"workshops\",\"rating\":5}"

# Editar sin sesión: debe devolver 401
curl.exe -X PATCH http://localhost:3000/api/experiences/ID -H "Content-Type: application/json" -d "{\"rating\":4}"
```

---

## 5. Desplegar

**Primero el backend, después el frontend.** El orden importa: el frontend nuevo
envía el campo `workshopId`, y el backend antiguo rechaza cualquier campo que no
conozca. Si despliegas el frontend primero, fallarían **todos** los envíos de
experiencias, de los cuatro tipos, hasta que suba el backend.

Al derecho no hay problema serio: quien tenga la PWA antigua en caché podría
recibir un error al enviar una experiencia de taller hasta que su navegador
actualice la aplicación, cosa de minutos.

Como has probado contra la base de producción, al desplegar ya te encuentras los
datos tal y como los dejaste: las experiencias que hayas asignado a su taller
salen agrupadas desde el primer momento.

Despliega desde una rama, no directamente sobre `main`:

```powershell
cd C:\PERSONAL\amamanta-app\amamanta-app
git checkout -b experiencias-por-taller
git add -A
git commit -m "Agrupar experiencias por taller y permitir editarlas desde el panel"
```

---

## 6. Deshacer

Si algo no convence, desde la raíz del proyecto:

```powershell
git checkout -- .
```

Eso devuelve los archivos al estado anterior a estos cambios.
