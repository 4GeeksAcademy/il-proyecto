// por seguridad habría que usar require('dotenv').config(); para poder usar las variables de entorno y crear una con la url de firebase

// require('dotenv').config()

const defaultSize = [40, 40];
const defaultAnchor = [20, 40];

export const iconList = [
  'Final%20Icons%2Flevel-0.png?alt=media&token=966182fb-4544-4bb1-9164-85f8986ecc69',
  'Final%20Icons%2Flevel-1.png?alt=media&token=7a469bcb-505f-4b9e-82d0-2d8471768317',
  'Final%20Icons%2Flevel-2.png?alt=media&token=679901b2-846a-4c8b-bbd3-f1b188bf493e',
  'Final%20Icons%2Flevel-3.png?alt=media&token=5edf7dcb-6aa3-4782-b52d-4a1a2b274549',
  'Final%20Icons%2Flevel-4.png?alt=media&token=60cdd5e4-7e13-49cb-8e9e-b8b8585be63a',

].map(name => ({
  url: `${process.env.FIREBASE_URL}/${name}`,
  size: defaultSize,
  anchor: defaultAnchor,
}));


