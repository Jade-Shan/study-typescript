import { greeter, Student } from "./module01/greeter";

var user02 = new Student("Jane", "M.", "tester auto v2");
  
console.log(greeter(user02));
 
let p = document.getElementById("user02");
if (p) {
	p.innerText = greeter(user02);
}
