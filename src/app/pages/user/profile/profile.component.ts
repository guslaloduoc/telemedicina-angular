import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { User } from '../../../core/services/auth.service';
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
    // Inicializamos el formulario
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: [{ value: '', disabled: true }], // Campo deshabilitado
      fechaNacimiento: ['', Validators.required]
    });

    // Cargamos los datos del usuario en el formulario
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

    // Usamos getRawValue() para obtener también los valores de campos deshabilitados (como el email)
    const exito = this.userService.updateUserProfile(this.profileForm.getRawValue());
    
    if (exito) {
      this.mensajeExito = '¡Perfil actualizado con éxito!';
      setTimeout(() => (this.mensajeExito = null), 3000);
    }
  }
}