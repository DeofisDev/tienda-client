import { TestBed } from '@angular/core/testing';

import { PerfilUsuarioService } from './perfil-usuario.service';

describe('PerfilUsuarioService', () => {
  let service: PerfilUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
