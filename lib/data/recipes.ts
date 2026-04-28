export interface Recipe {
  id: number;
  title: string;
  time: string;
  masala: string;
  tag: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Jaipur-Style Pav Bhaji',
    time: '35 Mins',
    masala: 'Tangry Pav Bhaji Masala',
    tag: 'Street Food',
  },
  {
    id: 2,
    title: 'Dabeli at Home',
    time: '25 Mins',
    masala: 'Tangry Dabeli Masala',
    tag: 'Gujarat & Rajasthan',
  },
  {
    id: 3,
    title: 'Comfort Dal with Jeera Tadka',
    time: '40 Mins',
    masala: 'Tangry Jeera & Turmeric',
    tag: 'Everyday',
  },
];
