# ARCHIVE-09 // PROTOCOLO SIGHTLESS

> *"Usted no está observando la transmisión. La transmisión ya registró su ubicación."*

Este repositorio es la base de un archivo interactivo de terror analógico y conspiración secreta, pensado para expandirse de forma modular exactamente como la Fundación SCP o la wiki de Los Backrooms, pero con estética de volante fotocopiado en mimeógrafo, cinta magnética VHS degradada y vigilancia paranoica de baja frecuencia.

Acá no hay nada de colores pastel ni interfaces amables.. el diseño está clavado en un monocromo de alto contraste puro (negros de brea, grises carbón y blancos tiza), con ruido xerox, geometrías de logia oculta y figuras encapuchadas que no se mueven de la niebla.

---

## 👁️ De qué carajo trata el universo (El Lore)

El proyecto gira en torno a **ARCHIVE-09** (también conocido como *Iniciativa Sightless* o *Sector 04-Ω*): un organismo clandestino sin fecha de creación clara que intercepta señales de transmisiones de origen no humano ni terrestre, pero registradas en cintas magnéticas de 35mm y casetes VHS fechados entre 1978 y 2008.

Los principios fundacionales de este universo son estos:

1. **La mirada es bidireccional:** Todo dispositivo que reproduce la señal (pantallas CRT, monitores de circuito cerrado, volantes impresos) actúa como una mirilla desde el otro lado. Si mirás la geometría central, la pupila te sigue la pista.
2. **Los Testigos (Entidad-03):** Figuras antropomorfas encapuchadas o con cascos sellados que aparecen inmóviles en terrenos baldíos, patios de hormigón brutalista y subestaciones eléctricas cuando la temperatura baja de cero. No hablan, no atacan.. solo hacen de anclaje para la señal.
3. **Cintas sin expurgar:** Las cintas recuperadas bajo tierra no se pueden borrar ni quemar. Cada intento de desmagnetizarlas provoca fallas de tracking y quemaduras en los operadores.
4. **La Frecuencia 1420.405 MHz:** Una portadora sub-grave constante (alrededor de los 54 Hz) que no transporta audio convencional sino inducción estática y zumbido analógico.

---

## 📂 Cómo está armado el proyecto hoy

A diferencia de proyectos pesados llenos de dependencias al pedo, esto está construido con HTML crudo, CSS vanilla y JavaScript nativo para que corra al instante en cualquier navegador sin instalar nada raro:

- `index.html`: Estructura semántica del expediente. Contiene los filtros SVG procedurales (`#chalk-sketch` y `#xerox-distort`) que le dan a las líneas vectoriales esa textura áspera de marcador y tiza sobre fotocopia gastada.
- `style.css`: Motor visual de alto contraste. Maneja el grano animado, las scanlines de monitor de tubo catódico, las marcas de doblado de papel en cruz, las barras de tracking de VHS y el modo invertido (`mode-invert`) que pasa la web a volante de papel blanco con tinta negra corrida.
- `script.js`: Toda la interactividad viva:
  - **Trigonometría ocular:** La pupila del ojo ocultista calcula el ángulo y la distancia de tu cursor en pantalla para clavarte la mirada adonde vayas.
  - **Sintetizador de cinta (Web Audio API):** Genera oscilador sub-grave a 54.2 Hz con modulación LFO, ruido rosa pasado por filtro pasabanda para simular el soplido de la cinta magnética y medidor de señal activo. Cero archivos MP3 externos.
  - **Desclasificación de censura:** Bloques de texto tachados que se revelan al hacerles click.
  - **Reloj VHS en vivo:** Contador con código de tiempo y fotogramas en milisegundos.
- `assets/surveillance_figure.jpg`: Fotograma de vigilancia de 35mm recuperado con los tres testigos encapuchados en niebla.

---

## 🗃️ Estructura para expandirlo (Formato SCP / Backrooms)

