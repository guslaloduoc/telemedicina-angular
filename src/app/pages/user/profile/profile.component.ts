import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../core/services/auth.service'; // FIX: Ruta de importación actualizada
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>;
  profileForm!: FormGroup;
  mensajeExito: string | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.user$ = this.userService.getCurrentUserProfile();
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      fechaNacimiento: ['', Validators.required]
    });

    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    const updatedData = this.profileForm.getRawValue();
    this.userService.updateUserProfile(updatedData);
    
    this.mensajeExito = '¡Perfil actualizado con éxito!';
    setTimeout(() => (this.mensajeExito = null), 3000);
  }
}