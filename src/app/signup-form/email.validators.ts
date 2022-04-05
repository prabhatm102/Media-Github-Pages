import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AbstractControl, ValidationErrors } from "@angular/forms";


export class EmailValidators{
    constructor() {
       
    }
    static shouldBeUnique(control:AbstractControl): Promise<ValidationErrors | null >{
        return new Promise((resolve,reject)=>{
           
           EmailValidators
            setTimeout(()=>{
                if(control.value==="test1@gmail.com") 
                resolve({shouldBeUnique:true})
              else resolve(null)
            },1000)
        });
    }
}