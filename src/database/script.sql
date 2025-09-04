-- ===========================
-- Sección 1: Municipios
-- ===========================
CREATE TABLE Municipios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    activo BOOLEAN
);

INSERT INTO Municipios (nombre, slug, lat, lng, activo) VALUES
('San Pedro de Macorís', 'SPM', 18.4500, -69.3000, TRUE),
('Santo Domingo', 'SD', 18.4861, -69.9312, TRUE),
('Santiago de los Caballeros', 'STI', 19.4500, -70.7000, TRUE),
('La Romana', 'LR', 18.4300, -68.9700, TRUE),
('Puerto Plata', 'PP', 19.7900, -70.6900, TRUE);

-- ===========================
-- Sección 2: Usuarios y Roles
-- ===========================
CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('cliente','administrador')),
    password_hash TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    municipio_id INT REFERENCES Municipios(id) ON DELETE SET NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
    tipo_cliente VARCHAR(20) NOT NULL CHECK (tipo_cliente IN ('persona','empresa')),
    telefono VARCHAR(20),
    direccion VARCHAR(100) NOT NULL,
    verificado BOOLEAN DEFAULT FALSE
);

CREATE TABLE ClientesPersona (
    cliente_id INT PRIMARY KEY REFERENCES Clientes(id) ON DELETE CASCADE,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    fecha_nacimiento DATE 
);

CREATE TABLE ClientesEmpresa (
    cliente_id INT PRIMARY KEY REFERENCES Clientes(id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(255) NOT NULL,
    contacto_nombre VARCHAR(100) NOT NULL,
    tipo_empresa VARCHAR(100) CHECK(tipo_empresa IN ('PYME', 'grande', 'mediana', 'pequeña', 'institucional')),
    rnc VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE PaymentMethods (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES Clientes(id) ON DELETE CASCADE,
    stripePaymentMethodId VARCHAR(255) NOT NULL,
    cardBrand VARCHAR(50),
    cardLast4 CHAR(4),
    cardExpMonth INT,
    cardExpYear INT,
    defaultMethod BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Administradores (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
    creado_por INT REFERENCES Administradores(id),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100)
);

CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Permisos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Administrador_Rol (
    administrador_id INT NOT NULL REFERENCES Administradores(id) ON DELETE CASCADE,
    rol_id INT NOT NULL REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY(administrador_id, rol_id)
);

CREATE TABLE Rol_Permiso (
    rol_id INT NOT NULL REFERENCES Roles(id) ON DELETE CASCADE,
    permiso_id INT NOT NULL REFERENCES Permisos(id) ON DELETE CASCADE,
    PRIMARY KEY(rol_id, permiso_id)
);

-- ===========================
-- Sección 3: Contenedores y Logística
-- ===========================

CREATE TABLE Dias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE Contenedores (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50),
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    ubicacion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    visibilidad BOOLEAN,
    capacidad VARCHAR(50) CHECK(capacidad IN ('pequeño, mediano, grande')),
    ultima_recoleccion TIMESTAMP,
    proxima_recoleccion TIMESTAMP,
    municipio_id INT REFERENCES Municipios(id) ON DELETE CASCADE
);

INSERT INTO Contenedores (codigo, lat, lng, ubicacion, estado, visibilidad, capacidad, ultima_recoleccion, proxima_recoleccion, municipio_id)
VALUES

CREATE TABLE Garajes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    lat DECIMAL(10,7) NOT NULL,
    lng DECIMAL(10,7) NOT NULL,
    municipio_id INT REFERENCES Municipios(id) ON DELETE CASCADE
);

CREATE TABLE Recibos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagado','cancelado')),
    fecha_emision TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_pago TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,             -- suma de subtotales de los servicios
    impuesto DECIMAL(10,2) DEFAULT 0,            -- impuestos
    total DECIMAL(10,2) NOT NULL,                -- total final
    metodo_pago VARCHAR(50),
    notas TEXT,
    referencia_pago VARCHAR(100),
    cliente_id INT NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE
);

