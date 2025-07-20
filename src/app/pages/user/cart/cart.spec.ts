import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
const mockItems = [
  { id: 1, nombre: 'Consulta A', precio: 5000 },
  { id: 2, nombre: 'Terapia B', precio: 7500 },
] as any as CartItem[];
const item = {
  id: 42,
  nombre: 'X',
  precio: 1000
} as any as CartItem;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [
      'getItemsForCurrentUser',
      'removeItem',
      'confirmarHoras'
    ]);
    // Devolvemos un observable con items simulados
    mockCartService.getItemsForCurrentUser.and.returnValue(of(mockItems));

    await TestBed.configureTestingModule({
      imports: [CartComponent],  // al ser standalone
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener los items del servicio en items$', () => {
    // Ya se llamó en el constructor
    expect(mockCartService.getItemsForCurrentUser).toHaveBeenCalled();

    let received: CartItem[] | undefined;
    component.items$.subscribe(items => received = items);

    expect(received).toEqual(mockItems);
  });

  describe('eliminarItem', () => {
     it('debería llamar a cartService.removeItem con el item correcto', () => {
    // Sólo pongo la propiedad mínima que sé que existe
    const item = { id: 42 } as CartItem;

    component.eliminarItem(item);
    expect(mockCartService.removeItem).toHaveBeenCalledWith(item);
  });
  });

  describe('confirmarHoras', () => {
    it('debería llamar a cartService.confirmarHoras y mostrar mensaje, luego limpiarlo', fakeAsync(() => {
      component.confirmarHoras();

      // Verificamos llamada al servicio
      expect(mockCartService.confirmarHoras).toHaveBeenCalled();

      // Mensaje debe establecerse inmediatamente
      expect(component.mensajeConfirmacion).toBe('¡Horas confirmadas con éxito! 🎉');

      // Tras 3 segundos, debe limpiarse
      tick(3000);
      expect(component.mensajeConfirmacion).toBeNull();
    }));
  });
});
