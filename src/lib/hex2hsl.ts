interface HSL {
  h: number;  
  s: number;
  l: number;   
}

/**
 * convert a hex color string to HSL object
 * @param hex a hex color string to convert to HSL
 * @returns a HSL object with the h, s, and l values to 1 decimal place
 */
export const hexToHSL = function (hex: string): HSL {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) {
    throw new Error('Invalid hex color.');
  }

  const r: number = parseInt(result[1], 16);   
  const g: number = parseInt(result[2], 16);  
  const b: number = parseInt(result[3], 16);
  
  const rNorm: number = r / 255;  
  const gNorm: number = g / 255;  
  const bNorm: number = b / 255;

  let max: number = Math.max(rNorm, gNorm, bNorm);  
  let min: number = Math.min(rNorm, gNorm, bNorm); 
  
  let h: number = 0;    
  let s: number = 0;   
  let l: number = (max + min) / 2;
    
  if(max != min) {

    const d: number = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
    switch(max){
      case rNorm: 
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); 
        break;
      case gNorm:  
        h = (bNorm - rNorm) / d + 2; 
        break;
      case bNorm:   
        h = (rNorm - gNorm) / d + 4;
        break;       
    }
    
    h /= 6;   

  }
    
  const hsl: HSL = {     
    h: parseFloat((h * 360).toFixed(1)),
    s: parseFloat((s * 100).toFixed(1)),
    l: parseFloat((l * 100).toFixed(1))
  };  
    
  return hsl;   
}

/**
 * convert a hex color string to HSL string
 * @param hex a hex color string to convert to HSL
 * @returns a css hsl string for use in css
 */
export const hexToHSLString = function (hex: string): string {
  return `hsl(${hexToHSL(hex).h}, ${hexToHSL(hex).s}%, ${hexToHSL(hex).l}%)`;
}