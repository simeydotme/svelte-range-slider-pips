
/**
 * Converts a string to a string which is safe to use as a css id/class
 * @param id a string to be converted to a safe id
 * @returns a string which is safe to use as a css id/class
 */
export const safeId = ( id: string ): string => {

  return encodeURIComponent( id )
    .toLowerCase()
    .replace( /%20/gi, '-')
    .replace(/\.|%[0-9a-z]{2}/gi, '');

}