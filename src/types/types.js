/**
 * @typedef {Object} Layout
 * @property {string} id - ID del dispositivo
 * @property {string} name - Nombre del dispositivo
 * @property {number} type - ID de la sección
 * @property {Section[]} sections - Arreglo de secciones en el layout
 */

/**
 * @typedef {Object} Section
 * @property {number} id - ID de la sección
 * @property {number} position - Posición de la sección
 * @property {number} aspectRatio - Aspect ratio de la sección
 * @property {SectionImage[]} sectionImages - Arreglo de imágenes en la sección
 */

/**
 * @typedef {Object} SectionImage
 * @property {number} id - ID de la imagen en la sección
 * @property {number} position - Posición de la imagen en la sección
 * @property {number} time - Tiempo de la imagen en la sección
 * @property {string} [imageUrl] - URL opcional de la imagen
 * @property {File} [image] - Archivo de imagen opcional
 */