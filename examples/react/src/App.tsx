import {Fragment} from 'react';
import Button from './Button';

import carousel from './caroussel.png';
import kids from './kids.png';
import Footer from './layout/Footer';
import Header from './layout/Header';
import men from './men.png';
import women from './women.png';

const categories = {men, women, kids};

type CategoryCardProps = {
  backgroundImage: string;
  label: string;
};

const Carousel: React.FC = () => (
  <section className='h-[540px] bg-[--primary-background]'>
    <div
      className='container mx-auto flex h-full flex-col justify-center md:bg-center'
      style={{
        backgroundImage: `url(${carousel})`,
      }}
    >
      <div className='space-y-2 px-8 md:relative md:left-[250px] md:px-0'>
        <h2 className='text-sm font-semibold uppercase text-primary'>Special offer</h2>
        <h1 className='text-4xl font-bold'>Black Friday</h1>
        <h3 className='md:w-[40ch]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </h3>
        <Button size='sm' className='font-bold'>
          Shop now
        </Button>
      </div>
    </div>
  </section>
);

const CategoryCard: React.FC<CategoryCardProps> = ({backgroundImage, label}) => (
  <li
    className='flex h-[290px] cursor-pointer items-center justify-center rounded-md bg-cover bg-center bg-no-repeat transition-transform hover:scale-105 hover:text-primary hover:underline'
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
  >
    <div className='rounded-md bg-background bg-opacity-80 px-4 py-2'>
      <h3 className='font-bold capitalize'>{label}</h3>
    </div>
  </li>
);

const App: React.FC = () => (
  <Fragment>
    <div className='h-svh max-h-lvh'>
      <div className='grid h-full w-full overflow-hidden [grid-template-rows:max-content_1fr]'>
        <Header />
        <div className='overflow-auto'>
          <Fragment>
            <Carousel />
            <ul className='container mx-auto grid gap-6 my-10 grid-rows-3 px-10 md:my-20 md:grid-cols-3 md:grid-rows-1 md:px-0'>
              {Object.entries(categories).map(([label, backgroundImage]) => (
                <CategoryCard key={label} backgroundImage={backgroundImage} label={label} />
              ))}
            </ul>
          </Fragment>
          <Footer />
        </div>
      </div>
    </div>
  </Fragment>
);

export default App;
