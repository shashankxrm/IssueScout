// Example usage of the reusable FloatingCta component

import { FloatingCta } from "@/components/landing/floating-cta";

// Basic usage with default properties
export function BasicExample() {
  return <FloatingCta />;
}

// Custom text and button
export function CustomTextExample() {
  return (
    <FloatingCta
      text="Join our community today!"
      buttonText="Sign Up"
      buttonHref="/signup"
    />
  );
}

// Custom appearance with button props
export function CustomAppearanceExample() {
  return (
    <FloatingCta
      text="Limited time offer!"
      buttonText="Claim Now"
      buttonProps={{
        variant: "destructive",
        className: "rounded-full font-bold",
      }}
      showAfterScroll={300} // Show earlier on scroll
    />
  );
}

// Example with custom button content
export function CustomButtonExample() {
  return (
    <FloatingCta
      text="Visit our documentation"
      buttonContent={
        <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l9 2-9-18-9 18 9-2z"></path>
          </svg>
          <span>Explore Docs</span>
        </div>
      }
    />
  );
}
