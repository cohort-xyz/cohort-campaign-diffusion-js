import type {Icon} from '@phosphor-icons/react';
import {Clock, CreditCard, Truck} from '@phosphor-icons/react';

import logo from './logo-footer.png';

type CommitmentProps = {
  Icon: Icon;
  title: string;
  subtitle: string;
};

const Commitment: React.FC<CommitmentProps> = ({Icon, title, subtitle}) => {
  return (
    <li className='flex items-center gap-2 flex-col md:flex-row'>
      <Icon className='text-primary' weight='fill' size={48} />
      <div>
        <h3 className='font-medium'>{title}</h3>
        <p className='mt-1 text-sm text-muted-foreground'>{subtitle}</p>
      </div>
    </li>
  );
};

const CategoryLinkList: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ul className='flex w-[160px] flex-col gap-4'>{children}</ul>
);

const CategoryLinkTitle: React.FC<{title: string}> = ({title}) => (
  <li className='text-sm font-medium uppercase tracking-wide text-muted-foreground'>{title}</li>
);

const CategoryLink: React.FC<{label: string}> = ({label}) => (
  <li className='cursor-pointer text-sm text-slate-500 hover:underline'>{label}</li>
);

const Footer: React.FC = () => (
  <footer>
    {/* Our commitments */}
    <div className='bg-[#E5ECE9]'>
      <div className='container mx-auto'>
        <ul className='flex justify-center gap-16 py-10 flex-col md:flex-row'>
          <Commitment Icon={Truck} title='Free shipping' subtitle='For all order over 99$' />
          <Commitment Icon={Clock} title='Delivery on time' subtitle='Under 48h' />
          <Commitment Icon={CreditCard} title='Secure payment' subtitle='100% secure payment' />
        </ul>
      </div>
    </div>
    {/* Nav links */}
    <div className='container mx-auto px-8 py-10'>
      <div className='grid grid-flow-row gap-8 md:[grid-template-columns:1fr_max-content] md:gap-0'>
        <div>
          <img src={logo} alt='Logo' className='h-6' />
        </div>
        <ul className='flex flex-wrap gap-y-10'>
          <li>
            <CategoryLinkList>
              <CategoryLinkTitle title='Solutions' />
              <CategoryLink label='Marketing' />
              <CategoryLink label='Analytics' />
              <CategoryLink label='Commerce' />
              <CategoryLink label='Insights' />
            </CategoryLinkList>
          </li>
          <li>
            <CategoryLinkList>
              <CategoryLinkTitle title='Support' />
              <CategoryLink label='Pricing' />
              <CategoryLink label='Documentation' />
              <CategoryLink label='Guides' />
              <CategoryLink label='API Status' />
            </CategoryLinkList>
          </li>
          <li>
            <CategoryLinkList>
              <CategoryLinkTitle title='Company' />
              <CategoryLink label='About' />
              <CategoryLink label='Blog' />
              <CategoryLink label='Jobs' />
              <CategoryLink label='Press' />
              <CategoryLink label='Partners' />
            </CategoryLinkList>
          </li>
          <li>
            <CategoryLinkList>
              <CategoryLinkTitle title='Legal' />
              <CategoryLink label='Claim' />
              <CategoryLink label='Privacy' />
              <CategoryLink label='Terms' />
            </CategoryLinkList>
          </li>
        </ul>
      </div>
    </div>
    {/* Copyright */}
    <div className='p-4 text-center text-muted-foreground'>
      © 2024 ACME, Inc. All rights reserved.
    </div>
  </footer>
);

export default Footer;
