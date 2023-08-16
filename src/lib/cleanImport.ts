/**
 * 
 * @param code a raw import from a .svelte file
 * @returns a string with the import statements and <pre> removed
 */
export const cleanImport = (code: string) => {
  code = code.replace(/import.*;?[\s\n]*/gi, "");
  code = code.replace(/[\s]*?<pre>.*?<\/pre>/g, "");
  code = code.replace(/[\s]*?<code data-values.*?>.*?<\/code>/g, "");
  code = code.replace(/[\s]+?<\w*? hide>.*?<\/\w+?>/gs, "");
  code = code.replace(/[\s]*?\/\* hide \*\/.*?\/\* endhide \*\//gs, "");
  code = code.replace(/[\s]*?<!-- hide -->.*?<!-- endhide -->/gs, "");
  
  return code;
}