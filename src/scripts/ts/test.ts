import { greeter, Student } from "./module01/greeter";
 
let user = new Student("Jane", "M.", "User");
  
console.log(greeter(user));
