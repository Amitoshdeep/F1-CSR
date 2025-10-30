import React from 'react'

import InfiniteMenu from '../components/InfiniteMenu';

const items = [
  {
    image: '/imgs/silverstone.png',
    link: 'https://www.formula1.com/en/information/great-britain-silverstone-circuit.2DtFVI1FjkYgLVdGhbAIv0',
    title: '',
    description: ''
  },
  {
    image: '/imgs/spa.png',
    link: 'https://www.formula1.com/en/information/belgium-circuit-de-spa-francorchamps.3LltuYaAXVRU8iezEsjzGw',
    title: '',
    description: ''
  },
  {
    image: '/imgs/australia.png',
    link: 'https://www.formula1.com/en/information/australia-melbourne-grand-prix-circuit.4LZLnnP4nXDFVVD01EdvvG',
    title: '',
    description: ''
  },
  {
    image: '/imgs/monoco.png',
    link: 'https://www.formula1.com/en/information/monaco-circuit-de-monaco-monte-carlo.2ZWRtIcSI6ZzVGX1uGRpkJ',
    title: '',
    description: ''
  },
  {
    image: '/imgs/suzuka.png',
    link: 'https://www.formula1.com/en/information/japan-suzuka-international-racing-course.2XjOiKgIHRRBVVpp5N3S5t',
    title: '',
    description: ''
  }
];

function Tracks() {
  return (
    <div>
      <div className='h-full relative rounded-2xl overflow-hidden'>

        <InfiniteMenu items={items}/>
      </div>
    </div>
  )
}

export default Tracks
