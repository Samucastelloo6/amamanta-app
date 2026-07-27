import mongoose from 'mongoose';

import { connectDatabase } from '../config/database.js';
import { CollaborateModel } from '../modules/collaborate/collaborate.model.js';
import { ContactModel } from '../modules/contact/contact.model.js';

const contactData = {
  key: 'main',

  emails: [
    {
      id: 'secretaria',
      title: 'Secretaría',
      description: 'Consultas generales sobre la asociación.',
      email: 'secretaria@amamanta.es',
    },
    {
      id: 'taller-virtual',
      title: 'Taller de lactancia virtual',
      description: 'Consultas sobre talleres virtuales.',
      email: 'inscripciones@amamanta.es',
    },
    {
      id: 'talleres-lactancia',
      title: 'Talleres de lactancia',
      description: 'Información sobre talleres presenciales.',
      email: 'barbara@amamanta.es',
    },
    {
      id: 'asesoramiento-legal',
      title: 'Asesoramiento legal',
      description:
        'Consultas jurídicas relacionadas con lactancia y maternidad.',
      email: 'juridico@amamanta.es',
    },
  ],

  phones: [
    {
      id: 'ana',
      name: 'Ana',
      description: 'Asesora de lactancia',
      phone: '667048284',
    },
    {
      id: 'barbara',
      name: 'Bárbara',
      description: 'Asesora de lactancia',
      phone: '699420414',
    },
    {
      id: 'pilar',
      name: 'Pilar',
      description: 'Asesora de lactancia',
      phone: '646701446',
    },
    {
      id: 'natascha',
      name: 'Natascha',
      description: 'Asesora de lactancia',
      phone: '615076014',
    },
    {
      id: 'gloria',
      name: 'Gloria',
      description: 'Lactancia gemelar',
      phone: '637780644',
    },
    {
      id: 'carmen',
      name: 'Carmen',
      description: 'Bebés prematuros',
      phone: '620741236',
    },
  ],

  location: {
    title: 'Sede de Amamanta',
    building: 'Centro Club de Convivencia',
    floor: 'Primera planta',
    address: 'C/ Lluís Santàngel, s/n, Vilamarxant',
    description:
      'Espacio donde se desarrollan reuniones, actividades y acciones de apoyo a la lactancia materna.',
    latitude: 39.57063230988723,
    longitude: -0.6200761326415115,
  },
};

const collaborateData = {
  key: 'main',

  options: [
    {
      id: 'membership',
      title: 'Hazte socia o socio',
      description:
        'Muestra tu compromiso con la lactancia materna vinculándote a Amamanta. Cuantas más socias y socios formen parte de la asociación, mayor fuerza tiene para defender la lactancia materna de manera independiente.',
      extraInfo: ['Alta: 30 €', 'Renovación anual: 25 €'],
      buttonText: 'Ir al formulario',
      url: 'https://amamanta.es/hazte-socio/',
      copyItems: [],
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
        'Consulta las ventajas de formar parte de Amamanta: calendario anual, camiseta de bienvenida, formación, descuentos y otros beneficios para socias y socios. Descubre todos los beneficios exclusivos de formar parte de Amamanta y cómo tu apoyo contribuye al mantenimiento de la asociación.',
      buttonText: 'Ver ventajas',
      url: 'https://amamanta.es/ventajas-de-ser-soci/',
      extraInfo: [],
      copyItems: [],
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
      copyItems: [],
    },
    {
      id: 'teaming',
      title: 'Teaming',
      description:
        'Hazte teamer y colabora con una aportación de 1 € al mes durante el tiempo que desees.',
      buttonText: 'Acceder a Teaming',
      url: 'https://www.teaming.net/amamantaoficial',
      extraInfo: [],
      copyItems: [],
    },
    {
      id: 'merchandising',
      title: 'Artículos de Amamanta',
      description:
        'Colabora con la asociación adquiriendo artículos solidarios de Amamanta y conoce las distintas opciones de colaboración disponibles.',
      buttonText: 'Más información',
      url: 'https://amamanta.es/colaboracion-empresas/',
      extraInfo: [],
      copyItems: [],
    },
  ],
};

async function seedStaticContent(): Promise<void> {
  try {
    await connectDatabase();

    await ContactModel.findOneAndUpdate(
      {
        key: 'main',
      },
      contactData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    ).exec();

    await CollaborateModel.findOneAndUpdate(
      {
        key: 'main',
      },
      collaborateData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    ).exec();

    console.log('🟢 Contenido estático insertado correctamente');
  } catch (error) {
    console.error('🔴 Error al insertar el contenido estático');
    console.error(error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedStaticContent();
