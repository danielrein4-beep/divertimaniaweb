-- La princesa de Aladdín se escribe «Jazmín» en español (Jasmine en inglés). Solo datos e idempotente.
UPDATE "Opcion" SET "nombre" = 'Show de Jazmín', "grupo" = 'Jazmín',
  "descripcion" = 'Jazmín llega desde Agrabah con su elegancia y su espíritu libre para llenar tu fiesta de magia oriental, baile y fotos de ensueño.'
WHERE "nombre" IN ('Show de Jasmine', 'Show de Jazmín');
UPDATE "Servicio" SET "descripcion" = 'Ariel, Elsa, Rapunzel, Cenicienta, Blancanieves, Bella, Moana y Jazmín llegan a tu fiesta con vestuario de cuento, baile, fotos y mucha magia. Elige a la princesa de tus sueños.'
WHERE "nombre" = 'Princesas Disney';
