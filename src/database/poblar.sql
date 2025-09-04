
recolecta=# INSERT INTO Contenedores (codigo, lat, lng, ubicacion, estado, visibilidad, capacidad, ultima_recoleccion, proxima_recoleccion, municipio_id)
recolecta-# VALUES
recolecta-# ('SPM-016', 18.4542, -69.3005, 'Calle Duarte, SPM', TRUE, TRUE, 'Grande', NULL, NULL, 1),
recolecta-# ('SPM-017', 18.4568, -69.2983, 'Parque Central, SPM', TRUE, TRUE, 'Mediano', NULL, NULL, 1),
recolecta-# ('SPM-018', 18.4575, -69.2950, 'Calle 30 de Mayo, SPM', TRUE, TRUE, 'Pequeño', NULL, NULL, 1),
recolecta-# ('SPM-019', 18.4590, -69.2925, 'Calle Sánchez, SPM', TRUE, TRUE, 'Grande', NULL, NULL, 1),
recolecta-# ('SPM-020', 18.4530, -69.2970, 'Calle 16 de Agosto, SPM', TRUE, TRUE, 'Mediano', NULL, NULL, 1);
INSERT 0 5
recolecta=# -- San Pedro de Macorís = 1
recolecta=#
recolecta=# INSERT INTO Contenedores
recolecta-# (codigo, lat, lng, ubicacion, estado, visibilidad, capacidad, ultima_recoleccion, proxima_recoleccion, municipio_id)
recolecta-# VALUES
recolecta-# ('SPM-101', 18.4545, -69.3060, 'Parque Central, SPM', TRUE, TRUE, 'Grande', NULL, NULL, 1),
recolecta-# ('SPM-102', 18.4570, -69.3085, 'Calle Duarte con Av. España, SPM', TRUE, TRUE, 'Mediano', NULL, NULL, 1),
recolecta-# ('SPM-103', 18.4600, -69.3100, 'Zona Universitaria, SPM', TRUE, TRUE, 'Pequeño', NULL, NULL, 1),
recolecta-# ('SPM-104', 18.4625, -69.3125, 'Malecón de San Pedro de Macorís', TRUE, TRUE, 'Grande', NULL, NULL, 1),
recolecta-# ('SPM-105', 18.4660, -69.3140, 'Avenida Libertad, SPM', TRUE, TRUE, 'Mediano', NULL, NULL, 1);