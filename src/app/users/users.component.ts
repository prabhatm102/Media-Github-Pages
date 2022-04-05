import { Component, OnInit } from '@angular/core';
import { AppError } from '../common/app-error';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any;
  currentUser: any;
  form: any;
  selectedUser: any;
  imageUrl: string = '';
  localImageUrl: string = '';

  constructor(
    private service: UserService,
    private auth: AuthService,
    fb: FormBuilder
  ) {
    this.imageUrl = environment.imageUrl;
    this.form = fb.group({
      name: fb.control('', [Validators.required]),
      email: fb.control(
        '',
        [Validators.required, Validators.email]
        // [EmailValidators.shouldBeUnique]
      ),
      file: fb.control('', [Validators.required]),
      fileSource: fb.control('', [Validators.required]),
      isAdmin: fb.control('', [Validators.required]),
      isActive: fb.control('', [Validators.required]),
    });
  }

  get name() {
    return this.form.get('name');
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  get file() {
    return this.form.get('file');
  }

  get isAdmin() {
    return this.form.get('isAdmin');
  }

  get isActive() {
    return this.form.get('isActive');
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getDecodedAccessToken(
      localStorage.getItem('authToken') || ''
    );

    this.service.getAll().subscribe((response) => {
      this.users = this.friendStatus(response);
    });
  }

  friendStatus(users: any) {
    for (let item of users) {
      let friend = item.friends.find(
        (f: any) => f?.user?._id === this.currentUser._id
      );

      if (friend) {
        if (friend.status === 'pending') {
          item.status = 'Cancel Request';
        } else if (friend.status === 'sent') {
          item.status = 'sent';
        } else if (friend.status === 'requested') {
          item.status = 'Cancel Request';
        } else if (friend.status === 'success') {
          item.status = 'Remove Friend';
        }
      } else item.status = 'Send Request';
    }
    return users;
  }
  deleteUser(user: any) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.service.delete(user._id).subscribe(
          (response) => {
            let index = this.users.findIndex((u: any) => u._id === user._id);

            this.users.splice(index, 1);

            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          (error: Response) => {}
        );
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;

    this.form.controls['name'].value = user?.name;
    this.form.controls['email'].value = user?.email;
    this.form.controls['file'].value = user?.file;
    this.form.controls['isAdmin'].value = user?.isAdmin;
    this.form.controls['isActive'].value = user?.isActive;
    this.form.controls['fileSource'].value = '';

    this.form.controls['name'].setErrors();
    this.form.controls['email'].setErrors();
    this.form.controls['file'].setErrors();
    this.form.controls['isAdmin'].setErrors();
    this.form.controls['isActive'].setErrors();
    this.form.controls['fileSource'].setErrors();
  }
  updateUser() {
    if (!this.form.valid) return;

    let formData = new FormData();
    formData.append('name', this.form.get('name').value);
    formData.append('email', this.form.get('email').value);

    if (this.form.get('fileSource').value)
      formData.append('file', this.form.get('fileSource').value);
    if (
      this.currentUser.isAdmin &&
      this.currentUser === this.selectedUser._id
    ) {
      formData.append('isActive', this.form.get('isActive').value);
      formData.append('isAdmin', this.form.get('isAdmin').value);
    }

    let newData = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      isActive: this.form.get('isActive').value,
      isAdmin: this.form.get('isAdmin').value,
      file: this.form.get('file').value,
    };

    let prevdata = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      isActive: this.selectedUser.isActive,
      isAdmin: this.selectedUser.isAdmin,
      file: this.selectedUser.file,
    };

    if (JSON.stringify(newData) === JSON.stringify(prevdata)) return;

    this.service
      .update(this.selectedUser?._id, formData)
      .subscribe((response) => {
        let index = this.users.findIndex(
          (u: any) => u._id === this.selectedUser._id
        );
        this.users[index] = this.friendStatus([response.body])[0];
        this.form.reset();

        if (this.currentUser._id === this.selectedUser._id) {
          localStorage.setItem(
            'authToken',
            response.headers.get('x-auth-token') || ''
          );
        }
        this.selectedUser = '';
      });
  }

  updateImageUrl(url: any) {
    this.localImageUrl = url;
    this.selectedUser = '';
  }

  viewUser(user: any) {
    Swal.fire({
      title: '<h1>User Details</h1>',
      html: `
      <div>
        <strong>Name:</strong>${user.name}
      </div>
      <div>
        <strong>Email:</strong>${user.email}
      </div>
      <div>
        <strong>Status:</strong>${user.isActive ? 'Active' : 'Deactive'}
      </div>
      <div>
        <strong>Role:</strong>${user.isAdmin ? 'Admin' : 'User'}
      </div>`,
      imageUrl: this.imageUrl + user.file,
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Custom image',
    });
  }

  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      this.form.controls['file'].touched = true;
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        this.localImageUrl = '';
        return this.form.controls['file'].setErrors({
          invalidFileExtension: true,
        });
      } else {
        this.form.patchValue({ fileSource: file });
        this.localImageUrl = URL.createObjectURL(event.target.files[0]);
      }
    }
  }
}
