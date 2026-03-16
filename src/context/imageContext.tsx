import { createContext, useContext, useState } from "react";

export const ImageContext = createContext<any>(null);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState(null);
  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImageContext = () => useContext(ImageContext);
