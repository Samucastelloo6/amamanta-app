import { Injectable } from '@angular/core';
import { ResourcePoint } from '../models/resource';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

   private readonly resources: ResourcePoint[] = [
    {
  id: 'uv-rectorado',
  name: 'Sala de lactancia - Rectorado UV',
  type: 'lactation_room',
  address: 'Av. de Blasco Ibáñez, 13, València',
  latitude: 39.47942658356864,
  longitude: -0.3644650193226058,
  googleMapsUrl: 'https://maps.app.goo.gl/o8vQUNdCKVNh1rx16',
  description: 'Dos salas de lactancia en los niveles 0 y 3.',
  isActive: true
},
{
  id: 'uv-enfermeria-podologia',
  name: 'Sala de lactancia - Enfermería y Podología',
  type: 'lactation_room',
  address: 'C/ Jaume Roig, Valencia',
  latitude: 39.479157990569675,
  longitude: -0.35913804220415557,
  googleMapsUrl: 'https://maps.app.goo.gl/3vn73PBtxYDR6rJY9',
  description: 'Sala de lactancia situada en planta baja.',
  isActive: true
},
   {
  id: 'uv-geografia-historia',
  name: 'Sala de lactancia - Geografía e Historia',
  type: 'lactation_room',
  address: 'Av. Blasco Ibáñez, 28, Valencia',
  latitude: 39.47724859037725,
  longitude: -0.36178602631206824,
  googleMapsUrl: 'https://maps.app.goo.gl/uMCoo9w37WgupfhB6',
  description: 'Sala de lactancia en la primera planta.',
  isActive: true
},
{
  id: 'uv-filologia',
  name: 'Sala de lactancia - Filología, Traducción y Comunicación',
  type: 'lactation_room',
  address: 'Av. Blasco Ibáñez, 32, Valencia',
  latitude: 39.47685090879144,
  longitude: -0.35919919126182925,
  googleMapsUrl: 'https://maps.app.goo.gl/rFYmrMh72aAETWP57',
  description: 'Sala de lactancia situada en el sótano.',
  isActive: true
},
{
  id: 'uv-palau-cervero',
  name: 'Sala de lactancia - Palau Cerveró',
  type: 'lactation_room',
  address: 'Plaça Cisneros, 4, Valencia',
  latitude: 39.47801249104033,
  longitude: -0.3760498548435757,
  googleMapsUrl: 'https://maps.app.goo.gl/WkkY4mbrcJeQd3w28',
  description: 'Sala de lactancia en el primer nivel.',
  isActive: true
},
{
  id: 'uv-filosofia-educacion',
  name: 'Sala de lactancia - Filosofía y Ciencias de la Educación',
  type: 'lactation_room',
  address: 'Av. Blasco Ibáñez, 30, Valencia',
  latitude: 39.476981008119225,
  longitude: -0.3602662188738489,
  googleMapsUrl: 'https://maps.app.goo.gl/dPXWvN98mswpi4ns9',
  description: 'Sala de lactancia situada en planta baja.',
  isActive: true
},
{
  id: 'uv-biblioteca-ciencias',
  name: 'Sala de lactancia - Biblioteca de Ciencias Eduard Boscà',
  type: 'lactation_room',
  address: 'Av. Vicent Andrés Estellés, 19, Burjassot',
  latitude: 39.507167261057205,
  longitude: -0.41788571463630414,
  googleMapsUrl: 'https://maps.app.goo.gl/AwnNQLQtd7LZG65Z9',
  description: 'Sala de lactancia en el Campus de Burjassot.',
  isActive: true
},
{
  id: 'uv-parque-cientifico',
  name: 'Sala de lactancia - Parque Científico UV',
  type: 'lactation_room',
  address: 'C/ Catedrático José Beltrán, 2, Paterna',
  latitude: 39.51588645452921,
  longitude: -0.42248738807603287,
  googleMapsUrl: 'https://maps.app.goo.gl/yQjtvivbewApp35f8',
  description: 'Sala de lactancia en el Parque Científico.',
  isActive: true
},
{
  id: 'cullera-fruteria-la-vega',
  name: 'Frutería La Vega',
  type: 'friendly_space',
  sector: 'food',
  address: 'C/ Rei en Jaume, 9, Cullera',
  latitude: 39.163708115921686,
  longitude: -0.25365700086954207,
  googleMapsUrl: 'https://maps.app.goo.gl/rEHSr5rpGzxmYLKs9',
  description: 'Espacio amigo de la lactancia materna.',
  isActive: true
},
{
  id: 'cullera-panaderia-antonio-sanchez',
  name: 'Panadería Antonio Sánchez',
  type: 'friendly_space',
  sector: 'food',
  address: 'Plaza de la Libertad, 1, Cullera',
  latitude: 39.16428253334542,
  longitude: -0.2530437225748683,
  googleMapsUrl: 'https://maps.app.goo.gl/A6LEQLhyKeuwyMyeA',
  description: 'Espacio amigo de la lactancia materna.',
  isActive: true
},
{
  id: 'cullera-forn-escriva',
  name: 'Forn Escrivà',
  type: 'friendly_space',
  sector: 'food',
  address: 'C/ Valencia, 222, Cullera',
  latitude: 39.17168844386194,
  longitude: -0.2593408189204469,
  googleMapsUrl: 'https://maps.app.goo.gl/6rjANxKdCng5Pajx6',
  description: 'Espacio amigo de la lactancia materna.',
  isActive: true
},
{
  id: 'cullera-herboristeria-sauco',
  name: 'Herboristería Sauco',
  type: 'friendly_space',
  sector: 'food',
  address: 'C/ Rei en Jaume, 1, Cullera',
  latitude: 39.16395584801198,
  longitude: -0.253350351342985,
  googleMapsUrl: 'https://maps.app.goo.gl/PbSez3Nb8HRypNXD7',
  description: 'Herboristería, dietética y alimentación ecológica.',
  isActive: true
},
{
  id: 'cullera-la-candy',
  name: 'La Candy',
  type: 'friendly_space',
  sector: 'food',
  address: 'Plaza de la Virgen, 31, Cullera',
  latitude: 39.1637244263545,
  longitude: -0.2546711053934834,
  googleMapsUrl: 'https://maps.app.goo.gl/hBuNXedqzamp9ZSq6',
  description: 'Tienda de chuches.',
  isActive: true
},
{
  id: 'cullera-la-terraza-de-julieta',
  name: 'La Terraza de Julieta',
  type: 'friendly_space',
  sector: 'food',
  address: 'Calle Poeta Miguel Hernández, 8, Cullera',
  latitude: 39.16475417672589,
  longitude: -0.24399896635783672,
  googleMapsUrl: 'https://maps.app.goo.gl/6JM4JkMDnp4HnYwf6',
  description: 'Cafetería – Gastrobar.',
  isActive: true
},
{
  id: 'cullera-angara-camos',
  name: 'Ángara Camós',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'C/ Muñoz Degrain, 1 bajo, Cullera',
  latitude: 39.16431875862876,
  longitude: -0.25443455004988585,
  googleMapsUrl: 'https://maps.app.goo.gl/rMV3ixtNnq4tFUEr6',
  description: 'Joyería y complementos.',
  isActive: true
},
{
  id: 'cullera-paco-camos',
  name: 'Paco Camós',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'C/ Cabañal, 16 bajo, Cullera',
  latitude: 39.16415986004465,
  longitude: -0.24405014356611862,
  googleMapsUrl: 'https://maps.app.goo.gl/Kv71edRwaGAtAZfH6',
  description: 'Bisutería y complementos.',
  isActive: true
},
{
  id: 'cullera-noah',
  name: 'Noah',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'C/ De la Sèquia, 38, Cullera',
  latitude: 39.164885273060854,
  longitude: -0.25515974291159327,
  googleMapsUrl: 'https://maps.app.goo.gl/WdYVbpawhr7DNWwt8',
  description: 'Moda y complementos.',
  isActive: true
},
{
  id: 'cullera-calzados-elche',
  name: 'Calzados Elche',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'C/ Cabañal, 9, Cullera',
  latitude: 39.16439136562297,
  longitude: -0.2445179308927345,
  googleMapsUrl: 'https://maps.app.goo.gl/HFh1RFrjajVHPrUk9',
  description: 'Calzado y complementos.',
  isActive: true
},
{
  id: 'cullera-mn-intima',
  name: 'MN Íntima',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'Passeig Dr. Alemany, 16, Cullera',
  latitude: 39.16388663791612,
  longitude: -0.255085196051208,
  googleMapsUrl: 'https://maps.app.goo.gl/6RU9Q9LB9c5YBBjKA',
  description: 'Lencería y corsetería.',
  isActive: true
},
{
  id: 'cullera-don-kiko',
  name: 'Don Kiko',
  type: 'friendly_space',
  sector: 'fashion',
  address: 'C/ Cabañal, 14, Cullera',
  latitude: 39.16418143364571,
  longitude: -0.24455023836571466,
  googleMapsUrl: 'https://maps.app.goo.gl/jTTP68FV51n5aW1WA',
  description: 'Comercio de moda para hombre y mujer.',
  isActive: true
},
{
  id: 'cullera-inka-estilisme',
  name: 'Inka Estilisme',
  type: 'friendly_space',
  sector: 'beauty',
  address: 'C/ del Mar, 14, Cullera',
  latitude: 39.163868822582415,
  longitude: -0.2518497245457407,
  googleMapsUrl: 'https://maps.app.goo.gl/kkcKR3skNSBxDc8T8',
  description: 'Peluquería.',
  isActive: true
},
{
  id: 'cullera-maria-jose-font-estilistes',
  name: 'Mª José Font Estilistes',
  type: 'friendly_space',
  sector: 'beauty',
  address: 'C/ Poeta Miguel Hernández, 3, Cullera',
  latitude: 39.16464886270825,
  longitude: -0.24428606248950396,
  googleMapsUrl: 'https://maps.app.goo.gl/muarAKcFok5aAfY66',
  description: 'Peluquería.',
  isActive: true
},
{
  id: 'cullera-peluqueria-low-cost-milano',
  name: 'Peluquería Low Cost Milano',
  type: 'friendly_space',
  sector: 'beauty',
  address: 'Calle La Marina, 28, Cullera',
  latitude: 39.16207784423799,
  longitude: -0.2533294502327527,
  googleMapsUrl: 'https://maps.app.goo.gl/LcVyLA8SyBitgZCg7',
  description: 'Peluquería.',
  isActive: true
},
{
  id: 'cullera-paco-perfumerias',
  name: 'Paco Perfumerías',
  type: 'friendly_space',
  sector: 'beauty',
  address: 'Avinguda Blasco Ibáñez, 3, Cullera',
  latitude: 39.16525895375007,
  longitude: -0.24378767615371247,
  googleMapsUrl: 'https://maps.app.goo.gl/bgPtRodqfPdfTipx9',
  description: 'Perfumería.',
  isActive: true
},
{
  id: 'cullera-paula-torres',
  name: 'Paula Torres',
  type: 'friendly_space',
  sector: 'health',
  address: 'C/ La Bega, 15, Cullera',
  latitude: 39.16168448729655,
  longitude: -0.25367713392506636,
  googleMapsUrl: 'https://maps.app.goo.gl/76Bj3UQN5QUUCGMR7',
  description: 'Clínica dental.',
  isActive: true
},
{
  id: 'cullera-clinica-bardana',
  name: 'Fisioterapia Clínica Bardana',
  type: 'friendly_space',
  sector: 'health',
  address: 'Carrer Caminàs dels Hòmens, 5, Cullera',
  latitude: 39.163701537586576,
  longitude: -0.24600189045972298,
  googleMapsUrl: 'https://maps.app.goo.gl/EgdwrNtnaHyv8zgS9',
  description: 'Fisioterapia, osteopatía, suelo pélvico y fisioterapia pediátrica.',
  isActive: true
},
{
  id: 'cullera-farmacia-macarena-peiro',
  name: 'Farmacia Macarena Peiro',
  type: 'friendly_space',
  sector: 'health',
  address: 'Avda 25 de Abril, 64, Cullera',
  latitude: 39.16404468182542,
  longitude: -0.2465856875627037,
  googleMapsUrl: 'https://maps.app.goo.gl/CmiPCz9pAtavwQaMA',
  description: 'Oficina de farmacia.',
  isActive: true
},
{
  id: 'cullera-farmacia-carmen-garcia-gorrita',
  name: 'Farmacia Carmen García-Gorrita Moltó',
  type: 'friendly_space',
  sector: 'health',
  address: 'Av. Diagonal del País Valencià, 33, Cullera',
  latitude: 39.16216607366836,
  longitude: -0.2516618350300105,
  googleMapsUrl: 'https://maps.app.goo.gl/8JbVFEfvKU6FbzeQ8',
  description: 'Farmacia.',
  isActive: true
},
{
  id: 'cullera-caixa-popular',
  name: 'Caixa Popular',
  type: 'friendly_space',
  sector: 'services',
  address: 'Av. Doctor Alemany, 22, Cullera',
  latitude: 39.16394470498962,
  longitude: -0.2552375628625741,
  googleMapsUrl: 'https://maps.app.goo.gl/AKaZ4tdfCBW6rqKc9',
  description: 'Entidad financiera.',
  isActive: true
},
{
  id: 'cullera-loterias-sant-antoni',
  name: 'Administración de Loterías Sant Antoni',
  type: 'friendly_space',
  sector: 'services',
  address: 'Plaza Mongrell, 10 bajo, Cullera',
  latitude: 39.16503133906416,
  longitude: -0.24510128402888057,
  googleMapsUrl: 'https://maps.app.goo.gl/qV3n3K42YiG912FB8',
  description: 'Comercio de juegos de azar.',
  isActive: true
},



  ];

    getResources(): ResourcePoint[] {
    return this.resources;
  }
}
