import 'dotenv/config';
import mongoose from 'mongoose';
import {
  UniversityRoomModel,
  type UniversityRoomDocument,
} from '../modules/university-rooms/university-room.model.js';

type UniversityRoomSeed=Omit<UniversityRoomDocument,'createdAt'|'updatedAt'>;

const universityRooms:UniversityRoomSeed[]=[

    {
      name: 'Rectorado UV',
      address: 'Av. de Blasco Ibáñez, 13, València',
      latitude: 39.47942658356864,
      longitude: -0.3644650193226058,
      googleMapsUrl: 'https://maps.app.goo.gl/o8vQUNdCKVNh1rx16',
      description: 'Dos salas de lactancia en los niveles 0 y 3.',
      isActive: true,
    },
    {
      name: 'Enfermería y Podología',
      address: 'C/ Jaume Roig, Valencia',
      latitude: 39.479157990569675,
      longitude: -0.35913804220415557,
      googleMapsUrl: 'https://maps.app.goo.gl/3vn73PBtxYDR6rJY9',
      description: 'Sala de lactancia situada en planta baja.',
      isActive: true,
    },
    {
      name: 'Geografía e Historia',
      address: 'Av. Blasco Ibáñez, 28, Valencia',
      latitude: 39.47724859037725,
      longitude: -0.36178602631206824,
      googleMapsUrl: 'https://maps.app.goo.gl/uMCoo9w37WgupfhB6',
      description: 'Sala de lactancia en la primera planta.',
      isActive: true,
    },
    {
      name: 'Filología, Traducción y Comunicación',
      address: 'Av. Blasco Ibáñez, 32, Valencia',
      latitude: 39.47685090879144,
      longitude: -0.35919919126182925,
      googleMapsUrl: 'https://maps.app.goo.gl/rFYmrMh72aAETWP57',
      description: 'Sala de lactancia situada en el sótano.',
      isActive: true,
    },
    {
      name: 'Palau Cerveró',
      address: 'Plaça Cisneros, 4, Valencia',
      latitude: 39.47801249104033,
      longitude: -0.3760498548435757,
      googleMapsUrl: 'https://maps.app.goo.gl/WkkY4mbrcJeQd3w28',
      description: 'Sala de lactancia en el primer nivel.',
      isActive: true,
    },
    {
      name: 'Filosofía y Ciencias de la Educación',
      address: 'Av. Blasco Ibáñez, 30, Valencia',
      latitude: 39.476981008119225,
      longitude: -0.3602662188738489,
      googleMapsUrl: 'https://maps.app.goo.gl/dPXWvN98mswpi4ns9',
      description: 'Sala de lactancia situada en planta baja.',
      isActive: true,
    },
    {
      name: 'Biblioteca de Ciencias Eduard Boscà',
      address: 'Av. Vicent Andrés Estellés, 19, Burjassot',
      latitude: 39.507167261057205,
      longitude: -0.41788571463630414,
      googleMapsUrl: 'https://maps.app.goo.gl/AwnNQLQtd7LZG65Z9',
      description: 'Sala de lactancia en el Campus de Burjassot.',
      isActive: true,
    },
    {
      name: 'Parque Científico UV',
      address: 'C/ Catedrático José Beltrán, 2, Paterna',
      latitude: 39.51588645452921,
      longitude: -0.42248738807603287,
      googleMapsUrl: 'https://maps.app.goo.gl/yQjtvivbewApp35f8',
      description: 'Sala de lactancia en el Parque Científico.',
      isActive: true,
    },
  
];

async function seedUniversityRooms(){
 const uri=process.env.MONGODB_URI;
 if(!uri) throw new Error('La variable MONGODB_URI no está definida.');
 try{
  await mongoose.connect(uri);
  await UniversityRoomModel.deleteMany({});
  const inserted=await UniversityRoomModel.insertMany(universityRooms,{ordered:true});
  console.log(`Seed completado: ${inserted.length} salas universitarias insertadas.`);
 }finally{await mongoose.disconnect();}
}
void seedUniversityRooms();
