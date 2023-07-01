import { greeter, Student } from "./module01/greeter";

let user = new Student("Jane", "M.", "User auto v5");
  
console.log(greeter(user));
 
document.body.textContent = greeter(user);
