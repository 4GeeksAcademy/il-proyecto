const defaultSize = [40, 40];
const defaultAnchor = [20, 40];

export const iconList = [
  'Cold%20Sweat%20Emoji.png?alt=media&token=2a6322d5-4863-4c83-97b9-c96b36ff8d4d',
  'Expressionless%20Face%20Emoji.png?alt=media&token=5edf848e-20b7-4269-a7a7-29c6bf6ecab0',
  'Eye%20Roll%20Emoji.png?alt=media&token=f298b5b6-4576-4f6c-b0d2-a2689fa32a39',
  'Face%20With%20Thermometer%20Emoji.png?alt=media&token=0dbecc58-8e27-405f-a2e0-9218f56d0aed',
  'Hugging%20Face%20Emoji.png?alt=media&token=69c2d626-056d-4658-a9b0-be72564b1ff7',
  'Loudly%20Crying%20Face%20Emoji.png?alt=media&token=0cd76966-ded3-438c-816d-1539168d7188',
  'Slightly%20Smiling%20Face%20Emoji.png?alt=media&token=ddf89495-8f3b-45b2-b8d2-f34547bf288b',
  'Tongue%20Out%20Emoji%20with%20Tightly%20Closed%20Eyes.png?alt=media&token=46f5dd77-dd72-4dd2-83ff-2c9170ee440d',
  'Heart%20Eyes%20Emoji.png?alt=media&token=dbdbf1d8-5e6b-411f-b27b-6704b5c571e3',
  'Smiling%20Emoji%20with%20Smiling%20Eyes.png?alt=media&token=04c13a53-980b-4f05-bf5f-9bbc86284102',
  'Very%20Angry%20Emoji.png?alt=media&token=6bd3c450-46ad-4eed-9185-c47b37f09fed',
  'Very%20Sad%20Emoji.png?alt=media&token=76cd3389-ebd1-466b-bb5c-0586d77bbf4b',
  'Very%20Mad%20Emoji.png?alt=media&token=0d6dd12c-92b7-402f-9dd8-243147ae4f87',
  'Sleeping%20Emoji.png?alt=media&token=14dca038-a634-4ae5-b6ae-44cbb3299fa8',
].map(name => ({
  url: `https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Emojis%2F${name}`,
  size: defaultSize,
  anchor: defaultAnchor,
}));