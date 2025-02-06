import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-block rounded-md transition-colors text-center";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link 
        href={href} 
        className={combinedClassName}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button 
      className={combinedClassName}
      {...props}
    />
  );
} 