interface ChiliIconProps {
  className?: string;
}

export const ChiliIcon = ({ className }: ChiliIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.5,2C12.5,2 12.8,4.5 11.5,6C10.2,7.5 5,9 5,9C5,9 3.5,9.5 3,11C2.5,12.5 3,14.5 4,16C5,17.5 8,20 12,21C16,22 19,20 20.5,18.5C22,17 22.5,15 22,13C21.5,11 20,9.5 18.5,9C17,8.5 15,9 15,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15,9 C15,9 17,6 17,4 C17,2 12.5,2 12.5,2" fill="currentColor" stroke="none"/>
  </svg>
);

