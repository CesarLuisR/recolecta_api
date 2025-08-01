CREATE TABLE municipios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  lat DECIMAL,
  lng DECIMAL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  cedula VARCHAR(15) UNIQUE NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
  tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('cliente', 'admin')),
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  municipio_id INT NOT NULL REFERENCES municipios(id) ON DELETE RESTRICT,
  verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE solicitudes_servicio (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  descripcion TEXT,
  direccion TEXT,
  lat DECIMAL,
  lng DECIMAL,
  fecha_solicitada TIMESTAMP NOT NULL,
  estado BOOLEAN NOT NULL DEFAULT FALSE,  -- FALSE = pendiente, TRUE = completado
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  municipio_id INT NOT NULL REFERENCES municipios(id) ON DELETE RESTRICT
);

CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  solicitud_id INT NOT NULL REFERENCES solicitudes_servicio(id) ON DELETE CASCADE,
  monto DECIMAL NOT NULL,
  metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'online')),
  estado BOOLEAN NOT NULL DEFAULT FALSE,  -- FALSE = pendiente, TRUE = pagado
  fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contenedores (
  id SERIAL PRIMARY KEY,
  municipio_id INT NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
  direccion TEXT NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('small', 'medium', 'big')),
  estado BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rutas_camion (
  id SERIAL PRIMARY KEY,
  municipio_id INT NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio TIME NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paradas_ruta (
  id SERIAL PRIMARY KEY,
  ruta_id INT NOT NULL REFERENCES rutas_camion(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('contenedor', 'servicio')),
  referencia_id INT NOT NULL, -- Deberia ser FK pero es una referencia polimorfica, es decir que puede referencia a un contenedor o aun servicio. Por simplicidad la dejamos como un entero sin referencia.
  orden INT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (ruta_id, orden)
);

CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES usuarios(id),
  token TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID DEFAULT uuid_generate_v4(),
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_mlink_user
      FOREIGN KEY (user_id)
      REFERENCES usuarios(id)
          ON DELETE CASCADE
);