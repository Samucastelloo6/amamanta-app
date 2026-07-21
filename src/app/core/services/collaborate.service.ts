import { Injectable } from '@angular/core';
import { CollaborateOption } from '../models/collaborate';

@Injectable({
  providedIn: 'root',
})
export class CollaborateService {
  private readonly options: CollaborateOption[] = [
    {
      id: 'membership',
      title: 'Hazte socia o socio',
      description:
        'Muestra tu compromiso con la lactancia materna vinculándote a Amamanta. Cuantas más socias y socios formen parte de la asociación, mayor fuerza tiene para defender la lactancia materna de manera independiente.',
      extraInfo: ['Alta: 30 €', 'Renovación anual: 25 €'],
      buttonText: 'Ir al formulario',
      url: 'https://amamanta.es/hazte-socio/',
    },
    {
      id: 'donation',
      title: 'Dona',
      description:
        'Cualquier aportación es importante para seguir manteniendo los talleres, la formación y el voluntariado hospitalario.',
      extraInfo: [
        'Titular: Amamanta Grupo Apoyo Lactancia Materna',
        'Teléfono: 699 420 414',
      ],
      copyItems: [
        {
          label: 'Transferencia bancaria',
          value: 'ES22 3159 0012 4128 9304 3923',
          copyText: 'ES2231590012412893043923',
          buttonText: 'Copiar IBAN',
        },
        {
          label: 'Bizum',
          value: '02592',
          copyText: '02592',
          buttonText: 'Copiar código Bizum',
        },
      ],
    },
    {
      id: 'benefits',
      title: 'Ventajas de ser socia o socio',
      description:
        'Consulta las ventajas de formar parte de Amamanta: calendario anual, camiseta de bienvenida, formación, descuentos y otros beneficios para socias y socios.Descubre todos los beneficios exclusivos de formar parte de Amamanta y cómo tu apoyo contribuye al mantenimiento de la asociación.',
      buttonText: 'Ver ventajas',
      url: 'https://amamanta.es/ventajas-de-ser-soci/',
    },
    {
      id: 'calendar',
      title: 'Colaboración con nuestro calendario',
      description:
        'Puedes realizar cualquier aportación económica para colaborar con el calendario solidario de Amamanta. Los datos para realizar la aportación son los mismos que en las donaciones.',
      extraInfo: [
        'Las empresas colaboradoras pueden incluir su logotipo en la contraportada del calendario y en las redes sociales de Amamanta.',
        'Para ello es necesario enviar el logotipo por correo electrónico.',
      ],
      buttonText: 'Enviar correo',
      url: 'mailto:colabora@amamanta.es',
    },
    {
      id: 'teaming',
      title: 'Teaming',
      description:
        'Hazte teamer y colabora con una aportación de 1 € al mes durante el tiempo que desees.',
      buttonText: 'Acceder a Teaming',
      url: 'https://www.teaming.net/amamantaoficial',
    },
    {
      id: 'merchandising',
      title: 'Artículos de Amamanta',
      description:
        'Colabora con la asociación adquiriendo artículos solidarios de Amamanta y conoce las distintas opciones de colaboración disponibles.',
      buttonText: 'Más información',
      url: 'https://amamanta.es/colaboracion-empresas/',
    },
  ];

  getOptions(): CollaborateOption[] {
    return this.options;
  }
}
