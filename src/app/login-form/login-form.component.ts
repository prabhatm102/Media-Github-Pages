import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BadInput } from '../common/bad-input';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  form: any;
  constructor(
    private service: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
    });
  }

  ngOnInit(): void {}

  submit() {
    let formData = new FormData();

    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);

    if (this.form.valid) {
      this.service
        .create({
          email: this.form.get('email').value,
          password: this.form.get('password').value,
        })
        .subscribe(
          (response) => {
            let res = JSON.stringify(response);
            if (JSON.parse(res)?.status === 200) {
              localStorage.setItem('authToken', JSON.parse(res)?.token);
              this.toastr.success('Login SuccessFull', '', {
                progressBar: true,
                closeButton: true,
                timeOut: 1000,
              });
              let returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigate([returnUrl]);
            }
          },
          (error) => {
            if (error instanceof BadInput)
              this.form.setErrors({
                loginErrros: error.originalError.error.message,
              });
            else {
              this.toastr.error('Something went wrong', '', {
                progressBar: true,
                closeButton: true,
                timeOut: 500,
              });
            }
          }
        );
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
