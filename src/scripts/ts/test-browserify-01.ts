import { greeter, Student } from "./module01/greeter";

var user01 = new Student("jane", "m.", "user auto v8");
  
console.log(greeter(user01));
 
let p = document.getElementById("user01");
if (p) {
p.innerText = greeter(user01);
}