CREATE TABLE Servicios (
    id SERIAL PRIMARY KEY,
    capacidad VARCHAR(10) NOT NULL CHECK(capacidad IN ('pequeño, mediano, grande'))
    lat DECIMAL(10,7) NOT NULL,
    lng DECIMAL(10,7) NOT NULL,
    calle VARCHAR(100),
    numero INT,
    sector VARCHAR(100),
    descripcion TEXT,
    observaciones TEXT,
    observaciones_admin TEXT,
    tipo VARCHAR(20) CHECK(tipo IN ('comercial', 'residencial')),
    precio DECIMAL(10,2) CHECK (precio >= 0),
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'aceptado', 'completado', 'pendiente_pago', 'en_espera', 'denegado', 'cancelado')),
    fecha_solicitud TIMESTAMP DEFAULT NOW(),
    fecha_aprobacion TIMESTAMP,
    fecha_completado TIMESTAMP,
    es_recurrente BOOLEAN DEFAULT FALSE,
    recibo_id INT REFERENCES Recibos(id) ON DELETE SET NULL, -- TODO: Revisar esto
    cliente_id INT REFERENCES Clientes(id) ON DELETE CASCADE,
    municipio_id INT REFERENCES Municipios(id) ON DELETE CASCADE
);

CREATE TABLE Rutas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50),
    nombre VARCHAR(100),
    es_publica BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    ruta_osrm TEXT,
    garaje_id INT REFERENCES Garajes(id),
    municipio_id INT REFERENCES Municipios(id) ON DELETE CASCADE
);

CREATE TABLE Ruta_Dia (
    id SERIAL PRIMARY KEY,
    ruta_id INT REFERENCES Rutas(id) ON DELETE CASCADE,
    dia_id INT REFERENCES Dias(id) ON DELETE CASCADE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    UNIQUE(ruta_id, dia_id)
);

CREATE TABLE Ruta_Parada (
    id SERIAL PRIMARY KEY,
    ruta_id INT NOT NULL REFERENCES Rutas(id) ON DELETE CASCADE,
    tipo_parada VARCHAR(20) NOT NULL CHECK (tipo_parada IN ('contenedor','servicio')),
    contenedor_id INT REFERENCES Contenedores(id) ON DELETE CASCADE,
    servicio_id INT REFERENCES Servicios(id) ON DELETE CASCADE,
    garaje_id INT REFERENCES Garajes(id),
    orden INT NOT NULL,
    tiempo_estimado INTERVAL,
    distancia_desde_inicio DECIMAL(10,2),
    UNIQUE(ruta_id, orden),
    CONSTRAINT chk_tipo_parada CHECK (
        (tipo_parada = 'contenedor' AND contenedor_id IS NOT NULL AND servicio_id IS NULL AND garaje_id IS NULL) OR
        (tipo_parada = 'servicio' AND servicio_id IS NOT NULL AND contenedor_id IS NULL AND garaje_id IS NULL) OR
        (tipo_parada = 'garaje' AND garaje_id IS NOT NULL AND contenedor_id IS NULL AND servicio_id IS NULL)
    )
);

CREATE TABLE Tipos_Vehiculos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,   -- ej: Camión compactador
    capacidad_kg INT NOT NULL,
    combustible VARCHAR(30) CHECK (combustible IN ('gasolina','diesel','eléctrico')),
    descripcion TEXT
);

CREATE TABLE Vehiculos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,   -- identificador interno
    placa VARCHAR(20) UNIQUE NOT NULL,
    modelo VARCHAR(100),
    anio INT CHECK(anio > 1900),
    tipo_id INT REFERENCES Tipos_Vehiculos(id) ON DELETE RESTRICT,
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupado', 'mantenimiento', 'inactivo')),
    ultimo_mantenimiento DATE,
    proximo_mantenimiento DATE,
    garaje_id INT REFERENCES Garajes(id),
    municipio_id INT NOT NULL REFERENCES Municipios(id) ON DELETE CASCADE
);

CREATE TABLE Vehiculo_Ruta (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id) ON DELETE CASCADE,
    ruta_id INT REFERENCES Rutas(id) ON DELETE CASCADE,
    asignado_desde TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(vehiculo_id, ruta_id)
);

CREATE TABLE Conductores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    licencia VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    municipio_id INT NOT NULL REFERENCES Municipios(id) ON DELETE CASCADE
);

CREATE TABLE Vehiculo_Conductor (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id) ON DELETE CASCADE,
    conductor_id INT REFERENCES Conductores(id) ON DELETE CASCADE,
    fecha_asignacion DATE NOT NULL,
    fecha_fin DATE, -- null = sigue activo
    UNIQUE(vehiculo_id, conductor_id, fecha_asignacion)
);