Para que esto crezca en comunidad y no quede como una página suelta, vamos a organizar las entradas en expedientes clasificados bajo esta taxonomía:

```text
/
├── index.html                  # Terminal principal de acceso y sintonizador
├── style.css                   # Sistema de diseño monocromo analógico
├── script.js                   # Mecánicas de tracking y audio
├── assets/                     # Metraje recuperado, escaneos y fotografías
└── records/                    # Expedientes clasificados (tipo SCP / Niveles)
    ├── REC-001-THE-WITNESSES/  # Los 3 observadores del brutalismo
    ├── REC-004-FREQUENCY-MAP/  # Mapa espectrográfico de la portadora
    ├── REC-019-THE-APERTURE/   # La lente que no se puede cerrar
    └── TEMPLATE-EXPEDIENTE.md  # Plantilla para redactar nuevos casos
```

### Clasificación de Amenaza / Anomalía

En vez de Safe/Euclid/Keter, acá usamos estados de señal y retención:

- **SILENTE:** La señal está capturada y confinada en bobina magnética fría. No emite radiación visible.
- **INTERCEPTADO:** La señal se filtró a monitores públicos o canales de TV abierta durante la madrugada. Se requiere corte de energía zonal.
- **VINCULADO:** El espectador estableció contacto visual directo con la apertura central por más de 12 segundos. La pupila no vuelve a soltar el objetivo.
- **EXPURGO IMPOSIBLE:** Anomalía que corrompe el soporte físico que intenta grabarla.

---

## 📝 Plantilla de Expediente (Para sumar nuevas entradas)

Cualquier nuevo caso que redactemos tiene que respetar esta estructura de reporte confidencial:

```markdown
### EXPEDIENTE: [CÓDIGO-NUMÉRICO] // [NOMBRE CLAVE]
**NIVEL DE EMBARGO:** [Nivel 1 al 5]
**SOPORTE DE RECUPERACIÓN:** [Cinta VHS / Bobina 35mm / Fotocopia mimeografiada / Transmisión UHF]
**ESTADO DE SEÑAL:** [Silente / Interceptado / Vinculado / Expurgo Imposible]

#### 1. REGISTRO VISUAL
[Descripción del metraje encontrado, hora, grano, condiciones climáticas]

#### 2. PROTOCOLO DE CONFINAMIENTO DE SEÑAL
[Instrucciones frías y paranoicas sobre qué hacer para que la señal no se propague]

#### 3. TRANSCRIPCIÓN DEL INCIDENTE
[Diálogos entrecortados, ruidos de estática, marcas de censura [REDACTADO], coordenadas]

#### 4. NOTAS AL MARGEN (MANUSCRITO)
"Anotaciones desesperadas dejadas por el operador de turno antes de apagar la consola."
```

---

## 🚀 Hoja de Ruta (Hacia dónde vamos)

- [x] Consola central con ojo ocultista que sigue el puntero del mouse.
- [x] Generador de audio de baja frecuencia nativo con Web Audio API.
- [x] Modo negativo de volante fotocopiado (Xerox Invert).
- [x] Panel de monitor CCTV con metraje de Los Testigos.
- [ ] **Directorio interactivo de Cintas (Tapes Index):** Selector lateral para cambiar entre canales (CH-01 al CH-12) y cargar distintos incidentes.
- [ ] **Sistema de audio polifónico:** Agregar voces distorsionadas de emisoras de números (Numbers Stations) sintetizadas con código morse o fonemas fonéticos.
- [ ] **Expedientes interactivos individuales:** Páginas estilo informe confidencial desclasificado con fotos de evidencia generadas en alto contraste.
- [ ] **Terminal de comandos cruda:** Consola oculta accesible tocando alguna tecla para meter códigos y desbloquear cintas prohibidas.

---

> **AVISO:** No apague el sincronizador horizontal. Si la pantalla parpadea en negro, no mire hacia atrás.