CREATE TABLE Vehiculo_Fallas (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50), -- ej: "motor", "eléctrico", "hidráulico"
    fecha_reporte TIMESTAMP NOT NULL DEFAULT NOW(),
    gravedad VARCHAR(20) CHECK (gravedad IN ('leve','moderada','grave')),
    resuelta BOOLEAN DEFAULT FALSE,
    fecha_resolucion TIMESTAMP,
    observaciones TEXT,
    vehiculo_id INT NOT NULL REFERENCES Vehiculos(id) ON DELETE CASCADE,
    reportado_por INT REFERENCES Conductores(id)
);

-- ===========================
-- Sección 4: Servicios y Pagos
-- ===========================

CREATE TABLE Recibo_Detalle (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,          -- descripción del servicio
    cantidad INT DEFAULT 1,             -- usualmente 1, pero por si se repite
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,     -- cantidad * precio_unitario
    recibo_id INT NOT NULL REFERENCES Recibos(id) ON DELETE CASCADE,
    servicio_id INT NOT NULL REFERENCES Servicios(id) ON DELETE CASCADE,
    UNIQUE(recibo_id, servicio_id)
);

-- Hay que ver esto junto a servicios
CREATE TABLE Suscripciones (
    id SERIAL PRIMARY KEY,
    frecuencia_dias INT CHECK (frecuencia_dias > 0),
    frecuencia_pago VARCHAR(20) DEFAULT 'mensual' CHECK(frecuencia_pago IN ('mensual', 'semanal', 'quincenal')),
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'activo', 'pendiente_pago', 'denegado', 'cancelado')),
    costo DECIMAL(10,2),
    fecha_inicio DATE NOT NULL,
    proxima_recoleccion DATE,
    proxima_facturacion DATE,
    servicio_id INT REFERENCES Servicios(id) ON DELETE CASCADE
);

CREATE TABLE Imagenes (
    id SERIAL PRIMARY KEY,
    url TEXT,
    fecha_subida TIMESTAMP DEFAULT NOW(),
    descripcion TEXT,
    servicio_id INT REFERENCES Servicios(id) ON DELETE CASCADE
);


CREATE TABLE Dia_Servicio (
    id SERIAL PRIMARY KEY,
    id_dia INT REFERENCES Dias(id) ON DELETE CASCADE,
    id_servicio INT REFERENCES Servicios(id) ON DELETE CASCADE,
    UNIQUE(id_dia, id_servicio)
);

CREATE TABLE Servicio_Contenedor (
    id SERIAL PRIMARY KEY,
    servicio_id INT REFERENCES Servicios(id) ON DELETE CASCADE,
    contenedor_id INT REFERENCES Contenedores(id) ON DELETE CASCADE,
    UNIQUE(servicio_id, contenedor_id)
);

CREATE TABLE Reembolsos (
    id SERIAL PRIMARY KEY,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','rechazado')),
    monto DECIMAL(10,2) NOT NULL,
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_resolucion TIMESTAMP,
    justificacion TEXT,
    recibo_id INT NOT NULL REFERENCES Recibos(id) ON DELETE CASCADE,
    cliente_id INT NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE,
    administrador_id INT REFERENCES Administradores(id)
);

-- ===========================
-- Sección 5: Comunicación y Auditoría
-- ===========================
CREATE TABLE Notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    prioridad INT DEFAULT 1 CHECK (prioridad BETWEEN 1 AND 3),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_envio TIMESTAMP,
    fecha_lectura TIMESTAMP
);

CREATE TABLE Historial_Cambios (
    id SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(50),
    registro_id INT,
    accion VARCHAR(50),
    valores_anteriores TEXT,
    valores_nuevos TEXT,
    administrador_id INT REFERENCES Administradores(id) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- Sección 6: Autenticación
-- ===========================
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Usuarios(id) ON DELETE CASCADE,
    token TEXT,
    emitido_en TIMESTAMP DEFAULT NOW(),
    expira_en TIMESTAMP
);

CREATE TABLE magic_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID DEFAULT gen_random_uuid(),
    user_id INT REFERENCES Usuarios(id) ON DELETE CASCADE,
    expira_en TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Planificacion_Semanal (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,                     -- día específico
    ruta_id INT REFERENCES Rutas(id) ON DELETE CASCADE,
    vehiculo_id INT REFERENCES Vehiculos(id) ON DELETE CASCADE,
    servicio_id INT REFERENCES Servicios(id) ON DELETE SET NULL, -- null si es solo ruta pública
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ruta_publica','servicio_cliente')),
    orden INT,                               -- orden de visita
    hora_estimada_inicio TIME,
    hora_estimada_fin TIME,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_proceso','completado')),
    observaciones TEXT,
    UNIQUE(fecha, ruta_id, orden),
    UNIQUE(fecha, servicio_id)
);
